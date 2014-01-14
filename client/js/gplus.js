define([],function() {

    var gplus = angular.module("dl.gplus", []);

    gplus.factory("evaluateAuthResult", function() {
        return function(authResult, callback) {
            // console.log("authResult",authResult);

            if ( authResult == null ) {
                callback({
                    message: "There is not token"
                });
            } else if ( authResult['access_token']) {
              // Autorizado correctamente
              // Guardo el token
              gapi.auth.setToken(authResult);
              
              // Pido los datos del usuario
              gapi.client.load('oauth2', 'v2', function() {
                var request = gapi.client.oauth2.userinfo.get();
                request.execute(function (googleUser){
                    // console.log("INFO", "googleUser", googleUser);
                    callback(null, googleUser);
                });
              });
            } else if ( authResult['error'] == "immediate_failed") {
                // silen error, not autorized but is not register
                callback();
            } else if ( authResult['error'] ) {
                callback({
                    message: authResult['error']
                });
                console.log('There was an error: ' + authResult['error']);
            } else {
                callback({
                    message: JSON.stringify(authResult)
                });
                console.log('Error inesperado');
            }
        };
    });

    return gplus;
});