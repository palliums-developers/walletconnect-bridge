const env = process.env.NODE_ENV || "development";
const debug = env !== "production";
const port = process.env.PORT || (env === "production" ? 5001 : 5001);
const host = process.env.HOST || `127.0.0.1:${port}`;

export default {
  env: env,
  debug: debug,
  port,
  host,
};
