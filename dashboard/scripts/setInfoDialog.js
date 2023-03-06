var playerDataArray,
	dialog,
	defaultSetObject,
	playerDataInputsContainer,
	gameSelection,
	player1Character,
	player2Character;


var playerDataInputs = [
	{id: 'player1tag', placeholder: 'Player 1 Tag', grid: '.player1'},
	{id: 'player1pronouns', placeholder: 'Player 1 Pronouns', grid: '.player1'},
	{id: 'player1character', placeholder: 'Player 1 Character', grid: '.player1'},
	{id: 'player1port', placeholder: 'Player 1 Port', grid: '.player1'},
	{id: 'player2tag', placeholder: 'Player 2 Tag', grid: '.player2'},
	{id: 'player2pronouns', placeholder: 'Player 2 Pronouns', grid: '.player2'},
	{id: 'player2character', placeholder: 'Player 2 Character', grid: '.player2'},
	{id: 'player2port', placeholder: 'Player 2 Port', grid: '.player2'},
	{id: 'bracketlocation', placeholder: 'Bracket Location', grid: '.others'},
	{id: 'commentator1', placeholder: 'Commentator 1', grid: '.others'},
	{id: 'commentator1pronouns', placeholder: 'Commentator 1 Pronouns', grid: '.others'},
	{id: 'commentator2', placeholder: 'Commentator 2', grid: '.others'},
	{id: 'commentator2pronouns', placeholder: 'Commentator 2 Pronouns', grid: '.others'},
	{id: 'game', placeholder: 'game'},
];


$(() => {
	dialog = nodecg.getDialog('set-info');
	playerDataArray = nodecg.Replicant('playerDataArray');
	defaultSetObject = nodecg.Replicant('defaultSetObject');
	defaultSetObject.value = {
			player1tag: '',
			player1pronouns: '',
			player1port: 1,
			player2tag: '',
			player2pronouns: '',
			player2port: 1,
			bracketlocation: '',
			player1character: 'Mario',
			player2character: 'Mario',
			commentator1: '',
			commentator1pronouns: '',
			commentator2: '',
			commentator2pronouns: '',
			game: 'ssb64',
		};
	gameSelection = nodecg.Replicant('gameSelection');
	player1Character = nodecg.Replicant('player1Character');
	player2Character = nodecg.Replicant('player2Character');

	document.addEventListener('dialog-confirmed', () => {
		saveInfo();
		$('.player1').empty();
		$('.player2').empty();
		$('.others').empty();
	});
	document.addEventListener('dialog-dismissed', () => {
		$('.player1').empty();
		$('.player2').empty();
		$('.others').empty();
	});

});

function loadInfo(){
	// Put all of the fields onto the dialog box.
	setDataCurrent = clone(defaultSetObject.value);
	if(playerDataArray.value != undefined && playerDataArray.value != ''){
		setDataCurrent = playerDataArray.value;
	}
	NodeCG.waitForReplicants(gameSelection).then(() => {
		setDataCurrent["game"] = gameSelection.value;
	});
	for (var i=0; i < playerDataInputs.length-1; i++){
		// Dynamically generate the dialog box based on the inputs. Cases will need to be modified if any further inputs added.
		var value = setDataCurrent[playerDataInputs[i].id];
		switch(playerDataInputs[i].id){
			case "player1tag":
			case "player1pronouns":
			case "player2tag":
			case "player2pronouns":
			case "bracketlocation":
			case "commentator1":
			case "commentator1pronouns":
			case "commentator2":
			case "commentator2pronouns":
				// These fields just need a text input box.
				var input = $(`<input title='${playerDataInputs[i].placeholder}' class='${playerDataInputs[i].id}''></input>`);
				break;

			case "player1character":
			case "player2character":
				// Make the dropdown for characters based on the current game.
				var game = gameSelection.value;
				var input = constructCharacterDropdown(game, playerDataInputs[i].id);
				break;
			case "player1port":
			case "player2port":
				var input = $(`<select class='${playerDataInputs[i].id}'><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select>`);
				break;
			default:
				// Anything not covered by these cases will be printed to the console and not generated.
				console.log("default", playerDataInputs[i].id);

		}
		input.val(value);
		$(`${playerDataInputs[i].grid}`).append(playerDataInputs[i].placeholder + ":<br>");
		$(`${playerDataInputs[i].grid}`).append(input);
		$(`${playerDataInputs[i].grid}`).append("<br>");
	}
}

