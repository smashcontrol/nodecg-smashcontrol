function verifyAuth(){
	nodecg.sendMessage('api-init', $('.auth-input').val(), (error, result) =>{
		if (error){
			$('.auth-result').html(error);
			return;
		}
		$('.auth-result').html(result);
	});
}

