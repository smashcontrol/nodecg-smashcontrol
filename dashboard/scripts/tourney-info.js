$(() => {
	var tourneyRepl = nodecg.Replicant("currentTournament");
	var eventListRepl = nodecg.Replicant("eventList");
	NodeCG.waitForReplicants(tourneyRepl).then(() => {
		if(tourneyRepl.value == ""){
			$('.tourney-name').empty();
			$('.event-list').empty();
			$('.disconnect').empty();
		}
	})
	var tourneyName = $('.tourney-name');
	var eventList = $('.event-list');
	tourneyRepl.on('change', (newVal, oldVal) => {
		if (newVal) {
			updateInfo(newVal);
		}
	});
	function updateInfo(tourneyData){
		// Currently adds the tournament name and events to the panel, can be extended to add more
		tourneyName.text(tourneyData.name);
		$('.events').text("Tournament Events:")
		eventList.empty();
		NodeCG.waitForReplicants(eventListRepl).then(() => {
			for (var event in eventListRepl.value) {
				eventList.append(eventListRepl.value[event].name, "<br>");
			}
		});
	}
});
function disconnect(){
	$('.tourney-info').empty();
	nodecg.Replicant("currentTournament").value = '';
	nodecg.Replicant('streamQueue').value = '';
}

