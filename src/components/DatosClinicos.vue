<template>
  <div class="container mt-4">
    <!-- Formulario para agregar o modificar datos clínicos -->
    <div class="card p-4 mb-4 shadow">
      <h4 class="text-center mb-3">Datos Clínicos 🩺 </h4>
      <form @submit.prevent="manejarFormulario">
        <p v-if="usuarioId" class="text-center form-label bg-warning-subtle d-block p-2 rounded">
          ID Usuario: {{ usuarioId }}   <span style="margin-left: 30px;"> </span>    Móvil: {{usuarioMovil }}
        </p>
        <p v-else class="text-center form-label bg-warning-subtle d-block p-2 rounded"> Usuario No Seleccionado</p>
        <br>

        <!-- Contenedor de los checkboxes en filas de 3 elementos -->
        <div class="row" v-for="(grupo, index) in agrupadosDatosClinicos" :key="index">
          <div class="col-md-4 mb-3" v-for="(valor, key) in grupo" :key="key">
            <label :for="key" class="form-label">
              {{ labelForKey(key) }}
              <span v-if="esFemenino(key)">♀️</span>
              <span v-else>♂️ ♀️</span>
            </label>
            <div class="d-flex align-items-center">
              <!-- Checkbox para "Sí" -->
              <input 
                type="checkbox" 
                :id="`${key}-si`"
                class="me-2"
                :checked="valor === true"
                @change="setCheckboxValue(key, true)"
              />
              <label :for="`${key}-si`" class="me-3">Sí</label>

              <!-- Checkbox para "No" -->
              <input 
                type="checkbox" 
                :id="`${key}-no`"
                class="me-2"
                :checked="valor === false"
                @change="setCheckboxValue(key, false)"
              />
              <label :for="`${key}-no`">No</label>
            </div>
          </div>

          <!-- Línea divisoria después de cada 3 elementos -->
          <div class="col-12" v-if="index < agrupadosDatosClinicos.length - 1">
            <hr class="custom-divider" />
          </div>
        </div>
        <hr class="custom-divider" />
        <!-- Campo de observaciones -->
        <br>
        <div class="mb-3">
          <label for="observaciones" class="form-label">Observaciones 📝 : </label>
          <textarea v-model="datosClinicos.observaciones" id="observaciones" class="form-control" rows="3"></textarea>
        </div>

        <!-- Botones para guardar o modificar los datos clínicos -->
        <div class="d-flex justify-content-center">
          <div class="d-flex justify-content-center">
            <!-- Solo muestra el botón "Modificar Datos" si hay un usuario seleccionado -->
            <button type="submit" class="btn btn-primary w-10 mt-3" :disabled="!usuarioId">
              Modificar Datos
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      modoEdicion: false,
      datosClinicos: {
        infecciones: null,
        alteracionesVasculares: null,
        diabetes: null,
        oncologicos: null,
        alergias: null,
        problemasRespiratorios: null,
        alteracionesHormonales: null,
        medicacion: null,
        operacionesRecientes: null,
        problemasCicatrizacion: null,
        embarazo: null,
        menopausia: null,
        ovarioPoliquistico: null,
        alteracionesMenstruales: null,
        observaciones: "",
      },
    };
  },

  computed: {
    agrupadosDatosClinicos() {
      const keys = Object.keys(this.datosClinicos).filter(k => k !== 'observaciones');
      const grupos = [];
      for (let i = 0; i < keys.length; i += 3) {
        const grupo = {};
        keys.slice(i, i + 3).forEach(k => {
          grupo[k] = this.datosClinicos[k];
        });
        grupos.push(grupo);
      }
      return grupos;
    },
    usuarioId() {
      return this.$store.getters.getUsuarioId; // Obtiene el usuarioId desde Vuex
    },
    usuarioMovil() {
      return this.$store.getters.getUsuarioMovil; // Obtiene el usuarioMovil desde Vuex
    }
  },

  created() {
    console.log('ID del usuario en DatosClinicos.vue:', this.usuarioId);
    console.log('Móvil del usuario en DatosClinicos.vue:', this.usuarioMovil);
  },

  mounted() {
    if (this.usuarioId) {
      this.modoEdicion = true; 
      this.cargarDatosClinicos(); // Asegúrate de que esta función esté definida en methods
    }
  },

  methods: {
    labelForKey(key) {
      return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
    },

    esFemenino(key) {
      const camposFemeninos = ["embarazo", "menopausia", "ovarioPoliquistico", "alteracionesMenstruales"];
      return camposFemeninos.includes(key);
    },

    setCheckboxValue(key, value) {
      this.datosClinicos[key] = value;
    },

    async cargarDatosClinicos() {
      try {
        const response = await axios.get(`http://localhost:3000/api/datosclinicos/${this.usuarioId}`);
        
        if (response.data.success) {
          const datos = response.data.datosClinicos;

          // Convertimos 0/1/null a true/false/null
          Object.keys(this.datosClinicos).forEach(key => {
            if (key === 'observaciones') {
              this.datosClinicos[key] = datos[key] || "";
            } else {
              if (datos[key] === 1) this.datosClinicos[key] = true;
              else if (datos[key] === 0) this.datosClinicos[key] = false;
              else this.datosClinicos[key] = null;
            }
          });
        }
      } catch (error) {
        console.log("No hay datos clínicos guardados o hubo un error:", error);
      }
    },

    async manejarFormulario() {
      if (this.modoEdicion) {
        await this.modificarDatosClinicos();
      } else {
        await this.guardarDatosClinicos();
      }
    },

    async modificarDatosClinicos() {
      const datosFormateados = {};
      Object.keys(this.datosClinicos).forEach(key => {
        if (key !== 'observaciones') {
          datosFormateados[key] = this.datosClinicos[key] === true ? 1 :
                                  this.datosClinicos[key] === false ? 0 : null;
        } else {
          datosFormateados[key] = this.datosClinicos[key];
        }
      });

      try {
        const response = await axios.post('http://localhost:3000/api/datosclinicos', {
          usuarioId: this.usuarioId,
          ...datosFormateados
        });

        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Modificado',
            text: 'Datos clínicos modificados correctamente.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data.message || 'Hubo un error al modificar los datos clínicos.'
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al modificar los datos clínicos.'
        });
      }
    },

    async guardarDatosClinicos() {
      try {
        const response = await axios.post('http://localhost:3000/api/datosclinicos', {
          usuarioId: this.usuarioId, 
          ...this.datosClinicos
        });

        if (response.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Guardado',
            text: 'Datos clínicos guardados correctamente.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data.message || 'Hubo un error al guardar los datos clínicos.'
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al guardar los datos clínicos.'
        });
      }
    }
  }
};
</script>


<style scoped>
/* Estilos para el formulario de datos clínicos */
.container {
  max-width: 1400px;
}
.custom-divider {
  border: 0;
  height: 2px; /* Aumenté el grosor */
  background-color: #f06292; /* Color rosado */
  margin: 10px 0;
  width: 100%; /* La línea ocupará el 100% del contenedor */
}
.card {
  padding: 20px;
}
.text-center.form-label.bg-warning-subtle {
  background: radial-gradient(circle, #fff3b0 0%, #ffffff 100%);
  color: #343a40; /* Color oscuro para el texto, resalta bien sobre el fondo amarillo */
  font-weight: bold; /* Acentúa el texto para mayor visibilidad */
  padding: 8px;
  border-radius: 5px; /* Bordes redondeados para un acabado más suave */
}
.form-label {
  font-weight: 600;
}

textarea {
  resize: none;
}

.btn {
  background-color: #5bc0de;
  color: white;
}
</style>
