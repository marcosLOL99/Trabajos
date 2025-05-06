<template>
    <div class="container mt-4">
  <!-- Formulario para agregar o modificar datos clínicos -->
  <div class="card p-4 mb-4 shadow">
    <h4 class="text-center mb-3"> Datos Piel 🧴  </h4>
    <form @submit.prevent="manejarFormulario">
      <p v-if="usuarioId" class="text-center form-label bg-warning-subtle d-block p-2 rounded">
        ID Usuario: {{ usuarioId }}   <span style="margin-left: 30px;"> </span>    Móvil: {{usuarioMovil }}
      </p>
      <p v-else class="text-center form-label bg-warning-subtle d-block p-2 rounded"> Usuario No Seleccionado</p>
        <br>
        <div class="row">
  <!-- Tipo de Piel -->
  <div class="col-md-12 mb-3">
    <div class="d-flex align-items-center">
      <label for="tipoPiel" class="form-label me-2" style="min-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        Tipo de Piel 🧴:
      </label>
      <div class="d-flex flex-wrap">
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="pielGrasa" name="tipoPiel" value="Grasa" v-model="datosPiel.tipoPiel" />
          <label class="form-check-label" for="pielGrasa">
            Grasa
          </label>
        </div>
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="pielSeca" name="tipoPiel" value="Seca" v-model="datosPiel.tipoPiel" />
          <label class="form-check-label" for="pielSeca">
            Seca
          </label>
        </div>
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="pielMixta" name="tipoPiel" value="Mixta" v-model="datosPiel.tipoPiel" />
          <label class="form-check-label" for="pielMixta">
            Mixta
          </label>
        </div>
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="pielNormal" name="tipoPiel" value="Normal" v-model="datosPiel.tipoPiel" />
          <label class="form-check-label" for="pielNormal">
            Normal
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" id="pielSensible" name="tipoPiel" value="Sensible" v-model="datosPiel.tipoPiel" />
          <label class="form-check-label" for="pielSensible">
            Sensible
          </label>
        </div>
      </div>
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
  <!-- Alteraciones Cutáneas -->
  <div class="col-md-12 mb-3">
    <div class="d-flex align-items-center">
      <label for="alteracionesCutaneas" class="form-label me-2" style="min-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        Alteraciones Cutáneas 🩹 :
      </label>
      <div class="d-flex flex-wrap">
        <div class="form-check me-4 " v-for="(alteracion) in alteracionesCutaneas" :key="alteracion.id">
          <input class="form-check-input" type="checkbox" :id="alteracion.id" :value="alteracion.value" v-model="datosPiel.alteracionesCutaneas" />
          <label class="form-check-label" :for="alteracion.id">
            {{ alteracion.value }}
          </label>
        </div>
      </div>
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
  <!-- Alteraciones Pigmentarias -->
  <div class="col-md-12 mb-3">
    <div class="d-flex align-items-center">
      <label for="alteracionesPigmentarias" class="form-label me-2" style="min-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        Alteraciones Pigmentarias 🌞:
      </label>
      <div class="d-flex flex-wrap">
        <div class="form-check me-4" v-for="(alteracion) in alteracionesPigmentarias" :key="alteracion.id">
          <input class="form-check-input" type="checkbox" :id="alteracion.id" :value="alteracion.value" v-model="datosPiel.alteracionesPigmentarias" />
          <label class="form-check-label" :for="alteracion.id">
            {{ alteracion.value }}
          </label>
        </div>
      </div>
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
  <!-- Alteraciones Vasculares -->
  <div class="col-md-12 mb-3">
    <div class="d-flex align-items-center">
      <label for="alteracionesVasculares" class="form-label me-2" style="min-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        Alteraciones Vasculares 💉:
      </label>
      <div class="d-flex flex-wrap">
        <div class="form-check me-4" v-for="(alteracion) in alteracionesVasculares" :key="alteracion.id">
          <input class="form-check-input" type="checkbox" :id="alteracion.id" :value="alteracion.value" v-model="datosPiel.alteracionesVasculares" />
          <label class="form-check-label" :for="alteracion.id">
            {{ alteracion.value }}
          </label>
        </div>
      </div>
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
  <!-- Alteraciones Pilosas -->
  <div class="col-md-12 mb-3">
    <div class="d-flex align-items-center">
      <label for="alteracionesPilosas" class="form-label me-2" style="min-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        Alteraciones Pilosas 🧑‍🦱:
      </label>
      <div class="d-flex flex-wrap">
        <div class="form-check me-4" v-for="(alteracion) in alteracionesPilosas" :key="alteracion.id">
          <input class="form-check-input" type="checkbox" :id="alteracion.id" :value="alteracion.value" v-model="datosPiel.alteracionesPilosas" />
          <label class="form-check-label" :for="alteracion.id">
            {{ alteracion.value }}
          </label>
        </div>
      </div>
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
  <!-- Grosor del Pelo -->
  <div class="col-md-12 mb-3">
    <div class="d-flex align-items-center">
      <label for="grosorPelo" class="form-label me-2" style="min-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        Grosor del Pelo 💇‍♀️:
      </label>
      <div class="d-flex flex-wrap">
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="ninguno" value="Ninguno" v-model="datosPiel.grosorPelo" />
          <label class="form-check-label" for="ninguno">
            Ninguno
          </label>
        </div>
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="muyFino" value="Muy Fino" v-model="datosPiel.grosorPelo" />
          <label class="form-check-label" for="muyFino">
            Muy Fino
          </label>
        </div>
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="fino" value="Fino" v-model="datosPiel.grosorPelo" />
          <label class="form-check-label" for="fino">
            Fino
          </label>
        </div>
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="medio" value="Medio" v-model="datosPiel.grosorPelo" />
          <label class="form-check-label" for="medio">
            Medio
          </label>
        </div>
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="grueso" value="Grueso" v-model="datosPiel.grosorPelo" />
          <label class="form-check-label" for="grueso">
            Grueso
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" id="muyGrueso" value="Muy Grueso" v-model="datosPiel.grosorPelo" />
          <label class="form-check-label" for="muyGrueso">
            Muy Grueso
          </label>
        </div>
      </div>
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
  <!-- Color del Pelo -->
  <div class="col-md-12 mb-3">
    <div class="d-flex align-items-center">
      <label for="colorPelo" class="form-label me-2" style="min-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        Color del Pelo 🎨:
      </label>
      <div class="d-flex flex-wrap">
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="pelirrojo" name="colorPelo" value="Pelirrojo" v-model="datosPiel.colorPelo" />
          <label class="form-check-label" for="pelirrojo">
            Pelirrojo
          </label>
        </div>
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="rubio" name="colorPelo" value="Rubio" v-model="datosPiel.colorPelo" />
          <label class="form-check-label" for="rubio">
            Rubio
          </label>
        </div>
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="castano" name="colorPelo" value="Castaño" v-model="datosPiel.colorPelo" />
          <label class="form-check-label" for="castano">
            Castaño
          </label>
        </div>
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="moreno" name="colorPelo" value="Moreno" v-model="datosPiel.colorPelo" />
          <label class="form-check-label" for="moreno">
            Moreno
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" id="negro" name="colorPelo" value="Negro" v-model="datosPiel.colorPelo" />
          <label class="form-check-label" for="negro">
            Negro
          </label>
        </div>
      </div>
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
  <!-- Color de Ojos -->
  <div class="col-md-12 mb-3">
    <div class="d-flex align-items-center">
      <label for="colorOjos" class="form-label me-2" style="min-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        Color de Ojos 👀:
      </label>
      <div class="d-flex flex-wrap">
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="azul" name="colorOjos" value="Azul" v-model="datosPiel.colorOjos" />
          <label class="form-check-label" for="azul">
            Azul
          </label>
        </div>
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="verde" name="colorOjos" value="Verde" v-model="datosPiel.colorOjos" />
          <label class="form-check-label" for="verde">
            Verde
          </label>
        </div>
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="marron" name="colorOjos" value="Marrón" v-model="datosPiel.colorOjos" />
          <label class="form-check-label" for="marron">
            Marrón
          </label>
        </div>
        <div class="form-check me-4">
          <input class="form-check-input" type="radio" id="gris" name="colorOjos" value="Gris" v-model="datosPiel.colorOjos" />
          <label class="form-check-label" for="gris">
            Gris
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" id="negro" name="colorOjos" value="Negro" v-model="datosPiel.colorOjos" />
          <label class="form-check-label" for="negro">
            Negro
          </label>
        </div>
      </div>
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
      <!-- Observaciones -->
      <div class="col-md-12 mb-3">
     <label for="observaciones" class="form-label">Observaciones 📝 :</label>
     <textarea v-model="datosPiel.observaciones" id="observaciones" class="form-control" rows="3"></textarea>
      </div>  
    </div>    
  
