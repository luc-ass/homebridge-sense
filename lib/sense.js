var request = require('request');

var token_url = 'https://api.hello.is/v1/oauth2/token';
var current_url = 'https://api.hello.is/v1/room/current?temp_unit=c'

// request temperature
exports.temperature = function(username, password, token, callback) {
	getData(username, password, token, function(json) {
		return callback(json.temperature.value);
	});
}

// request humidity
exports.humidity = function(username, password, token, callback) {
	getData(username, password, token, function(json) {
		return callback(json.humidity.value);
	});
}

// request particulates
exports.particulates = function(username, password, token, callback) {
	getData(username, password, token, function(json) {
		return callback(json.particulates.value);
	});
}

// HMCharacteristicValueAirQuality
// 
// Homekit       |Sense      |Elgato Eve
// --------------+-----------+------------
// unknown (0)   | ---       | ---
// excellent (1) | 0 - 50    | 0 -700
// good (2)      | 50 - 100  | 700 - 1100
// fair (3)      | 100 - 150 | 1100 - 1600
// inferior (4)  | 150 - 200 | 1600 - 2000
// poor (5)      | 200 - 300 | 2000 -
//               | 300 - 400 |

// request Air Quality
exports.airQuality = function(username, password, token, callback) {
	getData(username, password, token, function(json) {
		particulates = json.particulates.value;

		if (particulates < 50) {
			airQualityReturnValue = 1;
		} else if (particulates < 100) {
			airQualityReturnValue = 2;
		} else if (particulates < 150) {
			airQualityReturnValue = 3;
		} else if (particulates < 200) {
			airQualityReturnValue = 4;
		} else if (particulates < 300) {
			airQualityReturnValue = 5;
		} else {
			airQualityReturnValue = 0;
		}

		return callback(airQualityReturnValue);
	});
}

// HMCharacteristicAirParticulateSize
//
// Homekit      |Sense       |Elgato Eve
// -------------+------------+----------–-
// size2_5 (0)
// size10_0 (1)

// request sound
exports.sound = function(username, password, token, callback) {
	getData(username, password, token, function(json) {
		return callback(json.sound.value);
	});
}

// request light
exports.light = function(username, password, token, callback) {
	getData(username, password, token, function(json) {
		return callback(json.light.value);
	});
}

exports.login = function(username, password, callback) {
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

// get token
// -- check wether token is stored
// -- try wether token is valid
// -- -- else login and store token

// doing the login and return access_token
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

function getData(username, password, token, callback) {
	// test if we have a token
	// if yes: try to request data
	if (token) {
		// tell me what the token is
		//console.log("We have a token! It is:", token);
		// construct the header
		var header = "Bearer " + token;
		// request the data
		request({
			url: current_url,
			method: 'GET',
			headers: {
				Authorization: header
			}
		}, function(err, res) {
			// parse response into 'json'
			var json = JSON.parse(res.body);
			// tell me what the response was
			//console.log(json);
			// return response to function
			return callback(json);
		});
	// if not: log in and request data
	} else {
		// do this if no token was delivered
		// this would be used as a fallback because the token lasts for 1 year
		// I expect the server to be restarted more often.
		//console.log("We don't have a token. It will be requested but not stored.");
		login(username, password, function(token) {
			//console.log("The new token is:", token);
			var header = "Bearer " + token;
			request({
				url: current_url,
				method: 'GET',
				headers: {
					Authorization: header
				}
			}, function(err, res) {
				// parse response into 'json'
				var json = JSON.parse(res.body);
				// tell me what the response was
				//console.log(json);
				// return response to function
				return callback(json);
		});
	});
	}
}