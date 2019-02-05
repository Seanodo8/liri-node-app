require("dotenv").config();


var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require("moment");


var input = function(action, inputs) {
    switch (action) {
        case "concert-this":
            getConcert(inputs);
            break;
        case "spotify-this-song":
            getSpotify(inputs);
            break;
        case "movie-this":
            getMovie(inputs);
            break;
        case "do-what-it-says":
            doIt();
            break;
        default:
            console.log("I'm sorry, I don't understand that command.");
    };
};

function getConcert (artist) {
    console.log(artist);
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function(response) {
            var concerts = response.data;
            for (var i = 0; i < concerts.length; i++) {
                console.log("Venue: " + concerts[i].venue.name);
                console.log("Location: " + concerts[i].venue.city + ", " + concerts[i].venue.region + " " + concerts[i].venue.country);
                console.log("Date: " + moment(concerts[i].datetime.substring(0, 10), "YYYY-MM-DD").format("MM/DD/YYYY"));
                console.log("----------------------------------------");
            };
        });
};

function getArtistNames (artist) {
    return artist.name;
}

function getSpotify (songName) {
    var spotify = new Spotify(keys.spotify);

    if (!songName) { var songName = 'the sign' };
    spotify.search({ type: 'track', query: songName })
        .then(function(response) {
            var songs = response.tracks.items;
            for (var i = 0; i < songs.length; i++) {
                console.log('artist(s): ' + songs[i].artists.map(getArtistNames));
                console.log('song name: ' + songs[i].name);
                console.log('preview song: ' + songs[i].preview_url);
                console.log('album: ' + songs[i].album.name);
                console.log("----------------------------------------");
            };
        });
};

function getMovie (movieName) {
    if (!movieName) { var movieName = 'mr nobody' };
    axios.get('http://www.omdbapi.com/?apikey=trilogy&t=' + movieName)
        .then(function(response) {
            var movie = response.data;
            //console.log(movie);
            console.log('Title: ' + movie.Title);
            console.log('Year: ' + movie.Year);
            console.log('Rated: ' + movie.Rated);
            console.log('Rotten Tomatoe: ' + movie.Ratings[1].Value);
            console.log('Country: ' + movie.Country);
            console.log('Language: ' + movie.Language);
            console.log('Plot: ' + movie.Plot);
            console.log('Actors: ' + movie.Actors);
        });
};

function doIt() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) throw err;

        var dataArr = data.split(',');
        if (dataArr[0] === '') {
            console.log("The file does not contain a command.");
        } else {
            input(dataArr[0], dataArr[1]);
        };

    });
};

input(process.argv[2], process.argv[3]);