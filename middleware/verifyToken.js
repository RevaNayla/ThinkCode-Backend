const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("HEADER DITERIMA:", req.headers); 

  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ status: false, message: "Token tidak ditemukan" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretjwt");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Token tidak valid" });
  }
};
