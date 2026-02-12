const sequelize = require("../config/db");
const Materi = require("../models/Materi");
const MateriSection = require("../models/MateriSection");

async function seed() {

  const topics = [
    { title: "Percabangan IF", slug: "percabangan-if", description: "Dasar percabangan if", order: 1 },
    { title: "Percabangan IF-ELSE", slug: "percabangan-if-else", description: "Percabangan dua jalur", order: 2 },
    { title: "Percabangan IF-ELSE-IF", slug: "percabangan-if-else-if", description: "Percabangan beberapa kondisi", order: 3 }
  ];

  for (const t of topics) {
    const m = await Materi.create(t);
    for (let i = 1; i <= 4; i++) {
      await MateriSection.create({
        materiId: m.id,
        title: `${m.title} — Bagian ${i}`,
        content: `Konten ${m.title} Bagian ${i}. (Masukkan teks, gambar, atau HTML di sini)`,
        order: i
      });
    }
  }

  console.log("Materi seed done");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
