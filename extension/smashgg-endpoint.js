require('colors');
const smashgg = require('smashgg.js');

var nodecg = require('./nodecg-api-context').get();
var repl = nodecg.Replicant("API-KEY");

nodecg.listenFor('api-init', async (apiKey, ack) => {
	var message = await verify(apiKey);
	if(message === false){
		ack('API key invalid.', null);
	} else {
		ack(null, 'API key valid.');
		repl.value = apiKey;
		smashgg.initialize(apiKey); // checking the key with init only calls back if the key is 32-bit or not, doesn't check functionality
	}
});

async function verify(apiKey){
	// Checks if the given API key is valid by running it against a query to smash.gg's API.
	var test_query = 'query TestTournament($slug: String!){\n' +
		'  tournament(slug:$slug){\n' +
		'    name\n' +
		'  }\n' +
		'}'
	const testData = await fetch('https://api.smash.gg/gql/alpha', {
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + apiKey,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({query: test_query})
	})
	const result = await testData.json();
	return result.success; // in this query, success will be false only if the API key is invalid, undefined otherwise.
}
