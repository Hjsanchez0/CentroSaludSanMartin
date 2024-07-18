<template>
    <div class="table-container">
        <h2>Pacientes para {{ userData.role }}</h2>
        <div class="search-container">
            <div class="search-item">
                <label for="searchDate">Buscar por Fecha de Cita:</label>
                <input type="date" id="searchDate" v-model="searchQueryDate" @change="filterAppointmentsPatients">
            </div>
            <div class="search-item">
                <label for="search">Buscar por Número de DNI:</label>
                <input type="text" id="search" v-model="searchQuery" @input="filterAppointmentsPatients"
                    placeholder="Ingrese el DNI">
            </div>
        </div>

        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th>Acciones</th>
                        <th>Fecha de la Cita</th>
                        <th>Paciente</th>
                        <th>Tipo de Servicio</th>
                        <th>Turno</th>
                        <th>Estado de Cita</th>
                        <th>Diagnostico</th>
                        <th>Receta Médica</th>
                        <th>Pago</th>
                        <th>Estado de Pago</th>
                    </tr>
                </thead>
                <tbody v-if="filteredAppointmentsPatients.length > 0">
                    <tr v-for="(appointment, index) in filteredAppointmentsPatients" :key="index">
                        <td><button @click="registroAppoinment(appointment)" class="reset">
                                <img src="../../assets/registrar.png" alt="Resetear Icon" class="button-icon"></button>
                        </td>
                        <td>{{ appointment.fechaCita }}</td>
                        <td>
                            <template v-if="appointment.documentNumber_extra">
                                {{ appointment.documentType_extra }} - {{ appointment.documentNumber_extra }} -
                                {{ appointment.nombres_extra }} {{ appointment.apellidoPat_extra }} {{
                                    appointment.apellidoMat_extra }}
                            </template>
                            <template v-else>
                                {{ appointment.documentTypePac }} - {{ appointment.documentNumberPac }}
                            </template>
                        </td>
                        <td>{{ appointment.tipoServicio }}</td>
                        <td>{{ appointment.turno }}</td>
                        <td>{{ appointment.estadoCita }}</td>
                        <td>{{ appointment.diagnostico }}</td>
                        <td>{{ appointment.recetaMedica }}</td>
                        <td>{{ appointment.pago }}</td>
                        <td>{{ appointment.estadoPago }}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="10">No hay pacientes registrados</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showModal" class="modal-overlay2">
            <div class="modal2">
                <div class="modal-header">
                    <h2>Registrar Datos del Paciente</h2>
                    <span class="close" @click="closeModal">&times;</span>
                </div>
                <hr class="linea2">
                <div class="modal-content">
                    <form @submit.prevent="submitRegistro">
                        <div class="row">
                            <div class="column">
                                <label>Estado de la Cita:</label>
                                <select id="estado-cita" v-model="estadoCita">
                                    <option value="ec" disabled>Elija el estado de la cita</option>
                                    <option value="Finalizada">Finalizada</option>
                                    <option value="No Asistió">No Asistió</option>
                                </select>
                            </div>
                            <div class="column">
                                <label for="diagnostico">Diagnostico:</label>
                                <input type="text" id="diagnostico" placeholder="Ingrese su diagnóstico"
                                    v-model="diagnostico" @input="updateMayuscula"
                                    :disabled="estadoCita === 'No Asistió'">
                            </div>
                        </div>
                        <div class="row">
                            <div class="column">
                                <label for="recetaMedica">Receta Médica:</label>
                                <textarea id="recetaMedica" placeholder="Ingrese su receta médica"
                                    v-model="recetaMedica" @input="updateMayuscula"
                                    :disabled="estadoCita === 'No Asistió'"></textarea>
                            </div>
                        </div>
                        <div class="button-container">
                            <button type="button" @click="showConfirmModal = true">Rechazado</button>
                            <button type="submit">Aceptado</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div v-if="showConfirmModal" class="modal-overlay2">
            <div class="modal2">
                <div class="modal-content2">
                    <p>¿Está seguro de confirmar la acción?</p>
                    <div class="button-container">
                        <button class="confirmación" @click="showConfirmModal = false">Cancelar</button>
                        <button class="confirmación" @click="confirmAction">Aceptar</button>
                    </div>
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
                    <p>¡Se registró correctamente!</p>
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
            estadoCita: "ec",
            diagnostico: '',
            recetaMedica: '',
            appointments: [],
            filteredAppointmentsPatients: [],
            showModal: false,
            showSuccessModal: false,
            showErrorModal: false,
            showIncompleteModal: false,
            showConfirmModal: false,
            searchQueryDate: '',
            searchQuery: '',
            currentPatient: null
        };
    },

    watch: {
        estadoCita(newVal) {
            if (newVal === 'No Asistió') {
                this.diagnostico = 'No Asistió';
                this.recetaMedica = 'No Asistió';
            } else {
                this.diagnostico = '';
                this.recetaMedica = '';
            }
        }
    },

    created() {
        this.fetchPatients();
    },

    methods: {
        async fetchPatients() {
            try {
                const doctor = `${this.userData.nombres} ${this.userData.apellidoPat} ${this.userData.apellidoMat}`;
                const response = await fetch(`http://192.168.18.9:3000/cs-san-martin/patientsxspecialist?especialidad=${this.userData.role}&doctor=${encodeURIComponent(doctor)}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener los pacientes');
                }
                const appointments = await response.json();
                this.appointments = appointments;
                this.filteredAppointmentsPatients = appointments;
            } catch (error) {
                console.error('Error en fetchPatients:', error);
            }
        },

        updateMayuscula() {
            this.diagnostico = this.diagnostico.toUpperCase();
            this.recetaMedica = this.recetaMedica.toUpperCase();
        },

        registroAppoinment(appointment) {
            this.currentPatient = appointment;
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.password = '';
            this.confirmPassword = '';
        },

        filterAppointmentsPatients() {
            let filteredAppointments = this.appointments;

            if (this.searchQueryDate) {
                const queryDate = this.formatDate(this.searchQueryDate);
                filteredAppointments = filteredAppointments.filter(appointment => {
                    const appointmentDate = appointment.fechaCita;
                    return appointmentDate === queryDate;
                });
            }

            const query = this.searchQuery.toLowerCase();
            filteredAppointments = filteredAppointments.filter(appointment => {
                if (appointment.documentNumber_extra) {
                    return appointment.documentNumber_extra.toLowerCase().includes(query);
                } else {
                    return appointment.documentNumberPac.toLowerCase().includes(query);
                }
            });

            this.filteredAppointmentsPatients = filteredAppointments;
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

        async submitRegistro() {
            if (!this.diagnostico || !this.recetaMedica) {
                this.showIncompleteModal = true;
                return;
            }

            this.showConfirmModal = true;
        },

        async confirmAction() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No se encontró el token de autenticación');
                }

                const updatedAppointment = {
                    ...this.currentPatient,
                    estadoCita: this.estadoCita,
                    diagnostico: this.diagnostico,
                    recetaMedica: this.recetaMedica
                };

                const response = await fetch(`http://192.168.18.9:3000/cs-san-martin/appointmentspatientsxspecialist/${this.currentPatient._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedAppointment)
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar la cita');
                }

                const updatedIndex = this.appointments.findIndex(appointment => appointment._id === this.currentPatient._id);
                if (updatedIndex !== -1) {
                    this.appointments[updatedIndex] = updatedAppointment;
                    this.filteredAppointmentsPatients = [...this.appointments];
                }

                this.showSuccessModal = true;
                setTimeout(() => {
                    this.showSuccessModal = false;
                }, 1000);
                this.closeModal();
            } catch (error) {
                console.error('Error en confirmAction:', error);
                this.showErrorModal = true;
                setTimeout(() => {
                    this.showErrorModal = false;
                }, 1000);
            } finally {
                this.showConfirmModal = false;
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

textarea {
    margin-bottom: 10px;
    height: 100px;
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