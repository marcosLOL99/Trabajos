//*** CONEXIÓN BASE DE DATOS ***/

import 'core-js/stable/index.js'; // Si estás usando ES Modules
import mysql from 'mysql2';  // Usar import en lugar de require

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost', // Conexión inicial a localhost
  user: 'admin',
  password: 'abc123',
  database: 'bbdd',
  multipleStatements: true,
};

// Variable global para la conexión de la base de datos
let db;

//obtener datos 

// Función para intentar la conexión y verificar que realmente responde
const connectToDb = async (host) => {
  console.log(`Intentando conectar a ${host}...`);
  try {
    const dbConnection = await mysql.createConnection({
      ...dbConfig,
      host,
    });

    // Verificación real con una consulta simple
    await dbConnection.promise().query('SELECT 1');

    console.log(`Conexión exitosa a ${host}`);
    return dbConnection;
  } catch (err) {
    console.error(`Error al conectar a ${host}: ${err.message}`);
    throw err;
  }
};

// Intentamos conectar primero a localhost, luego a 192.168.10.66 si falla
(async () => {
  try {
    db = await connectToDb('localhost');
  } catch {
    console.log('Conexión a localhost fallida. Intentando conectar a 192.168.10.66...');
    try {
      db = await connectToDb('192.168.10.66');
    } catch {
      console.error('Conexión fallida a ambos hosts.');
      process.exit(1); // Salimos del proceso si no se puede conectar a ninguna base de datos
    }
  }
})();


//*** CONEXION BASE DE DATOS ***/


const obtenerUsuarios = (req, res) => {
  db.query('SELECT * FROM tablaUsuarios ORDER BY apellidos, nombre', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener usuarios');
      return;
    }
    res.json(results);
  });
};


const guardarUsuario = (req, res) => {
  const { apellidos, nombre, edad, direccion, profesion, movil, email } = req.body;

  // Si son undefined, asigna un valor vacío
  const direccionFinal = direccion || "";
  const profesionFinal = profesion || "";

  const query = 'INSERT INTO tablaUsuarios (apellidos, nombre, edad, direccion, profesion, movil, email) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [apellidos, nombre, edad, direccionFinal, profesionFinal, movil, email], (err, results) => {
    if (err) {
      console.error("Error en la consulta SQL:", err.sqlMessage);
      res.status(500).send("Error al guardar el usuario");
      return;
    }

    // El id generado automáticamente por MySQL está en results.insertId
    const nuevoUsuario = {
      id: results.insertId,  // El id generado por MySQL
      apellidos,
      nombre,
      edad,
      direccion: direccionFinal,
      profesion: profesionFinal,
      movil,
      email
    };

    // Devolvemos el nuevo usuario con el id incluido
    res.status(201).json(nuevoUsuario);
  });
};

// Función para actualizar un usuario
const actualizarUsuario = (req, res) => {
  const { id } = req.params;
  const { apellidos, nombre, edad, direccion, profesion, movil, email } = req.body;

  // Si ciertos valores son undefined, asignamos un valor vacío
  const direccionFinal = direccion || "";
  const profesionFinal = profesion || "";

  const query = `
    UPDATE tablaUsuarios 
    SET apellidos = ?, nombre = ?, edad = ?, direccion = ?, profesion = ?, movil = ?, email = ?
    WHERE id = ?
  `;

  db.query(query, [apellidos, nombre, edad, direccionFinal, profesionFinal, movil, email, id], (err, result) => {
    if (err) {
      console.error("Error en la consulta SQL:", err.sqlMessage);
      res.status(500).send("Error al actualizar el usuario");
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send("Usuario no encontrado");
    } else {
      res.status(200).send("Usuario actualizado correctamente");
    }
  });
};

// Función para buscar un usuario por móvil
const buscarUsuarioPorMovil = (req, res) => {
  const { movil } = req.params;  // Obtienes el móvil de los parámetros de la URL

  // Realizamos la consulta SQL para buscar el usuario por móvil
  db.query('SELECT * FROM tablaUsuarios WHERE movil = ?', [movil], (err, results) => {
    if (err) {
      console.error("Error en la consulta SQL:", err.sqlMessage);
      return res.status(500).send("Error al buscar el usuario");
    }

    if (results.length > 0) {
      // Si se encuentra el usuario, lo devolvemos en la respuesta
      res.json(results[0]);  // Devuelvo el primer resultado encontrado
    } else {
      // Si no se encuentra ningún usuario con ese móvil
      res.status(404).send("Usuario no encontrado");
    }
  });
};

