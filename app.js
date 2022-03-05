require("dotenv").config()
const express = require("express")
const cors = require("cors")
const SpotifyWebApi = require("spotify-web-api-node")
const bodyParser = require("body-parser")

var credentials = {
  clientId: '0449ff3ac3ec4afea0a6c7ceb84e65ba',
  clientSecret: 'ae39aaa76b564a43a365d3c1a79fadbf',
  redirectUri: 'http://localhost:6969/login'
};

const url = "https://accounts.spotify.com/authorize?client_id=0449ff3ac3ec4afea0a6c7ceb84e65ba&response_type=code&redirect_uri=http://localhost:6969/login&scope=user-read-email%20user-read-private%20user-top-read"


var spotifyApi = new SpotifyWebApi(credentials);

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.redirect(url);
});

app.get('/login',(req,res)=>{

  var code= req.query.code || null;

  var AL,AM,AS,TL,TM,TS,dataa;
  if(code==null){
    res.redirect(url);
  }
  spotifyApi
  .authorizationCodeGrant(code)
  .then(function(data) {
    console.log('Retrieved access token', data.body['access_token']);

    // Set the access token
    spotifyApi.setAccessToken(data.body['access_token']);
    return spotifyApi.refreshAccessToken()})
  .then(
      function(data) {
        console.log('The access token has been refreshed!');
    
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
      },
      function(err) {
        console.log('Could not refresh access token', err);})
  .then(function(data){
    return spotifyApi.getMyTopArtists({limit: 5, time_range: 'long_term'});
  })
  .then(function(data) {
    AL = data.body.items
  })
  .then(function(data){
    return spotifyApi.getMyTopArtists({limit: 5, time_range: 'medium_term'});
  }).then(function(data) {
    AM = data.body.items
  })
  .then(function(data){
    return spotifyApi.getMyTopArtists({limit: 5, time_range: 'short_term'});
  })
  .then(function(data) {
    AS = data.body.items
  })
  .then(function(data){
    return spotifyApi.getMyTopTracks({limit: 5, time_range: 'medium_term'});
  }).then(function(data) {
    TM = data.body.items
  })
  .then(function(data){
    return spotifyApi.getMyTopTracks({limit: 5, time_range: 'short_term'});
  })
  .then(function(data) {
    TS = data.body.items
  })
  .then(function(data){
    return spotifyApi.getMyTopTracks({limit: 5, time_range: 'long_term'});
  }).then(function(data) {
    TL = data.body.items
  })
  .then(function(data){
    return spotifyApi.getMe();
  })
  .then(function(data) {
    console.log('Retrieved data for ' + data.body['display_name']);
    dataa={
      name:data.body['display_name'],
      AL:AL,
      AM:AM,
      AS:AS,
      TL:TL,
      TM:TM,
      TS:TS
    }
    res.json(dataa)
  })
  .catch(function(err) {
    console.log('Something went wrong:', err.message);
  });
});

app.listen(6969)