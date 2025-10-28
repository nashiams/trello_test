function errorHandler(error, req, res, next) {
  console.log(error, "<< error Handler log");

  switch (error.name) {
    case "Forbidden":
      res.status(403).json({ message: error.message });
      break;
    case "Unauthorized":
      res.status(401).json({ message: error.message });
      break;
    case "SequelizeUniqueConstraintError":
    case "SequelizeValidationError":
      res.status(400).json({ message: error.errors[0].message });
      break;
    case "JsonWebTokenError":
      res.status(401).json({ message: "Invalid token" });
      break;
    case "BadRequest":
      res.status(400).json({ message: error.message });
      break;
    case "Not Found":
      res.status(404).json({ message: error.message });
      break;
    default:
      res.status(500).json({ message: "Internal server error" });
      break;
  }
}

module.exports = errorHandler;
