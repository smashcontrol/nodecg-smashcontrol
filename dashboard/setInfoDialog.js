var playerDataArray,
	dialog,
	defaultSetObject,
	playerDataInputContainer;


var playerDataInputs = [
	{id: 'player1tag', placeholder: 'Player 1 Tag'},
	//{id: 'player1character', placeholder: 'Player 1 Character'},
	//{id: 'player1score', placeholder: 'Player 1 Score'},
	{id: 'player2tag', placeholder: 'Player 2 Tag'},
	//{id: 'player2score', placeholder: 'Player 2 Score'},
	//{id: 'player2character', placeholder: 'Player 2 Character'},
	{id: 'bracketlocation', placeholder: 'Bracket Location'}
]


$(() => {
	dialog = nodecg.getDialog('set-info');
	playerDataArray = nodecg.Replicant('playerDataArray');
	defaultSetObject = nodecg.Replicant('defaultSetObject');
	defaultSetObject.value = {
			player1tag: '',
			player2tag: '',
			bracketlocation: ''
		};
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
	for (var i=0; i < playerDataInputs.length; i++){
		var value = setDataCurrent[playerDataInputs[i].id];
		var input = $(`<input title='${playerDataInputs[i].placeholder}' class='${playerDataInputs[i].id}' placeholder='${playerDataInputs[i].placeholder}'>`);
		input.val(value);
		playerDataInputsContainer.append(input);
	}
}

function saveInfo(){
	setData = clone(setDataCurrent);
	for (var i=0; i < playerDataInputs.length; i++){
		var input = $(`.${[playerDataInputs[i].id]}`).val();
		setData[playerDataInputs[i].id] = input;
	}
	playerDataArray.value = setData;

}
