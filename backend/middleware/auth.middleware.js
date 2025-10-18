import { HTTP_STATUS } from "../const/http-status.const.js";
import { verifyAccessToken } from "../util/JWTtoken.util.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const token = authHeader.substring("Bearer ".length);
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
    if (allowedRoles.length === 0) {
      return next();
    }
    const userRole = req.user.role || "user";
    if (!allowedRoles.includes(userRole)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Forbidden" });
    }
    return next();
  };
};

// Blacklist for non-admins
const ADMIN_URL_BLACKLIST = [
  /^\/api\/admin(\/|$)/,
  /^\/api\/auth\/admin(\/|$)/
];

export const blockBlacklistedForNonAdmins = (req, res, next) => {
  try {
    // If unauthenticated, let other middlewares decide; only enforce for authenticated non-admins
    const isBlacklisted = ADMIN_URL_BLACKLIST.some((re) => re.test(req.path));
    if (!isBlacklisted) return next();

    // Require auth first
    const userRole = req.user?.role || "user";
    if (userRole !== "admin") {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Forbidden" });
    }
    return next();
  } catch (_) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Forbidden" });
  }
};


