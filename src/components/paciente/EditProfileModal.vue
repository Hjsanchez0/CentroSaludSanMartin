<template>
    <div v-if="visible" class="modal-overlay">
        <div class="modal">
            <div class="modal-header">
                <img src="../../assets/logo.jpg" alt="Logo" class="modal-logo">
                <button @click="closeModal" class="close-button">×</button>
            </div>
            <hr class="linea">
            <div class="modal-content">
                <h3>Editar Información</h3>
                <form @submit.prevent="saveChanges">
                    <label for="email">Correo: (Gmail)</label>
                    <input type="email" id="email" placeholder="Ingrese su correo electrónico" v-model="email"
                        @input="autoCompleteEmail" />

                    <label for="direccion">Dirección:</label>
                    <input type="text" id="direccion" placeholder="Ingrese su dirección completa" v-model="direccion"
                        @input="updateMayuscula" />

                    <div class="row">
                        <div class="column">
                            <label for="region">Región:</label>
                            <select id="region" v-model="region" @change="cargarProvincias">
                                <option value="" disabled>Selecciona una región</option>
                                <option v-for="region in regiones" :key="region" :value="region">{{ region }}</option>
                            </select>
                        </div>
                        <div class="column">
                            <label for="provincia">Provincia:</label>
                            <select id="provincia" v-model="provincia" @change="cargarDistritos" :disabled="!region">
                                <option value="" disabled>Selecciona una provincia</option>
                                <option v-for="provincia in provincias" :key="provincia" :value="provincia">{{ provincia
                                    }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="column">
                            <label for="distrito">Distrito:</label>
                            <select id="distrito" v-model="distrito" :disabled="!provincia">
                                <option value="" disabled>Selecciona un distrito</option>
                                <option v-for="distrito in distritos" :key="distrito" :value="distrito">{{ distrito }}
                                </option>
                            </select>
                        </div>
                        <div class="column">
                            <label for="telefono">Teléfono:</label>
                            <input type="text" id="telefono" placeholder="Ingrese su teléfono" v-model="telefono"
                                @input="validateTelefono" maxlength="9" />
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
                <p>Los datos han sido actualizados exitosamente.
                    Vuelva a iniciar sesión para aplicar los cambios</p>
                <button class="confirmación" @click="redirectToLogin">Aceptar</button>
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
import { base } from '../../router/index';

export default {
    emits: ['close'],
    props: ['visible'],
    data() {
        return {
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
    created() {
        this.loadUserData();
    },

    methods: {
        updateMayuscula() {
            this.direccion = this.direccion.toUpperCase();
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
            this.distritos = [];
        },

        cargarDistritos() {
            const regionSeleccionada = regionesData.regiones.find(region => region.nombre === this.region);
            const provinciaSeleccionada = regionSeleccionada.provincias.find(provincia => provincia.nombre === this.provincia);
            this.distritos = provinciaSeleccionada ? provinciaSeleccionada.distritos : [];
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
                this.email = userData.email;
                this.direccion = userData.direccion;
                this.telefono = userData.telefono;
            } catch (error) {
                console.error(error);
                alert('Ocurrió un error al cargar los datos del usuario');
            }
        },

        async saveChanges() {
            if (
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
                const response = await fetch('http://192.168.18.9:3000/cs-san-martin/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
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
                } else {
                    throw new Error('Error al actualizar el perfil');
                }
            } catch (error) {
                console.error('Error al actualizar el perfil:', error);
            }
            this.closeModal();
        },

        redirectToLogin() {
            this.$router.push(`${base}/login`);
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
    width: 500px;
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
