const Note = require('../schemas/note');
const authService = require('./authService');

const noteService = (() => {
  async function save (req, res) {
    const note = new Note();
    note.heading = req.body.heading;
    note.content = req.body.content;
    const user = await authService.getCurrentUser(req);
    note.user = user._id;

    note.save((err, note) => {
      if (err) {
        res.statusCode = 500;
        return res.json({success: false, error: err});
      }
      return res.json({
        success: true,
        id: note._id
      });
    });
  }

  return {
    save
  };
})();

module.exports = noteService;
