<template>
    <div class="header">
      <header class="header-content">
        <div class="logo-container">
          <img src="../assets/logo.jpg" alt="Logo" class="logo">
        </div>
      </header>
    </div>
  </template>
  
  <style scoped>
  .header {
    width: 100%;
    box-shadow: 0 1px rgba(0, 0, 0, 0.1);
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 90px;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
  }
  
  .logo {
    height: 90px; 
    width: auto;
  }
  </style>
  