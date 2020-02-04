function changeScore(player, change){
	// Modify players score by the requested value.
	var scoreReplicant = (player === 1) ? nodecg.Replicant('player1Score') : nodecg.Replicant('player2Score');
	var playername = (player === 1) ? $('.player1-score') : $('.player2-score');

	NodeCG.waitForReplicants(scoreReplicant).then(() => {
		var score = Number(scoreReplicant.value);
		if(isNaN(score)){
			score = 0;
		}
		score += change;
		score = (score < 0) ? 0 : ((score > 99) ? 99 : score); // Bounds between 0 and 99, inclusive

		playername.text(score);
		scoreReplicant.value = playername.text();
	});
}

function resetScore(){
	var player1Repl = nodecg.Replicant('player1Score');
	var player2Repl = nodecg.Replicant('player2Score');

	NodeCG.waitForReplicants(player1Repl, player2Repl).then(() => {
		changeScore(1, (player1Repl.value * -1));
		changeScore(2, (player2Repl.value * -1));
	});
}
function updateScores(){
	// Score init
	var player1Replicant = nodecg.Replicant('player1Score');
	var player2Replicant = nodecg.Replicant('player2Score');
	NodeCG.waitForReplicants(player1Replicant, player2Replicant).then(() =>{
	if(player1Replicant.value !== ''){
		$('.player1-score').text(player1Replicant.value);
	}
	if(player2Replicant.value !== ''){
		$('.player2-score').text(player2Replicant.value);
	}
	else {
			$('.player1-score').text(0);
			$('.player2-score').text(0);
		}
	});
}


/* ===================================== */

$(function(){

	var $editSetButton = $('.editCurrentSet');

	function init() {
		// Open the set modify dialog option when button is clicked.
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
	var setDataCurrent = nodecg.Replicant('playerDataArray');
	setDataCurrent.on('change', (newVal, oldVal) => {
		if (newVal) {
			updateFields(newVal);
		}
	});
	function updateFields(setData){
		player1tag.text(setData.player1tag);
		player2tag.text(setData.player2tag);
		var p1ch = "images/" + setData.game + "/" + setData.player1character + ".png";
		var p2ch = "images/" + setData.game + "/" + setData.player2character + ".png";
		if(setData.game === "ssb64"){
			// 64's character icons are a different aspect ratio
			$('.character').children().attr({"height": 60, "width": 48});
		} else {
			$('.character').children().attr({"height": 64, "width": 64});
		}
		player1character.children().attr('src', p1ch);
		player2character.children().attr('src', p2ch);
		bracketlocation.text(setData.bracketlocation);
	}
	$('.swap').on("click", function(){
		swap()
	});
	function swap(){
		// Swap the sides for the playrs and change the corresponding Replicants.
		var temp;
		var player1Score = nodecg.Replicant('player1Score');
		var player2Score = nodecg.Replicant('player2Score');
		var playerDataArray = nodecg.Replicant('playerDataArray');
		NodeCG.waitForReplicants(player1Score, player2Score, playerDataArray).then(() => {
			temp = player1Score.value;
			player1Score.value = player2Score.value;
			player2Score.value = temp;
			$('.player1-score').text(player2Score.value);
			$('.player2-score').text(player1Score.value);

			temp = playerDataArray.value['player1tag'];
			playerDataArray.value['player1tag'] = playerDataArray.value['player2tag'];
			playerDataArray.value['player2tag'] = temp;

			temp = playerDataArray.value['player1character'];
			playerDataArray.value['player1character'] = playerDataArray.value['player2character'];
			playerDataArray.value['player2character'] = temp;
			updateFields(playerDataArray);
		})
	}
});
