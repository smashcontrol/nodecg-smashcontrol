function changeScore(player, change){
	let playername = (player == 1) ? $('.player1-score') : $('.player2-score');
	let score = parseInt(playername.html());
	score += change;
	score = (score < 0) ? 0 : ((score > 99) ? 99 : score);
	playername.html(score);
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
	var player1tag = $('.player1-tag');
	var player2tag = $('.player2-tag');
	var bracketlocation = $('.bracket-location');
	var setDataCurrent = nodecg.Replicant('playerDataArray');
	setDataCurrent.on('change', (newVal, oldVal) => {
		if (newVal) {
			updateFields(newVal);
		}
	});
	function updateFields(setData){
		console.log("updating fields");
		player1tag.html(setData.player1tag);
		player2tag.html(setData.player2tag);
		bracketlocation.html(setData.bracketlocation);
	}

});
