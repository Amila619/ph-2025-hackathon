/**
 * Sanitize a string input by:
 * - trimming whitespace
 * - removing HTML tags
 * - escaping special characters
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";

  let sanitized = input.trim();

  // Remove HTML tags (basic XSS prevention)
  sanitized = sanitized.replace(/<[^>]*>?/gm, "");

  // Replace special characters with safe equivalents
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

  return sanitized;
};

export const sanitizeObject = (obj) => {
  // Use Record<string, any> for mutable object
  const sanitizedObj = { ...obj };

  Object.keys(sanitizedObj).forEach((key) => {
    const value = sanitizedObj[key];

    if (typeof value === "string") {
      sanitizedObj[key] = sanitizeInput(value);
    } else if (typeof value === "object" && value !== null) {
      sanitizedObj[key] = sanitizeObject(value); // recursive
    }
  });

  return sanitizedObj;
};