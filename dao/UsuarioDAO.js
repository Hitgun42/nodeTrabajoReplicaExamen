const pool = require('../database/db'); // Conexión a la base de datos
const ModeloUsuario = require('../model/ModeloUsuario'); // Modelo de datos (Clase)

class UsuarioDAO {
    // Buscar un usuario por su email
    static async buscarPorEmail(email) {
        // Ejecutar consulta SQL
        const [filas] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        // Si no hay resultados, devolver null
        if (filas.length === 0) return null;

        // Convertir el resultado de la BD a un objeto ModeloUsuario
        const fila = filas[0];
        return new ModeloUsuario(fila.id, fila.nombre, fila.email, fila.password);
    }

    // Buscar un usuario por su ID
    static async buscarPorId(id) {
        const [filas] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        if (filas.length === 0) return null;
        const fila = filas[0];
        return new ModeloUsuario(fila.id, fila.nombre, fila.email, fila.password);
    }
}

module.exports = UsuarioDAO;
