const { Materi, MateriSection, Clue, DiscussionRoom, Upload } = require("../../models");
const fs = require("fs");

// materi
exports.listMateri = async (req,res) => {
  const list = await Materi.findAll({ order: [["order","ASC"]] });
  res.json(list);
};
exports.getMateri = async (req,res) => {
  const m = await Materi.findByPk(req.params.id);
  if(!m) return res.status(404).json({error:"Not found"});
  res.json(m);
};
exports.createMateri = async (req,res) => {
  const m = await Materi.create(req.body);
  res.json(m);
};
exports.updateMateri = async (req,res) => {
  const m = await Materi.findByPk(req.params.id);
  if(!m) return res.status(404).json({error:"Not found"});
  await m.update(req.body);
  res.json(m);
};
exports.deleteMateri = async (req,res) => {
  const m = await Materi.findByPk(req.params.id);
  if(!m) return res.status(404).json({error:"Not found"});
  await m.destroy();
  res.json({ success:true });
};

// orientasi 
exports.getOrientasi = async (req,res)=>{
  const step = await MateriSection.findOne({ where: { materiId: req.params.id, type: 'video', title: 'Orientasi' }});
  return res.json(step || {});
};
exports.putOrientasi = async (req,res)=>{
  const { videoUrl } = req.body;
  let step = await MateriSection.findOne({ where: { materiId: req.params.id, type: 'video', title: 'Orientasi' }});
  if(step){
    await step.update({ content: videoUrl });
  } else {
    step = await MateriSection.create({ materiId: req.params.id, title: "Orientasi", type: "video", content: videoUrl, order: 0 });
  }
  res.json(step);
};
exports.uploadOrientasi = async (req,res)=>{
  if(!req.file) return res.status(400).json({error:"No file"});
  const url = `/uploads/orientasi/${req.file.filename}`; 
  let step = await MateriSection.findOne({ where:{ materiId: req.params.id, type: 'video', title: 'Orientasi'  }});
  if(step) await step.update({ content: url });
  else step = await MateriSection.create({ materiId: req.params.id, title: "Orientasi", type: "video", content: url, order: 0 });
  res.json(step);
};
exports.deleteOrientasi = async (req,res)=>{
  let step = await MateriSection.findOne({ where:{ materiId: req.params.id, type:'video' }});
  if(step){
    await step.destroy();
  }
  res.json({ success:true });
};

// Sections
exports.listSections = async (req,res)=> {
  const list = await MateriSection.findAll({ where:{ materiId: req.params.id }, order:[["order","ASC"]] });
  res.json(list);
};
exports.createSection = async (req,res)=> {
  const body = req.body;
  const s = await MateriSection.create({ ...body, materiId: req.params.id });
  res.json(s);
};
exports.updateSection = async (req,res)=> {
  const s = await MateriSection.findByPk(req.params.sectionId);
  if(!s) return res.status(404).json({error:"Not found"});
  await s.update(req.body);
  res.json(s);
};
exports.deleteSection = async (req,res)=> {
  const s = await MateriSection.findByPk(req.params.sectionId);
  if(!s) return res.status(404).json({error:"Not found"});
  await s.destroy();
  res.json({ success:true });
};
exports.uploadSectionImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const url = `${baseUrl}/uploads/orientasi/${req.file.filename}`;

  res.json({ url });
};



// Clues
exports.listClues = async (req,res)=> {
  const list = await Clue.findAll({ where:{ materiId: req.params.id }, order:[["id","ASC"]] });
  res.json(list);
};
exports.createClue = async (req,res)=> {
  console.log("BODY CREATE CLUE:", req.body);   

  const count = await Clue.count({ where:{ materiId: req.params.id }});
  if(count >= 5) return res.status(400).json({error:"Maximum clues reached"});

  const c = await Clue.create({ 
    clueText: req.body.clueText,                
    cost: req.body.cost,
    materiId: req.params.id
  });

  res.json(c);
};

exports.updateClue = async (req,res)=> {
  const c = await Clue.findByPk(req.params.clueId);
  if(!c) return res.status(404).json({error:"Not found"});
  await c.update(req.body);
  res.json(c);
};
exports.deleteClue = async (req,res)=> {
  const c = await Clue.findByPk(req.params.clueId);
  if(!c) return res.status(404).json({error:"Not found"});
  await c.destroy();
  res.json({ success:true });
};

// Rooms
exports.listRooms = async (req,res)=> {
  const list = await DiscussionRoom.findAll({ where:{ materiId: req.params.id }});
  res.json(list);
};
exports.createRoom = async (req, res) => {
  try {
    const { title, capacity } = req.body;
    const materiId = req.params.id;

    if (!title) return res.status(400).json({ message: "title wajib diisi" });
    if (!capacity) return res.status(400).json({ message: "capacity wajib diisi" });

    const room = await DiscussionRoom.create({
      materiId,
      title,
      capacity,
      isClosed: false
    });

    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membuat room" });
  }
};

exports.updateRoom = async (req,res)=> {
  const r = await DiscussionRoom.findByPk(req.params.roomId);
  if(!r) return res.status(404).json({error:"Not found"});
  await r.update(req.body);
  res.json(r);
};
exports.deleteRoom = async (req,res)=> {
  const r = await DiscussionRoom.findByPk(req.params.roomId);
  if(!r) return res.status(404).json({error:"Not found"});
  await r.destroy();
  res.json({ success:true });
};

// Uploads
exports.listUploads = async (req,res)=> {
  const list = await Upload.findAll({ where:{ materiId: req.params.id }});
  res.json(list);
};
exports.uploadFile = async (req,res)=> {
  if(!req.file) return res.status(400).json({error:"No file"});
  const url = `/uploads/${req.file.filename}`;
  const u = await Upload.create({ userId: req.user?.id || null, materiId: req.params.id, filePath: url });
  res.json(u);
};
exports.deleteUpload = async (req,res)=> {
  const u = await Upload.findByPk(req.params.uploadId);
  if(!u) return res.status(404).json({error:"Not found"});
  await u.destroy();
  res.json({ success:true });
};