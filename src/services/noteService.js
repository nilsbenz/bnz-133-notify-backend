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

  async function findAll (req, res) {
    const user = await authService.getCurrentUser(req);
    Note.find({user: user._id}, '_id heading content', (err, notes) => {
      if (err) {
        res.statusCode = 500;
        return res.json({success: false, error: err});
      }
      return res.json({
        success: true,
        notes
      });
    });
  }

  async function findById (req, res) {
    const user = await authService.getCurrentUser(req);
    Note.findOne({_id: req.params.id, user: user._id}, (err, note) => {
      if (err) {
        res.statusCode = 500;
        return res.json({success: false, error: err});
      }
      if (!note) {
        res.statusCode = 403;
        return res.json({success: false, message: 'note not found'});
      }
      return res.json({success: true, note});
    });
  }

  async function update (req, res) {
    const heading = req.body.heading;
    const content = req.body.content;
    const user = await authService.getCurrentUser(req);
    Note.updateOne({_id: req.params.id, user: user._id}, {heading, content}, (err, response) => {
      if (err) {
        res.statusCode = 500;
        return res.json({success: false, error: err});
      }
      if (response.n === 0) {
        res.statusCode = 403;
        return res.json({
          success: false,
          message: 'note not found'
        });
      }
      return res.json({
        success: true
      });
    });
  }

  async function remove (req, res) {
    const user = await authService.getCurrentUser(req);
    Note.deleteOne({_id: req.params.id, user: user._id}, err => {
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
    update,
    remove
  };
})();

module.exports = noteService;
