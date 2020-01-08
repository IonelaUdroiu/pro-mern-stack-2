            //import express module
            const express = require('express');
            //instantiate express app
            const app = express();
            //create middleware function to match the request URL with a directory specified by thre parametere
            const fileServerMiddleware = express.static('public');
            //mount the static middleware on the application to use it
            app.use('/',fileServerMiddleware);

            app.listen(3000, function() {
              console.log('App started on port 3000');
            })