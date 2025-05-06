<template>
    <div class="container mt-4">
      <div class="card p-4 mb-4 shadow">
        <h4 class="text-center mb-3"> Datos Estéticos 💆‍♀️</h4>
        <form @submit.prevent="guardarDatosEsteticos">
          <p v-if="usuarioId" class="text-center form-label bg-warning-subtle d-block p-2 rounded">
            ID Usuario: {{ usuarioId }} <span style="margin-left: 30px;"></span> Móvil: {{ usuarioMovil }}
          </p>
          <p v-else class="text-center form-label bg-warning-subtle d-block p-2 rounded"> Usuario No Seleccionado</p>
          <br>
          <br>
          <div class="row">
            <!-- Hidratantes Faciales -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="hidratantesFaciales" class="form-label me-2" style="min-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  Hidratación Facial 🧴:
                </label>
                <input type="text" v-model="datosEsteticos.hidratantesFaciales" class="form-control form-control-sm text-start" id="hidratantesFaciales" style="max-width: 100%;"/>
              </div>
            </div>
            
            <!-- Hidratantes Corporales -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="hidratantesCorporales" class="form-label me-2" style="min-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  Hidratación Corporal 🛁:
                </label>
                <input type="text" v-model="datosEsteticos.hidratantesCorporales" class="form-control form-control-sm text-start" id="hidratantesCorporales" style="max-width: 100%;"/>
              </div>
            </div>
          </div>
           <!-- Línea separadora -->
          <div class="row">
            <div class="col-12 mb-3">
                <hr class="custom-divider" />
            </div>
          </div>
          <div class="row">
            <!-- Aceites -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="aceites" class="form-label me-2" style="min-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  Aceites 🛢️:
                </label>
                <input type="text" v-model="datosEsteticos.aceites" class="form-control form-control-sm text-start" id="aceites" style="max-width: 100%;"/>
              </div>
            </div>
            
            <!-- Protección Solar -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="proteccionSolar" class="form-label me-2" style="min-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  Protección Solar ☀️:
                </label>
                <input type="text" v-model="datosEsteticos.proteccionSolar" class="form-control form-control-sm text-start" id="proteccionSolar" style="max-width: 100%;"/>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 mb-3">
                <hr class="custom-divider" />
            </div>
          </div>
  
          <div class="row">
            <!-- Otra Cosmética -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="otraCosmetica" class="form-label me-2" style="min-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  Otra Cosmética 💅:
                </label>
                <input type="text" v-model="datosEsteticos.otraCosmetica" class="form-control form-control-sm text-start" id="otraCosmetica" style="max-width: 100%;"/>
              </div>
            </div>
            
            <!-- Métodos de Depilación -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="metodosDepilacion" class="form-label me-2" style="min-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  Dudas Estética 📏:
                </label>
                <input type="text" v-model="datosEsteticos.preocupacionesEsteticas" class="form-control form-control-sm text-start" id="metodosDepilacion" style="max-width: 100%;"/>
              </div>
            </div>
          </div>
             <!-- Línea separadora -->
          <div class="row">
            <div class="col-12 mb-3">
                <hr class="custom-divider" />
            </div>
          </div>
          
          <div class="row">
            <!-- Otra Cosmética -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="otraCosmetica" class="form-label me-2" style="min-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                   Cuidados Cosmética 🪞:
                </label>
                <input type="text" v-model="datosEsteticos.tratamientosEsteticos" class="form-control form-control-sm text-start" id="otraCosmetica" style="max-width: 100%;"/>
              </div>
            </div>
            
            <!-- Métodos de Depilación -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="metodosDepilacion" class="form-label me-2" style="min-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    Cirugía Estética 🔪:
                </label>
                <input type="text" v-model="datosEsteticos.cirugiaEstetica" class="form-control form-control-sm text-start" id="metodosDepilacion" style="max-width: 100%;"/>
              </div>
            </div>
          </div>
             <!-- Línea separadora -->
          <div class="row">
            <div class="col-12 mb-3">
                <hr class="custom-divider" />
            </div>
          </div>
          <div class="row">
            <!-- Otra Cosmética -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="otraCosmetica" class="form-label me-2" style="min-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                   Alergias Cosméticas 🤧 :
                </label>
                <input type="text" v-model="datosEsteticos.alergiaCosmeticas" class="form-control form-control-sm text-start" id="otraCosmetica" style="max-width: 100%;"/>
              </div>
            </div>
            
            <!-- Métodos de Depilación -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="metodosDepilacion" class="form-label me-2" style="min-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  Tipos Depilación ✂️:
                </label>
                <input type="text" v-model="datosEsteticos.metodosDepilacion" class="form-control form-control-sm text-start" id="metodosDepilacion" style="max-width: 100%;"/>
              </div>
            </div>
          </div> 
          <hr class="custom-divider" />
        <!-- Campo de observaciones -->
        <br>
        <div class="mb-3">
          <label for="observaciones" class="form-label">Observaciones 📝 : </label>
          <textarea v-model="datosEsteticos.observaciones" id="observaciones" class="form-control" rows="3"></textarea>
        </div>  
          <div class="d-flex justify-content-center">
            <!-- Solo muestra el botón "Modificar Datos" si hay un usuario seleccionado -->
            <button type="submit" class="btn btn-primary w-10 mt-3" :disabled="!usuarioId">
                Modificar Datos
            </button>
            </div>
        </form>
      </div>
    </div>
  </template>
  
    
  <script>
  export default {
    data() {
      return {
        datosEsteticos: {
          id: '',
          hidratantesFaciales: '',
          hidratantesCorporales: '',
          aceites: '',
          proteccionSolar: '',
          otraCosmetica: '',
          alergiaCosmetica: '',
          tratamientosRealizados: '',
          cirugiaEstetica: '',
          preocupacionesEsteticas: '',
          metodosDepilacion: '',
          observaciones: '',
        }
      };
    },
    computed: {
      usuarioId() {
        return this.$store.getters.getUsuarioId;
      },
      usuarioMovil() {
        return this.$store.getters.getUsuarioMovil;
      }
    },
    methods: {
      guardarDatosEsteticos() {
        if (this.usuarioId) {
          console.log('Modificando datos:', this.datosEsteticos);
        } else {
          console.log('Guardando nuevos datos:', this.datosEsteticos);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos personalizados para ajustar el tamaño de los inputs */
  .custom-divider {
    border: 0;
    height: 2px; /* Aumenté el grosor */
    background-color: #f06292; /* Color rosado */
    margin: 10px 0;
    width: 100%; /* La línea ocupará el 100% del contenedor */
  }
  
  .d-flex {
    display: flex;
    align-items: center;
  }
  
  .me-2 {
    margin-right: 10px;
  }
  
  /* Reducir el tamaño de los inputs a la mitad del ancho de su contenedor */
  .small-input {
    width: 50%; /* Ahora ocupa solo la mitad del contenedor */
    font-size: 0.9rem; /* Tamaño de fuente más pequeño */
  }
  
  /* Asegura que el texto esté alineado a la izquierda */
  .text-start {
    text-align: left;
  }
  
  .form-label {
    font-weight: 600;
  }
  
  .text-center.form-label.bg-warning-subtle {
    background: radial-gradient(circle, #fff3b0 0%, #ffffff 100%);
    color: #343a40; /* Color oscuro para el texto, resalta bien sobre el fondo amarillo */
    font-weight: bold; /* Acentúa el texto para mayor visibilidad */
    padding: 8px;
    border-radius: 5px; /* Bordes redondeados para un acabado más suave */
  }
  
  .btn {
    background-color: #5bc0de;
    color: white;
  }
  </style>
  