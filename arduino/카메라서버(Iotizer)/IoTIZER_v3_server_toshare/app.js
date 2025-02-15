'use strict';

const SERVER_IP = '143.248.109.42';

const SERVER_PORT = 45582;

const fs = require('fs');
var express = require('express');
var https = require('https');
var session = require('cookie-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var imageDataURI = require('image-data-uri');
var app = express();

const optionsHTTPS = {
  key: fs.readFileSync('./keys/key.pem'),
  cert: fs.readFileSync('./keys/cert.pem')
};

var firebaseAuth = require('./config/firebaseAuth.js');
var firebase = require("firebase");
var firestore = firebase.firestore();
let admin = require('firebase-admin');

// const server = require('http').createServer(app);
// server.listen(SERVER_PORT, function(){
//   console.log("server started");
// });

const server = require('http').createServer(app);
server.listen(SERVER_PORT, function(){
  console.log('server started at: ' + SERVER_PORT);
});

const io = require('socket.io').listen(server);

app.use(session({
    secret: 'iotizer',
    // resave: false,
    // saveUninitialized: true
}));

app.use(flash());
app.use(bodyParser.json({ limit: '200mb' } ));
app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/css'));

require('./config/routes.js')(app);

io.on('connection', function(client){
  console.log("[LOG] Arduino Client Connected");

  client.on('fromDevice', function(data){
    console.log(data);
  })

  client.on('disconnect', function(){
    console.log("[LOG] Arduino Client Disconnected");
  })
})

io.on('connection', function(client){
  console.log("socket openned");

  client.on('fromClient_mannual', function(data){
    console.log(data);
    io.sockets.emit('data_from_web', {uid: data.uid, type: "mannual", btn: data.btn});
    setTimeout(function() {
      io.sockets.emit('data_from_web', {uid: data.uid, type: "done_signal"});
    },200);
  })

  client.on('fromClient_newItem', function(data){
    if (data.type == 'device') {
      var userName = firebase.auth().currentUser.email;
      let deviceRef = firestore.collection('users').doc(userName);

      let getDeviceN = deviceRef.get().then(doc => {
        if (!doc.exists) {
          console.log('No such document');
        } else {
          var deviceN_ = doc.data().deviceN + 1;
          var doc_ = 'device' + String(deviceN_);
          firestore.collection('users').doc(userName).update({
            deviceN: deviceN_
          });
          firestore.collection('users').doc(userName).collection('devices').doc(doc_).set({
            camera: false,
            powerUID: String(data.powerUID),
            deviceName: String(data.deviceName),
            deviceIndex: deviceN_,
            photo: data.photo,
            imageW: data.imageW,
            imageH: data.imageH
          });
        }
      })
      .catch(err => {
        console.log(err);
      })
      console.log('device generate');
    }
    else if (data.type == 'action') {
      var userName = firebase.auth().currentUser.email;
      let deviceRef = firestore.collection('users').doc(userName);
      var _idx = data.deviceIdx;
      var _doc = 'device' + String(_idx);
      var powerUID;

      let deviceRef_ = firestore.collection('users').doc(userName).collection('devices').doc(_doc);
      let getPowerUID = deviceRef_.get().then(doc => {
        if (!doc.exists) {
          console.log('No such document: 0');
        } else {
          powerUID = doc.data().powerUID;
        }
      })

      let getDeviceN = deviceRef.get().then(doc => {
        if (!doc.exists) {
          console.log('No such document: 1');
        } else {
          var actionN_ = doc.data().actionN + 1;
          var doc_ = 'action' + String(actionN_);
          firestore.collection('users').doc(userName).update({
            actionN: actionN_
          });
          setTimeout(function(){
            firestore.collection('users').doc(userName).collection('actions').doc(doc_).set({
              actionName: String(data.actionName),
              deviceIndex: data.deviceIdx,
              pathPoints: data.pathPoints,
              pathList: data.pathList,
              path: data.path,
              powerUID: powerUID
            });
          }, 100);

        }
      })
      .catch(err => {
        console.log(err);
      })
      console.log('action generate');
    } else if (data.type == 'rule') {
      var userName = firebase.auth().currentUser.email;
      let ruleRef = firestore.collection('users').doc(userName);

      let getRule = ruleRef.get().then(doc => {
        if (!doc.exists) {
          console.log('No such document');
        } else {
          var ruleN_ = doc.data().ruleN + 1;
          var doc_ = 'rule' + String(ruleN_);
          firestore.collection('users').doc(userName).update({
            ruleN: ruleN_
          });
          firestore.collection('users').doc(userName).collection('rules').doc(doc_).set({
            ruleName: String(data.ruleName),
            condition: data.condition,
            if: data.if,
            actionIdx: data.actionIdx,
            status: data.status
          });
        }
      })
      .catch(err => {
        console.log(err);
      })
      console.log('rule generate');
    }
  })

  client.on('fromClient_infoUpdate', function(data){
    if(data.type == 'deviceName') {
      console.log(data);
      var userName = firebase.auth().currentUser.email;
      var idx_ = Number(data.deviceIndex);
      var doc_ = 'device' + String(idx_);
      let userRef = firestore.collection('users').doc(userName);

      let deviceRef = userRef.get().then(doc => {
        if(!doc.exists) {
          console.log('No such document: 2');
        } else {
          firestore.collection('users').doc(userName).collection('devices').doc(doc_).update({
            deviceName: data.deviceName
          });
          io.sockets.emit('reload', {updated: 'deviceName'})
        }
      })
    }
    if(data.type == 'actionName') {
      var userName = firebase.auth().currentUser.email;
      var idx_ = Number(data.actionIndex);
      var doc_ = 'action' + String(idx_);
      let userRef = firestore.collection('users').doc(userName);

      let actionRef = userRef.get().then(doc => {
        if(!doc.exists) {
          console.log('No such document: 2-2');
        } else {
          firestore.collection('users').doc(userName).collection('actions').doc(doc_).update({
            actionName: data.actionName
          });
          io.sockets.emit('reload', {updated: 'actionName'})
        }
      })
    }
    if(data.type == 'controlPoints') {
      var userName = firebase.auth().currentUser.email;
      var idx_ = data.deviceIdx;
      var doc_ = 'device' + String(idx_);
      let userRef = firestore.collection('users').doc(userName);

      let deviceRef = userRef.get().then(doc => {
        if(!doc.exists) {
          console.log('No such document: 3');
        } else {
          firestore.collection('users').doc(userName).collection('devices').doc(doc_).update({
            pushCP: data.pushCP,
            dragCP: data.dragCP,
            rotateCP: data.rotateCP
          });
          setTimeout(function() {
            io.sockets.emit('reload', {updated: 'controlPoints'})
          }, 1200)
        }
      })
    }
    if(data.type == "actionPath") {
      var userName = firebase.auth().currentUser.email;
      var idx_ = data.actionIdx;
      var doc_ = 'action' + String(idx_);
      let userRef = firestore.collection('users').doc(userName);

      let actionRef = userRef.get().then(doc => {
        if(!doc.exists) {
          console.log('No such document: 4');
        } else {
          firestore.collection('users').doc(userName).collection('actions').doc(doc_).update({
            path: data.path,
            pathPoints: data.pathPoints,
            pathList: data.pathList
          });
          setTimeout(function() {
            io.sockets.emit('reload', {updated: 'actionPath'})
          }, 1200)
        }
      })
    }
    if(data.type == "ruleStatus") {
      console.log('rulestatus update')
      var userName = firebase.auth().currentUser.email;
      var idx_ = data.idx;
      var doc_ = 'rule' + String(idx_);
      let userRef = firestore.collection('users').doc(userName);

      let ruleRef = userRef.get().then(doc => {
        if(!doc.exists) {
          console.log('No such document: 5');
        } else {
          firestore.collection('users').doc(userName).collection('rules').doc(doc_).update({
            status: data.status
          });
        }
      })
    }
  })

  client.on('fromClient_command', function(data){
    console.log(data);
    var userName = firebase.auth().currentUser.email;
    if(data.type != "action") {
      var idx_ = data.deviceIdx;
      var doc_ = 'device' + String(idx_);
      let userRef = firestore.collection('users').doc(userName).collection('devices').doc(doc_);

      let deviceRef = userRef.get().then(doc => {
        if(!doc.exists) {
          console.log('No such document: 4');
        } else {
          if(data.type == "controlPoints_push") {
            var radius = toRSteps(data.x1, data.y1);
            var theta = toTSteps(data.x1, data.y1);
            io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(0," + radius + "," + theta + ")\\n"});
            setTimeout(function() {
              io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "done_signal"});
            },200);
          } else if(data.type == 'controlPoints_drag') {
              var radius = toRSteps(data.x1, data.y1);
              var theta = toTSteps(data.x1, data.y1);
              var radius_ = toRSteps(data.x2, data.y2);
              var theta_ = toTSteps(data.x2, data.y2);
              io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(1," + radius + "," + theta + ")\\n"});
              setTimeout(function() {
                io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(3," + radius + "," + theta + ")\\n"});
              },200);
              setTimeout(function() {
                io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(3," + radius + "," + theta + ")\\n"});
              },400);
              setTimeout(function() {
                io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(3," + radius + "," + theta + ")\\n"});
              },600);
              setTimeout(function() {
                io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(2," + radius_ + "," + theta_ + ")\\n"});
              },800);
              setTimeout(function() {
                io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "done_signal"});
              },1000);
              firestore.collection('users').doc(userName).collection('devices').doc(doc_).update({
                dragCP: data.dragCP
              });
          } else if(data.type == 'controlPoints_rotate') {
              var length = data.path.length;
              var alpha = Math.round(length / 4);
              var beta = Math.round(length / 2);
              var gamma = Math.round(length*3/4);
              var radius1 = toRSteps(data.x1, data.y1);
              var theta1 = toTSteps(data.x1, data.y1);
              var radius2 = toRSteps(data.path[alpha].x, data.path[alpha].y);
              var theta2 = toTSteps(data.path[alpha].x, data.path[alpha].y);
              var radius3= toRSteps(data.path[beta].x, data.path[beta].y);
              var theta3= toTSteps(data.path[beta].x, data.path[beta].y);
              var radius4= toRSteps(data.path[gamma].x, data.path[gamma].y);
              var theta4= toTSteps(data.path[gamma].x, data.path[gamma].y);
              var radius5 = toRSteps(data.x2, data.y2);
              var theta5 = toTSteps(data.x2, data.y2);
              io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(1," + radius1 + "," + theta1 + ")\\n"});
              setTimeout(function() {
                io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(3," + radius2 + "," + theta2 + ")\\n"});
              },200);
              setTimeout(function() {
                io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(3," + radius3 + "," + theta3 + ")\\n"});
              },400);
              setTimeout(function() {
                io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(3," + radius4 + "," + theta4 + ")\\n"});
              },600);
              setTimeout(function() {
                io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(2," + radius5 + "," + theta5 + ")\\n"});
              },800);
              setTimeout(function() {
                io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "done_signal"});
              },1000);
            firestore.collection('users').doc(userName).collection('devices').doc(doc_).update({
              rotateCP: data.rotateCP
            });
          }
        }
      })
    } else {
      var idx_ = Number(data.actionIdx) + 1;
      var doc_ = 'action' + String(idx_);
      let userRef = firestore.collection('users').doc(userName).collection('actions').doc(doc_);
      console.log("ref: " + doc_)

      let deviceRef = userRef.get().then(doc => {
        if(!doc.exists) {
          console.log('No such document: 5');
        } else {
          for(let i in doc.data().pathPoints) {
            if(i != 0) {
              setTimeout(function(){
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@" + doc.data().powerUID)
                if (doc.data().pathPoints[i].type == "push") {
                  var radius = toRSteps(doc.data().pathPoints[i].x, doc.data().pathPoints[i].y);
                  var theta = toTSteps(doc.data().pathPoints[i].x, doc.data().pathPoints[i].y);
                  io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(0," + radius + "," + theta + ")\\n"});
                } else if (doc.data().pathPoints[i].type == "rotateStart" || doc.data().pathPoints[i].type == "dragStart") {
                  var radius = toRSteps(doc.data().pathPoints[i].x, doc.data().pathPoints[i].y);
                  var theta = toTSteps(doc.data().pathPoints[i].x, doc.data().pathPoints[i].y);
                  io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(1," + radius + "," + theta + ")\\n"});
                } else if (doc.data().pathPoints[i].type == "rotating") {
                  var radius = toRSteps(doc.data().pathPoints[i].x, doc.data().pathPoints[i].y);
                  var theta = toTSteps(doc.data().pathPoints[i].x, doc.data().pathPoints[i].y);
                  io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(3," + radius + "," + theta + ")\\n"});
                } else if (doc.data().pathPoints[i].type == "rotateEnd" || doc.data().pathPoints[i].type == "dragEnd") {
                  var radius = toRSteps(doc.data().pathPoints[i].x, doc.data().pathPoints[i].y);
                  var theta = toTSteps(doc.data().pathPoints[i].x, doc.data().pathPoints[i].y);
                  io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "command_move", msg: "(2," + radius + "," + theta + ")\\n"});
                }

                if(i == doc.data().pathPoints.length - 1) {
                  setTimeout(function() {
                    io.sockets.emit('data_from_web', {uid: doc.data().powerUID, type: "done_signal"});
                  }, 200);
                }
              }, i*200);
            }
          }
        }
      })
    }



  })
})

