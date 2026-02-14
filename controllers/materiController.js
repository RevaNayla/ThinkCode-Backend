const Materi = require("../models/Materi");
const MateriSection = require("../models/MateriSection");
const UserMateriProgress = require("../models/UserMateriProgress");
const STEPS = ["watch_video", "open_mini_lesson", "join_discussion", "submit_answer"];


// GET ALL MATERI
exports.getAllMateri = async (req, res) => {
  try {
    const materi = await Materi.findAll({ order: [["order", "ASC"]] });
    let progressMap = {};

    if (req.user?.id) {
      const ups = await UserMateriProgress.findAll({
        where: { userId: req.user.id }
      });
      ups.forEach(p => progressMap[p.materiId] = p);
    }

    const data = materi.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      progress: progressMap[m.id]?.percent || 0
    }));

    res.json({ status: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false });
  }
};

// GET DETAIL MATERI
exports.getMateriDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const m = await Materi.findByPk(id);
    if (!m) return res.status(404).json({ status: false, message: "Materi tidak ditemukan" });

    const sections = await MateriSection.findAll({
      where: { materiId: id },
      order: [["order", "ASC"]],
    });

    const miniSection = sections.find(s => s.type === "mini") || null;

    const mappedSections = sections.map(s => ({
      id: s.id,
      type: s.type,
      content: s.content,
      title: s.title,
      order: s.order
    }));

    let progress = null;
    if (req.user && req.user.id) {
      const up = await UserMateriProgress.findOne({ where: { userId: req.user.id, materiId: id } });
      progress = up ? {
        completedSections: JSON.parse(up.completedSections),
        percent: up.percent,
        xp: up.xp || 0  
      } : { completedSections: [], percent: 0, xp: 0 };
    }

    res.json({
      status: true,
      data: {
        materi: m,
        sections: mappedSections,
        miniLesson: miniSection
          ? { type: miniSection.type, content: miniSection.content, title: miniSection.title }
          : null,
        progress  
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// UPDATE PROGRESS USER (untuk sections, jika diperlukan)
exports.updateProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const materiId = parseInt(req.params.id);
    const { completedSections } = req.body;
    if (!Array.isArray(completedSections)) 
      return res.status(400).json({ status: false, message: "completedSections harus array" });

    const totalSections = await MateriSection.count({ where: { materiId } });
    const percent = totalSections === 0 ? 0 : Math.round((completedSections.length / totalSections) * 100);

    const [up, created] = await UserMateriProgress.findOrCreate({
      where: { userId, materiId },
      defaults: { completedSections: JSON.stringify(completedSections), percent, updatedAt: new Date() }
    });

    if (!created) {
      await up.update({ completedSections: JSON.stringify(completedSections), percent, updatedAt: new Date() });
    }

    res.json({ status: true, percent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

// COMPLETE STEP (untuk steps)
exports.completeStep = async (req, res) => {
  try {
    const userId = req.user.id;
    const materiId = parseInt(req.params.id);
    const { step } = req.body;

    if (!STEPS.includes(step)) {
      return res.status(400).json({ status: false, message: "Invalid step" });
    }

    let progress = await UserMateriProgress.findOne({
      where: { userId, materiId }
    });

    if (!progress) {
      progress = await UserMateriProgress.create({
        userId,
        materiId,
        completedSections: JSON.stringify([]),
        percent: 0
      });
    }

    let completedSteps = JSON.parse(progress.completedSections);

    completedSteps = completedSteps.filter(s => STEPS.includes(s));


    if (!completedSteps.includes(step)) {
      completedSteps.push(step);
    }

    const percentRaw = Math.round((completedSteps.length / STEPS.length) * 100);
    const percent = Math.min(percentRaw, 100);


    await progress.update({
      completedSections: JSON.stringify(completedSteps),
      percent
    });

    res.json({ status: true, percent, completedSteps });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false });
  }
};