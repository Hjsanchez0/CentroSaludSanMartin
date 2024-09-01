<template>
    <div>
        <div class="registrar">
            <div class="registrar-container">
                <div class="registrar-right">
                    <div class="registrar-form">
                        <form @submit.prevent="registro">
                            <div class="form-group-row">
                                <div class="form-group">
                                    <label for="document-type">Tipo de documento:</label>
                                    <select id="document-type" v-model="documentType_specialist">
                                        <option value="doc-iden" disabled>Elige su tipo de documento</option>
                                        <option value="DNI">DOCUMENTO NACIONAL DE IDENTIDAD</option>
                                        <option value="Carnet">CARNET DE EXTRANJERÍA</option>
                                        <option value="Pasaporte">PASAPORTE</option>
                                        <option value="die">DOCUMENTO DE IDENTIDAD EXTRANJERO</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="document-number">Documento:</label>
                                    <input type="text" id="document-number" placeholder="Ingrese su número de documento"
                                        v-model="documentNumber_specialist" @input="validateDocumentNumber"
                                        maxlength="8" />
                                </div>
                                <div class="form-group">
                                    <label for="document-type">Rol:</label>
                                    <select id="document-type" v-model="rol_specialist">
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
                            <div class="form-group-row">
                                <div class="form-group">
                                    <label for="nombres">Nombres:</label>
                                    <input type="text" id="nombres" placeholder="Ingrese su nombre completo"
                                        v-model="nombres_specialist" @input="updateMayuscula" />
                                </div>
                                <div class="form-group">
                                    <label for="apellido-pat">Apellido Paterno:</label>
                                    <input type="text" id="apellido-pat" placeholder="Ingrese su apellido paterno"
                                        v-model="apellidoPat_specialist" @input="updateMayuscula" />
                                </div>
                                <div class="form-group">
                                    <label for="apellido-mat">Apellido Materno:</label>
                                    <input type="text" id="apellido-mat" placeholder="Ingrese su apellido materno"
                                        v-model="apellidoMat_specialist" @input="updateMayuscula" />
                                </div>
                            </div>
                            <div class="form-group-row">
                                <div class="form-group">
                                    <label for="telefono">Teléfono:</label>
                                    <input type="text" id="telefono" placeholder="Ingrese su telefono"
                                        v-model="telefono_specialist" @input="validateTelefono" maxlength="9" />
                                </div>
                                <div class="form-group">
                                    <label for="fecha-nacimiento">Fecha de Nacimiento:</label>
                                    <input type="date" id="fecha-nacimiento" v-model="fechaNacimiento_specialist" />
                                </div>
                                <div class="form-group">
                                    <label for="genero">Género:</label>
                                    <select id="genero" v-model="genero_specialist">
                                        <option value="gen" disabled>Elige su género</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group-row">
                                <div class="form-group">
                                    <label for="region">Región:</label>
                                    <select id="region" v-model="region" @change="cargarProvincias">
                                        <option value="" disabled>Selecciona una región</option>
                                        <option v-for="region in regiones" :key="region" :value="region">
                                            {{ region }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="provincia">Provincia:</label>
                                    <select id="provincia" v-model="provincia" @change="cargarDistritos"
                                        :disabled="!region">
                                        <option value="" disabled>Selecciona una provincia</option>
                                        <option v-for="provincia in provincias" :key="provincia" :value="provincia">
                                            {{ provincia }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="distrito">Distrito:</label>
                                    <select id="distrito" v-model="distrito" :disabled="!provincia">
                                        <option value="" disabled>Selecciona un distrito</option>
                                        <option v-for="distrito in distritos" :key="distrito" :value="distrito">
                                            {{ distrito }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group-row">
                                <div class="form-group">
                                    <label for="direccion">Dirección:</label>
                                    <input type="text" id="direccion" placeholder="Ingrese su dirección completa"
                                        v-model="direccion_specialist" @input="updateMayuscula" />
                                </div>
                                <div class="form-group">
                                    <label for="email">Correo: (Gmail)</label>
                                    <input type="email" id="email" placeholder="Ingrese su email"
                                        v-model="email_specialist" @input="autoCompleteEmail" />
                                </div>
                            </div>
                            <div class="form-group-row">
                                <div class="form-group">
                                    <label for="password">Contraseña:</label>
                                    <div class="password-input">
                                        <input :type="showPassword ? 'text' : 'password'" id="password"
                                            placeholder="Ingrese su contraseña" v-model="password_specialist" />
                                        <button type="button" @click="toggleShowPassword">{{ showPassword ? 'Ocultar' :
                                            'Mostrar' }}</button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="confirm-password">Repetir Contraseña:</label>
                                    <div class="password-input">
                                        <input :type="ConfirmShowPassword ? 'text' : 'password'" id="confirm-password"
                                            placeholder="Repita su contraseña" v-model="confirmPassword_specialist" />
                                        <button type="button" @click="toggleShowConfirmPassword">{{ ConfirmShowPassword
                                            ? 'Ocultar' : 'Mostrar' }}</button>
                                    </div>
                                </div>
                            </div>
                            <button class="registrarse" type="submit">Registrar Especialista</button>
                            <div v-if="showSuccessMessage" class="modal">
                                <div class="modal-content">
                                    <span class="close" @click="showSuccessMessage = false">&times;</span>
                                    <p>{{ successMessage }}</p>
                                </div>
                            </div>
                            <div v-if="showErrorMessage" class="modal">
                                <div class="modal-content">
                                    <span class="close" @click="showErrorMessage = false">&times;</span>
                                    <p>{{ errorMessage }}</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import regionesData from '../ubicacion/regiones.json';

export default {
    data() {
        return {
            documentType_specialist: 'doc-iden',
            documentNumber_specialist: '',
            rol_specialist: 'rol-default',
            apellidoPat_specialist: '',
            apellidoMat_specialist: '',
            nombres_specialist: '',
            direccion_specialist: '',
            telefono_specialist: '',
            fechaNacimiento_specialist: '',
            genero_specialist: 'gen',
            region: '',
            provincia: '',
            distrito: '',
            regiones: regionesData.regiones.map(region => region.nombre),
            provincias: [],
            distritos: [],
            email_specialist: '',
            password_specialist: '',
            showPassword: false,
            ConfirmShowPassword: false,
            confirmPassword_specialist: '',
            showSuccessMessage: false,
            successMessage: "",
            showErrorMessage: false,
            errorMessage: ""
        };
    },
    methods: {
        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },

        toggleShowConfirmPassword() {
            this.ConfirmShowPassword = !this.ConfirmShowPassword;
        },

        cargarProvincias() {
            const regionSeleccionada = regionesData.regiones.find(region => region.nombre === this.region);
            this.provincias = regionSeleccionada ? regionSeleccionada.provincias.map(provincia => provincia.nombre) : [];
            this.distritos = [];
        },

        cargarDistritos() {
            const regionSeleccionada = regionesData.regiones.find(region => region.nombre === this.region);
            const provinciaSeleccionada = regionSeleccionada.provincias.find(provincia => provincia.nombre === this.provincia);
            this.distritos = provinciaSeleccionada ? provinciaSeleccionada.distritos : [];
        },

        updateMayuscula() {
            this.nombres_specialist = this.nombres_specialist.toUpperCase();
            this.apellidoPat_specialist = this.apellidoPat_specialist.toUpperCase();
            this.apellidoMat_specialist = this.apellidoMat_specialist.toUpperCase();
            this.direccion_specialist = this.direccion_specialist.toUpperCase();
        },

        validateDocumentNumber(event) {
            const input = event.target.value.replace(/\D/g, '').slice(0, 8);
            this.documentNumber_specialist = input;
        },

        validateTelefono(event) {
            const input = event.target.value.replace(/\D/g, '').slice(0, 9);
            this.telefono_specialist = input;
        },

        autoCompleteEmail() {
            this.email_specialist = this.email_specialist.toLowerCase();
            if (this.email_specialist.includes('@')) {
                const [userPart, domainPart] = this.email_specialist.split('@');
                this.email_specialist = userPart + '@gmail.com';
            }
        },

        formatSystemDate() {
            const date = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            let formattedDate = date.toLocaleDateString('es-ES', options);

            const dateParts = formattedDate.split(' ');
            if (dateParts.length >= 3) {
                dateParts[2] = dateParts[2].charAt(0).toUpperCase() + dateParts[2].slice(1);
                formattedDate = dateParts.join(' ');
            }

            return formattedDate;
        },

        registro() {
            if (!this.documentType_specialist || !this.documentNumber_specialist || !this.rol_specialist || !this.nombres_specialist || !this.apellidoPat_specialist || !this.apellidoMat_specialist ||
                !this.telefono_specialist || !this.fechaNacimiento_specialist || !this.genero_specialist || !this.region || !this.provincia ||
                !this.distrito || !this.direccion_specialist || !this.email_specialist || !this.password_specialist || !this.confirmPassword_specialist) {
                this.showErrorMessage = true;
                this.errorMessage = "Por favor, complete todos los campos.";
                return;
            }

            if (!this.email_specialist.includes('@gmail.com')) {
                this.showErrorMessage = true;
                this.errorMessage = "Por favor, ingrese un correo electrónico válido de Gmail.";
                return;
            }

            if (this.password_specialist !== this.confirmPassword_specialist) {
                this.showErrorMessage = true;
                this.errorMessage = "Las contraseñas no coinciden.";
                return;
            }
            const currentDate = this.formatSystemDate();
            const especialistaData = {
                documentType: this.documentType_specialist,
                documentNumber: this.documentNumber_specialist,
                role: this.rol_specialist,
                nombres: this.nombres_specialist,
                apellidoPat: this.apellidoPat_specialist,
                apellidoMat: this.apellidoMat_specialist,
                direccion: this.direccion_specialist,
                telefono: this.telefono_specialist,
                fechaNacimiento: this.fechaNacimiento_specialist,
                genero: this.genero_specialist,
                region: this.region,
                provincia: this.provincia,
                distrito: this.distrito,
                email: this.email_specialist,
                password: this.password_specialist,
                fechaRegistro: currentDate
            };

            fetch('http://192.168.18.79:3000/cs-san-martin/specialist/registro', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(especialistaData)
            })

                .then(response => response.json())
                .then(data => {
                    if (data.msg === "Registro exitoso") {
                        this.showSuccessMessage = true;
                        this.successMessage = "Registro exitoso.";
                        setTimeout(() => {
                            this.$emit('registro-exitoso');
                            this.showSuccessMessage = false;
                            this.closeModal();
                        }, 2000);
                    } else {
                        this.showErrorMessage = true;
                        this.errorMessage = data.msg;
                    }
                })
                .catch(error => {
                    console.error('Error al registrar especialista:', error);
                    this.showErrorMessage = true;
                    this.errorMessage = 'Error interno del servidor';
                });
        }
    }
};
</script>

<style scoped>
.registrar {
    display: flex;
    justify-content: center;
    align-items: center;
}

.form-group {
    margin-bottom: 15px;
}

.form-group-row {
    display: flex;
    justify-content: space-between;
}

.form-group-row .form-group {
    flex: 1;
    margin-right: 10px;
}

.form-group-row .form-group:last-child {
    margin-right: 0;
}

label {
    display: block;
    margin-bottom: 5px;
    color: rgb(82, 82, 82);
    text-align: left;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="date"],
select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: white;
    color: rgb(83, 83, 83);
    font-size: 15px;
}

button {
    background-color: #ffffff;
    border-radius: 0 5px 5px 0;
    color: rgb(82, 82, 82);
    cursor: pointer;
    font-family: sans-serif;
}

button:hover {
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

.registrarse {
    background-color: #2e9436;
    border-radius: 10px;
    color: rgb(255, 255, 255);
    cursor: pointer;
}

.registrarse:hover {
    background-color: #3a773f;
}

p {
    grid-column: span 1;
    margin-top: 15px;
    color: rgb(83, 83, 83);
}

a {
    color: #007bff;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.modal {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
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
</style>