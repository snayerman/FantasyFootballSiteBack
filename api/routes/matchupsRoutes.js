'use strict';

module.exports = function(app) {
   var matchups = require('../controllers/matchupsController');

   app.route('/matchups')
      .get(matchups.get_all_matchups);
      // .post(espn.create_a_task);
   
   app.route('/matchups/:teamId/:matchupPeriodId')
      .get(matchups.get_matchup)
};