require('colors');
const smashgg = require('smashgg.js');

var nodecg = require('./nodecg-api-context').get();
var apiRepl = nodecg.Replicant("API-KEY");
var tourneyRepl = nodecg.Replicant("currentTournament");
var eventListRepl = nodecg.Replicant("eventList");

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
	smashgg.initialize(apiRepl.value);
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
