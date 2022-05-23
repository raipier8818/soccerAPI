const express = require('express');
const path = require('path');
const router = express.Router();
const fotmob = require('../src/fotmob');

router.get('/', (req, res) => {
  res.redirect('/api/help');
})

router.get('/help', (req, res) => {
  let help = `
  <h1>Fotmob API</h1>
  <h2>How to use</h2>
  <p>
    /api/:league - Get the team standings for the league.
  </p>
  <p>
    /api/:league/:matchNum - Get the match schedule for the league.
  </p>
  <p>
    /api/leagues - Get the list of leagues.
  </p>
  <p>
    /api <sub>or</sub> /api/help  - Get this help page.
  </p>
  <sub>
    Every source is crawled from <a href="https://www.fotmob.com">Fotmob</a>.
    This API is still under development.
  </sub>
  `

  res.send(help);
});

router.get('/leagues', (req, res) => {
  const leagues = fotmob.getLeagues();
  res.send(leagues);
});

router.get('/:league/:match?', (req, res) => {
  const league = req.params.league;
  const match = req.params.match;


  if(match != undefined){
    fotmob.getMatchSchedule(league, match).then(data => {
      res.send(data);
    });
  }else{
    fotmob.getTeamStandings(league).then(data => {
      res.send(data);
    });
  }
});

module.exports = router;