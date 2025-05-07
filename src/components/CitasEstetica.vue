<template>
  <div class="container mt-4">
    <div class="card p-3 mb-4 shadow">
      <h4 class="text-center mb-3"> Gestión de Citas  📝  </h4>
      <form @submit.prevent="agregarCita">
        <div class="row">
          <div class="col-md-4 mb-3">
            <div class="d-flex align-items-center">
              <label for="nombre" class="form-label fw-bold mb-0">Nombre:</label>
              <input type="text" class="form-control ms-2" id="nombre" required 
                    @blur="nuevaCita.nombre = capitalizar(nuevaCita.nombre)" v-model="nuevaCita.nombre" placeholder="Nombre del cliente" />
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="d-flex align-items-center">
              <span class="text-danger">*</span><label for="movil" class="form-label mb-0 fw-bold me-2">Móvil:</label>
              <div class="input-group">
                <input v-model="nuevaCita.movil" 
                      type="text" 
                      class="form-control ms-2 me-2 text-center" 
                      id="movil"
                      @blur="validarMovil"
                      required  
                      placeholder="Introduzca móvil">
                </div>
              <small v-if="movilError" class="text-danger"></small> <!-- Mensaje de error -->
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="d-flex align-items-center">
              <label for="fecha" class="form-label fw-bold mb-0">Hora:</label>
              <select v-model="nuevaCita.hora" class="form-select ms-2" required>
                <option disabled value="">Seleccione una hora</option>
                <option v-for="hora in horasDisponibles" :key="hora" :value="hora">{{ hora }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <label class="form-label fw-bold mb-2">Fecha:</label>
          <div class="col-md-8 mb-4 text-center">
            <VueCal
              class="calendario"
              hide-title
              :disable-views="['years', 'year', 'week', 'day']"
              default-view="month"
              :disable-date="deshabilitarFecha"
              style="height: 300px; width: 700px;"
              @cell-click="seleccionarFecha"
            />
          <small v-if="nuevaCita.fecha" class="text-muted">Seleccionada: {{ formatearFecha(nuevaCita.fecha) }}</small>
          </div>
        </div>
        <div class="d-flex justify-content-center">
          <button type="button" class="btn btn-sm me-2" style="background-color: #5bc0de; color: white;" @click="restablecerFiltro"> Borrar filtro </button>
          <button type="submit" class="btn btn-sm" style="background-color: #5bc0de; color: white;"> Guardar </button>
        </div>
      </form>
    </div>
  </div>
  <div class="container mt-4">
    <table class="table table-bordered table-responsive table-striped" style="box-shadow: 0px 4px 15px rgba(255, 105, 180, 0.3);">
      <thead class="table-light">
        <tr class="text-center">
          <th>Nombre</th>
          <th>Teléfono</th>
          <th>Fecha</th>
          <th>Hora</th>
        </tr>
      </thead>
      <tbody class="table-hover">
        <tr v-for="cita in paginados" :key="cita.id" class="table-row">
          <td class="py-1">{{ cita.nombre }}</td>
          <td class="py-1 text-center">{{ cita.movil }}</td>
          <td class="py-1 text-center">{{ formatearFecha(cita.fecha) }}</td>
          <td class="py-1 text-center">{{ formatearHora(cita.hora) }}</td>
          <td class="py-1 justify-content-center">
            <div class="d-flex justify-content-center">     
              <button class="btn btn-warning btn-sm me-1" style="background-color: red; color: white;" @click="eliminarCita(cita.id)">
                <i class="bi bi-trash"></i>  
              </button> 
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

export default {
  name: "CitasEstetica",
  components: { VueCal },
  data() {
    return {
      nuevaCita: { 
        nombre: "", 
        movil: "", 
        fecha: "", 
        hora: "" 
      },
      citas: [],
      horasDisponibles: [],

      fechaFiltrada : "",
      movilError: false,
      loading: true,
      paginaActual: 1,  // Página inicial
      citasPorPagina: 6,  // Cantidad de citas por página
    };
  },

  computed: {
    totalPaginas() {
      return Math.ceil(this.citas.length / this.citasPorPagina);
    },
    paginados() {
      let citasFiltradas = this.citas;

      if (this.fechaFiltrada) {
        citasFiltradas = citasFiltradas.filter(cita => {
          const citaFecha = new Date(cita.fecha);
          const filtroFecha = new Date(this.fechaFiltrada);
          return (
            citaFecha.getFullYear() === filtroFecha.getFullYear() &&
            citaFecha.getMonth() === filtroFecha.getMonth() &&
            citaFecha.getDate() === filtroFecha.getDate()
          );
        });
      }

      const start = (this.paginaActual - 1) * this.citasPorPagina;
      const end = start + this.citasPorPagina;
      return citasFiltradas.slice(start, end);
    },
  },

  mounted() {
    this.cargarCitas();
    this.generarHoras();
  },

  methods: {
    limpiarCita() {
      this.nuevaCita = { nombre: "", movil: "", fecha: "", hora: "" };
    },

    async cargarCitas() {
      try {
        const response = await axios.get("http://localhost:3000/api/citas");
        this.citas = response.data;
      } catch (error) {
        console.error("Error al obtener las citas:", error);
      } finally {
        this.loading = false;
      }
    },

    async agregarCita() {
      
      try {
        const { data: citas } = await axios.get('http://localhost:3000/api/citas');
        const citaExistente = citas.find(cita => cita.movil === this.nuevaCita.movil && cita.id !== this.nuevaCita.id);
        const horaOcupada = citas.find(cita => 
          this.formatearHora(cita.hora) === this.formatearHora(this.nuevaCita.hora) && 
          this.formatearFecha(cita.fecha) === this.formatearFecha(this.nuevaCita.fecha)
        );

        if (horaOcupada) {
          Swal.fire({
            icon: 'error',
            title: 'Hora ya seleccionada',
            text: 'La hora seleccionada ya está ocupada. Elige otra hora.',
          });
          return;  // No permitir guardar la cita
        }

        if (citaExistente) {
          Swal.fire({
            icon: 'error',
            title: 'Cita duplicada',
            text: 'Número de móvil existente. Por favor, use otro.'
          });
          return;
        }

        let citaguardada;

        let citaAEnviar = { ...this.nuevaCita };

        if (this.nuevaCita.fecha.includes('/')) {
          const [dia, mes, año] = this.nuevaCita.fecha.split('/');
          citaAEnviar.fecha = `${año}-${mes}-${dia}`;
        }

        if (!citaAEnviar.id) {
          delete citaAEnviar.id;
        }

        if (this.nuevaCita.id) {
          const { data } = await axios.put(`http://localhost:3000/api/citas/${this.nuevaCita.id}`, citaAEnviar);
          citaguardada = data;
        } else {
          const { data } = await axios.post('http://localhost:3000/api/citas', citaAEnviar);
          citaguardada = data;
        }

        Swal.fire({
          icon: 'success',
          title: 'Guardado',
          text: 'Datos de la cita actualizados correctamente.'
        });

        this.nuevaCita = { ...citaguardada };
        this.cargarCitas();
        this.limpiarCita();

      } catch (error) {
        console.error('Error al guardar la cita:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al guardar la cita.'
        });
      }
    },

    async eliminarCita(id) {
      console.log("ID enviado al backend:", id);

      if (!id) return;
      const result = await Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar esta cita?',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
      if (!result.isConfirmed) return;
      try {
        await axios.delete(`http://localhost:3000/api/citas/${id}`);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El usuario ha sido eliminado.'
        });
        this.cargarCitas();
      } catch (error) {
        console.error('Error al eliminar la cita:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al eliminar la cita.'
        });
      }
    },

    esHoraOcupada(hora) {
      // Primero formateamos la fecha de la nueva cita para comparar en el mismo formato
      const nuevaCitaFecha = new Date(this.nuevaCita.fecha);

      // Comprobamos si existe alguna cita en el mismo día con la misma hora
      return this.citas.some(cita => {
        const citaFecha = new Date(cita.fecha);
        // Comparamos tanto la fecha como la hora, y además aseguramos que la hora de la cita está bien formateada
        return citaFecha.toDateString() === nuevaCitaFecha.toDateString() && cita.hora === hora;
      });
    },

    generarHoras() {
      const inicio = 8 * 60;
      const fin = 14 * 60 + 30;
      const intervalo = 30;

      for (let i = inicio; i <= fin; i += intervalo) {
        const horas = String(Math.floor(i / 60)).padStart(2, '0');
        const minutos = String(i % 60).padStart(2, '0');
        this.horasDisponibles.push(`${horas}:${minutos}`);
      }
    },

    capitalizar(texto) {
      return texto.replace(/\b\w/g, char => char.toUpperCase());
    },

    validarMovil() {
      const movilRegex = /^[67]\d{8}$/;
      if (this.nuevaCita.movil && !movilRegex.test(this.nuevaCita.movil)) {
        this.movilError = true;
        Swal.fire({
          icon: 'error',
          title: 'Número de móvil inválido',
          text: 'El móvil debe empezar por 6 o 7 y contener 9 dígitos.'
        });
      } else {
        this.movilError = false;
      }
    },  

    seleccionarFecha(payload) {
      const fecha = new Date(payload.dateTime || payload.start || payload);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      fecha.setHours(0, 0, 0, 0);
      if (fecha < hoy) {
        return; // No hacer nada si la fecha es anterior a hoy
      }
      if (!isNaN(fecha.getTime())) {
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();
        this.nuevaCita.fecha = `${año}-${mes}-${dia}`;
        this.fechaFiltrada = `${año}-${mes}-${dia}`;
      }
    },

    formatearFecha(fecha) {
      if (!fecha) return '';
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj)) return fecha;
      const dia = String(fechaObj.getDate()).padStart(2, '0');
      const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
      const año = fechaObj.getFullYear();
      return `${dia}/${mes}/${año}`;
    },

    formatearHora(hora) {
      if (!hora) return '';
      const [h, m] = hora.split(':');
      const horaFormateada = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
      return horaFormateada;
    },

    restablecerFiltro() {
      this.fechaFiltrada = "";
    },

    deshabilitarFecha(date) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Elimina la hora para comparación exacta de fechas
      const fechaSeleccionada = new Date(date);
      fechaSeleccionada.setHours(0, 0, 0, 0);
      return fechaSeleccionada < hoy;
    },
  },
};
</script>
<style scoped>
.calendario {
  height: 300px;
  width: 700px;
  background: linear-gradient(to top, #ffdde1, #ffffff);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
