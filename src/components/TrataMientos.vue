<template>
  <div class="container mt-4">
    <!-- Formulario para agregar o modificar datos clínicos -->
    <div class="card p-4 mb-4 shadow">
      <h4 class="text-center mb-3">Tratamientos 💆‍♀️</h4>
      <form @submit.prevent="manejarFormulario">
        <p v-if="usuarioId" class="text-center form-label bg-warning-subtle d-block p-2 rounded">
          ID Usuario: {{ usuarioId }} <span style="margin-left: 30px;"> </span> Móvil: {{ usuarioMovil }}
        </p>
        <p v-else class="text-center form-label bg-warning-subtle d-block p-2 rounded"> Usuario No Seleccionado</p>
      
        <!-- Mensaje de aviso -->
        <p class="text-center text-danger fw-bold">
          ⚠ Antes de iniciar cualquier tratamiento, consultar el panel de contraindicaciones del paciente.
        </p>
    
          <!-- Contenedor con display flex para alinear en una sola línea -->
          <div class="mb-3 d-flex justify-content-between align-items-center">
              <!-- Label para el ID del tratamiento con número en rojo burdeos y alineado a la izquierda -->
              <div class="d-flex align-items-center">
                <label for="tratamientoId" class="form-label me-3" style="margin-bottom: 0;">Tratamiento: </label>
                <span class="text-danger" style="font-weight: bold; vertical-align: middle;">{{ trataMiento.id }}</span> <!-- Mostrar el id del tratamiento en rojo burdeos -->
              </div>

              <!-- Input para la fecha del tratamiento, ajustado al contenido y alineado a la derecha -->
              <div class="d-flex align-items-center">
                <label for="fechaTratamiento" class="form-label me-3" style="margin-bottom: 0;">Fecha del Tratamiento 📅 : </label>
                <input type="date" id="fechaTratamiento" v-model="trataMiento.fechaTratamiento" class="form-control d-inline-block text-center" required />
              </div>
            </div>

        <!-- Línea separadora -->
        <div class="row">
          <div class="col-12 mb-3">
            <hr class="custom-divider" />
          </div>
        </div>

        <!-- Selección de Técnica de Tratamiento -->
        <div class="mb-3">
          <label class="form-label">Seleccionar Técnica de Tratamiento 🔧 :</label>
          <div class="d-flex flex-wrap">
            <div class="form-check me-4" v-for="(tecnica, index) in tecnicasTratamiento" :key="index">
              <input
                class="form-check-input"
                type="radio"
                :id="tecnica.id"
                :value="tecnica.value"
                v-model="trataMiento.tecnicaTratamiento"
              />
              <label class="form-check-label" :for="tecnica.id">
                {{ tecnica.value }}
              </label>
            </div>
          </div>
        </div>

        <!-- Línea separadora -->
        <div class="row">
          <div class="col-12 mb-3">
            <hr class="custom-divider" />
          </div>
        </div>

    <!-- Zonas a Depilar -->
    <div class="mb-3">
      <label class="form-label">Zonas a Depilar 🌟 :</label>

      <div class="row">
  <!-- Fila 1: Facial -->
  <div class="col-md-6 mb-2">
    <div class="d-flex align-items-center">
      <label class="form-label d-flex align-items-center me-3 label-fixed-width">
        <span role="img" aria-label="facial" class="me-2"></span> Facial 👩‍🦰 :
      </label>
      <div class="d-flex flex-wrap gap-2 align-items-center">
        <div class="form-check me-2" v-for="(zona, index) in zonasDepilar.filter(zona => zona.id.includes('facial'))" :key="index">
          <input
            class="form-check-input"
            type="checkbox"
            :id="zona.id"
            :value="zona.value"
            v-model="trataMiento.zonasDepilacion"
          />
          <label class="form-check-label ms-1" :for="zona.id">
            {{ zona.value }}
          </label>
        </div>
      </div>
    </div>
  </div>

  <!-- Fila 2: Extremidades -->
  <div class="col-md-6 mb-2">
    <div class="d-flex align-items-center">
      <label class="form-label d-flex align-items-center me-3 label-fixed-width">
        <span role="img" aria-label="extremidades" class="me-2"></span> Extremidades 🦵 :
      </label>
      <div class="d-flex flex-wrap gap-2 align-items-center">
        <div class="form-check me-2" v-for="(zona, index) in zonasDepilar.filter(zona => zona.id.includes('extremidades'))" :key="index">
          <input
            class="form-check-input"
            type="checkbox"
            :id="zona.id"
            :value="zona.value"
            v-model="trataMiento.zonasDepilacion"
          />
          <label class="form-check-label ms-1" :for="zona.id">
            {{ zona.value }}
          </label>
        </div>
      </div>
    </div>
  </div>
