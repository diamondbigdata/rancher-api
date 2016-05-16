module.exports = function rancher(host, port, user, pass){

	var CSRF    = '';
	var token   = '';
	var headers = {};

	auth();

	function auth(){		

		var http = require("http");

		var options = {
			"method": "GET",
			"hostname": host,
			"port": port,
			"path": "/v1/token",
			"headers": {
				"x-api-no-challenge": "true",
				"accept": "application/json",
				"accept-encoding": "gzip, deflate, sdch",
				"accept-language": "en-GB,en-US;q=0.8,en;q=0.6",
				"cookie": "PL=rancher"
			}
		};

		var req = http.request(options, function (res) {

			var cookies = res.headers["set-cookie"];
		    console.log(cookies);
		    CSRF = cookis.cookie;
		    login();

		});

		req.end();

		function login(){

			var http = require("http");

			var options = {
				"method": "POST",
				"hostname": host,
				"port": port,
				"path": "/v1/token",
				"headers": {
					"content-type": "application/json",
					"x-api-no-challenge": "true",
					"accept": "application/json",
					"x-api-csrf": CSRF,
					"accept-encoding": "gzip, deflate",
					"accept-language": "en-GB,en-US;q=0.8,en;q=0.6",
					"cookie": "PL=rancher; CSRF=" + CSRF
				}
			};

			var req = http.request(options, function (res) {

				var chunks = "";

				res.on("data", function (chunk) {
				
					chunks += chunk;
				
				});

				res.on("end", function () {

					console.log(JSON.parse(chunks));
					var data = JSON.parse(chunks);
					token = data.jwt;
					headers = {
						"content-type": "application/json",
						"x-api-no-challenge": "true",
						"accept": "application/json",
						"x-api-csrf": CSRF,
						"accept-encoding": "gzip, deflate",
						"accept-language": "en-GB,en-US;q=0.8,en;q=0.6",
						"cookie": "PL=rancher; CSRF=" + CSRF + "; token=" + token
					}

					console.log("CSRF: " + CSRF);
					console.log("token: " + token);
					console.log("headers: " + headers);

				});

			});

			req.write(JSON.stringify({ code: user + ':' + pass, authProvider: 'localauthconfig' }));
			req.end();

		}

	}

	function call(method, url, body, callback)
	{
			callApi(method, url, body, callback);
	}

	function callApi(method, path, body, callback)
	{

		var http = require("http");

		var options = {
			"method": method,
			"hostname": host,
			"port": port,
			"path": path,
			"headers": headers
		};

		var req = http.request(options, function (res) {

			var chunks = '';

			res.on("data", function (chunk) {

				chunks += chunk;

			});

			res.on("end", function () {

				var resBody = JSON.parse(chunks);
				console.log(resBody);
				callback(resBody);

			});

		});

		if (body)
			req.write(JSON.stringify(body));

		req.end();

	}

	return {
		login: function login(){
			auth();
		},
		create: function (data, callback){
			call('POST', '/v1/projects/1a5/container', data, callback);
		},
		read: function (data, callback){
			call('GET', '',data, callback);
		},
		update: function (data, callback){
			call('POST', '', data, callback);
		},
		delete: function (id, callback){
			call('POST', '/v1/projects/1a5/containers/' + id + '/?action=stop', null, function(){
				call('DELETE', '/v1/projects/1a5/containers/' + id, null, function(){
					call('POST', '/v1/projects/1a5/containers/' + id + '/?action=stop', null, callback);
				});
			});
		}
	}
}