<!-- Botones para guardar o modificar los datos piel -->
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
//import axios from 'axios';
//import Swal from 'sweetalert2';

export default {
    data() {
        return {
            datosPiel: {
                tipoPiel: null,
                alteracionesCutaneas: [],
                alteracionesPigmentarias: [],
                alteracionesVasculares: [],
                alteracionesPilosas: [],
                grosorPelo: null,
                colorPelo: null,
                colorOjos: null,
                observaciones: null
            },
        alteracionesCutaneas: [
        { id: "dermatitis", value: "Dermatitis" },
        { id: "psoriasis", value: "Psoriasis" },
        { id: "rosacea", value: "Rosácea" },
        { id: "acne", value: "Acné" },
        { id: "cicatrices", value: "Cicatrices" },
        { id: "impetigo", value: "Impétigo" },
        { id: "herpes", value: "Herpes" }
      ],
      alteracionesPigmentarias: [
        { id: "vitiligo", value: "Vitíligo" },
        { id: "melasma", value: "Melasma" },
        { id: "efelides", value: "Efélides" },
        { id: "lentigos", value: "Léntigos" },
        { id: "nevus", value: "Nevus" }
      ],
      alteracionesVasculares: [
        { id: "varices", value: "Varices" },
        { id: "edemas", value: "Edemas" }
      ],
      alteracionesPilosas: [
        { id: "foliculitis", value: "Foliculitis" },
        { id: "hipertricosis", value: "Hipertricosis" },
        { id: "hirsutismo", value: "Hirsutismo" },
        { id: "otras", value: "Otras" }
      ]
    }
  },

    computed:  {
         // Accede al usuarioId y usuarioMovil desde Vuex
      usuarioId() {
        return this.$store.getters.getUsuarioId;
      },
      usuarioMovil() {
        return this.$store.getters.getUsuarioMovil;
      } 
    },
  

  created() {
    // Usar el usuarioId para hacer alguna acción inicial si es necesario
    console.log('ID del usuario en HabitosVida.vue:', this.usuarioId);
    console.log('Móvil del usuario en HabitosVida.vue:', this.usuarioMovil);
    
    // Si es necesario, puedes hacer una llamada API para cargar los hábitos de vida del usuario
    // Ejemplo:
    // this.cargarHabitosVida(this.usuarioId); // Llamar a una función que cargue los hábitos de vida
  },
  

methods: {
    excluirCheckbox(grupo, valor) {
    // Asegurarte de que datosPiel[grupo] sea un arreglo
    if (!Array.isArray(this.datosPiel[grupo])) {
        this.datosPiel[grupo] = [];
    }

    // Lógica para excluir un valor del grupo
    if (this.datosPiel[grupo].includes(valor)) {
        this.datosPiel[grupo] = this.datosPiel[grupo].filter(item => item !== valor);
    } else {
        this.datosPiel[grupo].push(valor);
    }
    },
    manejarFormulario() {
      if (this.usuarioId) {
        console.log('Modificando datos:', this.datosPiel);
      } else {
        console.log('Guardando nuevos datos:', this.datosPiel);
      }
    }
  }
};


</script>

<style scoped>

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
