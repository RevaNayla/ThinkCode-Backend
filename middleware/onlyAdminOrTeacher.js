module.exports = function onlyAdminOrTeacher(req, res, next) {
  if (!req.user || !["admin", "teacher"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya admin atau guru."
    });
  }
  next();
};
