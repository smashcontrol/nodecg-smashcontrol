function verifyUrl(){
	// Send a message to the server to check/import the tournament.
	$(`.url-result`).text('');
	nodecg.sendMessage('url-import', $('.tourney-submit').val(), (error, result) =>{
		if (error){
			// Error would be "Tournament not found."
			$('.url-result').text(error);
			return;
		}
		$('.url-result').text(result);
	});
}
