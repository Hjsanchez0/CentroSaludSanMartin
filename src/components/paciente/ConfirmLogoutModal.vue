<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal">
      <img src="../../assets/exclamacion.png" alt="Cerrar Sesión" class="logout-icon">
      <h2>Cerrar Sesión</h2>
      <h3>¿Seguro de cerrar sesión?</h3>
      <div class="button-container">
        <button @click="confirmLogout" class="confirm-button">SI</button>
        <button @click="cancelLogout" class="cancel-button">NO</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    confirmLogout() {
      this.$emit('confirm');
    },
    cancelLogout() {
      this.$emit('cancel');
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
  width: 350px;
  text-align: center;
}

.logout-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 25px;
}

h2 {
  margin: 0;
  margin-bottom: 20px;
}

h3 {
  margin: 0;
  margin-bottom: 30px;
  color: rgb(112, 112, 112);
}

.button-container {
  display: block;
}

.confirm-button,
.cancel-button {
  padding: 10px 30px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
}

.confirm-button {
  background-color: #28a745;
  color: white;
  border: none;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  border: none;
}

.confirm-button:hover,
.cancel-button:hover {
  opacity: 0.8;
}
</style>
