const IncidenciaDAO = require('../dao/IncidenciaDAO');

class ControladorIncidencias {
    // Obtener todas las incidencias para mostrar en el dashboard
    static async obtenerTodas(req, res) {
        try {
            const incidencias = await IncidenciaDAO.obtenerTodas();
            res.json(incidencias);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener incidencias' });
        }
    }

    // Crear una nueva incidencia
    static async crear(req, res) {
        try {
            const { titulo, descripcion } = req.body;
            // Validación básica
            if (!titulo || !descripcion) {
                return res.status(400).json({ error: 'Faltan campos' });
            }

            // Usar el ID del usuario de la sesión actual
            const usuarioId = req.session.usuario.id;
            const id = await IncidenciaDAO.crear(titulo, descripcion, usuarioId);

            res.json({ exito: true, id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear incidencia' });
        }
    }

    // Marcar una incidencia como "resuelta"
    static async marcarResuelta(req, res) {
        try {
            const { id } = req.params;
            await IncidenciaDAO.marcarResuelta(id);
            res.json({ exito: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al resolver incidencia' });
        }
    }

    // Borrar una incidencia de la base de datos
    static async borrar(req, res) {
        try {
            const { id } = req.params;
            const usuarioId = req.session.usuario.id; // ID del usuario actual

            // Verificar que la incidencia existe
            const incidencia = await IncidenciaDAO.buscarPorId(id);
            if (!incidencia) {
                return res.status(404).json({ error: 'Incidencia no encontrada' });
            }

            // Verificar permiso: solo el creador puede borrarla
            if (incidencia.usuario_id !== usuarioId) {
                return res.status(403).json({ error: 'No tienes permiso para borrar esta incidencia' });
            }

            await IncidenciaDAO.borrar(id);
            res.json({ exito: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al borrar incidencia' });
        }
    }
}

module.exports = ControladorIncidencias;
