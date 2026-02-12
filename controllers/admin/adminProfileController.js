const User = require("../../models/User");
const bcrypt = require("bcryptjs");

// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "name", "email", "role"]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Profil tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil profil"
    });
  }
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    await User.update(
      { name, email },
      { where: { id: userId } }
    );

    res.json({
      success: true,
      message: "Profil berhasil diperbarui"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal memperbarui profil"
    });
  }
};

// ================= UPDATE PASSWORD =================
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
      { password: hashedPassword },
      { where: { id: userId } }
    );

    res.json({
      success: true,
      message: "Password berhasil diubah"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal mengubah password"
    });
  }
};
