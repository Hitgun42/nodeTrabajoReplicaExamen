const controlSesion = (req, res, next) => {
    if (req.session.usuario) {
        next();
    } else {
        res.status(401).json({ error: 'No autorizado, inicia sesión primero' });
    }
};

module.exports = controlSesion;
