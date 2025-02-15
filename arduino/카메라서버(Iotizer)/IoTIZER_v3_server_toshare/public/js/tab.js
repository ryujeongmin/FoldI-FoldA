//var verticalSwipe = require('./verticalSwipe.js');
var currentTab = 1;  // 0: iotizers, 1: actions, 2: rules

$(document).ready(function() {
  var activeTab = sessionStorage.getItem("activeTab");
  if (activeTab == "0") {
    $(".tab_text").removeClass('on');
    $(".tab_text").eq(0).addClass('on');
    $('.contents_lists').hide();
    $('.contents_lists').removeClass('on');
    $('.contents_lists').eq(0).show();
    $('.contents_lists').eq(0).addClass('on');
    document.getElementById("textMain").innerHTML = "My IoTIZERs";
    document.getElementById("textSub").innerHTML = "Registered devices";
    currentTab = 0;
    $('.workspace').prop('tab', 1);
  } else if (activeTab == "1") {
    currentTab = 1;
    $('.workspace').prop('tab', 2);
  } else if (activeTab == "2") {
    $(".tab_text").removeClass('on');
    $(".tab_text").eq(2).addClass('on');
    $('.contents_lists').hide();
    $('.contents_lists').removeClass('on');
    $('.contents_lists').eq(2).show();
    $('.contents_lists').eq(2).addClass('on');
    document.getElementById("textMain").innerHTML = "My Rules";
    document.getElementById("textSub").innerHTML = "Defined activating actions";
    currentTab = 2;
    $('.workspace').prop('tab', 3);
  }
})

// 탭 이동
$(".tab_text").click(function(){
  $(".tab_text").removeClass('on');
  $(this).addClass('on');

  var idx = $('.tab_text').index(this);
  currentTab = idx;

  $('.contents_lists').hide();
  $('.contents_lists').removeClass('on');
  $('.contents_lists').eq(idx).show();
  $('.contents_lists').eq(idx).addClass('on');

  if(idx == 0) {
    document.getElementById("textMain").innerHTML = "My IoTIZERs";
    document.getElementById("textSub").innerHTML = "Registered devices";
    $('.workspace').prop('tab', 1);
  } else if (idx == 1) {
    document.getElementById("textMain").innerHTML = "My Actions";
    document.getElementById("textSub").innerHTML = "Defined action presets";
    $('.workspace').prop('tab', 2);
  } else if (idx == 2) {
    document.getElementById("textMain").innerHTML = "My Rules";
    document.getElementById("textSub").innerHTML = "Defined activating actions";
    $('.workspace').prop('tab', 3);
  }

  sessionStorage.setItem("activeTab", idx);
});

// 아이템 세팅 메뉴
$(".setting_icon_show").click(function(){
  var idx = $(".setting_icon_show").index(this);

  $('.setting_icon_show').eq(idx).hide();
  $('.setting_icon_hide').eq(idx).show();
  $('.list_li_image_cover').eq(idx).show();
})

$(".setting_icon_hide").click(function(){
  var idx = $(".setting_icon_hide").index(this);

  $('.setting_icon_hide').eq(idx).hide();
  $('.setting_icon_show').eq(idx).show();
  $('.list_li_image_cover').eq(idx).hide();
})

$(".contents").on('swipedown',function(){alert("swipedown..");} );

// 작업창 내리기
