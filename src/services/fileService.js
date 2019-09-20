const File = require('../schemas/file');
const authService = require('./authService');

const fileService = (() => {
  async function save (req, res) {
    const file = new File();
    file.name = req.files.file.name;
    file.type = req.files.file.mimetype;
    file.data = req.files.file.data;
    const user = await authService.getCurrentUser(req);
    file.user = user._id;
    file.save((err, file) => {
      if (err) {
        res.statusCode = 500;
        return res.json({success: false, error: err});
      }
      return res.json({
        success: true,
        id: file._id
      });
    });
  }

  async function findAll (req, res) {
    const user = await authService.getCurrentUser(req);
    File.find({user: user._id}, '_id name type', (err, files) => {
      if (err) {
        res.statusCode = 500;
        return res.json({success: false, error: err});
      }
      res.json({
        success: true,
        files
      });
    });
  }

  async function findById (req, res) {
    const user = await authService.getCurrentUser(req);
    File.findOne({_id: req.params.id, user: user._id}, (err, file) => {
      if (err) {
        res.statusCode = 500;
        return res.json({success: false, error: err});
      }
      if (!file) {
        res.statusCode = 403;
        return res.json({success: false, message: 'file not found'});
      }
      res.writeHead(200, {
        'Content-Disposition': 'attachment;filename=' + file.name,
        'Content-Type': file.type
      });
      return res.end(file.data, 'binary');
    });
  }

  async function remove (req, res) {
    const user = await authService.getCurrentUser(req);
    File.deleteOne({_id: req.params.id, user: user._id}, err => {
      if (err) {
        res.statusCode = 500;
        return res.json({success: false, error: err});
      }
      return res.json({
        success: true
      });
    });
  }

  return {
    save,
    findAll,
    findById,
    remove
  };
})();

module.exports = fileService;