var path1 = function(dataX1, dataY1, dataX2, dataY2, dataCX, dataCY) {
  var distance = Math.sqrt(Math.pow(dataX1-dataX2, 2) + Math.pow(dataY1-dataY2, 2));
  var xqq = dataCX - ((dataX1+dataX2)/2);
  var yqq = dataCY - ((dataY1+dataY2)/2);
}

var toRSteps = function(dataX, dataY) {
  var distance = Math.sqrt(Math.pow(200-dataX, 2) + Math.pow(380-dataY, 2));
  var _radiusSteps = 5000 - ((distance*25) - 500);
  var radiusSteps = Math.min(Math.max(0, _radiusSteps), 5000);
  var rSteps = parseInt(radiusSteps);
  console.log(distance);
  console.log(_radiusSteps);
  return rSteps;
}

var toTSteps = function(dataX, dataY) {
  var thetaSteps;
  if (dataX < 200 && dataY >= 380) {
    var _theta = Math.PI - Math.atan((200-dataX)/(dataY-380));
    var theta = Math.min(Math.max(-Math.PI, _theta), Math.PI);
    thetaSteps = -(180*500*theta)/(26*Math.PI);
  } else if (dataX < 200 && dataY < 380) {
    var _theta = Math.atan((200-dataX)/(380-dataY));
    var theta = Math.min(Math.max(-Math.PI, _theta), Math.PI);
    thetaSteps = -(180*500*theta)/(26*Math.PI);
  } else if (dataX >= 200 && dataY >= 380) {
    var _theta = Math.PI - Math.atan((dataX-200)/(dataY-380));
    var theta = Math.min(Math.max(-Math.PI, _theta), Math.PI);
    thetaSteps = (180*500*theta)/(26*Math.PI);
  } else if (dataX >= 200 && dataY < 380) {
    var _theta = Math.atan((dataX-200)/(380-dataY));
    var theta = Math.min(Math.max(-Math.PI, _theta), Math.PI);
    thetaSteps = (180*500*theta)/(26*Math.PI);
  }
  var tSteps = parseInt(thetaSteps);
  return tSteps;
}
