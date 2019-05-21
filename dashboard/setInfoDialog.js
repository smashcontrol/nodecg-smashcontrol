var playerDataArray,
	dialog,
	defaultSetObject,
	playerDataInputsContainer,
	gameSelection,
	player1Character,
	player2Character;


var playerDataInputs = [
	{id: 'player1tag', placeholder: 'Player 1 Tag'},
	{id: 'player2tag', placeholder: 'Player 2 Tag'},
	{id: 'bracketlocation', placeholder: 'Bracket Location'},
	{id: 'player1character', placeholder: 'Player 1 Character'},
	{id: 'player2character', placeholder: 'Player 2 Character'},
	{id: 'game', placeholder: 'game'}
];


$(() => {
	dialog = nodecg.getDialog('set-info');
	playerDataArray = nodecg.Replicant('playerDataArray');
	defaultSetObject = nodecg.Replicant('defaultSetObject');
	defaultSetObject.value = {
			player1tag: '',
			bracketlocation: '',
			player2tag: '',
			player1character: 'Mario',
			player2character: 'Mario',
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
	NodeCG.waitForReplicants(gameSelection).then(() => {
		setDataCurrent["game"] = gameSelection.value;
	});
	for (var i=0; i < 5; i++){
		var value = setDataCurrent[playerDataInputs[i].id];
		//TODO player characters based on game selected
		switch(playerDataInputs[i].id){
			case "player1tag":
			case "player2tag":
			case "bracketlocation":
				var input = $(`<input title='${playerDataInputs[i].placeholder}' class='${playerDataInputs[i].id}' placeholder='${playerDataInputs[i].placeholder}'>`);
				break;

			case "player1character":
			case "player2character":
				var game = gameSelection.value;
				var input = constructCharacterDropdown(game, playerDataInputs[i].id);
				break;

			default:
				console.log("default", playerDataInputs[i].id);

		}
		input.val(value);
		playerDataInputsContainer.append(input);
	}
}

function saveInfo(){
	var setData = clone(setDataCurrent);

	for (var i=0; i < playerDataInputs.length; i++){
		var input = $(`.${[playerDataInputs[i].id]}`).val();
		if(typeof input === "undefined"){} else {
			setData[playerDataInputs[i].id] = input;
		}
	}

	playerDataArray.value = setData;
}


function constructCharacterDropdown(game, id_tag){
	var characters =  getCharacters(game);
	var index = $('<select />').attr("class", id_tag);
	characters.forEach(function(item){
		if(item !== "ROB"){
			var properName = item.match(/[A-Z][a-z]+|[A-Z]+/g).join(" ");
		} else {
			properName = "ROB";
		}
		$('<option />', {value: item, text: properName}).appendTo(index);
	});
	return index;
}


function getCharacters(game){
	var smash64 = ["Mario", "Luigi", "Yoshi", "Pikachu", "Fox", "Samus", "Falcon", "Jigglypuff", "Ness", "Kirby", "Link", "DonkeyKong"];

	var melee = smash64.concat(["Peach", "Bowser", "Marth", "Zelda", "Sheik", "Ganondorf", "Falco", "IceClimbers",
						"MrGameAndWatch", "DrMario", "YoungLink", "Mewtwo", "Roy"]);

	var brawl = melee.slice(0, -4).concat(["DiddyKong", "MetaKnight", "KingDedede", "ToonLink", "ZeroSuitSamus", "Charizard",
										"Lucario", "Lucas", "Ike", "Wario", "Pit", "Olimar", "ROB", "Sonic", "Snake",
										"Wolf", "PokemonTrainer", "Squirtle", "Ivysaur"]);

	var pm = brawl.concat(["Mewtwo", "Roy"]);

	var wiiu = brawl.slice(0, -5).concat(["DrMario", "Mewtwo", "Roy", "Rosalina", "Alph", "BowserJr", "RoyKoopa", "Wendy", "Iggy", "Lemmy", "Morton", "Ludwig", "Larry", "Greninja",
										"Lucina", "CorrinFemale", "CorrinMale", "Robin", "Palutena", "DarkPit", "VillagerMale", "VillagerFemale",
										"WiiFitMale", "WiiFitFemale", "LittleMac", "DuckHunt", "Shulk", "MegaMan", "PacMan", "Ryu", "Cloud", "Bayonetta", "Mii"]);

	wiiu = wiiu.filter(function (item) {
		return item !== "IceClimbers";
	});

	var ultimate = wiiu.slice(0, -1).concat(["IceClimbers", "DrMario", "YoungLink", "Snake", "Wolf", "PokemonTrainerMale", "PokemonTrainerFemale", "Squirtle",
							"Ivysaur", "Daisy", "PiranhaPlant", "KingK.Rool", "Ridley", "DarkSamus", "Incineroar",
							"Chrom", "Isabelle", "InklingBoy", "InklingGirl", "Ken", "Simon", "Richter", "Joker", "MiiGunner",
							"MiiSwordfighter", "MiiBrawler"]);
	switch(game){
		case "ssb64":
			return smash64.sort();
		case "ssbm":
			return melee.sort();
		case "ssbb":
			return brawl.sort();
		case "ssbpm":
			return pm.sort();
		case "ssb4":
			return wiiu.sort();
		case "ssbult":
			return ultimate.sort();
	}
}

