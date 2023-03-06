var top8Array,
    top8Data,
    defaultTop8Array,
    top8InputsContainer,
    gameSelection;

var top8Inputs = [
	{id: '1tag', placeholder: '1st Place Tag', grid: '.place_1'},
	{id: '1main', placeholder: '1st Place Main', grid: '.place_1'},
	{id: '1secondary', placeholder: '1st Place Secondary', grid: '.place_1'},

	{id: '2tag', placeholder: '2nd Place Tag', grid: '.place_2'},
	{id: '2main', placeholder: '2nd Place Main', grid: '.place_2'},
	{id: '2secondary', placeholder: '2nd Place Secondary', grid: '.place_2'},

    {id: '3tag', placeholder: '3rd Place Tag', grid: '.place_3'},
	{id: '3main', placeholder: '3rd Place Main', grid: '.place_3'},
	{id: '3secondary', placeholder: '3rd Place Secondary', grid: '.place_3'},

    {id: '4tag', placeholder: '4th Place Tag', grid: '.place_4'},
	{id: '4main', placeholder: '4th Place Main', grid: '.place_4'},
	{id: '4asecondary', placeholder: '4th Place Secondary', grid: '.place_4'},

    {id: '5atag', placeholder: '5th Place Tag', grid: '.place_5a'},
	{id: '5amain', placeholder: '5th Place Main', grid: '.place_5a'},
	{id: '5asecondary', placeholder: '5th Place Secondary', grid: '.place_5a'},

    {id: '5btag', placeholder: '5th Place Tag', grid: '.place_5b'},
	{id: '5bmain', placeholder: '5th Place Main', grid: '.place_5b'},
	{id: '5bsecondary', placeholder: '5th Place Secondary', grid: '.place_5b'},

    {id: '7atag', placeholder: '7th Place Tag', grid: '.place_7a'},
	{id: '7amain', placeholder: '7th Place Main', grid: '.place_7a'},
	{id: '7asecondary', placeholder: '7th Place Secondary', grid: '.place_7a'},

    {id: '7btag', placeholder: '7th Place Tag', grid: '.place_7b'},
	{id: '7bmain', placeholder: '7th Place Main', grid: '.place_7b'},
	{id: '7bsecondary', placeholder: '7th Place Secondary', grid: '.place_7b'},
];




$(() => {
    top8Array = nodecg.Replicant('top8Array');
    defaultTop8Array = nodecg.Replicant('defaultTop8Array');
    defaultTop8Array.value = {
        "1tag": '',
        "1main": '',
        "1secondary": '',

        "2tag": '',
        "2main": '',
        "2secondary": '',

        "3tag": '',
        "3main": '',
        "3secondary": '',

        "4tag": '',
        "4main": '',
        "4secondary": '',

        "5atag": '',
        "5amain": '',
        "5asecondary": '',

        "5btag": '',
        "5bmain": '',
        "5bsecondary": '',

        "7atag": '',
        "7amain": '',
        "7asecondary": '',

        "7btag": '',
        "7bmain": '',
        "7bsecondary": '',
    };
    gameSelection = nodecg.Replicant('gameSelection');
    NodeCG.waitForReplicants(defaultTop8Array, gameSelection).then(() => {
        loadTop8();
    })
    

});

function saveInfo(){
	// Save the result of the dialog to a replicant, to access later.
	var allData = clone(top8Data);
	for (var i=0; i < top8Inputs.length; i++){
		var input = $(`.${[top8Inputs[i].id]}`).val();
		if(typeof input === "undefined"){} else {
			allData[top8Inputs[i].id] = input;
		}
	}
	top8Array.value = allData;
}

function loadTop8(refresh=false){
    init_refresh = refresh;
    top8Data = clone(defaultTop8Array.value);
    if(top8Array.value != undefined && top8Array.value != ''){
        top8Data = top8Array.value;
    }
    
    for (var i=0; i < top8Inputs.length; i++){
		var value = top8Data[top8Inputs[i].id];
		switch(top8Inputs[i].id){
			case "1tag":
            case "2tag":
            case "3tag":
            case "4tag":
            case "5atag":
            case "5btag":
            case "7atag":
            case "7btag":
                refresh = init_refresh
                var input = $(`<input title='${top8Inputs[i].placeholder}' class='${top8Inputs[i].id}' placeholder='${top8Inputs[i].placeholder}'></input>`);
                break;
			default:
                var game = gameSelection.value;
				var input = constructCharacterDropdown(game, top8Inputs[i].id);
				break;
				

		}
        input.val(value);
        if(refresh){
            $(`${top8Inputs[i].grid}`).empty();
            refresh = false;
        }
		$(`${top8Inputs[i].grid}`).append(top8Inputs[i].placeholder + ":<br>");
		$(`${top8Inputs[i].grid}`).append(input);
		$(`${top8Inputs[i].grid}`).append("<br>");
    }
}

function constructCharacterDropdown(game, id_tag){
	// Generate HTML for a dropdown of characters to put in the dialog box.
	var characters =  getCharacters(game);
	var index = $('<select />').attr("class", id_tag);
    var properName;
	characters.forEach(function(item){
        if(item === ""){
            properName = "";
        }
		else if(item !== "ROB"){
			// Put spaces between the capital letters to avoid CapitalCased names in the dropdown, except ROB.
			properName = item.match(/[A-Z][a-z]+|[A-Z]+/g).join(" ");
		} else {
			properName = "ROB";
		}
		$('<option />', {value: item, text: properName}).appendTo(index);
	});
	return index;
}


function getCharacters(game){
	// Return a list of all of the character's names per game. Slices are to take out the cut characters.
	var smash64 = ["", "Mario", "Luigi", "Yoshi", "Pikachu", "Fox", "Samus", "Falcon", "Jigglypuff", "Ness", "Kirby", "Link", "DonkeyKong", "[REMIX] Bowser",
					"[REMIX] Dr. Mario", "[REMIX] Sheik", "[REMIX] Young Link", "[REMIX] Ganondorf", "[REMIX] Dark Samus", "[REMIX] King Dedede", "[REMIX] Falco",
					"[REMIX] Wolf", "[REMIX] Mewtwo", "[REMIX] Lucas", "[REMIX] Marth", "[REMIX] Wario", "[REMIX] Sonic", "[REMIX] Conker", "[REMIX] Marina"];

	var melee = smash64.slice(0,12).concat(["Peach", "Bowser", "Marth", "Zelda", "Sheik", "Ganondorf", "Falco", "IceClimbers",
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

