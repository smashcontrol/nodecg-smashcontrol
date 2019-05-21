
function changeScore(player, change){
	var scoreReplicant = (player === 1) ? nodecg.Replicant('player1Score') : nodecg.Replicant('player2Score');
	var playername = (player === 1) ? $('.player1-score') : $('.player2-score');

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
		if(player1Replicant.value !== '' && player2Replicant.value !== ''){
			$('.player1-score').html(player1Replicant.value);
			$('.player2-score').html(player2Replicant.value);
		} else {
			$('.player1-score').html(0);
			$('.player2-score').html(0);
		}
		
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
});

$(() => {
	updateScores();
	var player1tag = $('.player1-tag');
	var player2tag = $('.player2-tag');
	var player1character = $('.player1-character');
	var player2character = $('.player2-character');
	var bracketlocation = $('.bracket-location');
	var gameSelection = nodecg.Replicant('gameSelection');
	NodeCG.waitForReplicants(gameSelection).then(() =>{
		if(typeof gameSelection.value === "undefined" || gameSelection.value === ''){
			gameSelection.value = "ssb64";
		}
	});
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
		p1ch = "images/" + setData.game + "/" + setData.player1character + ".png";
		p2ch = "images/" + setData.game + "/" + setData.player2character + ".png";
		player1character.children().attr('src', p1ch);
		player2character.children().attr('src', p2ch);
		bracketlocation.html(setData.bracketlocation);
	}

});
