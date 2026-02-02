const express = require('express');
const router = express.Router();
const ControladorIncidencias = require('../controller/ControladorIncidencias');
const controlSesion = require('../middleware/controlSesion'); // Middleware para proteger rutas

// Proteger todas las rutas siguientes: solo usuarios logueados pueden acceder
router.use(controlSesion);

// Rutas CRUD de incidencias
router.get('/', ControladorIncidencias.obtenerTodas);           // GET /api/incidencias (Listar)
router.post('/', ControladorIncidencias.crear);                 // POST /api/incidencias (Crear)
router.post('/:id/resolver', ControladorIncidencias.marcarResuelta); // POST /api/incidencias/:id/resolver (Editar estado)
router.delete('/:id', ControladorIncidencias.borrar);           // DELETE /api/incidencias/:id (Borrar)

module.exports = router;
