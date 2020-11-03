//load json files
const fs = require('fs');

let USERS = JSON.parse(fs.readFileSync('users.json'));
const SECRETS = JSON.parse(fs.readFileSync('secrets.json'));

let USER_LOCK = false;
let SECRET_LOCK = false;

function modifyUsers(delta) {
  while(USER_LOCK);
  USER_LOCK = true;
  delta(USERS);
  fs.writeFileSync('users.json', JSON.stringify(USERS, null, '\t'));
  USER_LOCK = false;
}

function generateNewUser(user_name) {
  const user = {
    name: user_name,
    secret: drawSecret(),
  };
  modifyUsers((users) => {
    users[user_name] = user;
  });
}

function toggleSecret(secret_id) {
  if(!(secret_id in SECRETS)) return;
  while(SECRET_LOCK);
  SECRET_LOCK = true;
  SECRETS[secret_id].available = !SECRETS[secret_id].available;
  fs.writeFileSync('secrets.json', JSON.stringify(SECRETS, null, '\t'));
  SECRET_LOCK = false;
}

function drawSecret() {
  const available_keys = Object.keys(SECRETS).filter((key) => SECRETS[key].available);
  const chosen_key = available_keys[Math.floor(Math.random() * available_keys.length)];
  toggleSecret(chosen_key);
  return chosen_key;
}


// begin express server

const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.render('home.pug', {});
});

app.get('/view/:user', (req, res) => {
  const user = req.params['user'];
  if(!(user in USERS)) {
    generateNewUser(user);
  }
  res.render('player.pug', {
    user: USERS[user],
    secret: SECRETS[USERS[user].secret]
  });
});

app.post('/reroll/:user', (req, res) => {
  const user = req.params['user'];
  if(!(user in USERS)) {
    res.send(`${user} does not exist`);
  }
  const newSecret = drawSecret();
  toggleSecret(USERS[user].secret);
  modifyUsers((users) => {
    users[user].secret = newSecret;
  });
  res.send(`Rerolled for ${user}`);
});

app.listen(port, () => 'Application started');
