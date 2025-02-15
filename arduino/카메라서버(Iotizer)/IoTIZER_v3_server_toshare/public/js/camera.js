var addNewImage = document.getElementById('addBtn');
var takeImage = document.getElementById('takeImage');
var imageCanvas = document.getElementById('imageCanvas');
imageCanvas.width = window.innerWidth;
imageCanvas.height = window.innerHeight;

var cameraID = [];
navigator.mediaDevices.enumerateDevices().then(gotDevices);

var context = imageCanvas.getContext('2d');
takeImage.addEventListener("click", function(){
  console.log('w: ' + imageCanvas.width + ', h: ' + imageCanvas.height);
  console.log('w: ' + screen.width + ', h: ' + screen.height);
});

var server_socket = io.connect(window.location.host);

var data_to_arduino ={};
data_to_arduino.button = "NONE";
data_to_arduino.xPos = "0";
data_to_arduino.yPos = "0";

function gotDevices(deviceInfos) {
  for (var i = 0; i !== deviceInfos.length; i++) {
    if (deviceInfos[i].kind == 'videoinput') {
      cameraID.push(deviceInfos[i].deviceId);
      console.log(deviceInfos[i].deviceId);
      console.log(i)
    }
  }

  var video = document.getElementById('video'),
        vendorUrl = window.URL || window.webkitURL;
        navigator.getMedia =  navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetuserMedia || navigator.msGetUserMedia;
        navigator.getMedia({
          video: {
            deviceId: {exact: cameraID[4]}, width: imageCanvas.height, height: imageCanvas.width
          },
          audio: false
        }, function(stream) {
          video = document.querySelector('video');
          video.srcObject = stream;
          localstream = stream;
          video.onloadedmetadata = function(e) {
  					video.play();
  				};
        }, function(err) {
          // an error occurred
        });
};

$(".title_backicon").click(function(){
  location.href = "/"

  setTimeout(function(){
    $('.contents_lists').hide();
    $('.contents_lists').removeClass('on');
    $('.contents_lists').eq(0).show();
    $('.contents_lists').eq(0).addClass('on');
    document.getElementById("textMain").innerHTML = "My IoTIZERs";
    document.getElementById("textSub").innerHTML = "Registered devices";
  }, 1000);
})

$(".btn_beforeP").click(function(){
  $('.btn_beforeP').hide();
  $('.btn_afterP').show();

  video.pause();
  context.drawImage(video, 0, 0, imageCanvas.width, imageCanvas.height);
})

$(".btn_afterP.left").click(function(){
  $('.btn_afterP').hide();
  $('.btn_beforeP').show();
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  video.play();
})

$(".btn_afterP.right").click(function(){
  $('.btn_bottom').hide();
  $('.guideline_img').hide();
  $('.input_cover').show();
  $('.get_powerUID').show();
  document.getElementById("textSub").innerHTML = "Enter the UID on power module";
  //document.getElementById("textSub").innerHTML = window.innerHeight + ", " + imageCanvas.height;
})

$('.textbox2').click(function(){
  $('.textbox2 input[type="text"]').focus();
})

$('.textbox').click(function(){
  $('.textbox input[type="text"]').focus();
})

var placeholderTarget = $('#input_');
placeholderTarget.on('focus', function(){
  $(this).siblings('label').fadeOut('fast');
  $('.get_powerUID').addClass('input');
});
placeholderTarget.on('focusout', function(){
  $('.get_powerUID').removeClass('input');
  if($(this).val() == ''){
    $(this).siblings('label').fadeIn('fast');
  }
});

var placeholderTarget2 = $('#input2_');
placeholderTarget2.on('focus', function(){
  $(this).siblings('label').fadeOut('fast');
  $('.get_powerUID').addClass('input');
});
placeholderTarget2.on('focusout', function(){
  $('.get_powerUID').removeClass('input');
  if($(this).val() == ''){
    $(this).siblings('label').fadeIn('fast');
  }
});

$("#cancle").click(function(){
  $('.btn_bottom').show();
  $('.guideline_img').show();
  $('.input_cover').hide();
  $('.get_powerUID').hide();
  document.getElementById("textSub").innerHTML = "Take photo according to the guide ";
})

$("#complete").click(function(){
  var fromClient_newItem = {};
  fromClient_newItem.type = 'device';
  fromClient_newItem.photo = imageCanvas.toDataURL('image/jpeg', 1.0);
  fromClient_newItem.deviceName = $('#input_').val();
  fromClient_newItem.powerUID = $('#input2_').val();
  fromClient_newItem.imageW = window.innerWidth;
  fromClient_newItem.imageH = window.innerHeight;
  server_socket.emit('fromClient_newItem', fromClient_newItem);

  setTimeout(function(){
    location.href = "/";
  }, 500);
})
