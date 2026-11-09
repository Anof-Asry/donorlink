import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Authentication middleware — verifies JWT from Authorization header or cookie.
 * Attaches the authenticated user (id + role) to req.user.
 */
export const authenticate = async (req, res, next) => {
  try {
    let token;

    // 1. Try Authorization: Bearer <token> header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Fall back to HttpOnly cookie
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify the token (throws if invalid or expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB to ensure they still exist
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    // Attach user info to request object
    req.user = { userId: user._id, role: user.role, email: user.email };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Authorization middleware — restricts access to specific roles.
 * Must be used AFTER authenticate middleware.
 * Usage: authorize("admin", "donor")
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role(s): ${roles.join(", ")}. Your role: ${req.user.role}.`,
      });
    }
    next();
  };
};
