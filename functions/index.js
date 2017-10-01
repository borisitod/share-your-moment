var functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors')({origin: true});
var webpush = require('web-push');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

var serviceAccount = require("./pwagram-fb-key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://pwagram-49076.firebaseio.com/'
});

exports.storePostData = functions.https.onRequest(function(request, response)  {
 cors(request, response, function () {
     admin.database().ref('posts').push({
         id: request.body.id,
         title: request.body.title,
         location: request.body.location,
         image: request.body.image
     })
         .then(function () {
             webpush.setVapidDetails('mailto:business@pcwgram.com',
                 'BHYJESGUh8mHInmBIKXCJOsqk1TskX3Q-QnJX4aavpm-3rwpusb5thr6bMnVYz1VgF8VHFAN7NGBdO6N5hrJlF8',
                 'wWSpcyQYkVAnLZv4g3W8FP0WVPsZVc_fdmSxLpi-URI');
             return admin.database().ref('subscription').once('value');
         })
         .then(function (subscriptions) {
             subscriptions.forEach(function (sub) {
                var pushConfig = {
                    endpoint: sub.val().endpoint,
                    keys: {
                        auth: sub.val().keys.auth,
                        p256dh: sub.val().keys.p256dh
                    }
                };
                webpush.sendNotification(pushConfig, JSON.stringify({title: 'New Post', content: 'New Post Added!'}))
                    .catch(function (err) {
                        console.log(err);
                    })
             });
             response.status(201).json({message: 'Data stored', id: request.body.id});
         })
         .catch(function (err) {
             response.status(500).json({error: err});
         })
 })
});
