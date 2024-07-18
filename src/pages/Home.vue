<template>
  <div class="nav-cards">
    <header class="app-header">
      <img src="../assets/logo.jpg" alt="Header Image" />
      <hr class="header-divider" />
    </header>
    <div>
      <h2>SELECCIONA TU SEDE</h2>
    </div>
    <div class="card">
      <h2>TRUJILLO</h2>
      <img src="../assets/sede-trujillo.jpg" alt="Sede Trujillo" class="card-image" />
      <router-link to="/cs-san-martin/inicio">
        <button>SEDE TRUJILLO</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.app-header {
  text-align: center;
}

.header-divider {
  border: none;
  height: 1px;
  background-color: #ddd;
  margin: 10px 0;
}

.nav-cards {
  flex-direction: column;
  align-items: center;
}

.nav-cards>div:first-child {
  margin-bottom: 10px;
}

.card {
  border: 1px solid rgb(165, 213, 252);
  padding: 5px 15px;
  text-align: center;
  width: 350px;
}

.card-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 10px;
}

button {
  background-color: rgb(15, 147, 255);
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  padding: 10px 20px;
}

button:hover {
  background-color: rgb(11, 115, 201);
}
</style>