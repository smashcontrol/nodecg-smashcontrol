
function changeScore(player, change){
	var scoreReplicant = (player == 1) ? nodecg.Replicant('player1Score') : nodecg.Replicant('player2Score');
	var playername = (player == 1) ? $('.player1-score') : $('.player2-score');

	NodeCG.waitForReplicants(scoreReplicant).then(() => {
		var score = Number(scoreReplicant.value);
		score += change;
		score = (score < 0) ? 0 : ((score > 99) ? 99 : score);
		playername.html(score);
		scoreReplicant.value = playername.html();

	});
}

function updateScores(){
	var player1Replicant = nodecg.Replicant('player1Score');
	var player2Replicant = nodecg.Replicant('player2Score');
	NodeCG.waitForReplicants(player1Replicant, player2Replicant).then(() =>{
		$('.player1-score').html(player1Replicant.value);
		$('.player2-score').html(player2Replicant.value);
	});
}


/* ===================================== */

$(function(){

	var $editSetButton = $('.editCurrentSet');

	function init() {
		$editSetButton.button({});
		$editSetButton.click(() => {
			nodecg.getDialog('set-info').querySelector('iframe').contentWindow.loadInfo();
			nodecg.getDialog('set-info').open();
		})
	}
	init();
})

$(() => {
	updateScores();
	/*
	var games = ["ssb64", "ssbm", "ssbb", "ssbpm", "ssb4", "ssbult"];
	var characters = ["Mario", "Pikachu", "Luigi"];
	games.forEach(function(game){
		characters.forEach(function(character){
			console.log("/images/" + game + "/" + character + ".png");
		});
	});
	*/
	var player1tag = $('.player1-tag');
	var player2tag = $('.player2-tag');
	var player1character = $('.player1-character');
	var player2character = $('.player2-character');
	var bracketlocation = $('.bracket-location');

	//player1character.children().attr("src", "images/ssbb/Falcon.png");
	var setDataCurrent = nodecg.Replicant('playerDataArray');
	setDataCurrent.on('change', (newVal, oldVal) => {
		if (newVal) {
			updateFields(newVal);
		}
	});
	function updateFields(setData){
		player1tag.html(setData.player1tag);
		player2tag.html(setData.player2tag);
		player1character.children().attr('src', setData.player1character);
		player2character.children().attr('src', setData.player2character);
		bracketlocation.html(setData.bracketlocation);
	}

});
