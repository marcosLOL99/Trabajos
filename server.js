import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // Importamos cors
import { obtenerUsuarios, guardarUsuario, buscarUsuarioPorMovil, actualizarUsuario, 
  guardarDatosClinicos, obtenerDatosClinicos, guardarTratamiento, guardarZonaTratamiento,
  actualizarTratamiento, obtenerZonasPorTratamiento, obtenerTratamientosPorUsuario, getTratamiento, obtenerCita, guardarCita, 
  actualizarCita, eliminarCita 
} from './servicios.js'; // Asegúrate de usar la extensión .js si es un módulo ES

const app = express();
const port = 3000;

app.use(express.json());

// Permitir solicitudes de cualquier origen
app.use(cors({
  origin: "*", // Permitir todas las solicitudes
}));

// Middleware para parsear JSON en el cuerpo de la solicitud
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




// ***  FUNCIONES USUARIOS ***//

// Endpoint para obtener usuarios
app.get('/api/usuarios', obtenerUsuarios);

// Endpoint para guardar un usuario
app.post('/api/usuarios', guardarUsuario);

// Endpoint para actualizar un usuario
app.put('/api/usuarios/:id', actualizarUsuario);

// Endpoint para buscar un usuario por móvil
app.get('/api/usuarios/:movil', buscarUsuarioPorMovil);


//*** DATOS CLÍNICOS ***/

//Endpoint para guardar o actualizar datos clínicos
app.post('/api/datosclinicos', guardarDatosClinicos);

//Enpoint para conseguir los datos
app.get('/api/datosclinicos/:id', obtenerDatosClinicos);


//*** FUNCIONES TRATAMIENTOS  ***/

// Endpoint para obtener tratamientos de un usuario específico
app.get('/api/tratamientos/:usuarioId', obtenerTratamientosPorUsuario);

// Endpoint para guardar un nuevo tratamiento
app.post('/api/tratamientos', guardarTratamiento);

// Endpoint para actualizar un tratamiento existente
app.put('/api/tratamientos/:id', actualizarTratamiento);

// Endpoint para actualizar un tratamiento existente
app.get('/api/tratamientos/usuario/:id', getTratamiento);

// Endpoint para eliminar un tratamiento
//app.delete('/api/tratamientos/:id', eliminarTratamiento);

// Endpoint para obtener las zonas de un tratamiento específico
app.get('/api/zona-tratamiento/:tratamientoId', obtenerZonasPorTratamiento);

// Endpoint para guardar una zona asociada a un tratamiento
app.post('/api/zona-tratamiento', guardarZonaTratamiento);

//
app.get('/api/citas', obtenerCita);

//
app.post('/api/citas', guardarCita);

//
app.put('/api/citas/:id', actualizarCita);

//
app.delete('/api/citas/:id', eliminarCita);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
