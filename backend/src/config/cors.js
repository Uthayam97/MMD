const parseOrigins = (value) => {
  if (!value) return ["*"];
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const buildCorsOriginHandler = (origins) => {
  if (origins.includes("*")) {
    return true;
  }

  return (origin, callback) => {
    // Allow same-origin and server-to-server requests without Origin header.
    if (!origin || origins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin not allowed by CORS"));
  };
};

module.exports = { parseOrigins, buildCorsOriginHandler };
