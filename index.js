const fs = require("fs");
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { error } = require("console");

const app = express();
const port = 8080;

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
  res.send("online")
})

// Funktionen måste vara "async" för att kunna använda "await"
app.get('/status/rate_limit/', async function(req, res) {
  try {
    // 1. Du måste använda await här
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
    // 2. Skicka felmeddelandet som ett rent JSON-objekt
    res.status(500).json({ 
      working: false,
      error: error.message, // Detta ger en textsträng som t.ex. "fetch failed"
      message: 'Somthing does not work, please alert ecx678'
    });
  }
});


app.get('/commits', async function(req, res) {
  const difference = (Date.now() - lastFetch);
  if ((difference <= 120000) && (lastResults.length > 0)) {
    res.status(200)
    res.json(lastResults.sort(commitSort))
    return
  }

  try {
    const fetchPromises = githubCommitApis.map(api => fetch(api));
    const responses = await Promise.all(fetchPromises);

    lastResults.splice(0, lastResults.length);

    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      if (response.ok) {
        const json = await response.json();
        json.forEach(commit => {
          lastResults.push(commit);
        });
      } else {
        const text = await response.text();
        console.log("error getting commits;", text);
      }
    }

    console.log("got new commits")
    lastFetch = Date.now()
    res.status(200)
    res.json(lastResults.sort(commitSort))
  } catch (error) {
    console.error("Error fetching commits:", error);
    res.status(500).json({ error: "Server Error, please log into a  diffrent API for this request" });
  }
});

app.listen(port, () => console.log('Started server on port ' + port));
