if(process.version[2] >= 8){
    var fetch = require('node-fetch');
}
var nodecg = require('./nodecg-api-context').get();
var apiRepl = nodecg.Replicant("API-KEY");

module.exports = {
    getTourneySlugFromURL: (url) => {
        // Extract something like "ceo-2016" from https://smash.gg/tournament/ceo-2016/
        // This is over-engineered but it /should/ be foolproof
        console.log(process.version[2]);
        if(!url.includes("http")){
            //ex: smash.gg/tournament/ceo-2016
            slugIndex = 2;
            if(url.split("/")[1] !== "tournament"){
                //ex: smash.gg/ceo-2016
                slugIndex = 1;
            }
        }
        else if(url.split("/")[2] !== "tournament"){
            //ex: https://smash.gg/ceo-2016
            slugIndex = 3;
            if(url.split("/")[3] === "tournament"){
                //ex: https://smash.gg/tournament/ceo-2016
                slugIndex = 4;
            }
        }
        return url.split("/")[slugIndex];
    },

    async getTournament (shortSlug) {
        var tournament = 
        `query Tournament($slug:String!){
            tournament(slug:$slug){
              name
              slug
            }
          }`;
        const tournamentData = await fetch('https://api.smash.gg/gql/alpha', {
        method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + apiRepl.value,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({query: tournament, variables: {"slug": shortSlug}})
        });
        const result = await tournamentData.json();
        return result.data.tournament;
    },

    async getTournamentEvents(shortSlug) {
        const tournament_event_query = 
            `query TournamentEvents($slug: String!){
                tournament(slug: $slug) {
                    events {
                        id
                        name
                    }
                }
            }`;

        const event = await fetch('https://api.smash.gg/gql/alpha', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + apiRepl.value,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({query: tournament_event_query, variables: {"slug": shortSlug}})
        });
        const event_json = await event.json();
        return event_json.data.tournament.events;
    }
}