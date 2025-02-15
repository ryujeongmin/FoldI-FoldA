//------------------------------------------ 수직 swipe
var supportTouch = $.support.touch,
            scrollEvent = "touchmove scroll",
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
    $.event.special.swipeupdown = {
        setup: function() {
            var thisObject = this;
            var $this = $(thisObject);
            $this.bind(touchStartEvent, function(event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event,
                        start = {
                            time: (new Date).getTime(),
                            coords: [ data.pageX, data.pageY ],
                            origin: $(event.target)
                        },
                        stop;

                function moveHandler(event) {
                    if (!start) {
                        return;
                    }
                    var data = event.originalEvent.touches ?
                            event.originalEvent.touches[ 0 ] :
                            event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ]
                    };

                    // prevent scrolling
                    if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                        event.preventDefault();
                    }
                }
                $this
                        .bind(touchMoveEvent, moveHandler)
                        .one(touchStopEvent, function(event) {
                    $this.unbind(touchMoveEvent, moveHandler);
                    if (start && stop) {
                        if (stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                            start.origin
                                    .trigger("swipeupdown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                        }
                    }
                    start = stop = undefined;
                });
            });
        }
    };
    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function(event, sourceEvent){
        $.event.special[event] = {
            setup: function(){
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });

$(".workspace_image").click(function() {
  var point = {x: event.clientX, y: event.clientY}
  //$(".w_text_sub").text(c2d(point).x + ", " + c2d(point).y);
  //console.log(window.innerHeight + ", " + screen.height);
})

$(".workspace_image").on("swipedown", function() {
  $('.workspace').removeClass('open');
  $('.cover_black').fadeOut(300);
  setTimeout(function() {
    $('.workspace_image').css('background-image', 'none');
    if($(".btns_add").attr('id') == 'opt_') {
      $(".btns_add").attr('id','_opt');
      $(".btns_add").removeClass('opt');
      $('#push').removeClass('opt1');
      $('#drag').removeClass('opt2');
      $('#rotate').removeClass('opt3');
    }
  }, 600);
  $('.setting_icon_hide').trigger('click');
  checkedItem = 0;
});

$(".cover_black").click(function() {
  $('.workspace').removeClass('open');
  $('.cover_black').fadeOut(300);
  setTimeout(function() {
    $('.workspace_image').css('background-image', 'none');
    if($(".btns_add").attr('id') == 'opt_') {
      $(".btns_add").attr('id','_opt');
      $(".btns_add").removeClass('opt');
      $('#push').removeClass('opt1');
      $('#drag').removeClass('opt2');
      $('#rotate').removeClass('opt3');
    }
  }, 600);
  $('.setting_icon_hide').trigger('click');
  checkedItem = 0;
});


//------------------------------------------ edit
var svgCanvas = d3.select("#svgCanvas")

$(".btns_add").click(function() {
  if($(this).attr('id') == '_opt') {
    $(this).attr('id','opt_');
    $(this).addClass('opt');
    $('#push').addClass('opt1');
    $('#drag').addClass('opt2');
    $('#rotate').addClass('opt3');
  } else if ($(this).attr('id') == 'opt_') {
    $(this).attr('id','_opt');
    $(this).removeClass('opt');
    $('#push').removeClass('opt1');
    $('#drag').removeClass('opt2');
    $('#rotate').removeClass('opt3');
  }
});

$('#push').click(function() {
  $(".btns_add").attr('id','_opt');
  $(".btns_add").removeClass('opt');
  $('#push').removeClass('opt1');
  $('#drag').removeClass('opt2');
  $('#rotate').removeClass('opt3');

  generatePushCircle(200, 200);
})

$('#drag').click(function() {
  $(".btns_add").attr('id','_opt');
  $(".btns_add").removeClass('opt');
  $('#push').removeClass('opt1');
  $('#drag').removeClass('opt2');
  $('#rotate').removeClass('opt3');

  generateDragCircle(200,200,200,300,200,250);
})

$('#rotate').click(function() {
  $(".btns_add").attr('id','_opt');
  $(".btns_add").removeClass('opt');
  $('#push').removeClass('opt1');
  $('#drag').removeClass('opt2');
  $('#rotate').removeClass('opt3');

  generateRotateCircle(120, 320, 280, 320, 200, 160);
})
