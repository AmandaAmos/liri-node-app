//code to read and set environment variables
require("dotenv").config();
//code required to import "keys.js" file and then store it in a variable
var keys = require("./keys.js");
//code to require spotify api
var Spotify = require("node-spotify-api");
//code to require moment
var moment = require("moment");
//code to utilize axios
var axios = require("axios");
//code to require fs for reading and writing text files
var fs = require("fs");
//code to access spotify keys
var spotify = new Spotify(keys.spotify);
//code to read user commant
var userInput = process.argv[2];
//code to read user query
var searchTerm = process.argv.slice(3).join("+").toLowerCase();

if (userInput === "concert-this") {
    axios
        .get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id")
        .then(function (response) {
            if (response.data.length === 0) {
                ("I'm sorry. I was unable to find results for this performer or band.");
            } else {
                var eventNumber = 1;
                for (var i = 0; i < response.data.length; i++) {
                    var eventData = [
                        ("_______________________________"),
                        ("Event Number: " + eventNumber),
                        ("Venue name: " + response.data[i].venue.name),
                        ("Venue Location: " + response.data[i].venue.city),
                        ("Date of the Event: " + moment(response.data[i].datetime).format('MMMM Do YYYY, h:mm:ss a')),
                        ("\n")
                    ].join("\n\n");
                    fs.appendFile("log.txt", eventData, function (err) {
                        if (err) throw err;
                    });
                    console.log(eventData);
                    eventNumber++
                }
            }
        })
} else if (userInput === "spotify-this-song") {
    if (!searchTerm) {
        searchTerm = "Zombie by The Cranberries";
    }
    spotify.search({
            type: 'track',
            query: searchTerm
        })
        .then(function (response) {
            var songCounter = 1;
            for (var i = 0; i < response.tracks.items.length; i++) {
                var songData = [
                    ("--------------------------------"),
                    ("Song Number: " + songCounter),
                    ("Artist: " + response.tracks.items[i].artists[0].name),
                    ("Song Name: " + response.tracks.items[i].name),
                    ("This is the preview link from Spotify: " + response.tracks.items[i].preview_url),
                    ("The album this song is from " + response.tracks.items[i].album.name),
                    ("_________________________________")
                    ("\n")
                ].join("\n\n");
                fs.appendFile("log.txt", songData, function (err) {
                    if (err) throw err;
                });
                console.log(songData);
                songCounter++
            }
        })
        .catch(function (error) {
            (error);
        });
} else if (userInput === "movie-this") {
    if (searchTerm === "") {
        searchTerm = "Mr. Nobody"
    }
    axios
        .get("http://www.omdbapi.com/?t=" + searchTerm + "&apikey=trilogy")
        .then(function (response) {
            if (response.data.length === 0) {
                ("I'm sorry, I was unable to find results for this movie.");
            } else {
                var movieData = [
                    ("_________________________________________________"),
                    ("Movie Title: " + response.data.Title),
                    ("Year Released: " + response.data.Year),
                    ("IMDB rating: " + response.data.imdbRating),
                    (response.data.Ratings[1].Source + " gave this movie a " + response.data.Ratings[1].Value + " rating."),
                    ("Country Produced: " + response.data.Country),
                    ("Language/s: " + response.data.Language),
                    ("Plot: " + response.data.Plot),
                    ("Main Actors/Actresses: " + response.data.Actors),
                    ("-------------------------------------------------------------")
                ].join("\n\n");
                fs.appendFile("log.txt", movieData, function (err) {
                    if (err) throw err;
                    console.log(movieData);
                });
            };
        });
} else {
    ("No input detected, pulling random search...");
    fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return (error);
            }
            //put content of random.txt in an array
            var dataArr = data.split(",");
            var userInput = dataArr[0];
            var searchTerm = dataArr[1].replace(/\"/g, "")

            if (userInput === "spotify-this-song") {
                spotify.search({
                        type: 'track',
                        query: searchTerm
                    })
                    .then(function (response) {
                            var songCounter = 1;
                            for (var i = 0; i < response.tracks.items.length; i++) {
                                var songData = [
                                    
                                        ("--------------------------------"),
                                        ("Song Number: " + songCounter),
                                        ("Artist: " + response.tracks.items[i].artists[0].name),
                                        ("Song Name: " + response.tracks.items[i].name),
                                        ("This is the preview link from Spotify: " + response.tracks.items[i].preview_url),
                                        ("The album this song is from " + response.tracks.items[i].album.name),
                                        ("_________________________________")
                                        ("\n")
                                    ].join("\n\n");
                                    fs.appendFile("log.txt", songData, function (err) {
                                        if (err) throw err;
                                    });
                                    console.log(songData);
                                    songCounter++
                                }
                            })
                        .catch(function (error) {
                            (error);
                        });
                    }
                else {
                    ("What did you input?!!?!?!")
                };

            
        });
};
