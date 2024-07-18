<template>
    <Header />
    <div class="login">
        <div class="login-left">
            <img src="../assets/paciente.png" alt="Login Image" class="login-image" />
        </div>
        <div class="login-container">
            <div class="login-right">
                <div class="login-header">
                    <h2>Login</h2>
                    <div class="user-type">
                        <div class="user-type-buttons">
                            <button :class="{ active: role === 'paciente' }"
                                @click="toggleRole('paciente')">Paciente</button>
                        </div>
                        <select v-model="role_aux" @change="toggleRole(role_aux)" :class="{'highlighted': role_aux === 'Administrador' || 
                        role_aux === 'Admision' || role_aux === 'Medicina General' || role_aux === 'Enfermeria' || role_aux === 'Nutricion' || 
                        role_aux === 'Obstetricia' || role_aux === 'Odontologia' || role_aux === 'Psicologia'}">
                            <option value="Especialistas" disabled>Especialistas</option>
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
                <div class="login-form">
                    <form @submit.prevent="login">
                        <div class="form-group" v-if="role === 'paciente'">
                            <label for="document-type">Tipo de documento:</label>
                            <select id="document-type" v-model="documentType">
                                <option value="dni">DOCUMENTO NACIONAL DE IDENTIDAD</option>
                                <option value="carnet">CARNET DE EXTRANJERÍA</option>
                                <option value="pasaporte">PASAPORTE</option>
                                <option value="die">DOCUMENTO DE IDENTIDAD EXTRANJERO</option>
                            </select>
                        </div>
                        <div class="form-group" v-if="role === 'paciente'">
                            <label for="document-number">Número de documento:</label>
                            <input type="text" id="document-number" placeholder="Ingrese su número de documento"
                                v-model="documentNumberPaciente" />
                        </div>
                        <div class="form-group" v-if="role !== 'paciente'">
                            <label for="document-number">Usuario:</label>
                            <input type="text" id="document-number" placeholder="Ingrese su usuario"
                                v-model="documentNumberEspecialista" />
                        </div>
                        <div class="form-group" v-if="role === 'paciente'">
                            <label for="password">Contraseña:</label>
                            <div class="password-input">
                                <input :type="showPassword ? 'text' : 'password'" id="password"
                                    placeholder="Ingrese su contraseña" v-model="passwordPaciente" />
                                <button class="mostrar" type="button" @click="toggleShowPassword">{{ showPassword ?
                                    'Ocultar' :
                                    'Mostrar' }}</button>
                            </div>
                        </div>
                        <div class="form-group" v-if="role !== 'paciente'">
                            <label for="password">Contraseña:</label>
                            <div class="password-input">
                                <input :type="showPassword ? 'text' : 'password'" id="password"
                                    placeholder="Ingrese su contraseña" v-model="passwordEspecialista" />
                                <button class="mostrar" type="button" @click="toggleShowPassword">{{ showPassword ?
                                    'Ocultar' :
                                    'Mostrar' }}</button>
                            </div>
                        </div>
                        <button class="ingresar" type="submit">Ingresar</button>
                    </form>
                    <p v-if="role === 'paciente'">¿No tienes una cuenta? <a
                            href="/cs-san-martin/register">Regístrate</a></p>
                    <p>¿Olvidó su contraseña? Comuníquese al <a href="https://api.whatsapp.com/send?phone=51935691792&text=Quiero%20reportar%20un%20problema%20con%20la%20p%C3%A1gina%20web%20del%20centro%20de%20salud%20San%20Martin%20de%20Porres." target="_blank">WhatsApp</a></p>
                </div>
            </div>
        </div>
    </div>
    <div v-if="showLoginError" class="modal-overlay">
        <div class="modal">
            <div class="modal-content">
                <p>Usuario y/o contraseña incorrectos.</p>
                <button class="confirmacion" @click="closeLoginErrorModal">Aceptar</button>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../components/Header.vue';
