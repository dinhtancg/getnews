
var Sails = require('sails').constructor;
var bhttp = require("bhttp");

var mySailsApp = new Sails();
mySailsApp.lift({
  port: 1337
  // Optionally pass in any other programmatic config overrides you like here.
}, function(err) {
  if (err) {
    console.error('Failed to lift app.  Details:', err);
    return;
  }

  // --•
  // Make a request using the "request" library and display the response.
  // Note that you still must have an `api/controllers/RssController.js` file
  // under the current working directory, or a `/getnewsrss` or `GET /getnewsrss` route
  // set up in `config/routes.js`.
  setInterval(function(){
      bhttp.get('http://localhost:1337/getnewsrss', function (err, response) {
        if (err) {
          console.log('Could not send HTTP request.  Details:', err);
        }
        else {
          console.log('Got response:', response);
        }

        // >--
        // In any case, whether the request worked or not, now we need to call `.lower()`.
        mySailsApp.lower(function (err) {
          if (err) {
            console.log('Could not lower Sails app.  Details:',err);
            return;
          }

          // --•
          console.log('Successfully lowered Sails app.');

        });//</lower sails app>
      });//</request.get() :: send http request>
    }, 3000); //set time loop
});//</lift sails app>