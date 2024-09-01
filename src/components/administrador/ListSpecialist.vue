<template>
    <div class="table-container">
        <h2>Listado de los Especialistas</h2>
        <div class="search-container">
            <div>
                <button class="crear-especialista" @click="showCreateSpecialistModal = true">Crear Especialista</button>
            </div>
            <div>
                <label for="search">Buscar por Número de DNI:</label>
                <input type="text" id="search" v-model="searchQuery" @input="filterSpecialistByDNI"
                    placeholder="Ingrese el DNI">
            </div>
            <div>
                <label for="search">Rol:</label>
                <input type="text" id="search" v-model="searchQueryRol" @input="filterSpecialistByRole"
                    placeholder="Ingrese su rol">
            </div>
        </div>
        <div class="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th>Acciones</th>
                        <th>Documento</th>
                        <th>Número</th>
                        <th>Rol</th>
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
                <tbody v-if="filteredSpecialist.length > 0">
                    <tr v-for="(especialista, index) in filteredSpecialist" :key="index">
                        <td><button v-if="especialista._id !== userData._id" @click="resetPassword(especialista)" class="reset">
                                <img src="../../assets/resetear.png" alt="Resetear Icon" class="button-icon"></button>
                            <button @click="showEditModal(especialista)" class="edit">
                                <img src="../../assets/editar-especialista.png" alt="Edit Icon" class="button-icon">
                            </button>
                            <button v-if="especialista._id !== userData._id" @click="deleteSpecialist(especialista)" class="delete">
                                <img src="../../assets/marcar-x.png" alt="Delete Icon" class="button-icon">
                            </button>
                        </td>
                        <td>{{ especialista.documentType }}</td>
                        <td>{{ especialista.documentNumber }}</td>
                        <td>{{ especialista.role }}</td>
                        <td>{{ especialista.nombres }}</td>
                        <td>{{ especialista.apellidoPat }}</td>
                        <td>{{ especialista.apellidoMat }}</td>
                        <td>{{ formatFechaNacimiento(especialista.fechaNacimiento) }}</td>
                        <td>{{ especialista.genero }}</td>
                        <td>{{ especialista.region }}</td>
                        <td>{{ especialista.provincia }}</td>
                        <td>{{ especialista.distrito }}</td>
                        <td>{{ especialista.direccion }}</td>
                        <td>{{ especialista.telefono }}</td>
                        <td>{{ especialista.email }}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="15">No hay pacientes registrados</td>
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
        <div v-if="showCreateSpecialistModal" class="modal-overlay3">
            <div class="modal3">
                <div class="modal-header3">
                    <h2>Crear Especialista</h2>
                    <span class="close" @click="closeCreateSpecialistModal">&times;</span>
                </div>
                <hr class="linea">
                <div class="modal-content3">
                    <AgregarEspecialista @close="closeCreateSpecialistModal"
                        @registro-exitoso="handleRegistroExitoso" />
                </div>
            </div>
        </div>
        <div v-if="showConfirmModal" class="modal-overlay2">
            <div class="modal2">
                <div class="modal-header">
                    <h2>Confirmar Eliminación</h2>
                    <span class="close" @click="cancelDelete">&times;</span>
                </div>
                <hr class="linea">
                <div class="modal-content2">
                    <p>¿Está seguro que desea eliminar al especialista {{ currentSpecialist.nombres }} {{
                        currentSpecialist.apellidoPat }}?</p>
                    <div class="button-container">
                        <button class="confirmar" @click="confirmDelete">Confirmar</button>
                        <button class="cancelar" @click="cancelDelete">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
        <EditarEspecialista :visible="isEditModalVisible" :especialista="selectedSpecialist"
            @close="isEditModalVisible = false" @update-list="fetchSpecialist" />
    </div>
</template>

<script>
import AgregarEspecialista from './AgregarEspecialista.vue';
import EditarEspecialista from './EditarEspecialista.vue';

export default {
    props: {
        userData: {
            type: Object,
            required: true
        }
    },

    components: {
        AgregarEspecialista,
        EditarEspecialista
    },

    data() {
        return {
            especialistas: [],
            filteredSpecialist: [],
            showModal: false,
            showSuccessModal: false,
            showErrorModal: false,
            showIncompleteModal: false,
            showConfirmModal: false,
            searchQuery: '',
            searchQueryRol: '',
            password: '',
            confirmPassword: '',
            showPassword: false,
            ConfirmShowPassword: false,
            currentPatient: null,
            showCreateSpecialistModal: false,
            isEditModalVisible: false,
            selectedSpecialist: null,
        };
    },

    created() {
        this.fetchSpecialist();
    },

    methods: {
        showEditModal(especialista) {
            this.selectedSpecialist = especialista;
            this.isEditModalVisible = true;
        },

        handleRegistroExitoso() {
            this.closeCreateSpecialistModal();
            this.fetchSpecialist();
        },

        closeCreateSpecialistModal() {
            this.showCreateSpecialistModal = false;
        },

        async fetchSpecialist() {
            try {
                const response = await fetch('http://192.168.18.79:3000/cs-san-martin/specialist', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener los pacientes');
                }
                const especialistas = await response.json();
                this.especialistas = especialistas;
                this.filteredSpecialist = especialistas;
            } catch (error) {
                console.error('Error en fetchSpecialist:', error);
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

        resetPassword(especialista) {
            this.currentPatient = especialista;
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

        filterSpecialistByDNI() {
            const query = this.searchQuery.toLowerCase();

            this.filteredSpecialist = this.especialistas.filter(especialista => {
                return especialista.documentNumber.toLowerCase().includes(query);
            });

        },

        filterSpecialistByRole() {
            const roleQuery = this.searchQueryRol.trim().toLowerCase();
            if (roleQuery === '') {
                this.filteredSpecialist = this.especialistas;
            } else {
                this.filteredSpecialist = this.especialistas.filter(especialista => {
                    return especialista.role.toLowerCase().includes(roleQuery);
                });
            }
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

                const response = await fetch(`http://192.168.18.79:3000/cs-san-martin/specialist/${this.currentPatient._id}`, {
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
        },

        deleteSpecialist(especialista) {
            this.currentSpecialist = especialista;
            this.showConfirmModal = true;
        },

        confirmDelete() {
            const especialistaId = this.currentSpecialist._id;
            fetch(`http://192.168.18.79:3000/cs-san-martin/specialist/${especialistaId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar el especialista');
                    }
                    this.fetchSpecialist();
                    this.showConfirmModal = false;
                })
                .catch(error => {
                    console.error('Error al eliminar especialista:', error);
                });
        },

        cancelDelete() {
            this.currentSpecialist = null;
            this.showConfirmModal = false;
        },
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

.delete {
    padding: 5px;
    background-color: rgb(185, 24, 24);
    border: none;
    margin: 2px;
    border-radius: 4px;
    cursor: pointer;
}

.reset,
.edit {
    padding: 5px;
    background-color: green;
    border: none;
    margin: 2px;
    border-radius: 4px;
    cursor: pointer;
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

.modal2 button:last-of-type {
    background-color: #dc3545;
    color: white;
}

.modal2 button:first-of-type {
    background-color: #28a745;
    color: white;
}

.modal-overlay3 {
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

.modal3 {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 700px;
}

.modal-header3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    margin-bottom: 23px;
    display: flex;
    justify-content: space-between;
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

.crear-especialista {
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 15px;
}

.crear-especialista:hover {
    background-color: #218838;
}

@media screen and (max-width: 1366px) and (max-height: 768px) {
    .table-scroll {
        max-height: 400px;

    }
}
</style>