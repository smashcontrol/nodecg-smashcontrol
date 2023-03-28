import {ssb64, ssbm, ssbult, roa} from './costumes.js'

var top8Array,
    top8Data,
    defaultTop8Array,
    gameSelection;

var top8Inputs = [
	{id: '1tag', placeholder: '1st Place Tag', grid: '.place_1'},
	{id: '1main', placeholder: '1st Place Main', grid: '.place_1'},
	{id: '1costume', placeholder: 'Costume', grid: '.place_1'},
	{id: '1secondary', placeholder: '1st Place Secondary', grid: '.place_1'},

	{id: '2tag', placeholder: '2nd Place Tag', grid: '.place_2'},
	{id: '2main', placeholder: '2nd Place Main', grid: '.place_2'},
	{id: '2costume', placeholder: 'Costume', grid: '.place_2'},
	{id: '2secondary', placeholder: '2nd Place Secondary', grid: '.place_2'},

    {id: '3tag', placeholder: '3rd Place Tag', grid: '.place_3'},
	{id: '3main', placeholder: '3rd Place Main', grid: '.place_3'},
	{id: '3costume', placeholder: 'Costume', grid: '.place_3'},
	{id: '3secondary', placeholder: '3rd Place Secondary', grid: '.place_3'},

    {id: '4tag', placeholder: '4th Place Tag', grid: '.place_4'},
	{id: '4main', placeholder: '4th Place Main', grid: '.place_4'},
	{id: '4costume', placeholder: 'Costume', grid: '.place_4'},
	{id: '4secondary', placeholder: '4th Place Secondary', grid: '.place_4'},

    {id: '5atag', placeholder: '5th Place Tag', grid: '.place_5a'},
	{id: '5amain', placeholder: '5th Place Main', grid: '.place_5a'},
	{id: '5acostume', placeholder: 'Costume', grid: '.place_5a'},
	{id: '5asecondary', placeholder: '5th Place Secondary', grid: '.place_5a'},

    {id: '5btag', placeholder: '5th Place Tag', grid: '.place_5b'},
	{id: '5bmain', placeholder: '5th Place Main', grid: '.place_5b'},
	{id: '5bcostume', placeholder: 'Costume', grid: '.place_5b'},
	{id: '5bsecondary', placeholder: '5th Place Secondary', grid: '.place_5b'},

    {id: '7atag', placeholder: '7th Place Tag', grid: '.place_7a'},
	{id: '7amain', placeholder: '7th Place Main', grid: '.place_7a'},
	{id: '7acostume', placeholder: 'Costume', grid: '.place_7a'},
	{id: '7asecondary', placeholder: '7th Place Secondary', grid: '.place_7a'},

    {id: '7btag', placeholder: '7th Place Tag', grid: '.place_7b'},
	{id: '7bmain', placeholder: '7th Place Main', grid: '.place_7b'},
	{id: '7bcostume', placeholder: 'Costume', grid: '.place_7b'},
	{id: '7bsecondary', placeholder: '7th Place Secondary', grid: '.place_7b'},

	{id: 'tourneyname', placeholder: 'Tournament Name', grid: '.tournament'},
	{id: 'tourneydate', placeholder: 'Tournament Date', grid: '.tournament'},
	{id: 'tourneyentrants', placeholder: 'Tournament Entrant #', grid: '.tournament'},
	{id: 'tourneylocation', placeholder: 'Tournament Location', grid: '.tournament'},
	{id: 'game'},
];




