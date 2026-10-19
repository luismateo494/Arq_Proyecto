export function errores(err, req, res, next) {
  console.error(' Error capturado:', err.message);

  // Error de duplicado en SQL Server (Email ya registrado)
  if (err.number === 2627 || err.number === 2601) {
    return res.status(409).json({ msg: 'Este email ya está registrado' });
  }

  // Errores de Mongoose (MongoDB)
  if (['ValidationError', 'CastError'].includes(err.name)) {
    return res.status(400).json({ 
      msg: 'Error de validación', 
      detalles: err.message 
    });
  }

  // Error genérico
  res.status(500).json({ msg: 'Error interno del servidor' });
}