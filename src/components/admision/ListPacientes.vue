<template>
    <div class="table-container">
        <h2>Gestión de SIS e Historial Clínico</h2>
        <div class="search-container">
            <div class="search-item">
                <label for="searchDate">Buscar por Fecha de Registro:</label>
                <input type="date" id="searchDate" v-model="searchQueryDate" @change="filterPatients">
            </div>
            <div class="search-item">
                <label for="search">Buscar por Número de DNI:</label>
                <input type="text" id="search" v-model="searchQuery" @input="filterPatients" placeholder="Ingrese el DNI">
            </div>    
        </div>
        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th>Acciones</th>
                        <th>Fecha de Registro</th>
                        <th>Documento</th>
                        <th>Número</th>
                        <th>SIS</th>
                        <th>Historial Clínico</th>
                        <th>Nombres</th>
                        <th>Apellido Paterno</th>
                        <th>Apellido Materno</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Género</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody v-if="filteredPatients.length > 0">
                    <tr v-for="(patient, index) in filteredPatients" :key="index">
                        <td>
                            <button @click="openModal(patient)" class="reset">
                                <img src="../../assets/resetear.png" alt="Resetear Icon" class="button-icon">
                                <span style="margin-left: 5px;">Gestionar</span>
                            </button>
                        </td>
                        <td>{{ patient.fechaRegistro }}</td>
                        <td>{{ patient.documentType }}</td>
                        <td>{{ patient.documentNumber }}</td>
                        <td>{{ patient.sis }}</td>
                        <td>{{ patient.historialClinico }}</td>
                        <td>{{ patient.nombres }}</td>
                        <td>{{ patient.apellidoPat }}</td>
                        <td>{{ patient.apellidoMat }}</td>
                        <td>{{ formatFechaNacimiento(patient.fechaNacimiento) }}</td>
                        <td>{{ patient.genero }}</td>
                        <td>{{ patient.direccion }}</td>
                        <td>{{ patient.telefono }}</td>
                        <td>{{ patient.email }}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="14">No hay pacientes registrados</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showModal" class="modal-overlay2">
            <div class="modal2">
                <div class="modal-header2">
                    <h2>Gestionar SIS e Historial Clínico</h2>
                    <span class="close" @click="closeModal">&times;</span>
                </div>
                <hr class="linea2">
                <div class="modal-content2">
                    <div class="modal-grid">
                        <div>
                            <p><strong>Tipo de Documento:</strong> {{ currentPatient.documentType }}</p>
                            <p><strong>Nombres:</strong> {{ currentPatient.nombres }} </p>
                            <div class="select-container">
                                <label for="sis">SIS:</label>
                                <select id="sis" v-model="currentPatient.sis">
                                    <option value="Procesando...">Procesando...</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                    <option value="No tiene">No tiene</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <p><strong>Documento:</strong> {{ currentPatient.documentNumber }}</p>
                            <p><strong>Apellidos:</strong> {{ currentPatient.apellidoPat }} {{
                                currentPatient.apellidoMat }}</p>
                            <div class="select-container">
                                <label for="historialClinico">Historial Clínico:</label>
                                <input type="text" id="historialClinico" v-model="currentPatient.historialClinico" placeholder="Ingrese el Historial C.">
                            </div>
                        </div>
                    </div>
                    <div class="button-container">
                        <button @click="closeModal">Cancelar</button>
                        <button @click="updatePatient">Aceptar</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showSuccessModal" class="modal-overlay2">
            <div class="modal2">
                <div class="modal-content2">
                    <p>¡Se reestableció el SIS e Historial Clínico correctamente!</p>
                    <button @click="closeSuccessModal">Aceptar</button>
                </div>
            </div>
        </div>

        <div v-if="showErrorModal" class="modal-overlay2">
            <div class="modal2">
                <div class="modal-content2">
                    <p>{{ errorMessage }}</p>
                    <button @click="closeErrorModal">Aceptar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            patients: [],
            filteredPatients: [],
            searchQueryDate: '',
            showModal: false,
            showSuccessModal: false,
            showErrorModal: false,
            searchQuery: '',
            currentPatient: null,
            errorMessage: ''
        };
    },

    created() {
        this.fetchPatients();
    },

    methods: {
        async fetchPatients() {
            try {
                const response = await fetch('http://192.168.18.79:3000/cs-san-martin/patients', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener los pacientes');
                }
                const patients = await response.json();
                this.patients = patients;
                this.filteredPatients = patients;
            } catch (error) {
                console.error('Error en fetchPatients:', error);
            }
        },

        formatFechaNacimiento(dateString) {
            const months = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            const date = new Date(dateString);
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            return `${day} de ${month} de ${year}`;
        },

        filterPatients() {
            let filteredByDate = this.patients;
            if (this.searchQueryDate) {
                const queryDate = this.formatDate(this.searchQueryDate);
                filteredByDate = this.patients.filter(patient => {
                    const patientDate = patient.fechaRegistro;
                    return patientDate === queryDate;
                });
            }

            const query = this.searchQuery.toLowerCase();
            this.filteredPatients = filteredByDate.filter(patient => {
                return patient.documentNumber.toLowerCase().includes(query);
            });
        },

        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const fecha = new Date(`${dateString}T00:00:00`);
            let fechaFormateada = fecha.toLocaleDateString('es-ES', options);

            const partesFecha = fechaFormateada.split(' ');

            if (partesFecha.length >= 3) {
                partesFecha[2] = partesFecha[2].charAt(0).toUpperCase() + partesFecha[2].slice(1);
                fechaFormateada = partesFecha.join(' ');
            }

            return fechaFormateada;
        },

        openModal(patient) {
            this.currentPatient = { ...patient };
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.currentPatient = null;
        },

        async updatePatient() {
            try {

                const response = await fetch(`http://192.168.18.79:3000/cs-san-martin/update-patients/${this.currentPatient._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        sis: this.currentPatient.sis,
                        historialClinico: this.currentPatient.historialClinico
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el paciente');
                }

                this.showModal = false;
                this.showSuccessModal = true;
                this.fetchPatients();
            } catch (error) {
                console.error('Error en updatePatient:', error);
                this.errorMessage = 'No se pudo restablecer el SIS e Historial Clínico.';
                this.showErrorModal = true;
            }
        },

        closeSuccessModal() {
            this.showSuccessModal = false;
        },

        closeErrorModal() {
            this.showErrorModal = false;
        }
    }
};
</script>

<style scoped>
.table-container {
    overflow-x: auto;
}

.table-scroll {
    max-height: 600px;
    overflow-y: auto;
    overflow-x: auto;
}

table {
    width: max-content;
    border-collapse: collapse;
}

table th {
    border: 1px solid #dddddd;
    padding: 8px;
    text-align: left;
    text-align: center;
}

table td {
    border: 1px solid #dddddd;
    padding: 8px;
    text-align: left;
    color: rgb(82, 82, 82);
    text-align: center;
}

table th {
    background-color: #15558d;
}

table tr:nth-child(even) {
    background-color: #f2f2f2;
}

.button-icon {
    width: 22px;
    height: 22px;
}

.reset {
    padding: 5px;
    background-color: green;
    border: none;
    margin: 2px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-overlay2 {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal2 {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.modal-header2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header2 .linea2 {
    border: none;
    border-top: 1px solid #ebebeb;
}

.modal-content2 {
    margin-top: 10px;
}

.modal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.modal-grid p {
    margin: 0;
    color: rgb(82, 82, 82);
    margin-bottom: 15px;
    text-align: left;
}

.modal-content2 p{
    margin: 0;
    color: rgb(82, 82, 82);
    margin-bottom: 15px;
}

.modal-grid label {
    margin: 0;
    color: rgb(82, 82, 82);
    margin-bottom: 10px;
}

.modal2 button {
    margin-top: 10px;
    margin-right: 5px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.modal2 button:first-of-type {
    background-color: #dc3545;
    color: white;
}

.modal2 button:last-of-type {
    background-color: #28a745;
    color: white;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 500px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.linea {
    border: none;
    border-top: 1px solid #ebebeb;
}

.modal-content {
    margin-top: 10px;
}

.modal-content h3 {
    text-align: center;
    margin-bottom: 3px;
    color: rgb(82, 82, 82);
}

.modal-content form {
    display: flex;
    flex-direction: column;
}

.modal-content label {
    margin-bottom: 5px;
    color: rgb(82, 82, 82);
    text-align: left;
    display: flex;
    margin-top: 0;
}

input[type="text"],
select {
    margin-bottom: 10px;
    width: 51%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: white;
    color: rgb(83, 83, 83);
    font-size: 15px;
}

.select-container {
    display: flex;
    align-items: center;
}

.select-container label {
    margin-right: 10px;
}

.modal-content input {
    margin-bottom: 15px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    color: rgb(82, 82, 82);
    width: 100%;
    box-sizing: border-box;
}

.column:last-child {
    margin-right: 0;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

.search-container {
    display: flex;
    justify-content: center; 
    align-items: center; 
    gap: 20px; 
    margin-bottom: 25px;
}

.search-item {
    display: flex;
    align-items: center;
}

.search-container input {
    padding: 6px;
    border: 1px solid #535353;
    border-radius: 4px;
    background-color: white;
    color: rgb(82, 82, 82);
    font-size: 14px;
    width: 7rem;
}

.search-container label {
    font-weight: bold;
    color: rgb(82, 82, 82);
    margin-right: 10px;
    line-height: 30px;
}

@media screen and (max-width: 1366px) and (max-height: 768px) {
    .table-scroll {
        max-height: 400px;

    }
}
</style>