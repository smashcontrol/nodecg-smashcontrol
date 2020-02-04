function verifyUrl(){
	$(`.url-result`).text('');
	nodecg.sendMessage('url-import', $('.tourney-submit').val(), (error, result) =>{
		if (error){
			$('.url-result').text(error);
			return;
		}
		$('.url-result').text(result);
	});
}
