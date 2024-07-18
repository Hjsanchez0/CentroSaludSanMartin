<template>
    <div class="table-container">
        <h2>Historial de Citas</h2>
        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
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
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody v-if="appointments.length > 0">
                    <tr v-for="(appointment, index) in appointments" :key="index">
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
                        <td>
                            <button v-if="appointment.pago !== 'Cubierto por el SIS'" class="pagar"
                                @click="showPaymentModal(appointment)">
                                <img src="../../assets/pagar.png" alt="Pagar Icon" class="button-icon">Pagar la Cita
                            </button>
                            <span v-else>No tiene acciones</span>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="10">No tiene citas registradas</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="showModal" class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h2>Formulario de Pago</h2>
                    <span class="close" @click="closeModal">&times;</span>
                </div>
                <hr class="linea">
                <div class="modal-content">
                    <form @submit.prevent="submitPayment">

                        <div class="row">
                            <div class="column">
                                <label for="cuenta">Cuenta:</label>
                                <select v-model="paymentForm.cuenta">
                                    <option value="" disabled>Selecciona una cuenta</option>
                                    <option v-for="cuenta in cuentas" :key="cuenta" :value="cuenta">{{ cuenta }}
                                    </option>
                                </select>
                            </div>
                            <div class="column">
                                <label for="fechaPago">Fecha de Pago:</label>
                                <input type="date" v-model="paymentForm.fechaPago">
                            </div>
                        </div>
                        <div class="row">
                            <div class="column">
                                <label for="monto">Monto: (S/.)</label>
                                <input type="text" v-model="paymentForm.monto" placeholder="Ingrese su monto"
                                    @input="validateMonto" maxlength="8">
                            </div>
                            <div class="column">
                                <label for="codigoOperacion">Número de Operación:</label>
                                <input type="text" v-model="paymentForm.codigoOperacion"
                                    placeholder="Ingrese su número de operación" @input="validateCodOperacion"
                                    maxlength="14">
                            </div>
                        </div>

                        <label for="foto">Foto (PNG, JPG, JPEG):</label>
                        <input type="file" @change="handleFileUpload" accept="image/png, image/jpeg, image/jpg">

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
                    <p>¡El pago se guardó exitosamente!</p>
                </div>
            </div>
        </div>
        <div v-if="showErrorModal" class="modal-overlay2">
            <div class="modal2">
                <div class="modal-content2">
                    <p>¡Ha ocurrido un error al realizar el pago!</p>
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
            appointments: [],
            showModal: false,
            showSuccessModal: false,
            showErrorModal: false,
            showIncompleteModal: false,
            cuentas: ['Yape', 'BCP'],
            paymentForm: {
                cuenta: '',
                fechaPago: '',
                monto: '',
                codigoOperacion: '',
                foto: ''
            },
            currentAppointment: null
        };
    },

    created() {
        this.fetchAppointments();
    },

    methods: {
        async fetchAppointments() {
            try {
                const documentTypePac = this.userData.documentType;
                const documentNumberPac = this.userData.documentNumber;
                const role = this.userData.role;

                const response = await fetch(`http://192.168.18.9:3000/cs-san-martin/appointments?documentTypePac=${documentTypePac}&documentNumberPac=${documentNumberPac}&role=${role}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener las citas');
                }
                const appointments = await response.json();
                this.appointments = appointments;
            } catch (error) {
                console.error('Error en fetchAppointments:', error);
            }
        },

        showPaymentModal(appointment) {
            this.currentAppointment = appointment;
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.resetPaymentForm();
        },

        resetPaymentForm() {
            this.paymentForm = {
                cuenta: '',
                fechaPago: '',
                monto: '',
                codigoOperacion: '',
                foto: ''
            };
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                this.paymentForm.foto = e.target.result;
            };
            reader.readAsDataURL(file);
        },

        validateMonto(event) {
            let input = event.target.value.trim();

            input = input.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');

            const parts = input.split('.');
            let integerPart = parts[0].slice(0, 8);

            if (parts.length > 1) {
                const decimalPart = parts[1].slice(0, 2);
                input = `${integerPart}.${decimalPart}`;
            } else {
                input = integerPart;
            }

            this.paymentForm.monto = input;
        },

        validateCodOperacion(event) {
            const input = event.target.value.replace(/\D/g, '').slice(0, 14);
            this.paymentForm.codigoOperacion = input;
        },

        async submitPayment() {
            try {
                if (!this.paymentForm.cuenta || !this.paymentForm.fechaPago || !this.paymentForm.monto || !this.paymentForm.codigoOperacion || !this.paymentForm.foto) {
                    this.showIncompleteModal = true;
                    return;
                }

                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No se encontró el token de autenticación');
                }

                const response = await fetch(`http://192.168.18.9:3000/cs-san-martin/appointments/${this.currentAppointment._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(this.paymentForm)
                });

                if (!response.ok) {
                    throw new Error('Error al enviar el pago');
                }

                this.showSuccessModal = true;
                setTimeout(() => {
                    this.showSuccessModal = false;
                }, 2000);
                this.closeModal();
                this.fetchAppointments();
            } catch (error) {
                console.error('Error en submitPayment:', error);
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
    margin-right: 5px;
}

.pagar {
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

.sis-image {
    width: 100px;
    height: 100px;
    margin-bottom: 10px;
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

@media screen and (max-width: 1366px) and (max-height: 768px) {
    .table-scroll {
        max-height: 400px;

    }
}
</style>