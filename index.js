const fs = require("fs");
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { error } = require("console");
const {} = require('./Utiles/crypter.js');
const { url } = require("inspector");
const app = express();
require('dotenv').config()
const port = process.env.PORT;
app.set('trust proxy', true);

const lastResults = [];
let lastFetch = 0;
const testapi = ('https://api.github.com/rate_limit');
const githubCommitApis = [
    "https://api.github.com/repos/Snail-IDE/snail-ide.github.io/commits?per_page=50",
    "https://api.github.com/repos/Snail-IDE/Snail-IDE-Vm/commits?per_page=50",
    "https://api.github.com/repos/Snail-IDE/Snail-IDE-Website/commits?per_page=50",
    "https://api.github.com/repos/Snail-IDE/Snail-IDE-Paint/commits?per_page=50",
    "https://api.github.com/repos/Snail-IDE/Snail-IDE-Packager/commits?per_page=50",
  "https://api.github.com/repos/Snail-IDE/edu/commits?per_page=50",
  "https://api.github.com/repos/Snail-IDE/Desktop-Download/commits?per_page=50",
  "https://api.github.com/repos/Snail-IDE/examples/commits?per_page=50",
  "https://api.github.com/repos/Snail-IDE/ext-create/commits?per_page=50",
  "https://api.github.com/repos/Snail-IDE/Snail-IDE-ObjectLibraries/commits?per_page=50",
    "https://api.github.com/repos/Snail-IDE/OpenSnail/commits?per_page=50",
    "https://api.github.com/repos/Snail-IDE/SnailPy/commits?per_page=50"
]


function getDateMs(date) {
  return (new Date(date)).getTime();
}

function commitSort(f, s) {
  return getDateMs(s.commit.author.date) - getDateMs(f.commit.author.date);
}

app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(bodyParser.urlencoded({
  limit: "25mb",
  extended: false
}));
app.use(bodyParser.json({ limit: "25mb" }));

app.get('/', async function(req, res) {
  res.status(200)
  res.header("Content-Type", 'text/plain')
  res.redirect('/status/')
  console.log('Redirectet', req.ip, 'to /status/')

})

// Funktionen måste vara "async" för att kunna använda "await"
app.get('/status/', async function(req, res) {
  console.log(req.ip, "logged in on /status")
  try {
    
    const response = await fetch(testapi);
    const data = await response.json();
    res.status(200);
    if (data.rate.remaining > 0) {
      res.send({
      left: data.rate.remaining,
      working: true,
      message: ('Seems fine right now')
      });
    } else {
      res.send({
        working: false,
        message: ('No fetches left, try waiting for an hour'),
        limit: data.rate.limit
      })
    }
  } catch(error) {
    
    res.status(500).json({ 
      working: false,
      error: error.message, 
      message: 'Somthing does not work, please alert ecx678'
    });
  }
});




app.listen(port, () => 
  console.log('Started server on port ' + port)
);
