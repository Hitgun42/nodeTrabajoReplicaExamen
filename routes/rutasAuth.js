const express = require('express');
const router = express.Router(); // Crear un router de Express
const ControladorAuth = require('../controller/ControladorAuth'); // Importar el controlador

// Definir endpoints (rutas) de autenticación
router.post('/iniciarSesion', ControladorAuth.iniciarSesion); // POST /api/auth/iniciarSesion
router.post('/cerrarSesion', ControladorAuth.cerrarSesion);   // POST /api/auth/cerrarSesion
router.get('/sesion', ControladorAuth.obtenerSesion);         // GET /api/auth/sesion (verifica estado)

module.exports = router;
