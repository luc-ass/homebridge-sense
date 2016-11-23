var request = require('request');

var token_url = 'https://api.hello.is/v1/oauth2/token';
var current_url = 'https://api.hello.is/v1/room/current?temp_unit=c'

// token
// store token for later request?

// should all values be requested in one function?

// request temperature
exports.temperature = function(username, password, callback) {
	login(username, password, function(token) {
		var header = "Bearer " + token;
		request({
			url: current_url,
			method: 'GET',
			headers: {
				Authorization: header
			}
		}, function(err, res) {
			var json = JSON.parse(res.body);
			// console.log("Result:", json);
			return callback(json.temperature.value);
		});
	});
}

// request humidity

// request particulates

// request sound

// request light

// doing the login
function login(username, password, callback) {
	request({
		url: token_url,
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
		return callback(json.access_token);
	});
}
