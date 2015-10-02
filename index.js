"use strict";

var request = require('request'),
    cheerio = require('cheerio');


// The keys we gotta grab, index:key
var keys = {
    0: "sID",
    1: "episode",
    2: "title",
    5: "airdate"
};

module.exports = (req) => new Promise((resolve, reject) => {

    request(req, (err, res, body) => {

        if (err)
            return reject(err);

        var $ = cheerio.load(body);

        // Get the section with all the data
        var section = $('#Episodes').parent();

        var seasons = getSeasons($, section);
        var tables = getTables($, section);

        var response = {};

        // set the serie name;
        response.title = $('h1').find('i').text();
        response.episodes = [];

        tables.each((t, table) => {
            // get all episodes from the season
            response.episodes = response.episodes.concat(getEpisodes($, table, seasons[t]));
        });

        return resolve(response);
    });
});

function getSeasons($, section) {

    // Get the headings
    var headings = $(section).nextUntil('h2', 'h3');

    // All the seasons
    var seasons = [];

    headings.each((i, heading) => {
        // Get the full name
        var name = $(heading).find('.mw-headline').text();

        // find the number
        var res = /(?:Season|Series)\ ([\d])/.exec(name);
        var number = res[1];

        seasons.push(number);
    });

    return seasons;
}

function getTables($, section) {
    // get all data tables
    var tables = $(section).nextUntil('h2', 'table');
    return tables;
}

function getEpisodes($, table, season) {

    var episodes = [];

    // loop the rows;
    $(table).children().each((i, row) => {

        // if its the heading we skip it
        if (i === 0) return true;

        // current episode
        var episode = {};
        $(row).children().each((j, data) => {

            // If its the description we skip it
            if ($(data).hasClass('description')) return true;

            // remove reference links
            $(data).find('.reference').empty();

            // save the keys
            if (keys[j])
                episode[keys[j]] = $(data).text();

        });

        // if the object isnt empty
        if (Object.keys(episode).length > 0) {

            // create the name
            var name = genName(season, episode.episode);

            // save the season in the object
            episode.season = season;

            // fix the airdate to YYYY/MM/DD
            episode.airdate = fixDate(episode.airdate);

            // save the name in the object
            episode.key = name;

            // add the episode into the list
            episodes.push(episode);

        }

    });

    return episodes;
}

function genName(season, episode) {
    var name = "S" + ((season < 10 ? "0" : "") + season);
    name += "E" + ((episode < 10 ? "0" : "") + episode);
    return name;
}

function fixDate(date) {
    var res = /\(([^\)]*)\)/.exec(date);
    if (!res || !res[1])
        return "N/A";
    return res[1].split("-").join("/");
}

