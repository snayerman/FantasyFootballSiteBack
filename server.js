var express = require('express');
var cors = require('cors');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var matchupsRoutes = require('./api/routes/matchupsRoutes');
var teamsRoutes = require('./api/routes/teamsRoutes');

matchupsRoutes(app);
teamsRoutes(app);

app.listen(port);