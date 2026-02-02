const pool = require('../database/db');
const ModeloIncidencia = require('../model/ModeloIncidencia');

class IncidenciaDAO {
    // Obtener todas las incidencias de la base de datos
    static async obtenerTodas() {
        const query = `
            SELECT i.*, u.nombre as autor 
            FROM incidencias i 
            JOIN usuarios u ON i.usuario_id = u.id
            ORDER BY i.id DESC
        `;
        const [filas] = await pool.query(query);
        return filas;
    }

    // Insertar una nueva incidencia
    static async crear(titulo, descripcion, usuario_id) {
        // Obtener el ID más alto actual para calcular el siguiente (Simulación de Auto Increment si no está configurado)
        const [maxResultado] = await pool.query('SELECT MAX(id) as maxId FROM incidencias');
        const siguienteId = (maxResultado[0].maxId || 0) + 1;

        // Insertar los datos
        const query = 'INSERT INTO incidencias (id, titulo, descripcion, estado, usuario_id) VALUES (?, ?, ?, ?, ?)';
        await pool.query(query, [siguienteId, titulo, descripcion, 'abierta', usuario_id]);
        return siguienteId;
    }

    // Buscar una incidencia específica por ID
    static async buscarPorId(id) {
        const [filas] = await pool.query('SELECT * FROM incidencias WHERE id = ?', [id]);
        if (filas.length === 0) return null;
        const fila = filas[0];
        return new ModeloIncidencia(fila.id, fila.titulo, fila.descripcion, fila.estado, fila.usuario_id);
    }

    // Actualizar el estado de una incidencia a "resuelta"
    static async marcarResuelta(id) {
        await pool.query('UPDATE incidencias SET estado = ? WHERE id = ?', ['resuelta', id]);
    }

    // Eliminar una incidencia
    static async borrar(id) {
        await pool.query('DELETE FROM incidencias WHERE id = ?', [id]);
    }
}

module.exports = IncidenciaDAO;