</div>

<br>

<div class="row">
  <!-- Fila 3: Tronco -->
  <div class="col-md-6 mb-2">
    <div class="d-flex align-items-center">
      <label class="form-label d-flex align-items-center me-3 label-fixed-width">
        <span role="img" aria-label="tronco"></span> Tronco 👕 :
      </label>
      <div class="d-flex flex-wrap gap-2 align-items-center">
        <div class="form-check me-2" v-for="(zona, index) in zonasDepilar.filter(zona => zona.id.includes('tronco'))" :key="index">
          <input
            class="form-check-input"
            type="checkbox"
            :id="zona.id"
            :value="zona.value"
            v-model="trataMiento.zonasDepilacion"
          />
          <label class="form-check-label ms-1" :for="zona.id">
            {{ zona.value }}
          </label>
        </div>
      </div>
    </div>
  </div>

  <!-- Fila 4: Zona Íntima -->
  <div class="col-md-6 mb-2">
    <div class="d-flex align-items-center">
      <label class="form-label d-flex align-items-center me-3 label-fixed-width">
        <span role="img" aria-label="zona íntima" class="me-4"></span> Zona Íntima 🌸 :
      </label>
      <div class="d-flex flex-wrap gap-4 align-items-center">
        <div class="form-check me-2" v-for="(zona, index) in zonasDepilar.filter(zona => zona.id.includes('zonaIntima'))" :key="index">
          <input
            class="form-check-input"
            type="checkbox"
            :id="zona.id"
            :value="zona.value"
            v-model="trataMiento.zonasDepilacion"
          />
          <label class="form-check-label ms-1" :for="zona.id">
            {{ zona.value }}
          </label>
        </div>
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
            <!-- Otra Cosmética -->
            <div class="col-md-6 mb-3">
              <div class="d-flex align-items-center">
                <label for="otraCosmetica" class="form-label me-2" style="min-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                   Cosmeticos Usados 💄 :
                </label>
                <input type="text" v-model="trataMiento.cosmeticosUsados" class="form-control form-control-sm text-start" id="otraCosmetica" style="max-width: 100%;"/>
              </div>
            </div>
        </div>
            <!-- Línea separadora -->
          <div class="row">
          <div class="col-12 mb-3">
            <hr class="custom-divider" />
          </div>
        </div>
        <!-- Observaciones y Asesoramiento -->
        <div class="d-flex justify-content-between mb-3">
          <div class="col-md-6">
            <label for="observaciones" class="form-label">Observaciones 📝 :</label>
            <textarea v-model="trataMiento.observaciones" id="observaciones" class="form-control" rows="3"></textarea>
          </div>

          <div class="col-md-6 ms-2">
            <label for="asesoramiento" class="form-label">Asesoramiento 📝 :</label>
            <textarea v-model="trataMiento.asesoramiento" id="asesoramiento" class="form-control" rows="3"></textarea>
          </div>
        </div>

        <div class="d-flex justify-content-center">
          <!-- Botón de guardar -->
          <button type="submit" class="btn btn-primary w-10 mt-3" :disabled="!usuarioId">Guardar Tratamiento</button>
        </div>
      </form>
    </div>
