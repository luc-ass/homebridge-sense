var request = require('request');

var token_url = 'https://api.hello.is/v1/oauth2/token';
var current_url = 'https://api.hello.is/v1/room/current?temp_unit=c'
var log = undefined;

exports.sensor_data = function(username, password, token, callback) {
	getData(username, password, token, function(json) {
		if (json) {
			temperature_value = json.temperature.value;
			humidity_value = json.humidity.value;
			sound_value = json.sound.value;
			light_value = json.light.value;

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
			particules_value = json.particulates.value;

			if (particules_value < 50) {
				air_quality_value = 1;
			} else if (particules_value < 100) {
				air_quality_value = 2;
			} else if (particules_value < 150) {
				air_quality_value = 3;
			} else if (particules_value < 200) {
				air_quality_value = 4;
			} else if (particules_value < 300) {
				air_quality_value = 5;
			} else {
				air_quality_value = 0;
			}
			return callback(temperature_value, humidity_value, sound_value, light_value, air_quality_value)
		} else {
			return callback(-1, -1, -1, -1, -1)
		}
	});
}

exports.login = function(username, password, thisLog, callback) {
	log = thisLog;
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
		try {
			var json = JSON.parse(res.body);
		} catch (e) {
			var json = undefined;
			log("Please check your Internet-connection! (exports.Login)");
		}
		return (json ? callback(json.access_token) : callback(""));
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
		try {
			var json = JSON.parse(res.body);
		} catch (e) {
			var json = undefined;
			log("Please check your Internet-connection! (Login)");
		}
		return (json ? callback(json.access_token) : callback(""));
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
			try {
				var json = JSON.parse(res.body);
			} catch (e) {
				var json = undefined;
				log("Please check your Internet-connection! (" + token + ")");
			}
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
				try {
					var json = JSON.parse(res.body);
				} catch (e) {
					var json = undefined;
					log("Please check your Internet-connection! (no token)");
				}
				return callback(json);
				// tell me what the response was
				//console.log(json);
				// return response to function
		});
	});
	}
}
