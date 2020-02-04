var playerDataArray = nodecg.Replicant('playerDataArray');
var streamQueueArray = nodecg.Replicant('streamQueue');

function importSet(i){
	NodeCG.waitForReplicants(playerDataArray, streamQueueArray).then(() => {
		/* Update playerDataArray to whatever the i'th value of streamQueueArray is */
		populatePanel();
		playerDataArray.value.player1tag = streamQueueArray.value[i][1];
		playerDataArray.value.player2tag = streamQueueArray.value[i][2];
		playerDataArray.value.bracketlocation = streamQueueArray.value[i][3];
	});
}

function populatePanel(){
	nodecg.sendMessage('queue-import', event,(error, result) => {
		if (error){
			for(var i=0; i < 8; i++){
				$('.set-to-pick_' + i).empty();
			}
			$('.queue-error').text(error);
			return;
		}
		else{
			$('.queue-error').empty();
			NodeCG.waitForReplicants(streamQueueArray).then(() => {
				for(var i = 0; i < 8; i++) {
					try {
						$('.set-to-pick_' + i).empty();
						$('.set-to-pick_' + i).append("<div class=\"stream_" + i + "\"</div>");
						$('.set-to-pick_' + i).append("<div class=\"player-info_" + i + "\"</div>");
						$('.stream_' + i).text(streamQueueArray.value[i][0]).css({
							'font-weight': 'bold',
							'font-style': 'italic'
						});
						$('.player-info_' + i).text(streamQueueArray.value[i][1] + " vs. " + streamQueueArray.value[i][2] + " | " + streamQueueArray.value[i][3]);
						$('.set-to-pick_' + i).append("<button class=\"ui-button import-set_" + i + "\" style=\"color: green; float: right\" onclick=\"importSet(" + i + ")\">Import</button><br><br>");
					} catch (err) {
						// Goes until end of stream queue or maximum 8
						return;
					}
				}
			});
		}
	});
}

$(() => {
	NodeCG.waitForReplicants(streamQueueArray).then(() => {
		if(streamQueueArray.value.length > 0){
			$('.load-queue').text('Refresh');
			populatePanel();
			var queue = setInterval(populatePanel, 60000);
		} else {
			clearInterval(queue);
			$('.load-queue').text('Load Queue');
		}
	});
});