<!-- Tabla de tratamientos registrados -->
<div class="card p-4 shadow">
      <h5 class="text-center mb-3">Historial de Tratamientos</h5>
      <table class="table table-striped table-bordered table-responsive">
        <thead class="custom-thead table-light">
          <tr>
            <th>ID</th>
            <th class="text-center">Técnica</th>
            <th class="text-center">Fecha</th>
            <th class="text-center" style="width: 150px;">Cargar Datos</th>
          </tr>
        </thead>
        <tbody class="table-hover">
          <!-- Mostrar solo los tratamientos correspondientes a la página actual -->
          <tr v-for="(tratamiento) in tratamientosPaginados" :key="tratamiento.id">
            <td class="text-center">{{ tratamiento.id }}</td>
            <td class="text-center">{{ tratamiento.tecnica_tratamiento }}</td>
            <td class="text-center">{{ formatDate(tratamiento.fecha_tratamiento) }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-warning" @click="getTratamiento(tratamiento)">
                Cargar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="d-flex justify-content-center align-items-center">
          <!-- Botón de página anterior con ícono -->
          <button 
            class="btn btn-secondary me-2 custom-btn" 
            :disabled="paginaActual === 1" 
            @click="cambiarPagina(paginaActual - 1)">
            <span class="fs-5">&lt;&lt;</span>
          </button>

          <!-- Indicador de la página actual -->
          <span class="mx-2">{{ paginaActual }} de {{ totalPaginas }}</span>

          <!-- Botón de página siguiente con ícono -->
          <button 
            class="btn btn-secondary ms-2 custom-btn" 
            :disabled="paginaActual === totalPaginas" 
            @click="cambiarPagina(paginaActual + 1)">
            <span class="fs-5">&gt;&gt;</span>
          </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      trataMiento: {
        fechaTratamiento: '',
        tecnicaTratamiento: '',
        cosmeticosUsados: '',
        observaciones: '',
        asesoramiento: '',
        zonasDepilacion: []
      },
      paginaActual: 1, 
      tratamientosPorPagina: 5,  // Mostrar 10 por página
      tratamientos: [],
      tecnicasTratamiento: [
          { id: 'pinzas', value: 'Pinzas' },
          { id: 'hilo', value: 'Hilo' },
          { id: 'ceraCaliente', value: 'Cera Caliente' },
          { id: 'ceraFria', value: 'Cera Fría' },
          { id: 'ceraBajaFusion', value: 'Cera Baja Fusión' },
          { id: 'sugaring', value: 'Sugaring' },
          { id: 'electrica', value: 'Eléctrica' },
          { id: 'laser', value: 'Láser' },
          { id: 'ipl', value: 'IPL' },
          { id: 'decoloracion', value: 'Decoloración' },
        ],
        zonasDepilar: [
          { id: 'facial-labio', value: 'Labio Superior' },
          { id: 'facial-cejas', value: 'Cejas' },
          { id: 'facial-maxilares', value: 'Maxilares' },
          { id: 'facial-menton', value: 'Mentón' },
          { id: 'facial-cuello', value: 'Cuello' },
          { id: 'extremidades-superiores', value: 'Extremidades Superiores' },
          { id: 'extremidades-inferiores', value: 'Extremidades Inferiores' },
          { id: 'tronco-pecho', value: 'Pecho' },
          { id: 'tronco-abdomen', value: 'Abdomen' },
          { id: 'tronco-axilas', value: 'Axilas' },
          { id: 'zonaIntima-clasica', value: 'Clásica' },
          { id: 'zonaIntima-brasileña', value: 'Brasileña' },
          { id: 'zonaIntima-completa', value: 'Completa' }
        ],
       
    };
  },

  mounted() {
 
    this.obtenerTratamientos(); // Llama a la función para obtener los tratamientos al montar el componente
  },

  computed: {
    // Calcular los tratamientos para la página actual
    tratamientosPaginados() {
      const start = (this.paginaActual - 1) * this.tratamientosPorPagina;
      const end = start + this.tratamientosPorPagina;
      return this.tratamientos.slice(start, end);
    },
    // Calcular el número total de páginas
    totalPaginas() {
      return Math.ceil(this.tratamientos.length / this.tratamientosPorPagina);
    },
  
    usuarioId() {
      return this.$store.getters.getUsuarioId; // Obtiene el usuarioId desde Vuex
    },
    usuarioMovil() {
      return this.$store.getters.getUsuarioMovil; // Obtiene el usuarioMovil desde Vuex
    }
  },

  methods: {
    // Función para cambiar de página
    cambiarPagina(nuevaPagina) {
      if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
        this.paginaActual = nuevaPagina;
      }
    },

    // Método para formatear la fecha
    formatDate(fecha) {
      const dateObj = new Date(fecha);

      const dia = String(dateObj.getDate()).padStart(2, '0');
      const mes = String(dateObj.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
      const anio = dateObj.getFullYear();

      return `${dia}/${mes}/${anio}`;
    },

    async getTratamiento(tratamiento) {
            try {
              const response = await axios.get(`http://localhost:3000/api/tratamientos/usuario/${tratamiento.id}`);
              //esta solución daría error si usamos el programa entre las 00 y 02 de la madrugada
              const fecha = new Date(response.data.fecha_tratamiento);
              fecha.setDate(fecha.getDate() + 1); // Sumar un día
              const fechaTratamientoISO = fecha.toISOString().split('T')[0];

              // Asigna la fecha al objeto trataMiento
              this.trataMiento = { 
                ...response.data,
                fechaTratamiento: fechaTratamientoISO, // Asignamos solo la fecha
                tecnicaTratamiento: response.data.tecnica_tratamiento,
              };
            } catch (error) {
              console.error('Error al cargar el tratamiento:', error);
              Swal.fire('Error', 'No se pudo cargar el tratamiento.', 'error');
            }
            // Aquí puedes agregar la lógica para cargar las zonas depilación
            try {
              const responseZonas = await axios.get(`http://localhost:3000/api/zona-tratamiento/${tratamiento.id}`);
              // Asignar las zonas depilación al objeto trataMiento
              this.trataMiento.zonasDepilacion = responseZonas.data.map(zona => zona.zona);
            } catch (error) {
              console.error('Error al cargar las zonas depilación:', error);
              Swal.fire('Error', 'No se pudo cargar las zonas depilación.', 'error');
            }
          },
        
  
    async manejarFormulario() {
      try {
        // Paso 1: Guardar tratamiento
        const tratamientoData = {
          usuario_id: this.usuarioId,
          fecha_tratamiento: this.trataMiento.fechaTratamiento,
          tecnica_tratamiento: this.trataMiento.tecnicaTratamiento,
          cosmeticosUsados: this.trataMiento.cosmeticosUsados,
          observaciones: this.trataMiento.observaciones,
          asesoramiento: this.trataMiento.asesoramiento
        };

        // Petición para guardar el tratamiento
        const respuestaTratamiento = await axios.post('http://localhost:3000/api/tratamientos', tratamientoData);

        // Paso 2: Relacionar zonas con el tratamiento
        const tratamientoId = respuestaTratamiento.data.id; // Asegúrate de que la API te devuelva el ID del tratamiento recién guardado

        const zonasData = {
            tratamiento_id: tratamientoId,
            zonas: Array.from(this.trataMiento.zonasDepilacion) || []// Convierte el Proxy a un array normal
          };
        
        const response = await axios.post("http://localhost:3000/api/zona-tratamiento", zonasData, {
            headers: { "Content-Type": "application/json" }
        })
        .catch(error => {
              console.error('Error en la petición:', error.response ? error.response.data : error);
            });

        if (response.status === 201) {
            // Muestra un mensaje de éxito con SweetAlert
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'Tratamiento y zonas guardados correctamente.',
              confirmButtonText: 'Aceptar'
            });
          this.obtenerTratamientos();
        }


      } catch (error) {
        // Si hay un error, muestra un mensaje de error con SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al guardar el tratamiento y las zonas.',
          confirmButtonText: 'Intentar de nuevo'
        });

        console.error('Error al guardar el tratamiento y las zonas:', error);
      }
    },

    // Método para obtener los tratamientos de un usuario
    async obtenerTratamientos() {
                if (this.usuarioId) {
                  axios
                    .get(`http://localhost:3000/api/tratamientos/${this.usuarioId}`)  // Ruta completa con usuarioId
                    .then(response => {
                      // Asegúrate de que los datos sean correctos
                      console.log(response.data);  // Verifica la estructura de los datos
                      this.tratamientos = response.data; // Guarda los tratamientos en la propiedad
                    })
                    .catch(error => {
                      console.error('Hubo un error al obtener los tratamientos:', error);
                    });
                } else {
                  console.log('usuarioId no disponible');
                }
            },
          },
      };
