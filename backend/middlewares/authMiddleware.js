import { jwtDecrypt } from "jose";

const authMiddleware = async (req, res, next) => {
  const token = req.body.token;
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const token = req.cookies.jwt;
    if (!token)
      return res.status(401).json({ success: false, message: "No token" });

    const secret = new TextEncoder().encode(process.env.JWT_KEY);
    const { payload } = await jwtDecrypt(token, secret);

    return res.status(200).json({ user: payload });
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
