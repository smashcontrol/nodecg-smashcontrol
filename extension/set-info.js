'use strict';
var nodecg = require('./nodecg-api-context').get();


const defaultSetObject = nodecg.Replicant('defaultSetObject', {defaultValue: {
		player1tag: '',
		player2tag: '',
		bracketlocation: ''
	}, persistent: false});

