const express = require('express');
const bodyParser = require('body-parser');
const authService = require('./services/authService');
const fileService = require('./services/fileService');
const fileUpload = require('express-fileupload');
let tokenMiddleware = require('./middlewares/tokenMiddleware');
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/tbz-notes', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('database connected');
});

const app = express();
const port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(fileUpload({
  limits: {fileSize: 50 * 1024 * 1024}
}));

app.post('/api/auth/login', authService.login);
app.post('/api/auth/register', authService.register);
app.post('/api/files', tokenMiddleware.checkToken, fileService.save);
app.get('/api/files', tokenMiddleware.checkToken, fileService.findAll);
app.get('/api/files/:id', tokenMiddleware.checkToken, fileService.findById);
app.get('/', tokenMiddleware.checkToken, (req, res) => res.send('notes'));

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
