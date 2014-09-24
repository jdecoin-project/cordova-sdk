/**
*
* BitPay API XHR Request Adapter
*
* @example
*
*/

var requestXHR = function(params, callback) {

  if ( params.port === 443 ) {
    var hostAndPort = 'https://'+params.host;
  } else {
    var hostAndPort = 'https://'+params.host+':'+params.port;
  }

  if ( !params.data ) {
    var data = '';
  } else {
    var data = params.data;
  }

  var apiUrl = hostAndPort + params.path;

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {

    var res;

    if (xhr.readyState === 4) {
      if ( !xhr.responseText ) {
        return callback(new Error('Please check Internet connection'));
      }
      try {
        res = JSON.parse(xhr.responseText);
      } catch (err) {
        return callback(new Error('Unable to parse JSON response'));
      }

      if (typeof(res.data) != 'undefined') {
        callback(null, res.data);
      } else {
        if ( res.error ) {
          return callback(new Error(res.error));
        } else {
          return callback(new Error('An unexpected error has occurred'));
        }
      }
    }
  };

  xhr.open('POST', apiUrl, true);
  xhr.setRequestHeader("Cache-Control", "no-cache");
  xhr.setRequestHeader("Content-type","application/json");
  xhr.setRequestHeader("X-Accept-Version", "2.0.0");

  if ( params.identity && params.signature ) {

    xhr.setRequestHeader("X-Identity", params.identity );
    xhr.setRequestHeader("X-Signature", params.signature );
  }

  xhr.send(data);

}

module.exports = requestXHR;