function saveInfo(){
	// Save the result of the dialog to a replicant, to access later.
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
	// Generate HTML for a dropdown of characters to put in the dialog box.
	var characters =  getCharacters(game);
	var index = $('<select />').attr("class", id_tag);
	characters.forEach(function(item){
		if(item !== "ROB"){
			// Put spaces between the capital letters to avoid CapitalCased names in the dropdown, except ROB.
			var properName = item.match(/[A-Z][a-z]+|[A-Z]+/g).join(" ");
		} else {
			properName = "ROB";
		}
		$('<option />', {value: item, text: properName}).appendTo(index);
	});
	return index;
}


function getCharacters(game){
	// Return a list of all of the character's names per game. Slices are to take out the cut characters.
	var smash64 = ["Mario", "Luigi", "Yoshi", "Pikachu", "Fox", "Samus", "Falcon", "Jigglypuff", "Ness", "Kirby", "Link", "DonkeyKong", "[REMIX] Bowser",
					"[REMIX] Dr. Mario", "[REMIX] Sheik", "[REMIX] Young Link", "[REMIX] Ganondorf", "[REMIX] Dark Samus", "[REMIX] King Dedede", "[REMIX] Falco",
					"[REMIX] Wolf", "[REMIX] Mewtwo", "[REMIX] Lucas", "[REMIX] Marth", "[REMIX] Wario", "[REMIX] Sonic", "[REMIX] Conker", "[REMIX] Marina"];

	var melee = smash64.slice(0, 11).concat(["Peach", "Bowser", "Marth", "Zelda", "Sheik", "Ganondorf", "Falco", "IceClimbers",
						"MrGameAndWatch", "DrMario", "YoungLink", "Mewtwo", "Roy"]);

	// Remove Dr. Mario, Young Link, Mewtwo, Roy
	var brawl = melee.slice(0, -4).concat(["DiddyKong", "MetaKnight", "KingDedede", "ToonLink", "ZeroSuitSamus", "Charizard",
										"Lucario", "Lucas", "Ike", "Wario", "Pit", "Olimar", "ROB", "Sonic", "Snake",
										"Wolf", "PokemonTrainer", "Squirtle", "Ivysaur"]);

	var pm = brawl.concat(["Mewtwo", "Roy"]);

	// Remove Snake, Wolf, PT, Squirtle, Ivysaur
	var wiiu = brawl.slice(0, -5).concat(["DrMario", "Mewtwo", "Roy", "Rosalina", "BowserJr", "RoyKoopa", "Wendy", "Iggy", "Lemmy", "Morton", "Ludwig", "Larry", "Greninja",
										"Lucina", "CorrinFemale", "CorrinMale", "RobinFemale", "RobinMale", "Palutena", "DarkPit", "VillagerMale", "VillagerFemale",
										"WiiFitMale", "WiiFitFemale", "LittleMac", "DuckHunt", "Shulk", "MegaMan", "PacMan", "Ryu", "Cloud", "Bayonetta", "Mii"]);

	wiiu = wiiu.filter(function (item) {
		// Can't remove IC's easily with slicing
		return item !== "IceClimbers";
	});

	// Remove "Mii", instead use brawler/gunner/swordfighter
	var ultimate = wiiu.slice(0, -1).concat(["IceClimbers", "YoungLink", "Snake", "Wolf", "PokemonTrainerMale", "PokemonTrainerFemale", "Squirtle",
							"Ivysaur", "Daisy", "PiranhaPlant", "KingK.Rool", "Pichu", "Ridley", "DarkSamus", "Incineroar",
							"Chrom", "Isabelle", "InklingBoy", "InklingGirl", "Ken", "Simon", "Richter", "Joker", "MiiGunner",
							"MiiSwordfighter", "MiiBrawler", "Banjo&Kazooie", "Hero", "Terry", "BylethMale", "BylethFemale", "MinMin", "Steve", 
							"Alex", "Zombie", "Enderman", "Sephiroth", "PyraMythra", "Kazuya", "Sora"]);
	switch(game){
		// Sort the lists so they look decent in the dropdown.
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

