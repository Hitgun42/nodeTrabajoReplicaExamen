const UsuarioDAO = require('../dao/UsuarioDAO');

class ControladorAuth {
    // Maneja el inicio de sesión
    static async iniciarSesion(req, res) {
        try {
            // Recibir datos del frontend
            const { email, password } = req.body;
            // Buscar si el usuario existe en la base de datos
            const usuario = await UsuarioDAO.buscarPorEmail(email);

            if (!usuario) {
                return res.status(401).json({ error: 'Usuario no encontrado' });
            }

            // Comparar contraseña
            if (usuario.password !== password) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            // Guardar datos del usuario en la sesión del servidor
            req.session.usuario = {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            };

            // Responder con éxito
            res.json({ exito: true, usuario: req.session.usuario });

        } catch (error) {
            console.error('Error Login:', error);
            res.status(500).json({ error: 'Error del servidor' });
        }
    }

    // Maneja el cierre de sesión
    static cerrarSesion(req, res) {
        req.session.destroy(err => {
            if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
            res.json({ exito: true });
        });
    }

    // Devuelve el usuario si ya está autenticado (para recargar la página)
    static obtenerSesion(req, res) {
        if (req.session.usuario) {
            res.json({ autenticado: true, usuario: req.session.usuario });
        } else {
            res.json({ autenticado: false });
        }
    }
}

module.exports = ControladorAuth;
