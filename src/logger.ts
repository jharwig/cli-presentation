import log from "simple-node-logger";

const logger = log.createSimpleFileLogger("combined.log");
logger.setLevel("all");

export default logger;

console.log = logger.info.bind(logger);
console.warn = logger.warn.bind(logger);
console.error = logger.error.bind(logger);
console.info = logger.info.bind(logger);
console.debug = logger.debug.bind(logger);
