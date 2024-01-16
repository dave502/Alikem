
const admin = require('firebase-admin');
const express = require('express');
const server = express();

server.use(express.json());

var app = admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

auth = app.auth()
const port = process.env.PORT || 8055;

server.get("/get-jwt", function(req, res) {
  
  if (!req.body ) {
    res.status(400).send('text field is required');
  }
  
  var uid = req.body.uid;
  var additionalClaims = req.body.additionalClaims;
  
  auth.createCustomToken(uid, additionalClaims)
    .then((token) => {
      res.status(200).json({token, success: true});
    })
    .catch((error) => {
      console.log('Error creating custom token:', error.message);
      res.status(500).send(error.message);
    });
});

// server.use('/', router);

server.listen(port, function () {
  console.log('Listening on port', port)
})