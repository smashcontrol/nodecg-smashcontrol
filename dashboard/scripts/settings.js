function verifyAuth(){
	// Send a message to the server to check if the inputted API key is a valid key.
	nodecg.sendMessage('api-init', $('.auth-input').val(), (error, result) =>{
		if (error){
			$('.auth-result').text(error);
			return;
		}
		$('.auth-result').text(result);
	});
}

