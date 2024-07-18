<template>
    <div v-if="visible" class="modal-overlay">
        <div class="modal">
            <div class="modal-header">
                <h2>Agregar Cita</h2>
                <button @click="closeModal" class="close-button">×</button>
            </div>
            <hr class="linea">
            <div class="modal-content">
                <div class="user-type">
                    <button :class="{ active: section === 'paciente' }"
                        @click="toggleSection('paciente')">Paciente</button>
                    <button :class="{ active: section === 'cita' }" @click="toggleSection('cita')">Cita</button>
                </div>
                <form @submit.prevent="saveChanges" v-if="section === 'paciente'">
                    <div class="subtitle" style="display: flex; align-items: center;">
                        <h3 style="margin: 0; margin-right: 5px;">Datos del paciente</h3>
                        <h3 style="margin: 0; color: red;">(Paciente que va a pasar consulta)</h3>
                    </div>

                    <div class="checkbox">
                        <label>
                            <input class="opcion" type="checkbox" v-model="enableEditing"> Comprar para otra persona
                            <input type="hidden" name="enableEditing" :value="enableEditing">
                        </label>
                    </div>

                    <div class="row">
                        <div class="column">
                            <label for="document-type">Tipo de documento *</label>
                            <select v-if="!enableEditing" id="document-type" v-model="documentTypePac"
                                :disabled="!enableEditing" :class="{ disabled: !enableEditing }">
                                <option value="DNI">DNI</option>
                            </select>
                            <select v-else v-model="documentType_extra">
                                <option value="doc-iden" disabled>Elige su tipo de documento</option>
                                <option value="DNI">DNI</option>
                                <option value="Carnet">CARNET DE EXTRANJERÍA</option>
                                <option value="Pasaporte">PASAPORTE</option>
                                <option value="die">DOCUMENTO DE IDENTIDAD EXTRANJERO</option>
                            </select>
                        </div>
                        <div class="column">
                            <label for="document-number">Número de documento *</label>
                            <input v-if="!enableEditing" type="text" id="document-number"
                                placeholder="Ingrese su número de documento" v-model="documentNumberPac"
                                :disabled="!enableEditing" :class="{ disabled: !enableEditing }" />
                            <input v-else type="text" placeholder="Ingrese su número de documento"
                                v-model="documentNumber_extra" @input="validateDocumentNumber" maxlength="8">
                        </div>
                    </div>

                    <div class="row">
                        <div class="column">
                            <label for="nombres">Nombres *</label>
                            <input v-if="!enableEditing" type="text" id="nombres"
                                placeholder="Ingrese su nombre completo" v-model="nombres" :disabled="!enableEditing"
                                :class="{ disabled: !enableEditing }" />
                            <input v-else type="text" placeholder="Ingrese su nombre completo " v-model="nombres_extra"
                                @input="updateMayuscula" />
                        </div>
                        <div class="column">
                            <label for="apellido-pat">Apellido Paterno *</label>
                            <input v-if="!enableEditing" type="text" id="apellido-pat"
                                placeholder="Ingrese su apellido paterno" v-model="apellidoPat"
                                :disabled="!enableEditing" :class="{ disabled: !enableEditing }" />
                            <input v-else type="text" placeholder="Ingrese su apellido paterno"
                                v-model="apellidoPat_extra" @input="updateMayuscula" />
                        </div>
                    </div>

                    <div class="row">
                        <div class="column">
                            <label for="apellido-mat">Apellido Materno *</label>
                            <input v-if="!enableEditing" type="text" id="apellido-mat"
                                placeholder="Ingrese su apellido materno" v-model="apellidoMat"
                                :disabled="!enableEditing" :class="{ disabled: !enableEditing }" />
                            <input v-else type="text" placeholder="Ingrese su apellido materno"
                                v-model="apellidoMat_extra" @input="updateMayuscula" />
                        </div>
                        <div class="column">
                            <label for="genero">Género *</label>
                            <select v-if="!enableEditing" id="genero" v-model="genero" :disabled="!enableEditing"
                                :class="{ disabled: !enableEditing }">
                                <option value="gen" disabled>Elige su género</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                            <select v-else v-model="genero_extra">
                                <option value="gen" disabled>Elige su género</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="column">
                            <label for="fecha-nacimiento">Fecha de Nacimiento *</label>
                            <input v-if="!enableEditing" type="text" id="fecha-nacimiento" v-model="fechaNacimiento"
                                :disabled="!enableEditing" :class="{ disabled: !enableEditing }" />
                            <input v-else type="date" v-model="fechaNacimiento_extra" />
                        </div>
                        <div class="column">
                            <label for="telefono">Telefono *</label>
                            <input v-if="!enableEditing" type="text" id="telefono" v-model="telefono"
                                :disabled="!enableEditing" :class="{ disabled: !enableEditing }" />
                            <input v-else type="text" placeholder="Ingrese su telefono" v-model="telefono_extra"
                                @input="validateTelefono" maxlength="9" />
                        </div>
                    </div>
                    <div class="button-group-right">
                        <button type="submit" class="save-button">Siguiente</button>
                    </div>
                </form>
                <form @submit.prevent="saveChanges" v-if="section === 'cita'">
                    <div class="row">
                        <div class="column">
                            <label for="sintomas">Síntomas</label>
                            <textarea id="sintomas" v-model="sintomas"
                                placeholder="Describa sus síntomas aquí..."></textarea>
                        </div>
                        <div class="column">
                            <label for="sintomas">Sugerir especialidad es opcional</label>
                            <button type="button" @click="sugerirEspecialidad" class="suggest-button">Sugerir
                                especialidad</button>

                        </div>
                    </div>

                    <div class="row">
                        <div class="column">
                            <label for="especialidad-sugerida">Especialidad sugerida</label>
                            <input type="text" id="especialidad-sugerida" v-model="sugerenciaEspecialidad" readonly />
                        </div>
                        <div class="column">
                            <label for="especialidad">Especialidad para la cita *</label>
                            <select v-model="especialidad" @change="cargarEspecialistas">
                                <option value="" disabled>Elige la especialidad</option>
                                <option v-for="especialidad in especialidades" :key="especialidad"
                                    :value="especialidad">
                                    {{ especialidad }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="column">
                            <label for="tipo-servicio">Doctor *</label>
                            <select v-model="doctor">
                                <option value="" disabled>Elige el doctor</option>
                                <option v-for="doctor in doctores" :key="doctor" :value="doctor">
                                    {{ doctor }}
                                </option>
                            </select>
                        </div>
                        <div class="column">
                            <label for="tipo-servicio">Tipo de servicio *</label>
                            <select v-model="tipoServicio">
                                <option value="tip-ser" disabled>Elige el tipo de servicio</option>
                                <option value="Consulta">CONSULTA</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="column">
                            <label for="fecha-cita">Fecha de cita *</label>
                            <select v-model="fechaCita" @change="cargarTurnosDisponibles">
                                <option value="fec-cit" disabled>Elige la fecha de cita</option>
                                <option v-for="fecha in fechasDisponibles" :key="fecha.value" :value="fecha.value">
                                    {{ fecha.label }}
                                </option>
                            </select>
                        </div>
                        <div class="column">
                            <label for="turno">Turno *</label>
                            <select v-model="turno">
                                <option value="" disabled>Elige el turno</option>
                                <option v-for="turno in turnosPorDia" :key="turno" :value="turno"
                                    :disabled="!turnoDisponible(turno)">
                                    {{ turno }}
                                </option>
                                <option v-if="turnosPorDia.length === 0" disabled>No hay turnos disponibles</option>
                            </select>
                        </div>
                    </div>
                    <h2 v-if="shouldShowCosto" style="color: red; margin: 5px;">Costo: S/. 20 soles.</h2>

                    <div class="button-group">
                        <button type="button" class="back-button" @click="toggleSection('paciente')">Atrás</button>
                        <button type="submit" class="save-button">Guardar cita</button>
                    </div>

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
    <div v-if="showPaymentDeadlineModal" class="modal-overlay2">
        <div class="modal2">
            <div class="modal-content2">
                <img src="../../assets/exclamacion.png" alt="SIS Inactivo" class="sis-image">
                <p>Tiene un plazo máximo de un día para pagar.</p>
                <p>Cuentas</p>
                <p>Yape - N°: 935691792</p>
                <p>BCP - N°: 09890235835829</p>
                <p>BCP - CCI: 09890235835829</p>
                <button class="cancelar" @click="cancelCita">Cancelar cita</button>
                <button class="confirmación" @click="acceptPaymentDeadline">Aceptar y guardar</button>
            </div>
        </div>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay2">
        <div class="modal2">
            <div class="modal-content2">
                <p>¡La cita se ha guardado exitosamente!</p>
            </div>
        </div>
    </div>
    <div v-if="showErrorModal" class="modal-overlay2">
        <div class="modal2">
            <div class="modal-content2">
                <p>¡Ha ocurrido un error al guardar la cita!</p>
            </div>
        </div>
    </div>
</template>

<script>
import especialidadesData from '../especialidad/especialidades.json';
import { base } from '../../router/index';

export default {
    emits: ['close'],
    props: ['visible'],
    data() {
        return {
            section: 'paciente',
            enableEditing: false,
            documentTypePac: '',
            documentType_extra: 'doc-iden',
            documentNumberPac: '',
            documentNumber_extra: '',
            nombres: '',
            nombres_extra: '',
            apellidoPat: '',
            apellidoPat_extra: '',
            apellidoMat: '',
            apellidoMat_extra: '',
            genero: '',
            genero_extra: 'gen',
            fechaNacimiento: '',
            fechaNacimiento_extra: '',
            telefono: '',
            telefono_extra: '',
            sintomas: '',
            sugerenciaEspecialidad: '-',
            especialidad: '',
            tipoServicio: 'tip-ser',
            doctor: '',
            especialidades: especialidadesData.especialidades.map(esp => esp.nombre),
            doctores: [],
            fechaCita: 'fec-cit',
            turno: '',
            turnosPorDia: [],
            showIncompleteModal: false,
            showConfirmationModal: false,
            showPaymentDeadlineModal: false,
            showSuccessModal: false,
            showErrorModal: false
        };
    },

    computed: {
        shouldShowCosto() {
            return this.enableEditing || this.sis === "Inactivo" || this.sis === "Procesando..." || this.sis === "No tiene";
        },

        fechasDisponibles() {
            const fechas = [];
            const hoy = new Date();
            let contador = 1;
            while (fechas.length < 5) {
                const fecha = new Date(hoy.getTime() + contador * 24 * 60 * 60 * 1000);
                const diaSemana = fecha.getDay();
                const dia = fecha.getDate();
                const mes = fecha.toLocaleString('default', { month: 'long' });
                const año = fecha.getFullYear();
                if (diaSemana !== 6 && diaSemana !== 0) {
                    const esFeriado = false;
                    if (!esFeriado) {
                        const fechaFormato = `${dia} de ${mes} de ${año}`;
                        const fechaValor = fecha.toISOString();
                        fechas.push({ value: fechaValor, label: fechaFormato });
                    }
                }
                contador++;
            }
            return fechas;
        },

        turnosDisponibles() {
            return this.turnosPorDia;
        },
    },
    created() {
        this.loadUserData();
    },
    methods: {
        updateMayuscula() {
            this.nombres_extra = this.nombres_extra.toUpperCase();
            this.apellidoPat_extra = this.apellidoPat_extra.toUpperCase();
            this.apellidoMat_extra = this.apellidoMat_extra.toUpperCase();
        },

        toggleSection(type) {
            this.section = type;
        },

        closeModal() {
            this.$emit('close');
            window.location.reload();
        },

        async loadUserData() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://192.168.18.9:3000/cs-san-martin/special', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del usuario');
                }
                const userData = await response.json();
                this.documentTypePac = userData.documentType;
                this.documentNumberPac = userData.documentNumber;
                this.sis = userData.sis;
                this.historialClinico = userData.historialClinico;
                this.nombres = userData.nombres;
                this.apellidoPat = userData.apellidoPat;
                this.apellidoMat = userData.apellidoMat;
                this.genero = userData.genero;
                const fechaNacimiento = new Date(userData.fechaNacimiento);
                const year = fechaNacimiento.getFullYear();
                const month = String(fechaNacimiento.getMonth() + 1).padStart(2, '0');
                const day = String(fechaNacimiento.getDate()).padStart(2, '0');
                this.fechaNacimiento = `${day}-${month}-${year}`;
                this.telefono = userData.telefono;
                this.email = userData.email;
            } catch (error) {
                console.error(error);
                alert('Ocurrió un error al cargar los datos del usuario');
            }
        },

        validateFields() {
            if (
                !this.documentTypePac ||
                !this.documentNumberPac ||
                !this.nombres ||
                !this.apellidoPat ||
                !this.apellidoMat ||
                !this.genero ||
                !this.fechaNacimiento ||
                !this.telefono ||
                !this.especialidad ||
                !this.doctor ||
                !this.tipoServicio ||
                !this.fechaCita ||
                !this.turno
            ) {
                return false;
            }
            return true;
        },

        validateAdditionalFields() {
            if (
                !this.documentType_extra ||
                !this.documentNumber_extra ||
                !this.nombres_extra ||
                !this.apellidoPat_extra ||
                !this.apellidoMat_extra ||
                !this.genero_extra ||
                !this.fechaNacimiento_extra ||
                !this.telefono_extra
            ) {
                return false;
            }
            return true;
        },

        async saveChanges() {
            if (this.section === 'paciente') {
                this.toggleSection('cita');
                return;
            }
            if (this.section === 'cita') {
                if (!this.validateFields()) {
                    this.showIncompleteModal = true;
                    return;
                }

                if (this.enableEditing) {
                    if (!this.validateAdditionalFields()) {
                        this.showIncompleteModal = true;
                        return;
                    }

                    if (this.enableEditing || this.sis !== 'Activo') {
                        this.showPaymentDeadlineModal = true;
                        return;
                    }
                }

                if (this.sis !== 'Activo') {
                    this.showPaymentDeadlineModal = true;
                    return;
                }

                if (!this.enableEditing) {
                    if (!this.enableEditing && this.sis == 'Activo') {
                        await this.saveCitaData();
                        this.showSuccessModal = true;
                        setTimeout(() => {
                            this.showSuccessModal = false;
                            this.$emit('close');
                            window.location.reload();
                        }, 2000);
                    }
                }
            }
        },

        async saveCitaData() {
            let pago = '';
            let estadoPago = '';
            let cuenta = '';
            let fechaPago = '';
            let monto = '';
            let codigoOperacion = '';
            let foto = '';
            if (this.enableEditing) {
                pago = 'S/. 20 soles';
                estadoPago = 'Pendiente';
                cuenta = 'Pendiente';
                fechaPago = 'Pendiente';
                monto = 'Pendiente';
                codigoOperacion = 'Pendiente';
                foto = 'Pendiente';
            } else {
                pago = this.sis === 'Activo' ? 'Cubierto por el SIS' : 'S/. 20 soles';
                estadoPago = this.sis === 'Activo' ? 'Aceptado' : 'Pendiente';
                cuenta = this.sis === 'Activo' ? 'Innecesario' : 'Pendiente';
                fechaPago = this.sis === 'Activo' ? 'Innecesario' : 'Pendiente';
                monto = this.sis === 'Activo' ? 'Innecesario' : 'Pendiente';
                codigoOperacion = this.sis === 'Activo' ? 'Innecesario' : 'Pendiente';
                foto = this.sis === 'Activo' ? 'Innecesario' : 'Pendiente';
            }
            const fechaCitaFormatted = this.formatFechaCita(this.fechaCita);
            const citaData = {
                documentTypePac: this.documentTypePac,
                documentNumberPac: this.documentNumberPac,
                role: 'paciente',
                especialidad: this.especialidad,
                tipoServicio: this.tipoServicio,
                estadoCita: 'Pendiente',
                doctor: this.doctor,
                diagnostico: 'Pendiente',
                recetaMedica: 'Pendiente',
                fechaCita: fechaCitaFormatted,
                turno: this.turno,
                pago: pago,
                estadoPago: estadoPago,
                enableEditing: this.enableEditing,
                cuenta: cuenta,
                fechaPago: fechaPago,
                monto: monto,
                codigoOperacion: codigoOperacion,
                foto: foto
            };

            if (this.enableEditing) {
                Object.assign(citaData, {
                    documentType_extra: this.documentType_extra,
                    documentNumber_extra: this.documentNumber_extra,
                    nombres_extra: this.nombres_extra,
                    apellidoPat_extra: this.apellidoPat_extra,
                    apellidoMat_extra: this.apellidoMat_extra,
                    genero_extra: this.genero_extra,
                    fechaNacimiento_extra: this.fechaNacimiento_extra,
                    telefono_extra: this.telefono_extra
                });
            }

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No se encontró el token de autenticación');
                }
                const response = await fetch('http://192.168.18.9:3000/cs-san-martin/appointments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(citaData)
                });

                if (!response.ok) {
                    throw new Error('Error al guardar la cita');
                }
            } catch (error) {
                console.error(error);
                alert('Ocurrió un error al guardar la cita');
            }
        },

        formatFechaCita(fechaCita) {
            const fecha = new Date(fechaCita);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            let fechaFormateada = fecha.toLocaleDateString('es-ES', options);

            const partesFecha = fechaFormateada.split(' ');

            if (partesFecha.length >= 3) {
                partesFecha[2] = partesFecha[2].charAt(0).toUpperCase() + partesFecha[2].slice(1);

                fechaFormateada = partesFecha.join(' ');
            }

            return fechaFormateada;
        },

        async sugerirEspecialidad() {
            try {
                const response = await fetch('http://192.168.18.9:3000/cs-san-martin/suggest-specialty', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ sintomas: this.sintomas })
                });
                if (!response.ok) {
                    throw new Error('Error al obtener la sugerencia de especialidad');
                }
                const data = await response.json();
                this.sugerenciaEspecialidad = data.sugerencia;
            } catch (error) {
                console.error(error);
                alert('Ocurrió un error al obtener la sugerencia de especialidad');
            }
        },

        cargarEspecialistas() {
            const especialidadSeleccionada = especialidadesData.especialidades.find(
                esp => esp.nombre === this.especialidad
            );
            this.doctores = especialidadSeleccionada ? especialidadSeleccionada.especialistas : [];
        },

        async cargarTurnosDisponibles() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No se encontró el token de autenticación');
                }
                const fechaCitaFormatted = this.formatFechaCita(this.fechaCita);

                const response = await fetch('http://192.168.18.9:3000/cs-san-martin/check-appointments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        especialidad: this.especialidad,
                        doctor: this.doctor,
                        fechaCita: fechaCitaFormatted
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al verificar las citas registradas');
                }

                const citasRegistradas = await response.json();

                if (citasRegistradas.length === 0) {
                    const turnos = ['8:00 a.m - 9:00 a.m', '9:00 a.m - 10:00 a.m', '10:00 a.m - 11:00 a.m', '11:00 a.m - 12:00 a.m', '12:00 a.m - 01:00 p.m', '01:00 p.m - 02:00 p.m',];
                    this.turnosPorDia = turnos;

                } else {
                    const turnosOcupados = citasRegistradas.map(cita => cita.turno);
                    const turnosDisponibles = ['8:00 a.m - 9:00 a.m', '9:00 a.m - 10:00 a.m', '10:00 a.m - 11:00 a.m', '11:00 a.m - 12:00 a.m', '12:00 a.m - 01:00 p.m', '01:00 p.m - 02:00 p.m',].filter(turno => !turnosOcupados.includes(turno));
                    this.turnosPorDia = turnosDisponibles;
                }
            } catch (error) {
                console.error(error);
                alert('Ocurrió un error al cargar los turnos disponibles');
            }
        },

        turnoDisponible(turno) {
            return this.turnosPorDia.includes(turno);
        },

        validateDocumentNumber(event) {
            const input = event.target.value.replace(/\D/g, '').slice(0, 8);
            this.documentNumber_extra = input;
        },

        validateTelefono(event) {
            const input = event.target.value.replace(/\D/g, '').slice(0, 9);
            this.telefono_extra = input;
        },

        redirectToLogin() {
            this.$router.push(`${base}/login`);
        },

        closeIncompleteModal() {
            this.showIncompleteModal = false;
        },

        async acceptPaymentDeadline() {
            await this.saveCitaData();
            this.showSuccessModal = true;
            setTimeout(() => {
                this.showSuccessModal = false;
                this.$emit('close');
                window.location.reload();
            }, 2000);
            this.showPaymentDeadlineModal = false;
        },

        cancelCita() {
            this.showPaymentDeadlineModal = false;
            window.location.reload();
        }
    },
    watch: {
        fechaCita: {
            handler: function () {
                this.cargarTurnosDisponibles();
                this.turno = '';
            },
            deep: true
        },
        doctor: {
            handler: function () {
                this.turno = '';
                this.tipoServicio = 'tip-ser';
                this.fechaCita = 'fec-cit';
            },
            deep: true
        },
        especialidad: {
            handler: function () {
                this.doctor = '';
                this.tipoServicio = 'tip-ser';
                this.fechaCita = 'fec-cit';
                this.turno = '';
            },
            deep: true
        }
    }
};
</script>

