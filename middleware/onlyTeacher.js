module.exports = function onlyTeacher(req, res, next) {
  if (!req.user || req.user.role !== "teacher") {
    return res.status(403).json({
      status: false,
      message: "Akses ditolak. Hanya guru yang dapat masuk."
    });
  }
  next();
};