import { base } from "../router/index";

export default {
    components: {
        Header
    },
    data() {
        return {
            role: 'paciente',
            role_aux: 'Especialistas',
            documentType: 'dni',
            documentNumberPaciente: '',
            documentNumberEspecialista: '',
            passwordPaciente: '',
            passwordEspecialista: '',
            showPassword: false,
            showLoginError: false
        };
    },
    methods: {
        toggleRole(type) {
            this.role = type;
            if (type === 'paciente') {
                this.role_aux = 'Especialistas';
            }
        },

        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },

        async login() {
            try {
                let documentNumber = '';
                let password = '';

                if (this.role === 'paciente') {
                    documentNumber = this.documentNumberPaciente;
                    password = this.passwordPaciente;
                } else {
                    this.role = this.role_aux;
                    documentNumber = this.documentNumberEspecialista;
                    password = this.passwordEspecialista;
                }

                const response = await fetch('http://192.168.18.9:3000/cs-san-martin/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        role: this.role,
                        documentNumber: documentNumber,
                        password: password
                    })
                });

                if (!response.ok) {
                    this.showLoginError = true;
                    const errorData = await response.json();
                    throw new Error(errorData.msg);
                }

                const responseData = await response.json();
                const { token, role } = responseData;

                localStorage.setItem("token", token);
                localStorage.setItem("role", role.toLowerCase());

                setTimeout(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                }, 300000);

                if (role === 'paciente') {
                    this.$router.push(`${base}/dashboard-paciente`);
                }
                if (role === 'Administrador') {
                    this.$router.push(`${base}/dashboard-administrador`);
                } 
                if (role === 'Admision') {
                    this.$router.push(`${base}/dashboard-admision`);
                }
                if (role === "Medicina General" || role === "Enfermeria" || role === "Nutricion" || 
                role === "Obstetricia" || role === "Odontologia" || role === "Psicologia") {
                    this.$router.push(`${base}/dashboard-especialista`);
                }
            } catch (error) {
                console.error("Error durante el inicio de sesión:", error.message);
            }
        },

        closeLoginErrorModal() {
            this.showLoginError = false;
        }
    }
};
</script>

<style scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-container {
    display: flex;
    width: 450px;
    border: 1px solid #ccc;
    border-radius: 10px;
}

.login-left {
    flex: 1;
    margin: 20px;
}

.login-right {
    flex: 2;
    padding: 5px 20px;
}

.login-image {
    width: 100%;
    height: auto;
}

.login-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.user-type {
    display: flex;
    align-items: center;
}

.user-type-buttons {
    display: flex;
}

.user-type button.active {
    background-color: #0056b3;
    color: white;
}

.user-type button {
    width: calc(100%);
    margin-right: 10px;
}

.user-type select {
    width: 100%;
    padding: 8px;
    border: none;
    border-radius: 10px;
    box-sizing: border-box;
    background-color: white;
    font-size: 15px;
    height: 38px;
}

.user-type select.highlighted {
    background-color: #0056b3;
    color: white;
}

.login-form {
    max-width: 400px;
    margin: auto;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    color: rgb(82, 82, 82);
    text-align: left;
}

input[type="text"],
input[type="password"],
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

.mostrar {
    background-color: #ffffff;
    border-radius: 0 5px 5px 0;
    color: rgb(82, 82, 82);
    cursor: pointer;
    font-family: sans-serif;
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

.ingresar {
    width: 100%;
    background-color: #2e9436;
    border-radius: 10px;
    color: rgb(255, 255, 255);
    cursor: pointer;
}

.ingresar:hover {
    background-color: #3a773f;
}

p {
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

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    padding: 20px;
}

.modal-content {
    text-align: center;
}

.confirmacion {
    background-color: #2e9436;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 20px;
}

.confirmacion:hover {
    background-color: #3a773f;
}
</style>
