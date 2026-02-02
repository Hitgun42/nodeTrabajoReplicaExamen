const express = require('express'); // Importa el framework Express para crear el servidor
const session = require('express-session'); // Importa el manejador de sesiones
const bodyParser = require('body-parser'); // Importa el middleware para leer JSON
const path = require('path'); // Utilidad para manejar rutas de archivos
const dotenv = require('dotenv'); // Carga las variables de entorno desde .env

// Cargar configuración
dotenv.config();

// Importar las rutas definidas en otros archivos
const rutasAuth = require('./routes/rutasAuth');
const rutasIncidencias = require('./routes/rutasIncidencias');

const app = express(); // Crear la aplicación Express
const PORT = process.env.PORT || 3000; // Definir el puerto

// --- Middleware (Configuración Global) ---
// Permitir que el servidor entienda datos en formato JSON
app.use(bodyParser.json());
// Servir archivos estáticos (HTML, CSS, JS) desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la sesión del usuario
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret', // Clave para firmar la sesión
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 3600000 } // La sesión dura 1 hora
}));

// --- Rutas ---
// Rutas para autenticación (login, logout)
app.use('/api/auth', rutasAuth);
// Rutas para gestión de incidencias
app.use('/api/incidencias', rutasIncidencias);


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
