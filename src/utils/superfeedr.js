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
  },

  getSubscriptions: function getSubscriptions(login, token, callback) {
		
		var url = "https://push.superfeedr.com/";
		var query = {
			'detailed': true,
			'by_page': 500,
			'hub.mode': 'list',
			'authorization': btoa([login, token].join(':'))
		};

		url = [url, serialize(query)].join('?');

		var http = new XMLHttpRequest();
		http.onreadystatechange = function() { 
			if(http.readyState == 4) {
				if(http.status == 200)
					return callback(null, JSON.parse(http.responseText).subscriptions);
				return callback({status: http.status, message: http.responseText}, []);
			}
		}

    http.open("GET", url, true); // true for asynchronous 
    http.send(null);
  },

  unsubscribe: function unsubscribe(login, token, subscription, callback) {
  	var url = "https://push.superfeedr.com/";
		var params = {
			'hub.mode': 'unsubscribe',
			'hub.callback': subscription.subscription.endpoint,
			'hub.topic': subscription.subscription.feed.status.feed,
			'authorization': btoa([login, token].join(':'))
		};

		var http = new XMLHttpRequest();
		http.onreadystatechange = function() { 
			if(http.readyState == 4) {
				if(http.status == 204)
					return callback(null, true);
				return callback({status: http.status, message: http.responseText}, []);
			}
		}

    http.open("POST", url, true); 
    var body = serialize(params);

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.setRequestHeader("Content-length", body.length);
    http.send(body);
  },

  subscribe: function subscribe(login, token, topic, callback) {
  	var url = "https://push.superfeedr.com/";
		var params = {
			'hub.mode': 'subscribe',
			'hub.callback': "https://push.superfeedr.com/dev/null",
			'hub.topic': topic,
			'authorization': btoa([login, token].join(':'))
		};

		var http = new XMLHttpRequest();
		http.onreadystatechange = function() { 
			if(http.readyState == 4) {
				if(http.status == 204)  
					return callback(null, true);
				return callback({status: http.status, message: http.responseText}, []);
			}
		}

    http.open("POST", url, true); 
    var body = serialize(params);

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.setRequestHeader("Content-length", body.length);
    http.send(body);
  },

};