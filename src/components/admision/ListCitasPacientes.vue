<template>
    <div class="table-container">
        <h2>Citas de los Pacientes</h2>
        <div class="search-container">
            <label for="searchDate">Buscar por Fecha de Cita:</label>
            <input type="date" id="searchDate" v-model="searchQueryDate" @change="filterCitasPatients">
        </div>
        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th>Acciones</th>
                        <th>Fecha de la Cita</th>
                        <th>Paciente</th>
                        <th>Especialidad</th>
                        <th>Tipo de Servicio</th>
                        <th>Doctor(a)</th>
                        <th>Turno</th>
                        <th>Estado de Cita</th>
                        <th>Diagnostico</th>
                        <th>Receta Médica</th>
                        <th>Pago</th>
                        <th>Estado de Pago</th>
                    </tr>
                </thead>
                <tbody v-if="filteredCitasPatients.length > 0">
                    <tr v-for="(appointment, index) in filteredCitasPatients" :key="index">
                        <td>
                            <template
                                v-if="appointment.pago !== 'Cubierto por el SIS' || appointment.estadoPago !== 'Aceptado'">
                                <button class="reset" @click="openPaymentModal(appointment)">
                                    <img src="../../assets/verificarPago.png" alt="Resetear Icon" class="button-icon">
                                    <span style="margin-left: 5px;">Validar Pago</span>
                                </button>
                            </template>
                            <template v-else>
                                No tiene acciones
                            </template>
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
                        <td>{{ appointment.especialidad }}</td>
                        <td>{{ appointment.tipoServicio }}</td>
                        <td>{{ appointment.doctor }}</td>
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
                        <td colspan="12">No hay citas registradas</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="showPaymentModal" class="modal-overlay2">
            <div class="modal2">
                <div class="modal-header2">
                    <h2>Verificación de Pago</h2>
                    <span class="close" @click="closePaymentModal">&times;</span>
                </div>
                <hr class="linea2">
                <div class="modal-content2">
                    <div class="modal-grid">
                        <div>
                            <p v-if="currentAppointment?.documentNumber_extra"><strong>Paciente:</strong> {{
                                currentAppointment?.documentType_extra }} - {{ currentAppointment?.documentNumber_extra
                                }} -
                                {{ currentAppointment?.nombres_extra }} {{ currentAppointment?.apellidoPat_extra }} {{
                                    currentAppointment?.apellidoMat_extra }}</p>
                            <p v-else><strong>Paciente:</strong> {{ currentAppointment?.documentTypePac }} - {{
                                currentAppointment?.documentNumberPac }}
                            </p>
                            <p><strong>Pago:</strong> {{ currentAppointment?.pago }}</p>
                            <p><strong>Estado de Pago:</strong> {{ currentAppointment?.estadoPago }}</p>
                            <p><strong>Cuenta:</strong> {{ currentAppointment?.cuenta }}</p>
                            <p><strong>Fecha de Pago:</strong> {{ currentAppointment?.fechaPago }}</p>
                            <p><strong>Monto:</strong> {{ currentAppointment?.monto }}</p>
                            <p><strong>Código de Operación:</strong> {{ currentAppointment?.codigoOperacion }}</p>
                        </div>
                        <div>
                            <div v-if="currentAppointment?.foto !== 'Pendiente'">
                                <p>Comprobante:</p>
                                <div @dblclick="toggleImageSize" :style="{ cursor: isDragging ? 'grabbing' : 'grab' }">
                                    <img :src="`${currentAppointment?.foto}`" alt="Comprobante"
                                        :class="{ 'enlarged': isEnlarged }">
                                </div>
                            </div>
                            <div v-else>
                                <p><strong>Comprobante: </strong></p>
                                <p>{{ currentAppointment?.foto }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="button-container">
                        <button @click="confirmPayment('Rechazado')">Rechazado</button>
                        <button @click="confirmPayment('Aceptado')">Aceptado</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showConfirmationModal" class="modal-overlay2">
            <div class="modal2">
                <div class="modal-content2">
                    <p>¿Está seguro que quiere cambiar el estado del pago a {{ selectedPaymentStatus }}?</p>
                    <button @click="closeConfirmationModal">No</button>
                    <button @click="updatePaymentStatus">Sí</button>
                </div>
            </div>
        </div>

        <div v-if="showSuccessModal" class="modal-overlay2">
            <div class="modal2">
                <div class="modal-content2">
                    <p>¡Estado de pago actualizado con éxito!</p>
                </div>
            </div>
        </div>

        <div v-if="showErrorModal" class="modal-overlay2">
            <div class="modal2">
                <div class="modal-content2">
                    <p>Hubo un error al actualizar el estado de pago.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            appointments: [],
            filteredCitasPatients: [],
            searchQueryDate: '',
            currentAppointment: null,
            showPaymentModal: false,
            showConfirmationModal: false,
            showSuccessModal: false,
            showErrorModal: false,
            selectedPaymentStatus: '',
            isEnlarged: false
        };
    },

    created() {
        this.fetchCitasPatients();
    },

    methods: {
        toggleImageSize() {
            this.isEnlarged = !this.isEnlarged;
        },

        async fetchCitasPatients() {
            try {
                const response = await fetch('http://192.168.18.9:3000/cs-san-martin/appointments-patients', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener las citas');
                }
                const appointments = await response.json();
                this.appointments = appointments;
                this.filteredCitasPatients = appointments;
            } catch (error) {
                console.error('Error en fetchCitasPatients:', error);
            }
        },

        filterCitasPatients() {
            if (!this.searchQueryDate) {
                this.filteredCitasPatients = this.appointments;
                return;
            }

            const queryDate = this.formatDate(this.searchQueryDate);
            this.filteredCitasPatients = this.appointments.filter(appointment => {
                const appointmentDate = appointment.fechaCita;

                return appointmentDate === queryDate;
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

        openPaymentModal(appointment) {
            this.currentAppointment = appointment;
            this.showPaymentModal = true;
        },

        closePaymentModal() {
            this.showPaymentModal = false;
            this.currentAppointment = null;
        },

        confirmPayment(status) {
            this.selectedPaymentStatus = status;
            this.showPaymentModal = false;
            this.showConfirmationModal = true;
        },

        closeConfirmationModal() {
            this.showConfirmationModal = false;
            this.selectedPaymentStatus = '';
        },

        async updatePaymentStatus() {
            try {
                if (this.currentAppointment) {
                    this.currentAppointment.estadoPago = this.selectedPaymentStatus;

                    const token = localStorage.getItem('token');
                    if (!token) {
                        throw new Error('No se encontró el token de autenticación');
                    }

                    const response = await fetch(`http://192.168.18.9:3000/cs-san-martin/appointments-patients/${this.currentAppointment._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ estadoPago: this.selectedPaymentStatus, estadoCita: 'Confirmada', diagnostico: 'A la espera', recetaMedica: 'A la espera' })
                    });

                    if (!response.ok) {
                        throw new Error('Error al actualizar el estado de pago');
                    }

                    this.showSuccessModal = true;
                    setTimeout(() => {
                        this.showSuccessModal = false;
                    }, 2000);

                    this.fetchCitasPatients();

                    this.closeConfirmationModal();
                    this.currentAppointment = null;
                }
            } catch (error) {
                console.error('Error en updatePaymentStatus:', error);
                this.showErrorModal = true;
                setTimeout(() => {
                    this.showErrorModal = false;
                }, 2000);
            }
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
    margin-bottom: 10px;
    text-align: left;
}


.modal-content2 p{
    margin: 0;
    color: rgb(82, 82, 82);
    margin-bottom: 15px;
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

img {
    height: 300px;
    width: auto;
}

.enlarged {
    transform: scale(3);
}

@media screen and (max-width: 1366px) and (max-height: 768px) {
    .table-scroll {
        max-height: 400px;

    }

    .enlarged {
        transform: scale(2.4);
    }

}
</style>