var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyCr3EzdW7lvAO3wx1S934aa1_cyPlGj1lw",
    authDomain: "iotizer.firebaseapp.com",
    databaseURL: "https://iotizer.firebaseio.com",
    projectId: "iotizer",
    storageBucket: "iotizer.appspot.com",
    messagingSenderId: "279642521955",
    appId: "1:279642521955:web:1004779de8caf6652fd356",
    measurementId: "G-TYHTCWQ04C"
  };

var ref = firebase.initializeApp(config);
var firestore = firebase.firestore();
var database = firebase.database();

function createUser(email, password, done){
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(req, res){
        console.log("User Created");
        return done(true, null);
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        console.log('The password is too weak.');
      } else {
        console.log(errorMessage)
      }
      return done(false, errorMessage);
    });
}

function authenticate(email, password, done){
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(){
        console.log("Logged In");
        return done(true, firebase.auth().currentUser);
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        console.log('Wrong password.');
      } else {
        console.log(errorMessage);
      }
        return done(false, errorMessage);
    });
}

function googleAuth(id_token, done){
  var credential = firebase.auth.GoogleAuthProvider.credential(id_token);

  firebase.auth().signInAndRetrieveDataWithCredential(credential)
  .then(function(){
    console.log("Logged In - Google");
    return done(true, firebase.auth().currentUser);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    console.log(errorMessage);
    return done(false, errorMessage);
  });

}

function resetPassword(email, done){
    firebase.auth().sendPasswordResetEmail(email)
        .then(function() {
            console.log('Password reset mail sent');
            return done(true);
        })
        .catch(function(error) {
            console.log('Mail error');
            return done(false);
        });
}

function signOut(done){
    firebase.auth().signOut()
        .then(function() {
            console.log('Signed out');
            return done(true);
        })
        .catch(function(error) {
            console.log('Sign out error');
            return done(false);
        });
}



//firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

module.exports = {
    createUser: createUser,
    authenticate: authenticate,
    googleAuth: googleAuth,
    resetPassword: resetPassword,
    signOut: signOut,
    ref: ref,
    firebase: firebase,
    firestore: firestore
}

//
// const docRef = firestore.doc("samples/sandwichData");
//
// docRef.set({
//   hotDogStatus: backgroundColor
// }).then(function() {
//   console.log("saved succed");
// }).catch(function (error) {
//   console.log("error occured: ", error);
// })
