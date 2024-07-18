<template>
    <div v-if="visible" class="modal-overlay">
        <div class="modal">
            <div class="modal-header">
                <h2>Editar Especialista</h2>
                <button @click="closeModal" class="close-button">×</button>
            </div>
            <hr class="linea">
            <div class="modal-content">
                <form @submit.prevent="saveChanges">
                    <div class="row">
                        <div class="column">
                            <label for="document-type">Tipo de documento:</label>
                            <select id="document-type" v-model="documentType">
                                <option value="doc-iden" disabled>Elige su tipo de documento</option>
                                <option value="DNI">DOCUMENTO NACIONAL DE IDENTIDAD</option>
                                <option value="Carnet">CARNET DE EXTRANJERÍA</option>
                                <option value="Pasaporte">PASAPORTE</option>
                                <option value="die">DOCUMENTO DE IDENTIDAD EXTRANJERO</option>
                            </select>
                        </div>
                        <div class="column">
                            <label for="document-number">Documento:</label>
                            <input type="text" id="document-number" placeholder="Ingrese su número de documento"
                                v-model="documentNumber" @input="validateDocumentNumber" maxlength="8" />
                        </div>
                        <div class="column">
                            <label for="document-type">Rol:</label>
                            <select id="document-type" v-model="role">
                                <option value="rol-default" disabled>Elige su rol</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Admision">Admision</option>
                                <option value="Medicina General">Medicina General</option>
                                <option value="Enfermeria">Enfermeria</option>
                                <option value="Nutricion">Nutricion</option>
                                <option value="Obstetricia">Obstetricia</option>
                                <option value="Odontologia">Odontologia</option>
                                <option value="Psicologia">Psicologia</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="column">
                            <label for="nombres">Nombres:</label>
                            <input type="text" id="nombres" placeholder="Ingrese su nombre completo" v-model="nombres"
                                @input="updateMayuscula" />
                        </div>
                        <div class="column">
                            <label for="apellido-pat">Apellido Paterno:</label>
                            <input type="text" id="apellido-pat" placeholder="Ingrese su apellido paterno"
                                v-model="apellidoPat" @input="updateMayuscula" />
                        </div>
                        <div class="column">
                            <label for="apellido-mat">Apellido Materno:</label>
                            <input type="text" id="apellido-mat" placeholder="Ingrese su apellido materno"
                                v-model="apellidoMat" @input="updateMayuscula" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="column">
                            <label for="telefono">Teléfono:</label>
                            <input type="text" id="telefono" placeholder="Ingrese su telefono" v-model="telefono"
                                @input="validateTelefono" maxlength="9" />
                        </div>
                        <div class="column">
                            <label for="fecha-nacimiento">Fecha de Nacimiento:</label>
                            <input type="date" id="fecha-nacimiento" v-model="formattedFechaNacimiento" />
                        </div>
                        <div class="column">
                            <label for="genero">Género:</label>
                            <select id="genero" v-model="genero">
                                <option value="gen" disabled>Elige su género</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="column">
                            <label for="region">Región:</label>
                            <select id="region" v-model="region" @change="handleChangeRegion">
                                <option value="" disabled>Selecciona una región</option>
                                <option v-for="region in regiones" :key="region" :value="region">
                                    {{ region }}
                                </option>
                            </select>
                        </div>
                        <div class="column">
                            <label for="provincia">Provincia:</label>
                            <select id="provincia" v-model="provincia" @change="handleChangeProvincia">
                                <option value="" disabled>Selecciona una provincia</option>
                                <option v-for="provincia in provincias" :key="provincia" :value="provincia">
                                    {{ provincia }}
                                </option>
                            </select>
                        </div>
                        <div class="column">
                            <label for="distrito">Distrito:</label>
                            <select id="distrito" v-model="distrito" :disabled="!provincia">
                                <option value="" disabled>Selecciona un distrito</option>
                                <option v-for="distrito in distritos" :key="distrito" :value="distrito">
                                    {{ distrito }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="column">
                            <label for="direccion">Dirección:</label>
                            <input type="text" id="direccion" placeholder="Ingrese su dirección completa"
                                v-model="direccion" @input="updateMayuscula" />
                        </div>
                        <div class="column">
                            <label for="email">Correo: (Gmail)</label>
                            <input type="email" id="email" placeholder="Ingrese su email" v-model="email"
                                @input="autoCompleteEmail" />
                        </div>
                    </div>

                    <div class="password-section">
                        <label>
                            <input class="opcion" type="checkbox" v-model="changePassword"> Habilitar para restablecer
                            contraseña
                        </label>
                        <div v-if="changePassword">
                            <div class="row">
                                <div class="column">
                                    <label for="password">Contraseña:</label>
                                    <div class="password-input">
                                        <input :type="showPassword ? 'text' : 'password'" id="password"
                                            placeholder="Ingrese su contraseña" v-model="password" />
                                        <button type="button" @click="toggleShowPassword" class="show-button">
                                            {{ showPassword ? 'Ocultar' : 'Mostrar' }}
                                        </button>
                                    </div>
                                </div>
                                <div class="column">
                                    <label for="confirmPassword">Repetir Contraseña:</label>
                                    <div class="password-input">
                                        <input :type="ConfirmShowPassword ? 'text' : 'password'" id="confirm-password"
                                            placeholder="Repita su contraseña" v-model="confirmPassword" />
                                        <button type="button" @click="toggleShowConfirmPassword" class="show-button">
                                            {{ ConfirmShowPassword ? 'Ocultar' : 'Mostrar' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="save-button">Guardar</button>
                </form>
            </div>
        </div>
    </div>
    <div v-if="showConfirmationModal" class="modal-overlay">
        <div class="modal">
            <div class="modal-content">
                <img src="../../assets/exclamacion.png" alt="Cerrar Sesión" class="logout-icon">
                <h2>Información</h2>
                <p>Los datos han sido actualizados exitosamente.</p>
                <button class="confirmación" @click="handleCloseConfirmation">Aceptar</button>
            </div>
        </div>
    </div>
    <div v-if="showIncompleteModal" class="modal-overlay">
        <div class="modal">
            <div class="modal-content">
                <p>Por favor, complete todos los campos obligatorios.</p>
                <button class="confirmación" @click="closeIncompleteModal">Aceptar</button>
            </div>
        </div>
    </div>
    <div v-if="showMismatchPasswordModal" class="modal-overlay">
        <div class="modal">
            <div class="modal-content">
                <p>Las contraseñas no coinciden. Por favor, inténtelo de nuevo.</p>
                <button class="confirmación" @click="closeMismatchPasswordModal">Aceptar</button>
            </div>
        </div>
    </div>
</template>

<script>
import regionesData from '../ubicacion/regiones.json';

export default {
    emits: ['close', 'update-list'],
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        especialista: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    data() {
        return {
            documentType: '',
            documentNumber: '',
            role: '',
            nombres: '',
            apellidoPat: '',
            apellidoMat: '',
            fechaNacimiento: '',
            genero: '',
            telefono: '',
            email: '',
            region: '',
            provincia: '',
            distrito: '',
            direccion: '',
            regiones: regionesData.regiones.map(region => region.nombre),
            provincias: [],
            distritos: [],
            changePassword: false,
            password: '',
            confirmPassword: '',
            showPassword: false,
            ConfirmShowPassword: false,
            showIncompleteModal: false,
            showMismatchPasswordModal: false,
            showConfirmationModal: false
        };
    },

    computed: {
        formattedFechaNacimiento() {
            return this.formatDate(this.especialista.fechaNacimiento)
        }
    },

    watch: {
        especialista: {
            handler() {
                this.loadSpecialistData();
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        loadSpecialistData() {
            if (this.especialista) {
                this.documentType = this.especialista.documentType || '';
                this.documentNumber = this.especialista.documentNumber || '';
                this.role = this.especialista.role || '';
                this.nombres = this.especialista.nombres || '';
                this.apellidoPat = this.especialista.apellidoPat || '';
                this.apellidoMat = this.especialista.apellidoMat || '';
                this.fechaNacimiento = this.especialista.fechaNacimiento || '';
                this.genero = this.especialista.genero || '';
                this.email = this.especialista.email || '';
                this.direccion = this.especialista.direccion || '';
                this.telefono = this.especialista.telefono || '';
                this.region = this.especialista.region || '';
                this.provincia = this.especialista.provincia || '';
                this.distrito = this.especialista.distrito || '';

                if (this.especialista.fechaNacimiento) {
                    this.fechaNacimiento = this.formatDate(this.especialista.fechaNacimiento);
                } else {
                    this.fechaNacimiento = '';
                }

                if (this.region) {
                    this.cargarProvincias();
                }
                if (this.provincia && this.region) {
                    this.cargarDistritos();
                }
            }
        },

        formatDate(isoDateString) {
            if (!isoDateString) return '';
            const date = new Date(isoDateString);
            const year = date.getFullYear();
            let month = (1 + date.getMonth()).toString().padStart(2, '0');
            let day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        updateMayuscula() {
            this.direccion = this.direccion.toUpperCase();
            this.nombres = this.nombres.toUpperCase();
            this.apellidoPat = this.apellidoPat.toUpperCase();
            this.apellidoMat = this.apellidoMat.toUpperCase();

        },

        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },

        toggleShowConfirmPassword() {
            this.ConfirmShowPassword = !this.ConfirmShowPassword;
        },

        cargarProvincias() {
            const regionSeleccionada = regionesData.regiones.find(region => region.nombre === this.region);
            this.provincias = regionSeleccionada ? regionSeleccionada.provincias.map(provincia => provincia.nombre) : [];

            if (this.provincia === this.especialista.provincia) {
                this.cargarDistritos();
            } else {
                this.distritos = [];
            }
        },

        cargarDistritos() {
            const regionSeleccionada = regionesData.regiones.find(region => region.nombre === this.region);
            const provinciaSeleccionada = regionSeleccionada.provincias.find(provincia => provincia.nombre === this.provincia);
            this.distritos = provinciaSeleccionada ? provinciaSeleccionada.distritos : [];
        },

        handleChangeRegion() {
            this.provincia = '';
            this.distrito = '';
            this.provincias = [];
            this.distritos = [];
        },

        handleChangeProvincia() {
            if (this.provincia !== this.especialista.provincia) {
                this.distrito = '';
            }
            this.cargarDistritos();
        },

        validateTelefono(event) {
            const input = event.target.value.replace(/\D/g, '').slice(0, 9);
            this.telefono = input;
        },

        autoCompleteEmail() {
            this.email = this.email.toLowerCase();
            if (this.email.includes('@')) {
                const [userPart, domainPart] = this.email.split('@');
                this.email = userPart + '@gmail.com';
            }
        },

        closeModal() {
            this.$emit('close');
        },

        async saveChanges() {
            if (
                !this.documentType ||
                !this.documentNumber ||
                !this.role ||
                !this.nombres ||
                !this.apellidoPat ||
                !this.apellidoMat ||
                !this.fechaNacimiento ||
                !this.genero ||
                !this.email ||
                !this.direccion ||
                !this.telefono ||
                !this.region ||
                !this.provincia ||
                !this.distrito
            ) {
                this.showIncompleteModal = true;
                return;
            }

            if (this.changePassword && this.password !== this.confirmPassword) {
                this.showMismatchPasswordModal = true;
                return;
            }
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://192.168.18.9:3000/cs-san-martin/specialist/edit/${this.especialista._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        documentType: this.documentType,
                        documentNumber: this.documentNumber,
                        role: this.role,
                        nombres: this.nombres,
                        apellidoPat: this.apellidoPat,
                        apellidoMat: this.apellidoMat,
                        fechaNacimiento: this.fechaNacimiento,
                        genero: this.genero,
                        email: this.email,
                        direccion: this.direccion,
                        telefono: this.telefono,
                        region: this.region,
                        provincia: this.provincia,
                        distrito: this.distrito,
                        password: this.changePassword ? this.password : undefined
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    this.showConfirmationModal = true;
                    this.$emit('close');
                    this.$emit('update-list');
                } else {
                    throw new Error('Error al actualizar el perfil');
                }
            } catch (error) {
                console.error('Error al actualizar el perfil:', error);
            }
            this.closeModal();
        },

        handleCloseConfirmation() {
            this.showConfirmationModal = false;
            this.$emit('close');
            this.$emit('update-list');
        },

        closeIncompleteModal() {
            this.showIncompleteModal = false;
        },

        closeMismatchPasswordModal() {
            this.showMismatchPasswordModal = false;
        }
    }
};
</script>

<style scoped>
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
    width: 700px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-logo {
    width: 170px;
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

.password-input {
    display: flex;
}

.password-section .opcion {
    width: 15px;
    margin-top: 1px;
}

.password-input input {
    border-radius: 5px 0 0 5px;
    border-right: none;
    height: 36px;
}

.show-button {
    width: 100px;
    background-color: transparent;
    border-left: none;
    height: 36px;
    border: 1px solid #ccc;
    color: rgb(83, 83, 83);
    border-radius: 0 5px 5px 0;
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

p {
    color: rgb(82, 82, 82);
}

.confirmación {
    background-color: #28a745;
}

.confirmación:hover {
    background-color: #218838;
}
</style>
