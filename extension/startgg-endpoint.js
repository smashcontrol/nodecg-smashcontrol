var fetch = require('node-fetch');
const startgg = require('./startgg-helpers.js');

var nodecg = require('./nodecg-api-context').get();
var apiRepl = nodecg.Replicant("API-KEY");
var tourneyRepl = nodecg.Replicant("currentTournament");
var eventListRepl = nodecg.Replicant("eventList");
var streamQueueRepl = nodecg.Replicant("streamQueue");


nodecg.listenFor('api-init', async (apiKey, ack) => {
	// Checking the API key with startgg.initalize() doesn't check if it's functional, just that it's 32-bit.
	var message = await verify(apiKey);
	if(message === false){
		ack('API key invalid.', null);
	} else {
		ack(null, 'API key valid.');
		apiRepl.value = apiKey;
	}
});

nodecg.listenFor('url-import', async(url, ack) =>{
	if(apiRepl.value){ // check for API key before doing anything
		var imported = await tourneyImport(url);
		if(imported === null){
			ack("Tournament not found.", null)
		} else {
			tourneyRepl.value = imported;
			ack(null, imported.name + " imported.");
		}
	} else{
		ack('Please import your API Key in the \'4. Settings\' tab before using this.', null);
	}
});

nodecg.listenFor('queue-import', async(event, ack) => {
	var queue = await loadStreamQueue();
	if(queue.length === 0){
		ack("Stream queue is empty.", null)
	} else {
		ack(null, queue);
	}
});

async function verify(apiKey){
	// Checks if the given API key is valid by running it against a quick query to smash.gg's API.
	var test_query = 'query TestTournament($slug: String!){\n' +
		'  tournament(slug:$slug){\n' +
		'    name\n' +
		'  }\n' +
		'}';
	const testData = await fetch('https://api.start.gg/gql/alpha', {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + apiKey,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({query: test_query})
	});
	const result = await testData.json();
	return result.success; // in this query, success will be false only if the API key is invalid, undefined otherwise.
}

async function tourneyImport(url){
	const shortSlug = startgg.getTourneySlugFromURL(url);
	try{
		var tourn = await startgg.getTournament(shortSlug);
		var allEvents = await startgg.getTournamentEvents(shortSlug);
		eventListRepl.value = allEvents;
	} catch (err) {
		console.log(err);
		// If no tourney can be found, just return null and finish.
		return null;
	}
	return tourn;
}

async function loadStreamQueue(){
	var queue = [];
	try{
		var streamQueue = await getStreamQueue(tourneyRepl.value.slug.split('/')[1]);
	} catch {
		return queue;
	}
	for(var i in streamQueue){
		var stream = streamQueue[i];
		for(var j in stream.sets){
			var set = stream.sets[j];
			try{
				// The "tag" will be null if there's nobody in the slot yet, so check it and put in TBD if so.
				var player1Tag = set.slots[0].entrant.name;
				try{
					var player1pronouns = set.slots[0].entrant.participants[0].player.user.genderPronoun;
				}
				catch{
					var player1pronouns = '';
				}
			} catch {
				var player1Tag = "TBD";
			}
			try{
				var player2Tag = set.slots[1].entrant.name;
				try{
					var player2pronouns = set.slots[1].entrant.participants[0].player.user.genderPronoun;
				}
				catch{
					var player2pronouns = '';
				}
			} catch {
				var player2Tag = "TBD";
			}
			// set.fullRoundText returns things like "Winner's Semi-Final" in pools,
			// TODO possibly make this more accurate based on pool status?
			queue.push([stream.stream.streamName, player1Tag, player1pronouns, player2Tag, player2pronouns, set.fullRoundText]);
		}
	}
	streamQueueRepl.value = queue;
	return queue;
}

async function getStreamQueue(shortSlug){
	var streamQueue =
	`query StreamQueueOnTournament($tourneySlug: String!) {
		tournament(slug: $tourneySlug) {
		  streamQueue {
			stream {
			  streamName
			}
			sets {
			  fullRoundText
			slots{
				entrant{
				  name
				  participants{
					player{
					  user{
						genderPronoun
					  }
					}
				  }
				}
			  }
			}
		  }
		}
	  }`
	console.log('Getting stream queue for tournament %s', shortSlug);
	const streamQueueData = await fetch('https://api.start.gg/gql/alpha', {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + apiRepl.value,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({query: streamQueue, variables: {"tourneySlug": shortSlug}})
	});
	const result = await streamQueueData.json();
	try{
		return result.data.tournament.streamQueue;
	} catch (err) {
		return [];
	}
	
}

