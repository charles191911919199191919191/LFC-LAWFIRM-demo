function sanitizeValue(value) {
  if (typeof value === "string") {
    return value.replace(/\0/g, "").trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((result, [key, item]) => {
      if (key.startsWith("$") || key.includes(".")) return result;
      result[key] = sanitizeValue(item);
      return result;
    }, {});
  }

  return value;
}

export function sanitizeInput(req, res, next) {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
}
