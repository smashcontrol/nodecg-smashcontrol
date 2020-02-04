require('colors');
const smashgg = require('smashgg.js');

var nodecg = require('./nodecg-api-context').get();
var apiRepl = nodecg.Replicant("API-KEY");
var tourneyRepl = nodecg.Replicant("currentTournament");
var eventListRepl = nodecg.Replicant("eventList");
var attendeeRepl = nodecg.Replicant("attendees");
var streamQueueRepl = nodecg.Replicant("streamQueue");

function init(){
	smashgg.initialize(apiRepl.value);
}

nodecg.listenFor('api-init', async (apiKey, ack) => {
	var message = await verify(apiKey); // checking the key with init only calls back if the key is 32-bit or not, doesn't check functionality
	if(message === false){
		ack('API key invalid.', null);
	} else {
		ack(null, 'API key valid.');
		apiRepl.value = apiKey;
	}
});

nodecg.listenFor('url-import', async(url, ack) =>{
	try {
		var tourneyUrl = new URL(url);
	} catch(err){
		ack("Please enter a full URL, including the \'https://\'.", null);
		return;
	}
	if(apiRepl.value){ // check for API key before doing anything
		var imported = await tourneyImport(tourneyUrl);
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
	// Checks if the given API key is valid by running it against a query to smash.gg's API.
	var test_query = 'query TestTournament($slug: String!){\n' +
		'  tournament(slug:$slug){\n' +
		'    name\n' +
		'  }\n' +
		'}';
	const testData = await fetch('https://api.smash.gg/gql/alpha', {
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
	init();
	const Tournament = smashgg.Tournament;

	// This pulls out the slug for importing a tourney.
	var slugSlice = url.pathname.slice(1).indexOf('/');
	var shortSlug = url.pathname.slice(1, slugSlice+1);
	if(shortSlug === "tournament"){
		// Tournaments can be imported as https://smash.gg/{tourneyName} or https://smash.gg/tournament/{tourneyName}
		// But can only be used in this function (conveniently, at least) as just tourneyName.
		var newSlice = url.pathname.slice(1).indexOf('/', url.pathname.slice(1).indexOf('/')+1);
		shortSlug = url.pathname.slice(slugSlice+2, newSlice+1);
	}
	try{
		var tourn = await Tournament.get(shortSlug);
		var realSlug = tourn.getSlug();  // shortSlug needs to be converted to the full value, /ceo2016 --> /tournament/ceo-2016
		tourn = await Tournament.get(realSlug);
		var phases = await tourn.getPhases();
		var allEvents = {};
		var allAttendees = {};
		for(var i=0; i < phases.length; i++){
			if(allEvents[phases[i].eventId] === undefined){
				var event = await smashgg.Event.getById(phases[i].eventId);
				allEvents[phases[i].eventId] = await event.getName();
			}
		}
		eventListRepl.value = allEvents;
	} catch (err) {
		return null;
	}
	return tourn;
}

async function loadStreamQueue(){
	init();
	var queue = [];
	var streamQueue = await getStreamQueue(tourneyRepl.value.slug);
	for(var i in streamQueue){
		var stream = streamQueue[i];
		for(var j in stream.sets){
			var set = stream.sets[j];
			try{
				var player1Tag = set.slots[0].entrant.name;
			} catch {
				var player1Tag = "TBD";
			}
			try{
				var player2Tag = set.slots[1].entrant.name;
			} catch {
				var player2Tag = "TBD";
			}
			queue.push([stream.stream.streamName, player1Tag, player2Tag, set.fullRoundText]);
		}
	}
	streamQueueRepl.value = queue;
	return queue;
}

async function getStreamQueue(tourneyName){
	// smashgg.js shows null tags in the stream queue, so use a custom query.
	var streamQueue = 'query StreamQueueOnTournament($tourneySlug: String!) {\n' +
		'  tournament(slug: $tourneySlug) {\n' +
		'    streamQueue {\n' +
		'      stream {\n' +
		'        streamName\n' +
		'      }\n' +
		'      sets {\n' +
		'        fullRoundText\n' +
		'      \tslots{\n' +
		'          entrant{\n' +
		'            name\n' +
		'          }\n' +
		'        }\n' +
		'      }\n' +
		'    }\n' +
		'  }\n' +
		'}\n'
	console.log('Getting stream queue for tournament %s', tourneyName);
	const streamQueueData = await fetch('https://api.smash.gg/gql/alpha', {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + apiRepl.value,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({query: streamQueue, variables: {"tourneySlug": tourneyName}})
	});
	const result = await streamQueueData.json();
	return result.data.tournament.streamQueue;
}

