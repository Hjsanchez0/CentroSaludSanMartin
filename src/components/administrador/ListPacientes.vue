<template>
    <div class="table-container">
        <h2>Listado de los Pacientes</h2>
        <div class="search-container">
            <label for="search">Buscar por Número de DNI:</label>
            <input type="text" id="search" v-model="searchQuery" @input="filterPatients" placeholder="Ingrese el DNI">
        </div>
        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th>Acciones</th>
                        <th>Documento</th>
                        <th>Número</th>
                        <th>Nombres</th>
                        <th>Apellido Paterno</th>
                        <th>Apellido Materno</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Género</th>
                        <th>Región</th>
                        <th>Provincia</th>
                        <th>Distrito</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody v-if="filteredPatients.length > 0">
                    <tr v-for="(patient, index) in filteredPatients" :key="index">
                        <td><button @click="resetPassword(patient)" class="reset">
                                <img src="../../assets/resetear.png" alt="Resetear Icon" class="button-icon"></button>
                        </td>
                        <td>{{ patient.documentType }}</td>
                        <td>{{ patient.documentNumber }}</td>
                        <td>{{ patient.nombres }}</td>
                        <td>{{ patient.apellidoPat }}</td>
                        <td>{{ patient.apellidoMat }}</td>
                        <td>{{ formatFechaNacimiento(patient.fechaNacimiento) }}</td>
                        <td>{{ patient.genero }}</td>
                        <td>{{ patient.region }}</td>
                        <td>{{ patient.provincia }}</td>
                        <td>{{ patient.distrito }}</td>
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
        <div v-if="showModal" class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h2>Resetear Contraseña</h2>
                    <span class="close" @click="closeModal">&times;</span>
                </div>
                <hr class="linea">
                <div class="modal-content">
                    <form @submit.prevent="submitPassword">
                        <div class="row">
                            <div class="column">
                                <label for="password">Contraseña:</label>
                                <div class="password-input">
                                    <input :type="showPassword ? 'text' : 'password'" id="password"
                                        placeholder="Su contraseña" v-model="password" />
                                    <button class="password" type="button" @click="toggleShowPassword">{{ showPassword ?
                                        'Ocultar' : 'Mostrar' }}</button>
                                </div>
                            </div>
                            <div class="column">
                                <label for="confirm-password">Repetir Contraseña:</label>
                                <div class="password-input">
                                    <input :type="ConfirmShowPassword ? 'text' : 'password'" id="confirm-password"
                                        placeholder="Repita su contraseña" v-model="confirmPassword" />
                                    <button class="password" type="button" @click="toggleShowConfirmPassword">{{
                                        ConfirmShowPassword ? 'Ocultar' : 'Mostrar' }}</button>
                                </div>
                            </div>
                        </div>
                        <button class="enviar" type="submit">Enviar</button>
                    </form>
                </div>
            </div>
        </div>

        <div v-if="showIncompleteModal" class="modal-overlay2">
            <div class="modal2">
                <div class="modal-content2">
                    <p>Por favor, complete todos los campos obligatorios.</p>
                    <button class="confirmación" @click="closeIncompleteModal">Aceptar</button>
                </div>
            </div>
        </div>
        <div v-if="showSuccessModal" class="modal-overlay2">
            <div class="modal2">
                <div class="modal-content2">
                    <p>¡Se reestableció la contraseña correctamente!</p>
                </div>
            </div>
        </div>
        <div v-if="showErrorModal" class="modal-overlay2">
            <div class="modal2">
                <div class="modal-content2">
                    <p>{{ errorMessage }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        userData: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            patients: [],
            filteredPatients: [],
            showModal: false,
            showSuccessModal: false,
            showErrorModal: false,
            showIncompleteModal: false,
            searchQuery: '',
            password: '',
            confirmPassword: '',
            showPassword: false,
            ConfirmShowPassword: false,
            currentPatient: null
        };
    },

    created() {
        this.fetchPatients();
    },

    methods: {
        async fetchPatients() {
            try {
                const response = await fetch('http://192.168.18.9:3000/cs-san-martin/patients', {
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

        resetPassword(patient) {
            this.currentPatient = patient;
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.password = '';
            this.confirmPassword = '';
        },

        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },

        toggleShowConfirmPassword() {
            this.ConfirmShowPassword = !this.ConfirmShowPassword;
        },

        filterPatients() {
            const query = this.searchQuery.toLowerCase();
            this.filteredPatients = this.patients.filter(patient => {
                return patient.documentNumber.toLowerCase().includes(query);
            });
        },

        async submitPassword() {
            if (!this.password || !this.confirmPassword) {
                this.showIncompleteModal = true;
                return;
            }

            if (this.password !== this.confirmPassword) {
                this.errorMessage = "Las contraseñas no coinciden.";
                this.showErrorModal = true;
                setTimeout(() => {
                    this.showErrorModal = false;
                }, 2000);
                return;
            }
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No se encontró el token de autenticación');
                }

                const response = await fetch(`http://192.168.18.9:3000/cs-san-martin/patients/${this.currentPatient._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ password: this.password })
                });

                if (!response.ok) {
                    throw new Error('Error al restablecer la contraseña');
                }

                this.showSuccessModal = true;
                setTimeout(() => {
                    this.showSuccessModal = false;
                }, 2000);
                this.closeModal();
            } catch (error) {
                console.error('Error en submitPassword:', error);
                this.showErrorModal = true;
                setTimeout(() => {
                    this.showErrorModal = false;
                }, 2000);
            }
        },

        closeIncompleteModal() {
            this.showIncompleteModal = false;
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

.modal2 p {
    margin: 0;
    color: rgb(82, 82, 82);
    margin-bottom: 5px;
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

input[type="password"],
select {
    margin-bottom: 10px;
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: white;
    color: rgb(83, 83, 83);
    font-size: 15px;
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

.row {
    display: flex;
    justify-content: space-between;
}

.column {
    flex: 1;
    margin-right: 10px;
}

.password {
    background-color: #ffffff;
    border-radius: 0 5px 5px 0;
    color: rgb(82, 82, 82);
    cursor: pointer;
    font-family: sans-serif;
}

.password:hover {
    background-color: #d9dadb;
}

.password-input {
    display: flex;
}

.password-input input {
    border-radius: 5px 0 0 5px;
    height: 36px;
    border-right: none;
}

.password-input button {
    width: 100px;
    border-left: none;
    height: 36px;
    border: 1px solid #ccc;
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
    margin-bottom: 25px;
    display: flex;
    justify-content: flex-end;
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