module.exports = function rancher(host, port, user, pass){

	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Authorization': 'Basic ' + new Buffer(user + ':' + pass).toString('base64')
	};

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
		create: function (data, callback){
			call('POST', '/v1/projects/1a5/container', data, callback);
		},
		read: function (data, callback){
			call('GET', '',data, callback);
		},
		update: function (data, callback){
			call('POST', '', data, callback);
		},
		stop: function (id, callback){
			call('POST', '/v1/projects/1a5/containers/' + id + '/?action=stop', null, callback);
		},
		remove: function (id, callback){
			call('DELETE', '/v1/projects/1a5/containers/' + id, null, callback);
		},
		purge: function (id, callback){
			call('POST', '/v1/projects/1a5/containers/' + id + '/?action=purge', null, callback);
		}
	}
}