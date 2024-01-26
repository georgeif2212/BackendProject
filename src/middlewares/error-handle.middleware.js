import EnumsError from "../utils/EnumsError";

export const errorHandlerMiddleware = (error, req, res, next) => {
  console.error(error.cause || error.message);
  switch (error.code) {
    case EnumsError.BAD_REQUEST_ERROR:
      res.status(400).json({ status: "error", message: error.message });
      break;
    case EnumsError.UNAUTHORIZED_ERROR:
      res.status(401).json({ status: "error", message: error.message });
      break;
    case EnumsError.FORBIDDEN_ERROR:
      res.status(403).json({ status: "error", message: error.message });
      break;
    case EnumsError.NOT_FOUND_ERROR:
      res.status(403).json({ status: "error", message: error.message });
      break;
    case EnumsError.ROUTING_ERROR:
      res.status(500).json({ status: "error", message: error.message });
      break;
    case EnumsError.INVALID_TYPE_ERROR:
      res.status(400).json({ status: "error", message: error.message });
      break;
    case EnumsError.DATA_BASE_ERROR:
      res.status(500).json({ status: "error", message: error.message });
      break;
    case EnumsError.INVALID_PARAMS_ERROR:
      res.status(400).json({ status: "error", message: error.message });
      break;
  }
};
