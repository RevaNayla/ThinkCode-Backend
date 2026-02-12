module.exports = function onlyStudent(req, res, next) {
  if (!req.user || req.user.role !== "student") {
    return res.status(403).json({
      status: false,
      message: "Akses ditolak. Hanya siswa yang dapat masuk."
    });
  }
  next();
};
