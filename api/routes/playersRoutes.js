'use strict';

module.exports = function(app) {
   var players = require('../controllers/playersController');

   app.route('/players/:playerId')
      .get(players.get_player);
      // .post(espn.create_a_task);
};