//*** FUNCIONES DATOS CLINICOS ***/
const guardarDatosClinicos = (req, res) => {
  const {
    usuarioId, // este es el ID del usuario que usamos como clave en datosClinicos.id
    infecciones,
    alteracionesVasculares,
    diabetes,
    oncologicos,
    alergias,
    problemasRespiratorios,
    alteracionesHormonales,
    medicacion,
    operacionesRecientes,
    problemasCicatrizacion,
    embarazo,
    menopausia,
    ovarioPoliquistico,
    alteracionesMenstruales,
    observaciones
  } = req.body;


   // Verificamos si ya existen datos clínicos para ese id
   const buscarQuery = 'SELECT id FROM datosClinicos WHERE id = ?';
   db.query(buscarQuery, [usuarioId], (err, resultados) => {
     if (err) {
       console.error('Error al buscar datos clínicos:', err);
       return res.status(500).json({ success: false, message: 'Error al buscar datos clínicos.' });
     }
 
     if (resultados.length > 0) {
       // Si existen, actualizamos
       const actualizarQuery = `
         UPDATE datosClinicos SET
           infecciones = ?, alteracionesVasculares = ?, diabetes = ?, oncologicos = ?,
           alergias = ?, problemasRespiratorios = ?, alteracionesHormonales = ?, medicacion = ?,
           operacionesRecientes = ?, problemasCicatrizacion = ?, embarazo = ?, menopausia = ?,
           ovarioPoliquistico = ?, alteracionesMenstruales = ?, observaciones = ?
         WHERE id = ?
       `;
       const params = [
         infecciones, alteracionesVasculares, diabetes, oncologicos,
         alergias, problemasRespiratorios, alteracionesHormonales, medicacion,
         operacionesRecientes, problemasCicatrizacion, embarazo, menopausia,
         ovarioPoliquistico, alteracionesMenstruales, observaciones, usuarioId
       ];
 
       db.query(actualizarQuery, params, (err) => {
         if (err) {
           console.error('Error al actualizar datos clínicos:', err);
           return res.status(500).json({ success: false, message: 'Error al actualizar datos clínicos.' });
         }
 
         res.json({ success: true, message: 'Datos clínicos actualizados correctamente.' });
       });
     } else {
       // Si no existen, insertamos con el ID fijo
       const insertarQuery = `
         INSERT INTO datosClinicos (
           id, infecciones, alteracionesVasculares, diabetes, oncologicos,
           alergias, problemasRespiratorios, alteracionesHormonales, medicacion,
           operacionesRecientes, problemasCicatrizacion, embarazo, menopausia,
           ovarioPoliquistico, alteracionesMenstruales, observaciones
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       `;
       const params = [
         usuarioId, infecciones, alteracionesVasculares, diabetes, oncologicos,
         alergias, problemasRespiratorios, alteracionesHormonales, medicacion,
         operacionesRecientes, problemasCicatrizacion, embarazo, menopausia,
         ovarioPoliquistico, alteracionesMenstruales, observaciones
       ];
 
       db.query(insertarQuery, params, (err) => {
         if (err) {
           console.error('Error al insertar datos clínicos:', err);
           return res.status(500).json({ success: false, message: 'Error al insertar datos clínicos.' });
         }
 
         res.json({ success: true, message: 'Datos clínicos insertados correctamente.' });
       });
     }
   });
 };

 const obtenerDatosClinicos = (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM datosClinicos WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener datos clínicos:', err);
      return res.status(500).json({ success: false, message: 'Error al obtener datos clínicos.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron datos clínicos.' });
    }

    res.json({ success: true, datosClinicos: results[0] });
  });
};

//*** FUNCIONES HABITOS DE VIDA ***/


//*** FUNCIONES DATOS ESTETICOS ***/


//*** FUNCIONES DATOS PIEL ***/


//*** FUNCIONES CONTRAINDICACIONES ***/


//*** FUNCIONES TRATAMIENTOS ***/
const obtenerTratamientosPorUsuario = (req, res) => {
  const { usuarioId } = req.params;


  const query = `
    SELECT * 
    FROM Tratamientos
    WHERE usuario_id = ?
    ORDER BY fecha_tratamiento DESC
  `;

  db.query(query, [usuarioId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener tratamientos');
      return;
    }
    res.json(results);
  });
};


const getTratamiento = (req, res) => {
  const { id } = req.params;  // Aquí estamos extrayendo el ID de la URL correctamente.

  const query = `
    SELECT * 
    FROM Tratamientos
    WHERE id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener tratamiento');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Tratamiento no encontrado');
      return;
    }
    res.json(results[0]);  // Asegúrate de devolver un solo tratamiento (el primero)
  });
};


const guardarTratamiento = (req, res) => {
  const { usuario_id, fecha_tratamiento, tecnica_tratamiento, cosmeticosUsados, observaciones, asesoramiento } = req.body;
  const query = `
    INSERT INTO Tratamientos (usuario_id, fecha_tratamiento, tecnica_tratamiento, cosmeticosUsados, observaciones, asesoramiento)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [usuario_id, fecha_tratamiento, tecnica_tratamiento, cosmeticosUsados, observaciones, asesoramiento], (err, results) => {
    if (err) {
      console.error("Error en la consulta SQL:", err.sqlMessage);
      res.status(500).send("Error al guardar el tratamiento");
      return;
    }

    const nuevoTratamiento = {
      id: results.insertId,
      usuario_id,
      fecha_tratamiento,
      tecnica_tratamiento,
      cosmeticosUsados,
      observaciones,
      asesoramiento
    };

    res.status(201).json(nuevoTratamiento);
  });
};

