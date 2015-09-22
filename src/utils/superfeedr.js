var serialize = require('./serialize.js');

module.exports = {

	checkCredentials: function checkCredentials(login, token, callback) {
		
		var url = "https://push.superfeedr.com/";
		var query = {
			'rights': true,
			'hub.mode': 'authenticate',
			'authorization': btoa([login, token].join(':'))
		};

		url = [url, serialize(query)].join('?');

		var http = new XMLHttpRequest();
		http.onreadystatechange = function() { 
			if(http.readyState == 4) {
				if(http.status == 200) 
					return callback(null, true);
				else
					return callback({status: http.status, message: http.responseText});
			}
		}

    http.open("GET", url, true); // true for asynchronous 
    http.send(null);
  }

};