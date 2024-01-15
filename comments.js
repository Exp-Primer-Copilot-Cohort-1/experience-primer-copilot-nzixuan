// Create Web server
const express = require('express');
const app = express();
const port = 3000;

// Create middleware
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

// Create router
const router = express.Router();

// Create database
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json'); // path to database
const db = low(adapter);

// Set default value
db.defaults({ comments: [] }).write();

// Create route
router.get('/', (req, res) => {
  res.send('Hello world!');
});

router.get('/comments', (req, res) => {
  res.send(db.get('comments').value());
});

router.post('/comments', jsonParser, (req, res) => {
  const comment = req.body;
  db.get('comments').push(comment).write();
  res.send(comment);
});

router.get('/comments/:id', (req, res) => {
  const comment = db.get('comments').find({ id: req.params.id }).value();
  res.send(comment);
});

router.put('/comments/:id', jsonParser, (req, res) => {
  const id = req.params.id;
  const comment = req.body;
  db.get('comments').find({ id: id }).assign(comment).write();
  res.send(comment);
});

router.delete('/comments/:id', (req, res) => {
  const id = req.params.id;
  db.get('comments').remove({ id: id }).write();
  res.send('Deleted');
});

// Use router
app.use('/', router);

// Start Web server
app.listen(port, () => {
  console.log('Server is running at port ' + port);
});