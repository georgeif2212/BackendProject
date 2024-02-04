import winston from "winston";

const customLevelOpts = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  },
  colors: {
    debug: "white",
    http: "green",
    info: "blue",
    warning: "yellow",
    error: "magenta",
    fatal: "red",
  },
};

export const devLogger = winston.createLogger({
  levels: customLevelOpts.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOpts.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

export const prodLogger = winston.createLogger({
  levels: customLevelOpts.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOpts.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOpts.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

export const logger = config.env === "production" ? prodLogger : devLogger;

export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};