$(() => {
    top8Array = nodecg.Replicant('top8Array');
    defaultTop8Array = nodecg.Replicant('defaultTop8Array');
    defaultTop8Array.value = {
        "1tag": '',
        "1main": '',
		"1costume": '',
        "1secondary": '',

        "2tag": '',
        "2main": '',
		"2costume": '',
        "2secondary": '',

        "3tag": '',
        "3main": '',
		"3costume": '',
        "3secondary": '',

        "4tag": '',
        "4main": '',
		"4costume": '',
        "4secondary": '',

        "5atag": '',
        "5amain": '',
		"5acostume": '',
        "5asecondary": '',

        "5btag": '',
        "5bmain": '',
		"5bcostume": '',
        "5bsecondary": '',

        "7atag": '',
        "7amain": '',
		"7acostume": '',
        "7asecondary": '',

        "7btag": '',
        "7bmain": '',
		"7bcostume": '',
        "7bsecondary": '',

		"tourneyname": '',
		"tourneydate": '',
		"tourneyentrants": '',
		"tourneylocation": '',
		"game": 'ssb64',
    };
    gameSelection = nodecg.Replicant('gameSelection');
    NodeCG.waitForReplicants(defaultTop8Array, gameSelection).then(() => {
        loadTop8();
    })
	
	$('.save').on("click", function() {
		NodeCG.waitForReplicants(top8Array).then(() => {
			saveInfo();
		})
	})
	$('.refresh').on("click", function() {
		NodeCG.waitForReplicants(defaultTop8Array, gameSelection).then(() => {
			loadTop8(true);
		})
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
	console.log(allData);
	top8Array.value = allData;
}

function loadTop8(refresh=false){
    var init_refresh = refresh;
    top8Data = clone(defaultTop8Array.value);
	try{
		var game = gameSelection.value;
	} catch {
		var game = 'ssb64';
	}
	
    if(top8Array.value != undefined && top8Array.value != ''){
        top8Data = top8Array.value;
	}
	top8Data["game"] = game;
	var current_main = '';
    for (var i=0; i < top8Inputs.length-1; i++){
		var input;
		var value = top8Data[top8Inputs[i].id];
		if(top8Inputs[i].id.includes("tag") || top8Inputs[i].id.includes("tourney")){
			if(top8Inputs[i].id.includes("tag") || top8Inputs[i].id.includes("tourneyname")){
				refresh = init_refresh
			}
			input = $(`<input title='${top8Inputs[i].placeholder}' class='${top8Inputs[i].id}'></input>`);
		}
		else if(top8Inputs[i].id.includes("main") || top8Inputs[i].id.includes("secondary")){
			if(top8Inputs[i].id.includes("main")){
				current_main = value;
			}
			input = constructCharacterDropdown(game, top8Inputs[i].id, top8Inputs[i].id.includes("main"));
		}
		else if(top8Inputs[i].id.includes("costume")){
			input = getCostume(current_main, game, top8Inputs[i].id);
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

function constructCharacterDropdown(game, id_tag, main){
	// Generate HTML for a dropdown of characters to put in the dialog box.
	var characters =  getCharacters(game, main);
	var index;
	if (main){
		index = $('<select />').attr("class", id_tag);
		index.on("change", function (){
			getCostume($(this).val(), game, id_tag.split("main")[0]+"costume");
		});
	} else {
		index = $('<select />').attr("class", id_tag);
	}
	
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

function getCostume(character, game, id_tag){
	var costumelist;
	var selector = $(`<select />`).attr("class", id_tag);
	switch(game){
		case "ssb64":
			costumelist = ssb64;
			character = character.split("[REMIX] ").at(-1)
			break;
		case "ssbm":
			costumelist = ssbm;
			break;
		case "ssbult":
			costumelist = ssbult;
			break;
		case "roa":
			costumelist	= roa;
			break;
		default:
			break;
	}
	if(character === '' || !costumelist.hasOwnProperty(character)){
		$(`.${id_tag}`).replaceWith(selector);
		return selector;
	}
	costumelist[character].forEach(function (costume) {
		$('<option />', {value: costume, text: costume}).appendTo(selector);
	})
	$(`.${id_tag}`).replaceWith(selector);
	return selector;
};

function getCharacters(game, main){
	// Return a list of all of the character's names per game. Slices are to take out the cut characters.
	var smash64 = ["", "Mario", "Luigi", "Yoshi", "Pikachu", "Fox", "Samus", "Falcon", "Jigglypuff", "Ness", "Kirby", "Link", "DonkeyKong", "[REMIX] Bowser",
					"[REMIX] Dr. Mario", "[REMIX] Sheik", "[REMIX] Young Link", "[REMIX] Ganondorf", "[REMIX] Dark Samus", "[REMIX] King Dedede", "[REMIX] Falco",
					"[REMIX] Wolf", "[REMIX] Mewtwo", "[REMIX] Lucas", "[REMIX] Marth", "[REMIX] Wario", "[REMIX] Sonic", "[REMIX] Conker", "[REMIX] Marina"];

	var melee = smash64.slice(0,12).concat(["Peach", "Bowser", "Marth", "Zelda", "Sheik", "Ganondorf", "Falco", "IceClimbers",
						"MrGameAndWatch", "DrMario", "YoungLink", "Mewtwo", "Roy"]);

	// Remove Dr. Mario, Young Link, Mewtwo, Roy
	var brawl = melee.slice(0, -4).concat(["DiddyKong", "MetaKnight", "KingDedede", "ToonLink", "ZeroSuitSamus",
										"Lucario", "Lucas", "Ike", "Wario", "Pit", "Olimar", "ROB", "Sonic", "Snake",
										"Wolf", "PokemonTrainer", "Squirtle", "Ivysaur", "Charizard"]);

	var pm = brawl.concat(["Mewtwo", "Roy"]);

	// Remove Snake, Wolf, PT, Squirtle, Ivysaur
	var wiiu = brawl.slice(0, -6).concat(["DrMario", "Mewtwo", "Roy", "Rosalina", "BowserJr", "Greninja",
										"Lucina", "Corrin", "Robin", "Palutena", "DarkPit", "Villager",
										"WiiFit", "LittleMac", "DuckHunt", "Shulk", "MegaMan", "PacMan", "Ryu", "Cloud", "Bayonetta", "Mii"]);
	if(!main){
		var wiiu = brawl.slice(0, -6).concat(["DrMario", "Mewtwo", "Roy", "Rosalina", "BowserJr", "Greninja",
										"Lucina", "CorrinMale", "CorrinFemale", "RobinMale", "RobinFemale", "Palutena", "DarkPit", "VillagerMale", "VillagerFemale",
										"WiiFitMale", "WiiFitFemale", "LittleMac", "DuckHunt", "Shulk", "MegaMan", "PacMan", "Ryu", "Cloud", "Bayonetta", "Mii"]);
	}
	wiiu = wiiu.filter(function (item) {
		// Can't remove IC's easily with slicing
		return item !== "IceClimbers";
	});

	// Remove "Mii", instead use brawler/gunner/swordfighter
	var ultimate = wiiu.slice(0, -1).concat(["IceClimbers", "YoungLink", "Snake", "Wolf", "PokemonTrainer",
							"Daisy", "PiranhaPlant", "KingK.Rool", "Pichu", "Ridley", "DarkSamus", "Incineroar",
							"Chrom", "Isabelle", "Inkling", "Ken", "Simon", "Richter", "Joker", "MiiGunner",
							"MiiSwordfighter", "MiiBrawler", "Banjo&Kazooie", "Hero", "Terry", "Byleth", "MinMin", "Steve", 
							"Sephiroth", "PyraMythra", "Kazuya", "Sora"]);
	if(!main){
		var ultimate = wiiu.slice(0, -1).concat(["IceClimbers", "YoungLink", "Snake", "Wolf", "PokemonTrainerMale", "PokemonTrainerFemale",
							"Daisy", "PiranhaPlant", "KingK.Rool", "Pichu", "Ridley", "DarkSamus", "Incineroar",
							"Chrom", "Isabelle", "InklingMale", "InklingFemale", "Ken", "Simon", "Richter", "Joker", "MiiGunner",
							"MiiSwordfighter", "MiiBrawler", "Banjo&Kazooie", "Hero", "Terry", "BylethMale", "BylethFemale", "MinMin", "Steve", 
							"Sephiroth", "PyraMythra", "Kazuya", "Sora"]);
	}
	var roa = ["Absa", "Clairen", "Elliana", "Etalus", "Forsburn", "Hodan", "Kragg", "Maypul", "Mollo", "Olympia", "Orcane", "Ori", "Pomme", "Ranno", "ShovelKnight",
				"Sylvanos", "Wrastor", "Zetterburn"]
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
		case "roa":
			return roa.sort();
	}
}

