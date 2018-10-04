'use strict';

var Axios = require('axios');
var leagueId = 240470;
var baseURL = 'http://games.espn.com/ffl/api/v2/';

exports.get_player = function(req, res) {
   if(!req.params.playerId)
      res.status(400).send("No player ID provided!");
   
   var playerId = req.params.playerId;
   var url = `${baseURL}player?leagueId=${leagueId}&playerId=${playerId}`;

   for(let query in queries) {
      url += '&' + query + '=' + queries[query];
   }

   Axios.get(url)
      .then(function(espnRes) {
         res.json(espnRes.data.player);
      })
      .catch(function(err) {
         res.status(400).send(err);
      })
};