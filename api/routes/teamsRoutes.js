'use strict';

module.exports = function(app) {
   var teams = require('../controllers/teamsController');

   app.route('/teams')
      .get(teams.get_teams);
      // .post(espn.create_a_task);
};