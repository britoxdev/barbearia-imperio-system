function notFoundHandler(req, res, next) {
  res.status(404).json({ message: "Rota nao encontrada." });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({
    message: "Erro interno do servidor.",
    details: process.env.NODE_ENV === "development" ? err.message : undefined
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
