function roleMiddleware(allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !req.user.rol) {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. No se pudo identificar el rol del usuario.'
            });
        }

        if (!allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. No tiene permisos para realizar esta operación.'
            });
        }

        next();
    };
}

module.exports = roleMiddleware;
