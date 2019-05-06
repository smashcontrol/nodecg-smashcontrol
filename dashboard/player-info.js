var playerDataArray


var playerDataInputs = [
	{id: 'player1-name', placeholder: 'Player 1 Tag'},
	{id: 'player1-character', placeholder: 'Player 1 Character'},
	{id: 'player2-name', placeholder: 'Player 2 Tag'},
	{id: 'player2-character', placeholder: 'Player 2 Character'}
]

$(() => {
	playerDataArray = nodecg.Replicant('playerDataArray');
});



$(function(){
	$('.score-button').on('click', changeScore);

});
function changeScore(){
	let op = $(this).html();
	let parent = $(this).parent().parent().attr('class');
	if(parent === 'player1-info'){
		let player = $('.player1-score');
		let score = parseInt(player.html());
		if(op === '+1'){
			score++;
			player.html(score);
		} else{
			score = (score-- > 0) ? score : 0;
			player.html(score);
		}
	} else {
		let player = $('.player2-score');
		let score = parseInt(player.html());
		if(op === '+1'){
			score++;
			player.html(score);
		} else{
			score = (score-- > 0) ? score : 0;
			player.html(score);
		}
	}
}
