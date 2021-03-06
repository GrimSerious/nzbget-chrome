function $(o) {
	return document.getElementById(o);
}

document.addEventListener('DOMContentLoaded', function() {
	api = chrome.extension.getBackgroundPage().ngAPI;
	opts = api.Options;

	var inputs = document.body.querySelectorAll('input[type=text],input[type=password],select')

	for(var i in inputs) {
		inputs[i].value = opts.get(inputs[i].id);
	}
		
	$('btn_save').addEventListener('click', function(){
		for(var i in inputs) {
			opts.set(inputs[i].id, inputs[i].value);
		}
		chrome.runtime.sendMessage({message: 'optionsUpdated'});
	});

	$('btn_test').addEventListener('click', function(){
		$('connection_test').innerText = 'Trying to connect...';
		$('connection_test').className = 'working';
		api.sendMessage('version', {}, function(r){
			$('connection_test').innerText = 'Successfully connected to NZBGet v'+r.result;
			$('connection_test').className = 'success';
		}, function(reason){
			$('connection_test').className = 'error';
			$('connection_test').innerText = 'Connection failed! '+reason;
		});
	});

	// Parse text in host field and try to place URI-parts in their right form fields.
	$('opt_host').addEventListener('blur', function() {
		var prot = this.value.match(/^([a-z]+):\/\//);

		if(prot) {
			var a = document.createElement('a');
			a.href = this.value;
			this.value = this.value.replace(/^[a-z]+:\/\//,'');
			if(prot[1] == 'http' || prot[1] == 'https') {
				$('opt_protocol').value = prot[1];
			}
			if(a.hostname) $('opt_host').value = a.hostname;
			if(a.port) $('opt_port').value = a.port;
			if(a.username) $('opt_username').value = a.username;
			if(a.password) $('opt_password').value = a.password;
		}
	});
});
