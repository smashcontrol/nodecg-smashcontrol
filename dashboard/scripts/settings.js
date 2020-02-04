function verifyAuth(){
	nodecg.sendMessage('api-init', $('.auth-input').val(), (error, result) =>{
		if (error){
			$('.auth-result').text(error);
			return;
		}
		$('.auth-result').text(result);
	});
}

