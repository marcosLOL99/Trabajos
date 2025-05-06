<template>
  <div class="container mt-4">
    <!-- Formulario de Login -->
    <div class="card p-4 mb-4 shadow">
      <h5 class="text-center mb-3">Acceso</h5>
      <form @submit.prevent="iniciarSesion" autocomplete="off">
        <!-- Campos del formulario -->
        <div class="mb-3">
          <label for="usuario" class="form-label">Usuario: </label>
          <input type="text" v-model="usuario" class="form-control" id="usuario" required autocomplete="off" />
        </div>
        <div class="mb-3">
          <label for="contrasena" class="form-label">Contraseña: </label>
          <input type="password" v-model="contrasena" class="form-control" id="contrasena" required autocomplete="off" />
        </div>
        <div class="d-flex justify-content-center">
          <button type="submit" class="btn btn-primary btn-sm w-50 mt-3">Enviar</button>
        </div>
      </form>
    </div>

    <!-- Mensaje para el registro de nuevos usuarios -->
    <p class="text-center mt-3" style="font-size: 0.9rem; color: #6c757d;">
      El registro de un nuevo usuario deberá solicitarse al administrador del sistema.
    </p>
  </div>
</template>

<script>
export default {
  name: "TablaHome",
  data() {
    return {
      usuario: "",
      contrasena: "",
    };
  },

  mounted() {
    window.localStorage.clear(); // Borra el almacenamiento local
    window.sessionStorage.clear(); // Borra la sesión de almacenami 
    // Limpiar los inputs cuando se recargue la página
    this.$nextTick(() => {
      this.usuario = "";
      this.contrasena = "";
    });
  },
  methods: {
    onSubmit() {
      alert("¡Formulario enviado! Ahora implementaremos la autenticación.");
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 500px;
}

form {
  background: linear-gradient(to bottom, #f0f0f0, #dfe6e9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-family: 'Arial', sans-serif;
  color: #2c3e50;
  margin-bottom: 30px;
}

button {
  width: 100%;
}

button:hover {
  background-color: #3498db;
}

input[type="text"], input[type="password"] {
  border-radius: 5px;
}

.btn {
  background-color: #5bc0de;
  color: white;
}

.btn-sm {
  font-size: 0.875rem; /* Tamaño de fuente más pequeño */
  padding: 0.375rem 0.75rem; /* Reducir el padding */
}
</style>
