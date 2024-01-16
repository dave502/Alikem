
const admin = require('firebase-admin');
const express = require('express');
const server = express();

server.use(express.json());

var app = admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

auth = app.auth()
const port = process.env.PORT || 8055;

server.post("/auth/get-jwt", function(req, res) {
  console.log('req:', req)
  if (!req.body ) {
    res.status(400).send('text field is required');
  }
  console.log('req.body.uid:', req.body.uid, typeof(req.body.uid));
  var uid = req.body.uid;
  var additionalClaims = req.body.data;
  
  auth.createCustomToken(uid, additionalClaims)
    .then((token) => {
      res.status(200).json({token, success: true});
    })
    .catch((error) => {
      console.log('Error creating custom token:', error.message);
      res.status(500).send(error.message);
    });
});

server.post("/auth/edit-user", function(req, res) {
  console.log('req:', req)
  if (!req.body ) {
    res.status(400).send('text field is required');
  }
  var uid = req.body.uid;
  var info = req.body.data;
  
  auth.updateUser(uid, info)
    .then((userRecord) => {
      res.status(200).json({userRecord, success: true});
    })
    .catch((error) => {
      console.log('Error updating user:', error.message);
      res.status(500).send(error.message);
    });
});

// admin.auth().updateUser(uid, { emailVerified: true })

// server.use('/', router);

server.listen(port, function () {
  console.log('Listening on port', port)
})