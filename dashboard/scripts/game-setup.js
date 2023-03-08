/*
	This panel sets up a dropdown for the game to load character icons/renders (if applicable) for.
	Can likely be merged with another panel, but because it sees little use it's ok to be on its own page.
 */


$(() => {
	var gamesList = {
		"ssb64" : "Super Smash Bros. 64",
		"ssbm" : "Super Smash Bros. Melee",
		"ssbb" : "Super Smash Bros. Brawl",
		"ssbpm" : "Project M",
		"ssb4" : "Super Smash Bros. for Wii U",
		"ssbult" : "Super Smash Bros. Ultimate",
		"roa": "Rivals of Aether",
	};
	var input = $('<select />').attr("class", "game-select");
	for(var key in gamesList){
		$('<option />', {value: key, text: gamesList[key]}).appendTo(input);
	}
	input.appendTo($('.selector'));
	$('<input />', {type: "submit", value: "Update Game", class: "game-selection"}).appendTo($('.selector'));
	$('.game-selection').on("click", function(){
		updateGame()
	});
});


function updateGame(){
	var gameSelection = nodecg.Replicant('gameSelection');
	NodeCG.waitForReplicants(gameSelection).then(() => {
		gameSelection.value = $('.game-select').val();
	});
}
