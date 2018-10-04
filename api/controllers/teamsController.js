'use strict';

var Axios = require('axios');
var leagueId = 240470;
var baseURL = 'http://games.espn.com/ffl/api/v2/';

function formatTeam(team) {
   let teamObj = {};

   let nickName = team.teamLocation + " " + team.teamNickname;
   let owner = team.owners[0].firstName + " " + team.owners[0].lastName;
   let { division, logoUrl, teamId, record, divisionStanding, overallStanding } = team;

   teamObj.owner = owner;
   teamObj.teamId = teamId;
   teamObj.nickName = nickName;
   teamObj.division = division;
   teamObj.logoUrl = logoUrl;
   teamObj.record = record;
   teamObj.divisionStanding = divisionStanding;
   teamObj.overallStanding = overallStanding;

   return teamObj;
}

exports.get_teams = function(req, res) {
   var queries = req.query;
   var teamId = queries && queries.teamId ? queries.teamId : null;
   var name = queries && queries.name ? queries.name : null;
   var url = baseURL + 'teams?leagueId=' + leagueId;

   for(let query in queries) {
      url += '&' + query + '=' + queries[query];
   }

   Axios.get(url)
      .then(function(espnRes) {
         var teams = [];

         espnRes.data.teams.map(function(team) {
            if((teamId && team.teamId != teamId) || (name && team.owners[0].firstName != name))
               return;

            teams.push(formatTeam(team));
         })

         res.json(teams);
      })
      .catch(function(err) {
         res.status(400).send(err);
      })
};