</script>

<style scoped>
/* Estilo específico para el thead */


.custom-thead th {
  background: radial-gradient(circle, #f1eeef, #ffdde1); /* Degradado centrado de rosa claro a tono más fuerte */
  color: #343a40; /* Color del texto */
  font-weight: bold; /* Negrita */
  text-align: center; /* Centrado */
}

.table-row {
    background: linear-gradient(to bottom, #ffffff, #fbe4e4);
    transition: background-color 0.3s ease-in-out;
  }
  .table-row:hover {
    background-color: #f1c1c1;
  }
.d-flex-nowrap {
  display: flex;
  flex-wrap: nowrap; /* Impide que los elementos se pasen a la siguiente fila */
  align-items: center; /* Alinea verticalmente los elementos */
}

.form-check {
  margin-right: 10px; /* Reduce el margen entre los checkboxes */
  display: inline-block; /* Asegura que los checkboxes no se rompan a otra fila */
}

.label-fixed-width {
  white-space: nowrap; /* Evita que el texto se divida */
  margin-right: 10px; /* Reduce la distancia con los checkboxes */
}

/* Estilos para el formulario de datos clínicos */
.container {
  max-width: 1400px;
}
.custom-btn {
  padding: 0.2rem 0.5rem; /* Reduce el padding para hacer los botones más pequeños */
  font-size: 1.2rem; /* Ajusta el tamaño de la fuente */
  line-height: 1; /* Ajusta la altura de la línea */
  min-height: 30px; /* Ajusta la altura mínima del botón */
}

.card {
  padding: 20px;
}

.text-center.form-label.bg-warning-subtle {
  background: radial-gradient(circle, #fff3b0 0%, #ffffff 100%);
  color: #343a40;
  font-weight: bold;
  padding: 8px;
  border-radius: 5px;
}

.form-label {
  font-weight: 600;
}
.btn {
  padding: 0.3rem 0.8rem; /* Ajusta el padding a tu preferencia */
  font-size: 0.9rem; /* Ajusta el tamaño de la fuente */
}

textarea {
  resize: none;
}

.btn {
  background-color: #5bc0de;
  color: white;
}

.custom-divider {
  border: 0;
  height: 2px; /* Aumenté el grosor */
  background-color: #f06292; /* Color rosado */
  margin: 10px 0;
  width: 100%; /* La línea ocupará el 100% del contenedor */
}
.table-bordered {
    border: 1px solid #f0c0c0;
  }
  .table-light th {
    font-size: 0.9rem;
    background: linear-gradient(to bottom, #f8e0e0, #f0c0c0);
  }
.d-inline-block {
  display: inline-block;
  width: auto;
}
</style>
