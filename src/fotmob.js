const axios = require('axios');
const cheerio = require('cheerio');

const leagues = {
  'premier-league': 47,
  'bundesliga': 54,
  'laliga': 87,
  'ligue-1': 53,
  'mls': 130,
  'serie-a': 55,
};

function getLeagues(){
  return {
    leagues: Object.keys(leagues)
  }
}

function getTeamStandings(leagueName){
  const leagueId = getLeagueId(leagueName);
  return axios.get(`https://www.fotmob.com/leagues/${leagueId}`)
  .then(html => {
    const $ = cheerio.load(html.data);
    const $table = $('tbody').children('tr');
    let standings = {};
    $table.each((i, el) => {
      const rowData = $(el).children('td');
      const ranking = rowData.eq(0).text();
      const teamName = rowData.eq(1).find('span').text();
      const game = rowData.eq(2).text();
      const win = rowData.eq(3).text();
      const draw = rowData.eq(4).text();
      const lose = rowData.eq(5).text();
      const goal = rowData.eq(6).text();
      const goalDifference = rowData.eq(7).text();
      const points = rowData.eq(8).text();
      const lastFives = rowData.eq(9).find('a').text();

      const team = {
        ranking: ranking,
        team: teamName,
        game: game,
        win: win,
        draw: draw,
        lose: lose,
        goal: goal,
        goalDifference: goalDifference,
        points: points,
        lastFives: lastFives
      };

      
      standings[ranking] = team;
    });

    // console.log(standings);
    return standings;
  }).catch(err => {
    console.log(err);
    return {};
  })
}

function getMatchSchedule(leagueName, matchNum=undefined){
  const leagueId = getLeagueId(leagueName);
  const link = matchNum 
  ? `https://www.fotmob.com/leagues/${leagueId}/matches/${leagueName}?page=${matchNum}` 
  : `https://www.fotmob.com/leagues/${leagueId}/matches`;

  return axios.get(link)
  .then(html => {
    const $ = cheerio.load(html.data);
    const $table = $('main').find('section').children('section');
    let games = {};

    $table.each((i, el) => {
      const matchDay = $(el).find('h3').text();
      const $matches = $(el).children('div');
      const matches = [];

      $matches.each((j, el_) => {
        const rowData = $(el_).find('a').find('span');
        const homeTeam = rowData.eq(1).text();
        const score = rowData.eq(2).text();
        const time = rowData.eq(3).text();
        const awayTeam = rowData.eq(4).text();

        const match = {
          home: homeTeam,
          score: score,
          time: time,
          away: awayTeam
        }
        matches.push(match);
      });

      games[matchDay] = matches;
    })
    // console.log(games);

    return games;
  }).catch(err => {
    console.log(err);
    return {};
  });
}

function getLeagueId(leagueName){
  return leagues[leagueName];
}

module.exports = {
  getTeamStandings,
  getMatchSchedule,
  getLeagues
}