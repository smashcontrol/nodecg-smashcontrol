var playerDataArray,
	dialog,
	defaultSetObject,
	playerDataInputContainer,
	gameSelection;


var playerDataInputs = [
	{id: 'player1tag', placeholder: 'Player 1 Tag'},
	{id: 'player2tag', placeholder: 'Player 2 Tag'},
	{id: 'bracketlocation', placeholder: 'Bracket Location'},
	{id: 'player1character', placeholder: 'Player 1 Character'},
	{id: 'player2character', placeholder: 'Player 2 Character'},
	{id: 'game', placeholder: 'game'}
]


$(() => {
	dialog = nodecg.getDialog('set-info');
	playerDataArray = nodecg.Replicant('playerDataArray');
	defaultSetObject = nodecg.Replicant('defaultSetObject');
	defaultSetObject.value = {
			player1tag: '',
			bracketlocation: '',
			player2tag: '',
			player1character: 'images/ssb64/Mario.png',
			player2character: 'images/ssb64/Mario.png',
			game: 'ssb64'
		};
	gameSelection = nodecg.Replicant('gameSelection');
	player1Character = nodecg.Replicant('player1Character');
	player2Character = nodecg.Replicant('player2Character');
	playerDataInputsContainer = $('#playerDataInputs');

	document.addEventListener('dialog-confirmed', () => {
		saveInfo();
		playerDataInputsContainer.empty();
	});
	document.addEventListener('dialog-dismissed', () => {
		playerDataInputsContainer.empty();
	});
});

function loadInfo(){
	if(playerDataArray.value.length === 0 || typeof playerDataArray.value === "undefined"){
		setDataCurrent = clone(defaultSetObject.value);
	}
	else{ setDataCurrent = playerDataArray.value;}
	//To reset to default, uncomment, run + save, recomment
	//setDataCurrent = clone(defaultSetObject.value);
	for (var i=0; i < 3; i++){
		var value = setDataCurrent[playerDataInputs[i].id];
		//TODO player characters based on game selected
		switch(playerDataInputs[i].id){
			case "player1tag":
			case "player2tag":
			case "bracketlocation":
				var input = $(`<input title='${playerDataInputs[i].placeholder}' class='${playerDataInputs[i].id}' placeholder='${playerDataInputs[i].placeholder}'>`);
			/*case "player1character":
			case "player2character":*/
			default:

		}
		input.val(value);
		playerDataInputsContainer.append(input);
	}
}

function saveInfo(){
	setData = clone(setDataCurrent);
	for (var i=0; i < playerDataInputs.length; i++){
		var input = $(`.${[playerDataInputs[i].id]}`).val();
		if(typeof input === "undefined"){
			continue;
		} else {
			setData[playerDataInputs[i].id] = input;
		}
	}
	playerDataArray.value = setData;

}