const actualizarTratamiento = (req, res) => {
  const { id } = req.params;
  const { fecha_tratamiento, tecnica_tratamiento, cosmeticosUsados, observaciones, asesoramiento } = req.body;

  const query = `
    UPDATE Tratamientos 
    SET fecha_tratamiento = ?, tecnica_tratamiento = ?, cosmeticosUsados = ?, observaciones = ?, asesoramiento = ?
    WHERE id = ?
  `;

  db.query(query, [fecha_tratamiento, tecnica_tratamiento, cosmeticosUsados,observaciones, asesoramiento, id], (err, result) => {
    if (err) {
      console.error("Error en la consulta SQL:", err.sqlMessage);
      res.status(500).send("Error al actualizar el tratamiento");
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send("Tratamiento no encontrado");
    } else {
      res.status(200).send("Tratamiento actualizado correctamente");
    }
  });
};

const eliminarTratamiento = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM Tratamientos WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error en la consulta SQL:", err.sqlMessage);
      res.status(500).send("Error al eliminar el tratamiento");
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send("Tratamiento no encontrado");
    } else {
      res.status(200).send("Tratamiento eliminado correctamente");
    }
  });
};

const obtenerZonasPorTratamiento = (req, res) => {
  const { tratamientoId } = req.params;

  const query = 'SELECT * FROM ZonaTratamientos WHERE tratamiento_id = ?';

  db.query(query, [tratamientoId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener zonas del tratamiento');
      return;
    }
    res.json(results);
  });
};

const guardarZonaTratamiento = async (req, res) => {

  const { tratamiento_id, zonas } = req.body;

  
  if (!tratamiento_id || !zonas || zonas.length === 0) {
    return res.status(400).send("Se deben enviar 'tratamiento_id' y 'zonas'");
  }

  try {
    const valores = zonas.map(zona => [tratamiento_id, zona]);
    
    // Construcción de la consulta SQL con múltiples valores
    const query = `
      INSERT INTO ZonaTratamientos (tratamiento_id, zona)
      VALUES ${valores.map(() => "(?, ?)").join(", ")}
    `;

    // Convertir los valores a un array plano para la consulta
    const flatValues = valores.flat();

    // Ejecutar la consulta SQL
    const [results] = await db.promise().query(query, flatValues);

    res.status(201).json({
      tratamiento_id,
      zonas: zonas.map(zona => ({
        tratamiento_id,
        zona
      })),
      insertados: results.affectedRows
    });

  } catch (err) {
    console.error("Error en la consulta SQL:", err);
    res.status(500).send("Error al guardar las zonas de tratamiento");
  }
};

//citas: obtener citas 

const obtenerCita = (req, res) => {
  db.query('SELECT * FROM citas ORDER BY fecha, hora DESC', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener citas');
      return;
    }
    res.json(results);
  });
};

//citas: guardar cita

const guardarCita = (req, res) => {
  const { nombre, movil, fecha, hora } = req.body;

  const query = 'INSERT INTO citas (nombre, movil, fecha, hora) VALUES (?, ?, ?, ?)';

  db.query(query, [nombre, movil, fecha, hora], (err, results) => {
    if (err) {
      console.error("Error en la consulta SQL:", err.sqlMessage);
      res.status(500).send("Error al guardar la cita");
      return;
    }

    // El id generado automáticamente por MySQL está en results.insertId
    const nuevaCita = {
      id: results.insertId,  // El id generado por MySQL
      nombre,
      movil,
      fecha,
      hora
    };

    // Devolvemos el nuevo usuario con el id incluido
    res.status(201).json(nuevaCita);
  });
};

//citas: actualizar cita
const actualizarCita = (req, res) => {
  const { id } = req.params;
  const { nombre, movil, fecha, hora } = req.body;

  const query = `
    UPDATE citas 
    SET nombre = ?, movil = ?, fecha = ?, hora = ?
    WHERE id = ?
  `;

  db.query(query, [nombre, movil, fecha, hora, id], (err, result) => {
    if (err) {
      console.error("Error en la consulta SQL:", err.sqlMessage);
      res.status(500).send("Error al actualizar la cita");
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send("Cita no encontrada");
    } else {
      res.status(200).send("Cita actualizada correctamente");
    }
  });
};
//citas: eliminar cita
const eliminarCita = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM citas WHERE citas.id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error en la consulta SQL:", err.sqlMessage);
      res.status(500).send("Error al eliminar la cita");
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send("Cita no encontrada");
    } else {
      res.status(200).send("Cita eliminada correctamente");
    }
  });
};

//*** EXPORTACION DE FUNCIONES ***/

// Exporta todas las funciones al final del archivo
export {
  obtenerUsuarios,
  guardarUsuario,
  actualizarUsuario,
  buscarUsuarioPorMovil,
  guardarDatosClinicos,
  obtenerDatosClinicos,
  obtenerTratamientosPorUsuario,
  guardarZonaTratamiento,
  getTratamiento,
  guardarTratamiento,
  actualizarTratamiento,
  eliminarTratamiento,
  obtenerZonasPorTratamiento,
  obtenerCita,
  guardarCita,
  actualizarCita,
  eliminarCita
};

