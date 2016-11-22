// NODE.JS test for HELLO SENSE

var request = require('request');

request({
	url: 'https://api.hello.is/v1/oauth2/token',
	method: "POST",
	form: {
		'grant_type': 'password',
		'client_id': '8d3c1664-05ae-47e4-bcdb-477489590aa4',
		'client_secret': '4f771f6f-5c10-4104-bbc6-3333f5b11bf9',
		'username': 'username/email',
		'password': 'password'
	}
}, function(err, res) {
	var json = JSON.parse(res.body);
	console.log("Access Token:", json.access_token);

	var header = "Bearer " + json.access_token;
	console.log(header);

	request({
		url: 'https://api.hello.is/v1/room/current?temp_unit=c',
		method: "GET",
		headers: {
			'Authorization': header
		}
	}, function(err, res) {
		var response = JSON.parse(res.body);
		console.log(response);
	});
});
