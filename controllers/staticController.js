exports.getTutorial = (req, res) => {
  res.json({
    title: "Cara Menggunakan ThinkCode",
    steps: [
      "1. Login menggunakan akun yang telah dibuat atau Register terlebih dahulu jika belum memiliki akun",
      "2. Pilih materi yang tersedia dihalaman materi",
      "3. Ikuti step: orientasi masalah, gabung ruang diskusi, upload jawaban",
      "4. Jika terdapat kesulitan dalam menyelesaikan permasalahan dapat menggunakan Clue yang disediakan pada ruang diskusi",
      "5. Kumpulkan XP dari mini game",
      "6. Tedapat pula  Mini Lesson yaitu pada button i jika ingin mengakses materi",
    ],
  });
};

exports.getAbout = (req, res) => {
  res.json({
    app: "ThinkCode E-Learning",
    version: "1.0",
    developer: "Reva Nayla",
    copyright:
      "© ThinkCode 2026",
  });
};
