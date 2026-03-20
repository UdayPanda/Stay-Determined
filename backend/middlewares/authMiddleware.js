import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    let token;

    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.user = decoded;

    next();

  } catch (err) {
    console.error("Auth Error:", err.message);

    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
