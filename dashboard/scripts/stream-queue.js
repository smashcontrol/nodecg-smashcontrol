var playerDataArray = nodecg.Replicant('playerDataArray');
var streamQueueArray = nodecg.Replicant('streamQueue');

function importSet(i){
	NodeCG.waitForReplicants(playerDataArray, streamQueueArray).then(() => {
		// Update playerDataArray to whatever the i'th value of streamQueueArray is
		populatePanel();
		playerDataArray.value.player1tag = streamQueueArray.value[i][1];
		//playerDataArray.value.player1pronouns = streamQueueArray.value[i][1];
		playerDataArray.value.player2tag = streamQueueArray.value[i][2];
		//playerDataArray.value.player2pronouns = streamQueueArray.value[i][2];
		playerDataArray.value.bracketlocation = streamQueueArray.value[i][3];
	});
}

function populatePanel(){
	nodecg.sendMessage('queue-import', (error, result) => {
		if (error){
			// Only error would be "stream queue empty".
			for(var i=0; i < 8; i++){
				// Clean up the panel, in the case of switching tourneys or something.
				$('.set-to-pick_' + i).empty();
			}
			$('.queue-error').text(error);
			return;
		}
		else{
			$('.queue-error').empty();
			NodeCG.waitForReplicants(streamQueueArray).then(() => {
				for(var i = 0; i < 8; i++) {
					// Fill up the panel with the stream queue, maximum of 8 sets at a time.
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
						// This will error if the stream queue has less than 8 sets in it.
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
