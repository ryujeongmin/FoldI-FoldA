var firebaseAuth = require('../config/firebaseAuth.js');
var firebase = require("firebase");
var firestore = firebase.firestore();
var async = require('async');
var database = firebase.database();

module.exports = function(app) {

  app.post('/getdata', function(req, res){
    let deviceRef = firestore.collection('users').doc(req.session.user);
    let getNumber = deviceRef.get().then(doc => {
      if (!doc.exists) {

      } else {
        var deviceN = doc.data().deviceN;
        var actionN = doc.data().actionN;
        var ruleN = doc.data().ruleN;
        var userUID = doc.data().userUID;

        var pushCP = [];
        var dragCP = [];
        var rotateCP = [];

        var dataURL = [];
        var deviceName = [];
        var actionInfo = [];
        var ruleInfo = [];
        for(var i=1; i<ruleN+1; i++) {
          var doc_ = 'rule' + String(i);
          var ruleInfoRef = firestore.collection('users').doc(req.session.user).collection('rules').doc(doc_);
          var getName = ruleInfoRef.get().then(doc => {
            if (!doc.exists) {

            } else {
              var ruleName_ = doc.data().ruleName;
              var ruleInfo_ = {name: doc.data().ruleName, if: doc.data().if, actionIndex: doc.data().actionIdx, status: doc.data().status, condition: doc.data().condition}
              ruleInfo.push(ruleInfo_);
            }
          })
        }
        for(var i=1; i<actionN+1; i++){
          var doc_ = 'action' + String(i);
          var actionInfoRef = firestore.collection('users').doc(req.session.user).collection('actions').doc(doc_);
          var getName = actionInfoRef.get().then(doc => {
            if (!doc.exists) {

            } else {
              var actionInfo_ = {name: doc.data().actionName, deviceIndex: doc.data().deviceIndex, path: doc.data().path, pathPoints: doc.data().pathPoints, pathList: doc.data().pathList}
              actionInfo.push(actionInfo_);
            }
          })
        }
        for(var i=1; i<deviceN+1; i++){
          console.log(deviceN);
          var doc_ = 'device' + String(i);
          var deviceInfoRef = firestore.collection('users').doc(req.session.user).collection('devices').doc(doc_);
          var getPhoto = deviceInfoRef.get().then(doc => {
            if (!doc.exists) {

            } else {
              // dataURL[i] = doc.data().photo;
              dataURL.push(doc.data().photo);
              deviceName.push(doc.data().deviceName);
              pushCP.push(doc.data().pushCP);
              dragCP.push(doc.data().dragCP);
              rotateCP.push(doc.data().rotateCP);
              console.log('photo data updated: device' + i);
              console.log(dataURL.length);
            }

            if(dataURL.length == deviceN){
              console.log(dataURL.length);
              res.send({deviceN: deviceN, actionN: actionN, ruleN: ruleN, userUID: userUID, dataURL: dataURL, deviceName: deviceName, actionInfo: actionInfo, pushCP: pushCP, dragCP: dragCP, rotateCP: rotateCP, ruleInfo: ruleInfo});
            }
          })
        }
      }
    })
  })

  app.post('/getdata_cp', function(req, res){
    var idx_ = req.body.index;
    var doc_ = String(idx_);
    console.log('doc_ is ' + doc_)
    let deviceRef = firestore.collection('users').doc(req.session.user).collection('devices').doc(doc_);

    let getNumber = deviceRef.get().then(doc => {
      if (!doc.exists) {
        console.log('no such doc')
      } else {
        var pushCP = doc.data().pushCP;
        var dragCP = doc.data().dragCP;
        var rotateCP = doc.data().rotateCP;
        var imageW = doc.data().imageW;
        var imageH = doc.data().imageH;
        console.log('data res: ' + pushCP)
        res.send({pushCP: pushCP, dragCP: dragCP, rotateCP: rotateCP, imageW: imageW, imageH: imageH});
      }
    })
  })

  app.post('/getCam', function(req, res){
    console.log(req.body.index)
    var _uid;
    var idx_ = Number(req.body.index) + 1;
    var doc_ = 'device' + String(idx_);
    let deviceRef = firestore.collection('users').doc(req.session.user).collection('devices').doc(doc_);

    let getUID = deviceRef.get().then(doc => {
      if(!doc.exists) {
        console.log('no such doc')
      } else {
        _uid = String(doc.data().powerUID);
        var _link = '/' + _uid + '/'
        var _ref = firebase.database().ref(_link);
        _ref.once('value').then(function(snapshot) {
          var _length = Object.keys(snapshot.val()).length - 1;
          var ref_ = firebase.database().ref(_link + String(Object.keys(snapshot.val())[_length]));
          ref_.once('value').then(function(snapshot) {
            res.send({cam: String(snapshot.val().photo)})
          })
        });
      }
    })
  })

  setInterval(function() {
    var ref = firebase.database().ref('/').remove();
    console.log('database clear')
  }, 100000)

  app.get('/', isSignedIn, function(req,res){
    res.render('index', {

    });
  });


  app.get('/signup', function(req, res){
    res.render('signup', {
      message: req.flash('signupMessage')
    });
  });

  app.post('/signup', function(req, res){
    firebaseAuth.createUser(req.body.email, req.body.password, function(success, msg){
      if(success){
        res.redirect('/login');
      }else{
        req.flash('signupMessage', msg);
        res.redirect('/signup');
      }
    });
  });

  app.get('/login', function(req, res){
    res.render('login', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/logingoogle', function(req, res){
    firebaseAuth.googleAuth(req.body.token, function(success, msg){
      if(success){
        req.session.user = msg.email;
        req.session.uid = msg.uid;

        res.send({redirect: '/'});
      }else{
        req.flash('loginMessage', msg);
        res.send({redirect: '/login'});
      }
    });
  });

  app.get('/logout', function(req, res){
    firebaseAuth.signOut(function(success, msg){
      delete req.session.user;
      res.redirect('/');
    });
  });

  app.get('/deviceRegister', isSignedIn, function(req, res){
    res.render('deviceRegister');
  });

  app.get('/defineAction', isSignedIn, function(req, res){
    res.render('defineAction')
  })

  app.get('/addNewRule', isSignedIn, function(req, res){
    res.render('addNewRule');
  })

  app.get('/mannual', isSignedIn, function(req, res){
    res.render('mannual');
  })

  function isSignedIn(req, res, next) {
    if(req.session.user!=null){
        console.log('Current User : ' + req.session.user);

        if(firebase.auth().currentUser==null){
          res.redirect('/login');
        }

        let data = {
          userUID: firebase.auth().currentUser.uid,
          deviceN: 0,
          actionN: 0,
          ruleN: 0
        };
        var doc = firestore.collection('users').doc(req.session.user);
        doc.get().then((docData) => {
          if (docData.exists) {
            console.log('user db already exist');
          } else {
            firestore.collection('users').doc(req.session.user).set(data, {merge: true});
            firestore.collection('users').doc(req.session.user).collection('devices').doc('device0').set({
              camera: false,
              powerUID: "required",
              deviceName: "required"
            }, {merge: true});
            firestore.collection('users').doc(req.session.user).collection('actions').doc('action0').set({
              camera: false,
              powerUID: "required",
              deviceName: "required",
              actionName: "required"
            }, {merge: true});
            firestore.collection('users').doc(req.session.user).collection('rules').doc('rule0').set({
              camera: false,
              powerUID: "required",
              deviceName: "required",
              actionName: "required",
              ruleName: "required"
            }, {merge: true});
          }
        })
        return next();
    }else{
        res.redirect('/login');
    }
  }
}
