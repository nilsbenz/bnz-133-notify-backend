const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    heading: String,
    content: String,
    user: String
  },
  {timestamps: true}
);

module.exports = mongoose.model('Note', noteSchema);
