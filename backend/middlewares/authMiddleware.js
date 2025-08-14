import { jwtDecrypt } from "jose";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // console.log("Token from cookies:", req.cookies);
    
    if (!token)
      return res.status(401).json({ success: false, message: "No token" });

    const secret = new TextEncoder().encode(process.env.JWT_KEY);
    const { payload } = await jwtDecrypt(token, secret);
    // console.log("middlware activated", payload);    

    req.user = payload;
    next();

  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