<style scoped>
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

.close-button {
    background: none;
    color: rgb(82, 82, 82);
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.linea {
    border: none;
    border-top: 1px solid #ebebeb;
}

.modal-content {
    margin-top: 10px;
}

.subtitle {
    margin-bottom: 15px;
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

select.disabled {
    background-color: #f0f0f0;
    border-color: #ccc;
    color: #8f8f8f;
}

.modal-content input,
textarea {
    margin-bottom: 15px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    color: rgb(82, 82, 82);
    width: 100%;
    box-sizing: border-box;
}

.checkbox .opcion {
    width: 15px;
    margin-top: 1px;
}

input.disabled {
    background-color: #f0f0f0;
    border-color: #ccc;
    color: #8f8f8f;
}

.user-type {
    margin-bottom: 10px;
}

.user-type button.active {
    background-color: #28a745;
    color: white;
}

.user-type button {
    width: calc(50%);
}

.suggest-button {
    background-color: #1648b4;
    border-radius: 10px;
    color: #ffffff;
    cursor: pointer;
    font-family: sans-serif;
}

.suggest-button:hover {
    background-color: #0a3591;
}

button {
    background-color: #ffffff;
    border-radius: 10px;
    color: rgb(82, 82, 82);
    cursor: pointer;
    font-family: sans-serif;
}

button:hover {
    background-color: #d9dadb;
}

button.disabled {
    background-color: #5a5a5a;
    color: #0a0909;
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

.logout-icon {
    width: 100px;
    height: 100px;
    margin-bottom: 0;
}

.save-button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
}

.save-button:hover {
    background-color: #218838;
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.button-group-right {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.back-button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
}

.back-button:hover {
    background-color: #218838;
}
</style>
