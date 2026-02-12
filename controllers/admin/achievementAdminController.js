const Achievement = require("../../models/Achievement");

exports.list = async (req,res) => { const list = await Achievement.findAll(); res.json({ status:true, data:list }); };
exports.create = async (req,res) => { const a = await Achievement.create(req.body); res.json({ status:true, data:a }); };
exports.update = async (req,res) => { await Achievement.update(req.body, { where:{ id: req.params.id }}); res.json({ status:true }); };
exports.remove = async (req,res) => { await Achievement.destroy({ where:{ id: req.params.id }}); res.json({ status:true }); };
