const sequelize = require("../config/database");
const GameLevel = require("../models/GameLevel");
const GameQuestion = require("../models/GameQuestion");

async function seed() {
  await sequelize.sync();

  const topics = [
    { key: "if", titlePrefix: "IF" },
    { key: "if-else", titlePrefix: "IF ELSE" },
    { key: "if-else-if", titlePrefix: "IF ELSE IF" }
  ];

  let levelNumber = 1;

  for (const t of topics) {
    for (let lv = 1; lv <= 3; lv++) {
      const level = await GameLevel.create({
        title: `${t.titlePrefix} - Level ${lv}`,
        materi: t.key,
        levelNumber,
        totalQuestions: 10
      });

      for (let i = 1; i <= 10; i++) {

        // ===== MCQ =====
        if (i % 2 === 1) {
          const options = [
            "Percabangan",
            "Perulangan",
            "Deklarasi variabel",
            "Pemanggilan fungsi"
          ];

          await GameQuestion.create({
            levelId: level.id,
            type: "mcq",
            meta: {
              question: "Apa fungsi utama dari pernyataan if dalam pemrograman?",
              options,
              answerIndex: 0
            }
          });
        }

        // ===== ESSAY / FILL =====
        else {
          await GameQuestion.create({
            levelId: level.id,
            type: "essay",
            meta: {
              question: "Jelaskan fungsi pernyataan if dalam pemrograman!",
              answer: "percabangan"
            }
          });
        }
      }

      levelNumber++;
    }
  }

  console.log("✅ Game seed berhasil");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
