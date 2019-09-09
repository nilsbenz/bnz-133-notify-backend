const File = require('../schemas/file');

const fileService = (() => {
  function save (req, res) {
    const file = new File();
    file.name = req.files.file.name;
    file.type = req.files.file.mimetype;
    file.data = req.files.file.data;
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

  function findAll (req, res) {
    File.find({}, '_id name type', (err, files) => {
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

  function findById (req, res) {
    File.findOne({_id: req.params.id}, (err, file) => {
      if (err) {
        res.statusCode = 500;
        return res.json({success: false, error: err});
      }
      res.writeHead(200, {
        'Content-Disposition': 'attachment;filename=' + file.name,
        'Content-Type': file.type
      });
      return res.end(file.data, 'binary');
    });
  }

  return {
    save,
    findAll,
    findById
  };
})();

module.exports = fileService;
