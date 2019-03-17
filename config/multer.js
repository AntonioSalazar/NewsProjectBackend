const multer = require("multer");
const Datauri = require("datauri");
const path  = require("path")
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');
const dUri = new Datauri();

module.exports = multerUploads;
// module.exports = multerUploads;
