<template>
  <div class="container mt-4">
    <div class="card p-3 mb-4 shadow">
      <h4 class="text-center mb-3"> Gestión de Citas  📝  </h4>
      <form @submit.prevent="agregarCita">
        <div class="row">
          <div class="col-md-4 mb-3">
            <div class="d-flex align-items-center">
              <span class="text-danger">*</span><label for="nombre" class="form-label fw-bold mb-0">Nombre:</label>
              <input type="text" class="form-control ms-2" id="nombre" required 
                    @blur="nuevaCita.nombre = capitalizar(nuevaCita.nombre)" v-model="nuevaCita.nombre" placeholder="Nombre del cliente" />
            </div>
          </div>
          <div class="col-md-6 mb-3">
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
                      <button 
                        class="btn btn-outline-secondary" 
                        type="button" 
                        @click="buscarUsuarioPorMovil" 
                        style="background-color: #5bc0de; color: white;" >
                        <i class="bi bi-search"></i>
                      </button>
                </div>
              <small v-if="movilError" class="text-danger"></small>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-5 mb-4">
            <div class="d-flex align-items-center">
              <span class="text-danger">*</span><label for="fecha" class="form-label fw-bold mb-0">Hora:</label>
              <select v-model="nuevaCita.hora" class="form-select ms-2" required>
                <option disabled value="">Seleccione una hora</option>
                <option v-for="hora in horasDisponibles" :key="hora" :value="hora">{{ hora }}</option>
              </select>
            </div>
          </div>
          <div class="col-md-5 mb-4">
            <div class="d-flex align-items-center">
              <label for="tecnica" class="form-label fw-bold">Técnica:</label>
              <input type="text" id="tecnica" class="form-control ms-2"  v-model="nuevaCita.tecnica" placeholder="Escribe una técnica"/>
            </div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-8 mb-4 text-center">
            <small v-if="nuevaCita.fecha" class="texto-fecha">Seleccionada: {{ formatearFecha(nuevaCita.fecha) }}</small>
            <VueCal
              title="Selecciona una fecha"
              locale="es"
              :disable-views="['years', 'year', 'week', 'day']"
              default-view="month"
              :min-date="minDate()"
              :disable-date="deshabilitarFecha"
              hide-weekends
              style="height: 300px; width: 700px;"
              @cell-click="seleccionarFecha">
            </VueCal>
         </div>
        </div>
        <div class="d-flex justify-content-center">
          <button type="submit" class="btn btn-sm me-2" style="background-color: #5bc0de; color: white;"> Guardar </button>
          <button type="button" class="btn btn-sm" style="background-color: #5bc0de; color: white;" @click="restablecerFiltro"> Restablecer </button>
        </div>
      </form>
    </div>
  </div>
  <div class="container mt-4">
    <!-- Botón de descarga PDF -->
    <div class="mb-2 d-flex justify-content-end">
      <button class="btn btn-sm" @click="descargarCitasPDF" style="background-color: #5bc0de; color: white;">
        <i class="bi bi-download"></i> Descargar PDF
      </button>
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
          <th>Técnica</th>
        </tr>
      </thead>
      <tbody class="table-hover">
        <tr v-for="cita in paginados" :key="cita.id" class="table-row">
          <td class="py-1">{{ cita.nombre }}</td>
          <td class="py-1 text-center">{{ cita.movil }}</td>
          <td class="py-1 text-center">{{ formatearFecha(cita.fecha) }}</td>
          <td class="py-1 text-center">{{ formatearHora(cita.hora) }}</td>
          <td class="py-1 text-center">{{ cita.tecnica }}</td>
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
    <div class="d-flex justify-content-center mt-2">
      <button class="btn btn-sm" :disabled="paginaActual === 1" @click="cambiarPagina(paginaActual - 1)" style="background-color: #f8c6d2; border-color: #f8c6d2;">
        <i class="bi bi-chevron-left"></i>
      </button>
      <span class="mx-2" style="font-size: 0.75rem; color: #555; display: flex; align-items: center;">{{ paginaActual }} / {{ totalPaginas }}</span>
      <button class="btn btn-sm" :disabled="paginaActual === totalPaginas" @click="cambiarPagina(paginaActual + 1)" style="background-color: #f8c6d2; border-color: #f8c6d2;">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
  name: "CitasEstetica",
  components: { VueCal },
  data() {
    return {
      nuevaCita: { 
        nombre: "", 
        movil: "", 
        fecha: "", 
        hora: "",
        tecnica: ""
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
    minDate() {
      const hoy = new Date();
      return hoy;
    },


    limpiarCita() {
      this.nuevaCita = { nombre: "", movil: "", fecha: "", hora: "", tecnica: "" };
    },

    cambiarPagina(pagina) {
      if (pagina >= 1 && pagina <= this.totalPaginas) {
        this.paginaActual = pagina;
      }
    },

    async cargarCitas() {
      try {
        const response = await axios.get("/api/citas");
        this.citas = response.data;
      } catch (error) {
        console.error("Error al obtener las citas:", error);
      } finally {
        this.loading = false;
      }
    },

    async agregarCita() {
      
      try {
        const { data: citas } = await axios.get('/api/citas');
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
          return;
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
          const { data } = await axios.put(`/api/citas/${this.nuevaCita.id}`, citaAEnviar);
          citaguardada = data;
        } else {
          const { data } = await axios.post('/api/citas', citaAEnviar);
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
        this.restablecerFiltro();

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
        await axios.delete(`/api/citas/${id}`);
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

    async buscarUsuarioPorMovil() {
      if (!this.nuevaCita.movil) {
        Swal.fire({
          icon: 'warning',
          title: 'Número requerido',
          text: 'Por favor, introduzca un número de móvil para buscar.',
        });
        return;
      }

      try {
        const response = await axios.get(`/api/usuarios/${this.nuevaCita.movil}`);
        const usuario = response.data;

        if (usuario && usuario.nombre) {
          this.nuevaCita.nombre = usuario.nombre;
          Swal.fire({
            icon: 'success',
            title: 'Usuario encontrado',
            text: `Nombre: ${usuario.nombre}`,
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'No encontrado',
            text: 'No se encontró ningún usuario con ese número.',
          });
        }
      } catch (error) {
        console.error('Error al buscar el usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se encontró al usuario. ',
        });
      }
    },

    descargarCitasPDF() {
      const doc = new jsPDF();
      const margen = 15;
      const LOGO_WIDTH = 20;
      const fechaHoy = this.formatearFecha(new Date());
      const LOGO_BASE64 = "data:image/jpeg;base64,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";

      let y = 20;

      const hoySinHora = new Date();
      hoySinHora.setHours(0, 0, 0, 0);

      const citasDeHoy = this.citas.filter(cita => {
        const fechaCita = new Date(cita.fecha);
        fechaCita.setHours(0, 0, 0, 0);
        return fechaCita.getTime() === hoySinHora.getTime();
      });

      const dibujarCabecera = () => {
        if (LOGO_BASE64) {
          doc.addImage(LOGO_BASE64, 'JPEG', margen, y, LOGO_WIDTH, 20);
        }
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Departamento Imagen Personal', margen + 50, y + 10);
        doc.text('Estética', margen + 150, y + 10, { align: 'right' });
        y += 25;

        doc.rect(margen, y, 180, 10);
        doc.setFont(undefined, 'bold');
        doc.text('Citas marcadas', margen + 3, y + 7);
        doc.setFont(undefined, 'bold');
        doc.text('Fecha:', margen + 120, y + 7);
        doc.setFont(undefined, 'normal');
        doc.text(fechaHoy, margen + 140, y + 7);
        y += 15;
      };

      dibujarCabecera();

      autoTable(doc, {
        startY: y,
        head: [['Nombre', 'Teléfono', 'Fecha', 'Hora', 'Técnica']],
        body: citasDeHoy.map(cita => [
          cita.nombre,
          cita.movil,
          this.formatearFecha(cita.fecha),
          this.formatearHora(cita.hora),
          cita.tecnica || ''
        ]),
        styles: { fontSize: 10 },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
        margin: { left: margen, right: margen },
      });
      
      doc.save(`Citas ${fechaHoy}.pdf`);
    },

    esHoraOcupada(hora) {
      const nuevaCitaFecha = new Date(this.nuevaCita.fecha);

      return this.citas.some(cita => {
        const citaFecha = new Date(cita.fecha);
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
        return;
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
      this.limpiarCita();
    },

    deshabilitarFecha(date) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaSeleccionada = new Date(date);
      fechaSeleccionada.setHours(0, 0, 0, 0);
      return fechaSeleccionada < hoy;
    },
  },
};
</script>
<style scoped>
.vuecal {
  max-width: 100%;
  width: 700px;
  margin: 0 auto;
  background: linear-gradient(to top, #ffdde1, #ffffff);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.texto-fecha {
  font-size: 14px;
  font-weight: bold;
  color: #ff0000;
}
</style>