var request = require('request');

// doing the login
function login(username, password) {
	request({
		url: 'https://api.hello.is/v1/oauth2/token',
		method: "POST",
		form: {
			'grant_type': 'password',
			'client_id': '8d3c1664-05ae-47e4-bcdb-477489590aa4',
			'client_secret': '4f771f6f-5c10-4104-bbc6-3333f5b11bf9',
			'username': username,
			'password': password
		}
	}, function(err, res) {
		var json = JSON.parse(res.body);
		return json.access_token;
	});
}

// request temperature
exports.temperature = function(username, password) {
	header = "Bearer " + login(username, password);
	request({
		url: '',
		method: 'GET',
		headers: {
			Authorization: header
		}
	}, function(err, res) {
		var json = JSON.parse(res.body);
		return json.temperature.value;
	});
}
