$(() => {
	var tourneyRepl = nodecg.Replicant("currentTournament");
	var eventListRepl = nodecg.Replicant("eventList");

	var tourneyName = $('.tourney-name');
	var eventList = $('.event-list');
	tourneyRepl.on('change', (newVal, oldVal) => {
		if (newVal) {
			updateInfo(newVal);
		}
	});
	function updateInfo(tourneyData){
		tourneyName.text(tourneyData.name);
		eventList.empty();
		NodeCG.waitForReplicants(eventListRepl).then(() => {
			for (var key in eventListRepl.value) {
				eventList.append(eventListRepl.value[key], "<br>");
			}
		});
	}
});

