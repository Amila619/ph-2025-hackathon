/**
 * Sanitize a string input by:
 * - trimming whitespace
 * - removing HTML tags
 * - escaping special characters
 * Note: URLs are NOT sanitized to preserve their functionality
 */
export const sanitizeInput = (input, skipUrlEncoding = false) => {
  if (typeof input !== "string") return "";

  let sanitized = input.trim();

  // If it looks like a URL, don't sanitize it
  if (skipUrlEncoding || /^https?:\/\//i.test(sanitized)) {
    return sanitized;
  }

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
  // Handle arrays separately
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        return sanitizeInput(item);
      } else if (typeof item === "object" && item !== null) {
        return sanitizeObject(item);
      }
      return item;
    });
  }

  // Use Record<string, any> for mutable object
  const sanitizedObj = { ...obj };

  Object.keys(sanitizedObj).forEach((key) => {
    const value = sanitizedObj[key];

    if (typeof value === "string") {
      sanitizedObj[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitizedObj[key] = sanitizeObject(value); // handle arrays
    } else if (typeof value === "object" && value !== null) {
      sanitizedObj[key] = sanitizeObject(value); // recursive
    }
  });

  return sanitizedObj;
};