<template>
    <div>
        <HeaderPaciente />
        <div class="container">
            <div class="content">
                <h3>INICIO</h3>
                <div class="user-info">
                    <label> {{ userData.role }}: {{ userData.documentNumber }}</label>
                </div>
            </div>
            <div class="profile-container">
                <div class="profile">
                    <img src="../../assets/perfil.png" alt="Perfil" class="profile-icon">
                    <p>{{ userData.nombres }} {{ userData.apellidoPat }} {{ userData.apellidoMat }}</p>
                    <p class="ubi"><img src="../../assets/ubicacion.png" alt="Location Icon" class="inline-icon">{{
                        userData.direccion }} - {{ userData.provincia }}</p>
                    <button class="edit" @click="showEditModal"><img src="../../assets/editar.png" alt="Edit Icon"
                            class="button-icon">Editar</button>
                    <hr class="linea">
                    <button class="cita" @click="togglePacientesInfo"><img src="../../assets/hospitalizacion.png"
                            alt="Appointment Icon" class="button-icon">Pacientes</button>
                    <hr class="linea">
                    <button class="logout" @click="showConfirmLogoutModal"><img src="../../assets/cerrar-sesion.png"
                            alt="Logout Icon" class="button-icon logout-icon">Cerrar Sesión</button>
                </div>

                <div class="button-container">
                    <div v-if="showPacientesInfo" class="button-box">
                        <ListCitasPacientes :userData="userData" />
                    </div>
                </div>

            </div>
        </div>
        <ConfirmLogoutModal :visible="isConfirmLogoutModalVisible" @confirm="logout" @cancel="hideConfirmLogoutModal" />
        <EditProfileModal :visible="isEditModalVisible" @close="isEditModalVisible = false" />
    </div>
</template>

<script>
import HeaderPaciente from '../../components/paciente/HeaderPaciente.vue';
import ConfirmLogoutModal from '../../components/paciente/ConfirmLogoutModal.vue';
import EditProfileModal from '../../components/paciente/EditProfileModal.vue';
import ListCitasPacientes from '../../components/especialista/ListCitasPacientes.vue';
import { base } from '../../router';

export default {
    components: {
        HeaderPaciente,
        ConfirmLogoutModal,
        ListCitasPacientes,
        EditProfileModal
    },
    data() {
        return {
            userData: {},
            isConfirmLogoutModalVisible: false,
            isEditModalVisible: false,
            showPacientesInfo: false
        };
    },
    created() {
        this.getUserData();
    },

    methods: {
        async getUserData() {
            try {
                const response = await fetch('http://192.168.18.79:3000/cs-san-martin/special', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del usuario');
                }
                const userData = await response.json();
                this.userData = userData;
            } catch (error) {
                console.error(error);
            }
        },
        
        showEditModal() {
            this.isEditModalVisible = true;
        },

        showConfirmLogoutModal() {
            this.isConfirmLogoutModalVisible = true;
        },

        hideConfirmLogoutModal() {
            this.isConfirmLogoutModalVisible = false;
        },

        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            this.$router.push(`${base}/login`);
        },

        togglePacientesInfo() {
            this.showPacientesInfo = !this.showPacientesInfo;
        }
    }
};
</script>

<style scoped>
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
}

.modal {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.modal p {
    margin: 0;
    color: rgb(82, 82, 82);
    margin-bottom: 5px;
}

.modal button {
    margin-top: 10px;
    margin-right: 5px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.modal button:first-of-type {
    background-color: #dc3545;
    color: white;
}

.modal button:last-of-type {
    background-color: #28a745;
    color: white;
}

.container {
    width: 100vw;
    height: 45.9vw;
    margin: 0;
    padding: 0;
    background-color: rgb(250, 250, 250);
}

.content {
    background: #15558d;
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: space-between;
}

h3 {
    margin: 0;
    color: white;
    text-align: left;
}

.user-info {
    display: flex;
    gap: 20px;
    margin: 0 4rem;
}

.profile-container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 20px;
}

.profile {
    background-color: #ffffff;
    padding: 20px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    width: 23rem;
}

.profile-icon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
}

.profile p {
    margin: 5px 0;
    margin-bottom: 15px;
    color: rgb(82, 82, 82);
    display: flex;
    align-items: center;
    justify-content: center;
}

.profile .ubi {
    margin: 5px 0;
    margin-bottom: 15px;
    color: rgb(158, 158, 158);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}

.linea {
    border: none;
    border-top: 1px solid #ebebeb;
}

.profile .cita {
    width: 100%;
    background-color: transparent;
    color: #bb6605;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.profile .edit {
  width: 30%;
  padding: 5px;
  background-color: rgb(206, 248, 206);
  color: rgb(3, 150, 3);
  border: none;
  margin: 10px auto;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile .logout {
    width: 100%;
    background-color: transparent;
    color: #757575;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.profile .logout:hover {
    color: #10d1eb;
}

.profile .logout:hover .logout-icon {
    filter: brightness(0) saturate(100%) invert(67%) sepia(16%) saturate(2048%) hue-rotate(149deg) brightness(99%) contrast(106%);
}

.button-container {
    display: flex;
    flex-direction: column;
    margin-left: 3rem;

}

.button-box {
    width: 82rem;
    background-color: #ffffff;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 20px;
}

.button-icon,
.inline-icon {
    width: 22px;
    height: 22px;
    margin-right: 5px;
}

@media screen and (max-width: 1366px) and (max-height: 768px) {
    .profile {
        width: 20rem;
    }

    .button-box {
        width: 53.5rem;

    }

    .profile .ubi {
        font-size: 13px;
    }
}
</style>