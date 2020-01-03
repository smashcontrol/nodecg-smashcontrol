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

	// This checks if there are any other /'s in the path, like /ceo2016/events/melee-singles, we only need ceo2016
	var additionalSlash = url.pathname.slice(1).indexOf('/');
	if(additionalSlash !== -1){  // If there is an additional slash, trim the rest of the path to not include it
		var shortSlug = url.pathname.slice(1, additionalSlash+1);
	} else{
		var shortSlug = url.pathname.slice(1);  // Trims the leading slash, pathname of /ceo2016 --> ceo2016
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
				var attendees = await pullAttendees(event);
				attendees.forEach(function(data){
					allAttendees[data[0]] = data[1]
				});
			}
		}
		attendeeRepl.value = allAttendees;
		eventListRepl.value = allEvents;
	} catch (err) {
		return null;
	}
	return tourn;
}

/*  This is used as a workaround for the Stream Queue sets not having the tags in them until after a score is reported.
	Making a dict of attendeeId's to attendeeTags is the best way to workaround this, because the sets show the
	attendeeId.
 */
async function pullAttendees(event){
	var attendees = [];
	var allAttendees = await event.getAttendees();
	for(var i in allAttendees){
		var playerId = allAttendees[i].id;
		var playerTag = allAttendees[i].gamerTag;
		if(!attendees.includes([playerId, playerTag])){
			attendees.push([playerId, playerTag]);
		}
	}
	return attendees;
}

async function loadStreamQueue(){
	init();
	var queue = [];
	var attendees = attendeeRepl.value;
	var streamQueue = await smashgg.StreamQueue.get(tourneyRepl.value.id);
	for(var i in streamQueue){
		var stream = streamQueue[i];
		for(var j in stream.sets){
			var set = stream.sets[j];
			var player1Tag = getTag(set.player1.attendeeIds, attendees);
			var player2Tag = getTag(set.player2.attendeeIds, attendees);
			queue.push([stream.stream.streamName, player1Tag, player2Tag, set.getFullRoundText()]);
		}
	}
	streamQueueRepl.value = queue;
	return queue;
}

function getTag(idArray, attendees){
	var tag;
	if(idArray.length > 1){
		for(var i in idArray.length){
			tag += attendees[idArray[i]] + " & ";
		}
		tag = tag.slice(0,-3); //Remove the last " & "
	} else{
		tag = attendees[idArray[0]];
	}
	if(tag === undefined){
		// in a majority of instances, an undefined tag means there's no opponent yet.
		tag = "TBD"
	}
	return tag;
}
