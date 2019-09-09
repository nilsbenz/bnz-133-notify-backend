const File = require('../schemas/file');

const fileService = (() => {
  function save (req, res) {
    console.log(req.files);
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

  return {
    save
  };
})();

module.exports = fileService;
