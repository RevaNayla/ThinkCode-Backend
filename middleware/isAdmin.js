module.exports = function (req, res, next) {
  if (!req.user) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }

  if (req.user.role !== "admin" && req.user.role !== "teacher") {
    return res.status(403).json({ status: false, message: "Akses ditolak" });
  }

  next();
};
