'use strict';

var Axios = require('axios');
var leagueId = 240470;
var baseURL = 'http://games.espn.com/ffl/api/v2/';

exports.get_all_matchups = function(req, res) {
   var queries = req.query;
   var url = baseURL + 'scoreboard?leagueId=' + leagueId;

   for(let query in queries) {
      url += '&' + query + '=' + queries[query];
   }

   Axios.get(url)
      .then(function(espnRes) {
         res.json(espnRes.data.scoreboard);
      })
      .catch(function(err) {
         res.status(400).send(err);
      })
};

/* 
Possible params:
   seasonId: year
*/
exports.get_matchup = function(req, res) {
   if(!req.params || !req.params.teamId || !req.params.matchupPeriodId)
      res.status(400).send("Missing paramaters");

   var queries = req.query;
   var {teamId, matchupPeriodId} = req.params;
   var url = `${baseURL}boxscore?leagueId=${leagueId}`;

   for(let query in queries) {
      url += '&' + query + '=' + queries[query];
   }

   url += `&teamId=${teamId}&matchupPeriodId=${matchupPeriodId}`;

   Axios.get(url)
      .then(function(espnRes) {
         var matchup = buildMatchup(espnRes.data.boxscore);
         res.json(matchup);
      })
      .catch(function(err) {
         res.status(400).send(err);
      })

}

function buildMatchup(boxscore) {
   let finalMatchup = {};
   let homeTeam = {};
   let awayTeam = {};

   let matchups = boxscore.scheduleItems[0].matchups[0];
   let teams = boxscore.teams;

   homeTeam.teamId = matchups.homeTeamId;
   homeTeam.nickName = matchups.homeTeam.teamLocation + ' ' + matchups.homeTeam.teamNickname;
   homeTeam.logoUrl = matchups.homeTeam.logoUrl;
   homeTeam.score = matchups.homeTeamScores[0];

   awayTeam.teamId = matchups.awayTeamId;
   awayTeam.nickName = matchups.awayTeam.teamLocation + ' ' + matchups.awayTeam.teamNickname;
   awayTeam.logoUrl = matchups.awayTeam.logoUrl;
   awayTeam.score = matchups.awayTeamScores[0];

   homeTeam.currentStarterPoints = teams[0].appliedActiveRealTotal;
   homeTeam.currentBenchPoints = teams[0].appliedInactiveRealTotal;

   awayTeam.currentStarterPoints = teams[0].appliedActiveRealTotal;
   awayTeam.currentBenchPoints = teams[0].appliedInactiveRealTotal;

   let playerMap = { 0: "qb", 1: "rb1", 2: "rb2", 3: "wr1", 4: "wr2", 5: "wr3", 6: "te", 7: "flx", 8: "dst", 9: "k", 10: "be1", 11: "be2", 12: "be3", 13: "be4", 14: "be5", 15: "be6", 16: "be7", 17: "ir"}

   homeTeam.players = {}
   awayTeam.players = {}

   teams[0].slots.map(function(slot, idx) {
      if(idx == 17)
         return;

      let tmp = {};

      tmp.name = slot.player.firstName + ' ' + slot.player.lastName;
      tmp.playerId = slot.player.playerId;
      tmp.score = slot.currentPeriodRealStats.appliedStatTotal;
      tmp.percentOwned = slot.player.percentOwned;
      tmp.percentStarted = slot.player.percentStarted;
      tmp.positionRank = slot.player.positionRank;
      tmp.draftRank = slot.player.draftRank;
      tmp.playerPictureUrl = `http://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${slot.player.sportsId}.png`;

      homeTeam.players[playerMap[idx]] = tmp;
   })

   teams[1].slots.map(function(slot, idx) {
      if(idx == 17)
         return;

      let tmp = {};
      
      tmp.name = slot.player.firstName + ' ' + slot.player.lastName;
      tmp.playerId = slot.player.playerId;
      tmp.score = slot.currentPeriodRealStats.appliedStatTotal;
      tmp.percentOwned = slot.player.percentOwned;
      tmp.percentStarted = slot.player.percentStarted;
      tmp.positionRank = slot.player.positionRank;
      tmp.draftRank = slot.player.draftRank;
      tmp.playerPictureUrl = `http://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${slot.player.sportsId}.png`;

      awayTeam.players[playerMap[idx]] = tmp;
   })

   finalMatchup.homeTeam = homeTeam;
   finalMatchup.awayTeam = awayTeam;
   return finalMatchup;
}