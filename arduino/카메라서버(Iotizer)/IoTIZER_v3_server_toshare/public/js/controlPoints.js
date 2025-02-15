var server_socket = io.connect(window.location.host);
var edit = false;
var tap = false;
var dragging = 0;
$('.cp_edit').prop('cpIdx', -1);
$('.cp_edit').prop('cpId', 'none');
$('.cp_edit').prop('cpType', 'none');

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;


// -----------------------------------------------  control point 생성
    var svgWidth_act = String(window.innerWidth);
    var svgHeight_act = String(window.innerHeight*0.78);
    var svgCanvas = d3.select("#svgCanvas")
      .append("svg")
      .attr("width", svgWidth_act)
      .attr("height", svgHeight_act);

    svgCanvas.append("g").attr("id", "pathGroup");

    svgCanvas.on('click', function() {
      $('.cp_edit').hide();
      console.log("svg clicked: " + d3.event.x + ", " + d3.event.y);
    })

    var svgCanvasP = d3.select(".svgCanvasP")
      .append("svg")
      .attr("width", svgWidth_act)
      .attr("height", svgHeight_act);
    svgCanvasP.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("markerUnits", "strokeWidth")
      .attr("markerWidth", "6")
      .attr("markerHeight", "6")
      .attr("viewBox", "0 0 6 6")
      .attr("refX", "2")
      .attr("refY", "2")
      .attr("orient", "auto")
      // .append("path")
      //   .attr("d", "M0,-5L10,0L0,5")
      //   .attr("fill", "blue")
      .append("polygon")
        .attr("points", "0 0, 4 2, 0 4, 1 2, 0 0")
        .attr("fill", "rgba(224,90,82,1)")
      // .append("polygon")
      //   .attr("points", "0 0, 0 12, 12 12, 12 0")
      //   .attr("fill", "black");

    var actSVG = d3.select(".actSvg")
      .append("svg")
      .attr("width", svgWidth_act)
      .attr("height", svgHeight_act);
    actSVG.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("markerUnits", "strokeWidth")
      .attr("markerWidth", "6")
      .attr("markerHeight", "6")
      .attr("viewBox", "0 0 6 6")
      .attr("refX", "2")
      .attr("refY", "2")
      .attr("orient", "auto")
      .append("polygon")
        .attr("points", "0 0, 4 2, 0 4, 1 2, 0 0")
        .attr("fill", "rgba(224,90,82,1)")

    function Circle(_id, _x, _y){
      this.id = _id;
      this.x = _x;
      this.y = _y;
    };

    var pushCircleList = new Array();
    var pushIndex = 1;

    function generatePushCircle(_xPos, _yPos){
      var _id = "circlePush_" + pushIndex;
      var _x;
      var _y;

      svgCanvas.append("circle")
        .attr("cx", _xPos)
        .attr("cy", _yPos)
        .attr("class", "circle-push")
        .attr("id", _id)
        .attr("index", pushIndex)
        .attr("xPos", _xPos)
        .attr("yPos", _yPos)
        //.on('taphold', longPress)
        .call(
          d3.drag()
          .on("start", startDrag)
          .on("drag", dragPushCircle)
          .on("end", function(d) {
            event.preventDefault();
            $('.cp_edit').prop('cpType', 'push');
            console.log('dragend')
            edit = false;
            tap = false;
            dragging = 0;
          })
        );

      pushCircleList.push(new Circle(_id, _xPos, _yPos));
      pushIndex++;
    }

    function startDrag(e){
      event.preventDefault();
      console.log('drag start');
      var xPos = d3.select(this).attr("xPos");
      var yPos = d3.select(this).attr("yPos");
      var cpIdx = d3.select(this).attr("index");
      var cpId = d3.select(this).attr("id");
      $('.cp_edit').prop('xPos',  d3.select(this).attr("cx"))
      $('.cp_edit').prop('yPos', d3.select(this).attr("cy"));
      console.log(xPos + ", " + yPos);
      tap = true;
      setTimeout(function() {
        if(tap == true) {
          edit = true;
          if(yPos < 0.78*window.innerHeight/3) {
            if(xPos < screen.width/3) {
              var xPos_ = Number(xPos) - 34;
              var yPos_ = Number(yPos) + 32;
              $('.cp_edit').css('background-image', 'url(./images/editBubble_l_t.png)');
              $('.cp_edit').css('margin-top', yPos_).css('margin-left', xPos_);
            } else if(xPos >= screen.width/3 && xPos < 2*screen.width/3) {
              var xPos_ = Number(xPos) - 66;
              var yPos_ = Number(yPos) + 32;
              $('.cp_edit').css('background-image', 'url(./images/editBubble_m_t.png)');
              $('.cp_edit').css('margin-top', yPos_).css('margin-left', xPos_);
            } else if(xPos >= 2*screen.width/3) {
              var xPos_ = Number(xPos) - 95;
              var yPos_ = Number(yPos) + 32;
              $('.cp_edit').css('background-image', 'url(./images/editBubble_r_t.png)');
              $('.cp_edit').css('margin-top', yPos_).css('margin-left', xPos_);
            }
          } else if(yPos > 0.78*window.innerHeight/3) {
            if(xPos < screen.width/3) {
              var xPos_ = Number(xPos) - 34;
              var yPos_ = Number(yPos) - 100;
              $('.cp_edit').css('background-image', 'url(./images/editBubble_l_b.png)');
              $('.cp_edit').css('margin-top', yPos_).css('margin-left', xPos_);
            } else if(xPos >= screen.width/3 && xPos < 2*screen.width/3) {
              var xPos_ = Number(xPos) - 66;
              var yPos_ = Number(yPos) - 100;
              $('.cp_edit').css('background-image', 'url(./images/editBubble_m_b.png)');
              $('.cp_edit').css('margin-top', yPos_).css('margin-left', xPos_);
            } else if(xPos >= 2*screen.width/3) {
              var xPos_ = Number(xPos) - 95;
              var yPos_ = Number(yPos) - 100;
              $('.cp_edit').css('background-image', 'url(./images/editBubble_r_b.png)');
              $('.cp_edit').css('margin-top', yPos_).css('margin-left', xPos_);
            }
          }
          $('.cp_edit').prop('cpIdx', cpIdx);
          $('.cp_edit').prop('cpId', cpId);
          $('.cp_edit').show();
          window.navigator.vibrate(60);
        }
      },500)
    }

    function dragPushCircle(){
      event.preventDefault(); //prevent default mouse event for dragging svg elements

      if(edit == true) {
        dragging = dragging + 1;
        if (dragging > 15) {
          console.log('draging');
          $('.cp_edit').hide();
          var _draggedCircleID = d3.select(this).attr("id");
          var _draggedCircle = findCircleFromID(_draggedCircleID);
          var _draggedCircleIndex = d3.select(this).attr("index");

          var _x = d3.select(this).attr("cx");
          var _y = d3.select(this).attr("cy");
          var _dx = d3.event.x - _x;
          var _dy = d3.event.y - _y;
          d3.select(this).attr("transform", "translate(" + _dx + "," + _dy + ")");
          d3.select(this).attr("xPos", d3.event.x).attr("yPos", d3.event.y);
          _draggedCircle.x = d3.event.x; //save changed coordination
          _draggedCircle.y = d3.event.y;
        }
      } else {
        console.log("edit attr is false")
      }
    }

    function findCircleFromID(_id){
      var _circle;
      for(var i in pushCircleList){
        if(_id == pushCircleList[i].id){
          _circle = pushCircleList[i];
        }
      }
      return _circle;
    }

    // --------------------------------------------------------------  Drag
    var dragCircleList = new Array();
    var dragIndex = 1;

    function generateDragCircle(_xPos1, _yPos1, _xPos2, _yPos2, _xPos3, _yPos3) {
      var _id_drag_start = "circleDragStart_" + dragIndex;
      var _id_drag_line = "circleDragLine_" + dragIndex;
      var _id_drag_end = "circleDragEnd_" + dragIndex;
      var _id_drag_handle = "circleDragHandle_" + dragIndex;

      //var _x1 = _xPos1;
      //var _y1 = _yPos1;
      //var _x2 = _xPos2;
      //var _y2 = _yPos2;

      svgCanvas.append("circle")
        .attr("cx", _xPos1)
        .attr("cy", _yPos1)
        .attr("class", "circle-drag")
        .attr("id", _id_drag_start)
        .attr("index", dragIndex)
        .attr("xPos", _xPos1)
        .attr("yPos", _yPos1)
        .call(
          d3.drag()
          .on("start", startDrag)
          .on("drag", dragDragCircleS)
          .on("end", function(d) {
            event.preventDefault();
            $('.cp_edit').prop('cpType', 'drag');
            console.log('dragend')
            edit = false;
            tap = false;
            dragging = 0;
          })
        );

      svgCanvas.append("circle")
        .attr("cx", _xPos2)
        .attr("cy", _yPos2)
        .attr("class", "circle-drag")
        .attr("id", _id_drag_end)
        .attr("index", dragIndex)
        .attr("xPos", _xPos2)
        .attr("yPos", _yPos2)
        .call(
          d3.drag()
          .on("start", startDrag)
          .on("drag", dragDragCircleE)
          .on("end", function(d) {
            event.preventDefault();
            $('.cp_edit').prop('cpType', 'drag');
            edit = false;
            tap = false;
            dragging = 0;
          })
        );

      var _path = "M" + _xPos1 + "," + _yPos1 + " L" + _xPos2 + "," + _yPos2;
      svgCanvas.append("path")
        .attr("d", _path)
        .attr("stroke-width", "8px")
        .attr("class", "circle-dragLine")
        .attr("id", _id_drag_line)
        .style("stroke", "rgba(222,140,131,1)")
        .style("stroke-linecap", "round");

      svgCanvas.append("circle")
        .attr("cx", _xPos3)
        .attr("cy", _yPos3)
        .attr("class", "circle-drag-handle")
        .attr("id", _id_drag_handle)
        .attr("index", dragIndex)
        .attr("xPos", _xPos3)
        .attr("yPos", _yPos3)

      dragCircleList.push(new Circle(_id_drag_start, _xPos1, _yPos1));
      dragCircleList.push(new Circle(_id_drag_end, _xPos2, _yPos2));
      dragCircleList.push(new Circle(_id_drag_handle, _xPos3, _yPos3));
      dragIndex++;
    }

    function dragDragCircleS(){
      if (event.cancelable) {
        event.preventDefault(); //prevent default mouse event for dragging svg elements
      }

      if(edit == true) {
        dragging = dragging + 1;
        if (dragging > 15) {
          $('.cp_edit').hide();
          var _draggedCircleID = d3.select(this).attr("id");
          var _draggedCircle = findCircleFromID_drag(_draggedCircleID);
          var _draggedCircleIndex = d3.select(this).attr("index");
          var _pairCircle = findCircleFromID_drag("circleDragEnd_" + _draggedCircleIndex);
          var _handleCircle = findCircleFromID_drag("circleDragHandle_" + _draggedCircleIndex);

          var _x = d3.select(this).attr("cx");
          var _y = d3.select(this).attr("cy");
          var _dx = d3.event.x - _x;
          var _dy = d3.event.y - _y;
          d3.select(this).attr("transform", "translate(" + _dx + "," + _dy + ")");
          d3.select(this).attr("xPos", d3.event.x).attr("yPos", d3.event.y);

          _draggedCircle.x = d3.event.x; //save changed coordination
          _draggedCircle.y = d3.event.y;

          var _x1 = _draggedCircle.x;
          var _y1 = _draggedCircle.y;
          var _x2;
          var _y2;
          if (_pairCircle.y > 600) {
            _x2 = 200;
            _y2 = 300;
          } else {
            _x2 = _pairCircle.x;
            _y2 = _pairCircle.y;
          }
          var _path = "M"+ _x1 +"," + _y1 +" L"+ _x2 +"," + _y2;
          d3.select("#circleDragLine_" + _draggedCircleIndex).attr("d", _path);
          d3.select("#circleDragHandle_" + _draggedCircleIndex).attr("cx", (_x1+_x2)/2).attr("cy", (_y1+_y2)/2);
          _handleCircle.x = (_x1+_x2)/2;
          _handleCircle.y = (_y1+_y2)/2;
        }
      } else {
        console.log("edit attr is false")
      }
    }

    function dragDragCircleE(){
      if (event.cancelable) {
        event.preventDefault(); //prevent default mouse event for dragging svg elements
      }

      if(edit == true) {
        dragging = dragging + 1;
        if (dragging > 15) {
          $('.cp_edit').hide();
          var _draggedCircleID = d3.select(this).attr("id");
          var _draggedCircle = findCircleFromID_drag(_draggedCircleID);
          var _draggedCircleIndex = d3.select(this).attr("index");
          var _pairCircle = findCircleFromID_drag("circleDragStart_" + _draggedCircleIndex);
          var _handleCircle = findCircleFromID_drag("circleDragHandle_" + _draggedCircleIndex);

          var _x = d3.select(this).attr("cx");
          var _y = d3.select(this).attr("cy");
          var _dx = d3.event.x - _x;
          var _dy = d3.event.y - _y;
          d3.select(this).attr("transform", "translate(" + _dx + "," + _dy + ")");
          d3.select(this).attr("xPos", d3.event.x).attr("yPos", d3.event.y);

          _draggedCircle.x = d3.event.x; //save changed coordination
          _draggedCircle.y = d3.event.y;

          var _x2 = _draggedCircle.x;
          var _y2 = _draggedCircle.y;
          var _x1;
          var _y1;
          if (_pairCircle.y > 600) {
            _x1 = 200;
            _y1 = 200;
          } else {
            _x1 = _pairCircle.x;
            _y1 = _pairCircle.y;
          }
          var _path = "M"+ _x1 +"," + _y1 +" L"+ _x2 +"," + _y2;
          d3.select("#circleDragLine_" + _draggedCircleIndex).attr("d", _path);
          d3.select("#circleDragHandle_" + _draggedCircleIndex).attr("cx", (_x1+_x2)/2).attr("cy", (_y1+_y2)/2);
          _handleCircle.x = (_x1+_x2)/2;
          _handleCircle.y = (_y1+_y2)/2;
        }
      } else {
        console.log("edit attr is false")
      }
    }

    function findCircleFromID_drag(_id){
      var _circle;
      for(var i in dragCircleList){
        if(_id == dragCircleList[i].id){
          _circle = dragCircleList[i];
        }
      }
      return _circle;
    }


// --------------------------------------------------------------  Rotate
var rotateCircleList = new Array();
var rotateIndex = 1;

function generateRotateCircle(_x1, _y1, _x2, _y2, _x3, _y3) {
  var _id_rotate_start = "circleRotateStart_" + rotateIndex;
  var _id_rotate_line = "circleRotateLine_" + rotateIndex;
  var _id_rotate_end = "circleRotateEnd_" + rotateIndex;
  var _id_rotate_center = "circleRotateCenter_" + rotateIndex;
  var _id_rotate_handle = "circleRotateHandle_" + rotateIndex;

  var cx = findCenterPoint(_x1, _y1, _x2, _y2, _x3, _y3).x;
  var cy = findCenterPoint(_x1, _y1, _x2, _y2, _x3, _y3).y;

  svgCanvas.append("circle")
    .attr("cx", _x1)
    .attr("cy", _y1)
    .attr("class", "circle-rotate")
    .attr("id", _id_rotate_start)
    .attr("index", rotateIndex)
    .attr("xPos", _x1)
    .attr("yPos", _y1)
    .call(
      d3.drag()
      .on("start", startDrag)
      .on("drag", dragRotateCircleS)
      .on("end", function(d) {
        event.preventDefault();
        console.log('dragend')
        edit = false;
        tap = false;
        dragging = 0;
      })
    );

  svgCanvas.append("circle")
    .attr("cx", _x2)
    .attr("cy", _y2)
    .attr("class", "circle-rotate")
    .attr("id", _id_rotate_end)
    .attr("index", rotateIndex)
    .attr("xPos", _x2)
    .attr("yPos", _y2)
    .call(
      d3.drag()
      .on("start", startDrag)
      .on("drag", dragRotateCircleE)
      .on("end", function(d) {
        event.preventDefault();
        console.log('dragend')
        edit = false;
        tap = false;
        dragging = 0;
      })
    );

  svgCanvas.append("circle")
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("class", "circle-rotate-center")
    .attr("id", _id_rotate_center)
    .attr("index", rotateIndex)
    //.call(d3.drag()
      //.on("start", generatePath)
      //.on("drag", dragRotateCircleC));

  svgCanvas.append("circle")
    .attr("cx", _x3)
    .attr("cy", _y3)
    .attr("class", "circle-rotate-handle")
    .attr("id", _id_rotate_handle)
    .attr("index", rotateIndex)
    .attr("xPos", _x3)
    .attr("yPos", _y3)
    .call(
      d3.drag()
      .on("start", startDrag)
      .on("drag", dragRotateCircleH)
      .on("end", function(d) {
        event.preventDefault();
        console.log('dragend')
        edit = false;
        tap = false;
        dragging = 0;
      })
    );

  var _path = calcArcPath(_x1, _y1, _x2, _y2, _x3, _y3);
  svgCanvas.append("path")
    .attr("d", _path)
    .attr("stroke-width", "8px")
    .attr("class", "circle-rotateLine")
    .attr("id", _id_rotate_line)
    .style("stroke", "rgba(222,140,131,1)")
    .style("stroke-linecap", "round");

  rotateCircleList.push(new Circle(_id_rotate_start, _x1, _y1));
  rotateCircleList.push(new Circle(_id_rotate_end, _x2, _y2));
  rotateCircleList.push(new Circle(_id_rotate_center, cx, cy));
  rotateCircleList.push(new Circle(_id_rotate_handle, _x3, _y3));
  rotateIndex++;
}

function dragRotateCircleS(){
  console.log('draging')
  if (event.cancelable) {
    event.preventDefault(); //prevent default mouse event for dragging svg elements
  }

  if(edit == true) {
    dragging = dragging + 1;
    if (dragging > 15) {
      $('.cp_edit').hide();
      var _draggedCircleID = d3.select(this).attr("id");
      var _draggedCircle = findCircleFromID_rotate(_draggedCircleID);
      var _draggedCircleIndex = d3.select(this).attr("index");
      // var _testBtn = findBtnTag_rotate(_draggedCircleIndex);
      var _pairCircle = findCircleFromID_rotate("circleRotateEnd_" + _draggedCircleIndex);
      var _handleCircle = findCircleFromID_rotate("circleRotateHandle_" + _draggedCircleIndex);
      var _centerCircle = findCircleFromID_rotate("circleRotateCenter_" + _draggedCircleIndex);

      var _x = d3.select(this).attr("cx");
      var _y = d3.select(this).attr("cy");
      var _dx = d3.event.x - _x;
      var _dy = d3.event.y - _y;

      d3.select(this).attr("transform", "translate(" + _dx + "," + _dy + ")");
      d3.select(this).attr("xPos", d3.event.x).attr("yPos", d3.event.y);

      _draggedCircle.x = d3.event.x; //save changed coordination
      _draggedCircle.y = d3.event.y;

      var _x1 = _draggedCircle.x;
      var _y1 = _draggedCircle.y;
      var _x0, _y0, _x2, _y2;

      if (_pairCircle.y >  600) {
        _x2 = 280;
        _y2 = 320;
      } else {
        _x2 = _pairCircle.x;
        _y2 = _pairCircle.y;
      }

      if (_handleCircle.y > 600) {
        _x0 = 200;
        _y0 = 160;
      } else {
        _x0 = _handleCircle.x;
        _y0 = _handleCircle.y;
      }

      var _path = calcArcPath(_x1, _y1, _x2, _y2, _x0, _y0);
      var cx = findCenterPoint(_x1, _y1, _x2, _y2, _x0, _y0).x;
      var cy = findCenterPoint(_x1, _y1, _x2, _y2, _x0, _y0).y;
      d3.select("#circleRotateLine_" + _draggedCircleIndex).attr("d", _path);
      d3.select("#circleRotateCenter_" + _draggedCircleIndex).attr("cx", cx).attr("cy",cy);
    }
  } else {
    console.log("edit attr is false")
  }
}
function dragRotateCircleE(){
  console.log('draging')
  if (event.cancelable) {
    event.preventDefault(); //prevent default mouse event for dragging svg elements
  }

  if(edit == true) {
    dragging = dragging + 1;
    if (dragging > 15) {
      $('.cp_edit').hide();
      var _draggedCircleID = d3.select(this).attr("id");
      var _draggedCircle = findCircleFromID_rotate(_draggedCircleID);
      var _draggedCircleIndex = d3.select(this).attr("index");
      // var _testBtn = findBtnTag_rotate(_draggedCircleIndex);
      var _pairCircle = findCircleFromID_rotate("circleRotateStart_" + _draggedCircleIndex);
      var _handleCircle = findCircleFromID_rotate("circleRotateHandle_" + _draggedCircleIndex);
      var _centerCircle = findCircleFromID_rotate("circleRotateCenter_" + _draggedCircleIndex);

      if (event.cancelable) {
        event.preventDefault(); //prevent default mouse event for dragging svg elements
      }
      var _x = d3.select(this).attr("cx");
      var _y = d3.select(this).attr("cy");
      var _dx = d3.event.x - _x;
      var _dy = d3.event.y - _y;
      d3.select(this).attr("transform", "translate(" + _dx + "," + _dy + ")");
      d3.select(this).attr("xPos", d3.event.x).attr("yPos", d3.event.y);

      _draggedCircle.x = d3.event.x; //save changed coordination
      _draggedCircle.y = d3.event.y;

      var _x2 = _draggedCircle.x;
      var _y2 = _draggedCircle.y;
      var _x0, _y0, _x1, _y1;

      if (_pairCircle.y > 600) {
        _x1 = 120;
        _y1 = 320;
      } else {
        _x1 = _pairCircle.x;
        _y1 = _pairCircle.y;
      }

      if (_handleCircle.y > 600) {
        _x0 = 200;
        _y0 = 160;
      } else {
        _x0 = _handleCircle.x;
        _y0 = _handleCircle.y;
      }

      var _path = calcArcPath(_x1, _y1, _x2, _y2, _x0, _y0);
      var cx = findCenterPoint(_x1, _y1, _x2, _y2, _x0, _y0).x;
      var cy = findCenterPoint(_x1, _y1, _x2, _y2, _x0, _y0).y;
      var _cdx = cx - _centerCircle.x;
      var _cdy = cy - _centerCircle.y;
      d3.select("#circleRotateLine_" + _draggedCircleIndex).attr("d", _path);
      d3.select("#circleRotateCenter_" + _draggedCircleIndex).attr("cx", cx).attr("cy",cy);
    }
  } else {
    console.log("edit attr is false")
  }
}
function dragRotateCircleH(){
  console.log('draging')
  if (event.cancelable) {
    event.preventDefault(); //prevent default mouse event for dragging svg elements
  }

  if(edit == true) {
    dragging = dragging + 1;
    if (dragging > 15) {
      $('.cp_edit').hide();
      var _draggedCircleID = d3.select(this).attr("id");
      var _draggedCircle = findCircleFromID_rotate(_draggedCircleID);
      var _draggedCircleIndex = d3.select(this).attr("index");
      var _startCircle = findCircleFromID_rotate("circleRotateStart_" + _draggedCircleIndex);
      var _endCircle = findCircleFromID_rotate("circleRotateEnd_" + _draggedCircleIndex);
      var _centerCircle = findCircleFromID_rotate("circleRotateCenter_" + _draggedCircleIndex);

      var _x = d3.select(this).attr("cx");
      var _y = d3.select(this).attr("cy");
      var _dx = d3.event.x - _x;
      var _dy = d3.event.y - _y;

      d3.select(this).attr("transform", "translate(" + _dx + "," + _dy + ")");
      d3.select(this).attr("xPos", d3.event.x).attr("yPos", d3.event.y);

      _draggedCircle.x = d3.event.x; //save changed coordination
      _draggedCircle.y = d3.event.y;

      var _x1, _y1, _x2, _y2;
      var _x3 = _draggedCircle.x;
      var _y3 = _draggedCircle.y;

      if (_startCircle.y > 600) {
        _x1 = 120;
        _y1 = 320;
      } else {
        _x1 = _startCircle.x;
        _y1 = _startCircle.y;
      }

      if (_endCircle.y > 600) {
        _x2 = 280;
        _y2 = 320;
      } else {
        _x2 = _endCircle.x;
        _y2 = _endCircle.y;
      }

      var _path = calcArcPath(_x1, _y1, _x2, _y2, _x3, _y3);
      var cx = findCenterPoint(_x1, _y1, _x2, _y2, _x3, _y3).x;
      var cy = findCenterPoint(_x1, _y1, _x2, _y2, _x3, _y3).y;
      var _cdx = cx - _centerCircle.x;
      var _cdy = cy - _centerCircle.y;
      d3.select("#circleRotateLine_" + _draggedCircleIndex).attr("d", _path);
      d3.select("#circleRotateCenter_" + _draggedCircleIndex).attr("cx", cx).attr("cy",cy);
    }
  } else {
    console.log("edit attr is false")
  }
}
function findCircleFromID_rotate(_id){
  var _circle;
  for(var i in rotateCircleList){
    if(_id == rotateCircleList[i].id){
      _circle = rotateCircleList[i];
    }
  }
  return _circle;
}


// -----------------------------------------------  points 저장
$('.edit_complete_text').click(function() {
  var fromClient_infoUpdate = {};
  fromClient_infoUpdate.type = 'controlPoints';
  fromClient_infoUpdate.deviceIdx = Number($('.workspace').prop('index'));
  fromClient_infoUpdate.pushCP = pushCircleList;
  fromClient_infoUpdate.dragCP = dragCircleList;
  fromClient_infoUpdate.rotateCP = rotateCircleList;
  server_socket.emit('fromClient_infoUpdate', fromClient_infoUpdate);

  pushCircleList = [];
  dragCircleList = [];
  rotateCircleList = [];

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
})

$('.edit_cancle_text').click(function() {
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
})
7

// -----------------------------------------------  points 수정
$('.cp_test').click(function() {
  //socket data emit required
  fromClient_command.type = "controlPoints_push";
  fromClient_command.deviceIdx = $('.workspace').prop('index');
  fromClient_command.x1 = $('.cp_edit').prop('xPos');
  fromClient_command.y1 = $('.cp_edit').prop('yPos');
  console.log(fromClient_command.x1 + ", " + fromClient_command.y1);
  server_socket.emit('fromClient_command', fromClient_command);
})

$('.cp_delete').click(function() {
  var id = String($('.cp_edit').prop('cpId'));
  var idx = Number($('.cp_edit').prop('cpIdx'));
  var idxA = Number($('.cp_edit').prop('cpIdx'))-1;
  if($('.cp_edit').prop('cpType') == 'push') {
    $('.cp_edit').hide();
    d3.select('#' + id).remove();
    pushCircleList.splice(idxA, 1);
  } else if($('.cp_edit').prop('cpType') == 'drag') {
    $('.cp_edit').hide();
    console.log(id.includes('Start'))
    if (id.includes('Start') == true) {
      var arr = (3*idx)-3;
      d3.select('#' + id).remove();
      d3.select('#circleDragEnd_' + idx).remove();
      d3.select('#circleDragLine_' + idx).remove();
      d3.select('#circleDragHandle_' + idx).remove();
      dragCircleList.splice(arr, 3);
    } else if (id.includes('End') == true) {
      var arr = (3*idx)-3;
      d3.select('#' + id).remove();
      d3.select('#circleDragStart_' + idx).remove();
      d3.select('#circleDragLine_' + idx).remove();
      d3.select('#circleDragHandle_' + idx).remove();
      console.log(dragCircleList)
      dragCircleList.splice(arr, 3);
    }
  } else if($('.cp_edit').prop('cpType') == 'rotate') {
    $('.cp_edit').hide();
  }
})

var fromClient_command = {};
fromClient_command.type = "none";
fromClient_command.x1 = 0;
fromClient_command.y1 = 0;
fromClient_command.x2 = 0;
fromClient_command.y2 = 0;

// -----------------------------------------------  control points 그리기
function drawCP(_idx) {
  $.ajax({
    url: '/getdata_cp',
    method: 'post',
    data: {index: _idx},
    success: function(data){
      pushCP = data.pushCP;
      dragCP = data.dragCP;
      rotateCP = data.rotateCP;
      imageW = data.imageW;
      imageH = data.imageH;
      $('.workspace').prop('_w', data.imageW);
      $('.workspace').prop('_h', data.imageH);

      for(i in pushCP) {
        svgCanvas.append("circle")
          .attr("cx", pushCP[i].x)
          .attr("cy", pushCP[i].y)
          .attr("class", "circle-push2")
          .attr("id", pushCP[i].id)
          .on("click", function() {
            fromClient_command.type = "controlPoints_push";
            fromClient_command.deviceIdx = $('.workspace').prop('index');
            fromClient_command.x1 = d3.select(this).attr("cx");
            fromClient_command.y1 = d3.select(this).attr("cy");
            console.log(fromClient_command.x1 + ", " + fromClient_command.y1);
            server_socket.emit('fromClient_command', fromClient_command);
          })
      }

      var pathD = [];
      for(i in dragCP) {
        if(i%3 == 0) {
          pathD.push(i);
          svgCanvas.append("circle")
            .attr("cx", dragCP[i].x)
            .attr("cy", dragCP[i].y)
            .attr("class", "circle-pathEnd")
            .attr("id", dragCP[i].id)
          dragCircleList.push(new Circle(dragCP[i].id, dragCP[i].x, dragCP[i].y));
        } else if (i%3 == 1) {
          svgCanvas.append("circle")
            .attr("cx", dragCP[i].x)
            .attr("cy", dragCP[i].y)
            .attr("class", "circle-pathEnd")
            .attr("id", dragCP[i].id)
          dragCircleList.push(new Circle(dragCP[i].id, dragCP[i].x, dragCP[i].y));
        } else if (i%3 == 2) {
          pathD.push(i);
          var _path = "M"+ dragCP[i-2].x +"," + dragCP[i-2].y +" L"+ dragCP[i-1].x +"," + dragCP[i-1].y;
          svgCanvas.append("path")
            .attr("d", _path)
            .attr("stroke-width", "8px")
            .attr("class", "circle-dragLine")
            .attr("id", "circleDragLine_" + String((Number(i)+1)/3))
            .style("stroke", "rgba(222,140,131,1)")
            .style("stroke-linecap", "round");
          pathD.push(d3.select("#circleDragLine_" + String((Number(i)+1)/3)));

          dragCircleList.push(new Circle(dragCP[i].id, dragCP[i].x, dragCP[i].y));
          svgCanvas.append("circle")
            .attr("cx", dragCP[i].x)
            .attr("cy", dragCP[i].y)
            .attr("class", "circle-drag-handle2")
            .attr("id", dragCP[i].id)
            .attr("xPos", dragCP[i].x)
            .attr("yPos", dragCP[i].y)
            .attr("idx", Number(i))
            .call(
              d3.drag()
              .on("start", dragHandleStart)
              .on("drag", dragHandle)
              .on("end", dragHandleEnd)
            );
        }

        function dragHandleStart(e) {
          event.preventDefault();
          console.log('drag start');
          fromClient_command.type = "controlPoints_drag";
          fromClient_command.deviceIdx = $('.workspace').prop('index');
          fromClient_command.x1 = d3.select(this).attr("cx");
          fromClient_command.y1 = d3.select(this).attr("cy");
        }

        function dragHandle(e) {
          console.log('dragging')
          if (event.cancelable) {
            event.preventDefault();
          }
          var m = [d3.event.x, d3.event.y];
          var p = closestPoint(pathD[d3.select(this).attr("idx")].node(), m);
          d3.select(this).attr("cx", p[0]).attr("cy", p[1]);
        }

        function dragHandleEnd(e) {
          if (event.cancelable) {
            event.preventDefault();
          }
          console.log('drag end');
          fromClient_command.x2 = d3.select(this).attr('cx');
          fromClient_command.y2 = d3.select(this).attr('cy');
          dragCircleList[d3.select(this).attr("idx")].x = Number(d3.select(this).attr('cx'));
          dragCircleList[d3.select(this).attr("idx")].y = Number(d3.select(this).attr('cy'));
          fromClient_command.dragCP = dragCircleList;
          server_socket.emit('fromClient_command', fromClient_command);

        }
      }

      var pathR = new Array();
      var path_points = [];
      for(i in rotateCP) {
        if(i%4 == 0) {
          pathR.push(i);
          svgCanvas.append("circle")
            .attr("cx", rotateCP[i].x)
            .attr("cy", rotateCP[i].y)
            .attr("class", "circle-pathEnd")
            .attr("id", rotateCP[i].id)
          rotateCircleList.push(new Circle(rotateCP[i].id, rotateCP[i].x, rotateCP[i].y));
        } else if (i%4 == 1) {
          pathR.push(i);
          svgCanvas.append("circle")
            .attr("cx", rotateCP[i].x)
            .attr("cy", rotateCP[i].y)
            .attr("class", "circle-pathEnd")
            .attr("id", rotateCP[i].id)
          rotateCircleList.push(new Circle(rotateCP[i].id, rotateCP[i].x, rotateCP[i].y));
        } else if (i%4 == 2) {
          pathR.push(i);
          svgCanvas.append("circle")
            .attr("cx", rotateCP[i].x)
            .attr("cy", rotateCP[i].y)
            .attr("class", "circle-rotate-center")
            .attr("id", rotateCP[i].id)
          rotateCircleList.push(new Circle(rotateCP[i].id, rotateCP[i].x, rotateCP[i].y));
        } else if (i%4 == 3) {
          rotateCircleList.push(new Circle(rotateCP[i].id, rotateCP[i].x, rotateCP[i].y));
          //fromClient_command.circleIdx = Number(i);
          var j = Number(i) - 3;
          var k = Number(i) - 2;

          var _path = calcArcPath(rotateCP[j].x, rotateCP[j].y, rotateCP[k].x, rotateCP[k].y, rotateCP[i].x, rotateCP[i].y);
          var cx = findCenterPoint(rotateCP[j].x, rotateCP[j].y, rotateCP[k].x, rotateCP[k].y, rotateCP[i].x, rotateCP[i].y).x;
          var cy = findCenterPoint(rotateCP[j].x, rotateCP[j].y, rotateCP[k].x, rotateCP[k].y, rotateCP[i].x, rotateCP[i].y).y;

          svgCanvas.append("path")
            .attr("d", _path)
            .attr("stroke-width", "8px")
            .attr("class", "circle-rotateLine")
            .attr("id", "circleRotateLine_" + String((Number(i)+1)/4))
            .style("stroke", "rgba(222,140,131,1)")
            .style("stroke-linecap", "round");
          pathR.push(d3.select("#circleRotateLine_" + String((Number(i)+1)/4)));

          d3.select("#" + rotateCP[i-1].id).attr("cx", cx).attr("cy",cy);
          svgCanvas.append("circle")
            .attr("cx", rotateCP[i].x)
            .attr("cy", rotateCP[i].y)
            .attr("class", "circle-rotate-handle2")
            .attr("id", rotateCP[i].id)
            .attr("idx", Number(i))
            .call(
              d3.drag()
              .on("start", rotateHandleStart)
              .on("drag", function(e) {
                console.log('dragging')
                if (event.cancelable) {
                  event.preventDefault();
                }
                var m = [d3.event.x, d3.event.y];
                var p = closestPoint(pathR[d3.select(this).attr("idx")].node(), m);
                d3.select(this).attr("cx", p[0]).attr("cy", p[1]);
                path_points.push({x: p[0], y: p[1]})
              })
              .on("end", rotateHandleEnd)
            );
        }

        function rotateHandleStart(e) {
          event.preventDefault();
          console.log('drag start');
          fromClient_command.type = "controlPoints_rotate";
          fromClient_command.deviceIdx = $('.workspace').prop('index');
          fromClient_command.x1 = d3.select(this).attr('cx');
          fromClient_command.y1 = d3.select(this).attr('cy');
        }

        function rotateHandle() {

        }

        function rotateHandleEnd(e) {
          if (event.cancelable) {
            event.preventDefault();
          }
          console.log('drag end');
          fromClient_command.x2 = d3.select(this).attr('cx');
          fromClient_command.y2 = d3.select(this).attr('cy');
          fromClient_command.cx = cx;
          fromClient_command.cy = cy;
          fromClient_command.path = path_points;
          rotateCircleList[d3.select(this).attr("idx")].x = Number(d3.select(this).attr('cx'));
          rotateCircleList[d3.select(this).attr("idx")].y = Number(d3.select(this).attr('cy'));
          fromClient_command.rotateCP = rotateCircleList;
          server_socket.emit('fromClient_command', fromClient_command);
          path_points = [];
        }
      }
    },
    error: function(err) {
      console.log(err);
    }
  });

  function findCP(_x, _y) {
    for (i in pushCP) {

    }
    dist(_x, _y, pushCP[i].x, pushCP[i].y)
  }
}


// -----------------------------------------------  control points 그리기
var pathPoints = new Array();
var start = {x: 206, y: 240};
pathPoints.push(start);
var path_ = "M 206 240";
var path_list = "M 92.7 73";

function clearPath() {
  svgCanvasP.selectAll("circle").remove();
  svgCanvasP.selectAll("path").remove();
  svgCanvasP.selectAll("polygon").remove();
  actSVG.selectAll("circle").remove();
  actSVG.selectAll("path").remove();
  actSVG.selectAll("polygon").remove();
  pathPoints = [];
  pathPoints.push(start);
  path_ = "M 206 240";
  path_list = "M 92.7 73";

  d3.select("#arrow").append("polygon").attr("points", "0 0, 4 2, 0 4, 1 2, 0 0").attr("fill", "rgba(224,90,82,1)")
}

function x2list(_x) {
  var x_ = _x*0.45;
  return x_;
}
function y2list(_y) {
  var y_ = (0.4*_y)-(0.025*window.innerHeight);
  return y_;
}

function drawCP_ae(_idx, _points, _d, _d_sub) {
  pathPoints = _points.slice();
  path_ = _d;
  path_list = _d_sub;
  for(var i in _points) {
    if(i > 0) {
      actSVG.append("circle")
        .attr("cx", _points[i].x)
        .attr("cy", _points[i].y)
        .attr("class", "circle-push3 selected")
    }
  }
  actSVG.append("path")
    .attr("d", path_)
    .attr("stroke-width", "8px")
    .attr("id", "actionPath")
    .attr("marker-end","url(#arrow)")
    .style("stroke", "rgba(224,90,82,1)")
    .style("fill", "none")
    .style("stroke-linecap", "round")
    .style("stroke-linejoin", "round")
    .style("z-index", 1);

  d3.select("#arrow").append("polygon").attr("points", "0 0, 4 2, 0 4, 1 2, 0 0").attr("fill", "rgba(224,90,82,1)")

  $.ajax({
    url: '/getdata_cp',
    method: 'post',
    data: {index: _idx},
    success: function(data){
      pushCP = data.pushCP;
      dragCP = data.dragCP;
      rotateCP = data.rotateCP;

      for(i in pushCP) {
        svgCanvas.append("circle")
          .attr("cx", pushCP[i].x)
          .attr("cy", pushCP[i].y)
          .attr("class", "circle-push3")
          .attr("id", pushCP[i].id)
          .style("z-index", 2)
          .on("click", dragEnd_p)
          .call(
            d3.drag()
            .on("start", function() {
              console.log('start')
            })
            .on("drag", function() {
              console.log('ing')
            })
            .on("end", function() {
              console.log('end')
            })
          );

          function dragEnd_p(e) {
            var _point = {x: Number(d3.select(this).attr("cx")), y: Number(d3.select(this).attr("cy")), type: "push"};
            pathPoints.push(_point);
            path_ = path_ + "L " + d3.select(this).attr("cx") + " " + d3.select(this).attr("cy") + " ";
            var _y = String((0.4*Number(d3.select(this).attr("cy")))-(0.025*window.innerHeight));
            path_list = path_list + "L " + 0.45*Number(d3.select(this).attr("cx")) + " " + _y + " ";
            d3.select("#actionPath").remove();
            //d3.select("#arrow").remove();
            actSVG.append("circle")
              .attr("cx", d3.select(this).attr("cx"))
              .attr("cy", d3.select(this).attr("cy"))
              .attr("id", d3.select(this).attr("id"))
              .attr("class", "circle-push3 selected")
              .style("z-index", 2)
            actSVG.append("path")
              .attr("d", path_)
              .attr("stroke-width", "8px")
              .attr("id", "actionPath")
              .attr("marker-end","url(#arrow)")
              .style("stroke", "rgba(224,90,82,1)")
              .style("fill", "none")
              .style("stroke-linecap", "round")
              .style("stroke-linejoin", "round")
              .style("z-index", 1);
            //d3.select("#actionPath").lower();
            d3.select("#arrow").raise();
            console.log(pathPoints)
            console.log(_points)
          }
      }

      var pathD = new Array();
      for(i in dragCP) {
        if(i%3 == 0) {
          pathD.push(i);
          svgCanvas.append("circle")
            .attr("cx", dragCP[i].x)
            .attr("cy", dragCP[i].y)
            .attr("class", "circle-pathEnd3")
            .attr("id", dragCP[i].id)
            .style("z-index", 2)
          dragCircleList.push(new Circle(dragCP[i].id, dragCP[i].x, dragCP[i].y));
          svgCanvas.append("circle")
            .attr("cx", dragCP[i].x)
            .attr("cy", dragCP[i].y)
            .attr("class", "circle-push3 selected")
            .attr("id", "dragStart")
            .style("z-index", 1)
            .style("display", "none")
        } else if (i%3 == 1) {
          svgCanvas.append("circle")
            .attr("cx", dragCP[i].x)
            .attr("cy", dragCP[i].y)
            .attr("class", "circle-pathEnd3")
            .attr("id", dragCP[i].id)
            .style("z-index", 2)
          dragCircleList.push(new Circle(dragCP[i].id, dragCP[i].x, dragCP[i].y));
        } else if (i%3 == 2) {
          pathD.push(i);
          var _path = "M"+ dragCP[i-2].x +"," + dragCP[i-2].y +" L"+ dragCP[i-1].x +"," + dragCP[i-1].y;
          svgCanvas.append("path")
            .attr("d", _path)
            .attr("stroke-width", "8px")
            .attr("class", "circle-dragLine")
            .attr("id", "circleDragLine_" + String((Number(i)+1)/3))
            .attr("_x", "none")
            .attr("_y", "none")
            .style("stroke", "rgba(200,200,200,1)")
            .style("stroke-linecap", "round")
            .style("z-index", 2)
            .call(
              d3.drag()
              .on("start", dragStart_d)
              .on("drag", dragging_d)
              .on("end", dragEnd_d)
            );
          pathD.push(d3.select("#circleDragLine_" + String((Number(i)+1)/3)));

          dragCircleList.push(new Circle(dragCP[i].id, dragCP[i].x, dragCP[i].y));
        }

        function dragStart_d(e) {
          console.log('dragStart')
          if (event.cancelable) {
            event.preventDefault();
          }
          var m = [d3.event.x, d3.event.y];
          var p = closestPoint(d3.select(this).node(), m);

          d3.select(this).attr("_x", p[0]).attr("_y", p[1]);
          d3.select("#dragStart").attr("cx", p[0]).attr("cy", p[1]);
          actSVG.append("circle")
            .attr("cx", p[0])
            .attr("cy", p[1])
            .attr("class", "circle-push3 selected")
            .attr("id", "dragStart")
            .style("z-index", 1)

          var _point = {x: Number(d3.select(this).attr("_x")), y: Number(d3.select(this).attr("_y")), type: "dragStart"};
          var _y = String((0.4*Number(d3.select(this).attr("_y")))-(0.025*window.innerHeight));
          pathPoints.push(_point);
          path_ = path_ + "L " + d3.select(this).attr("_x") + " " + d3.select(this).attr("_y") + " ";
          path_list = path_list + "L " + 0.45*Number(d3.select(this).attr("_x")) + " " + _y + " ";
          d3.select("#actionPath").remove();
          console.log()
          //d3.select("#arrow").remove();
          actSVG.append("path")
            .attr("d", path_)
            .attr("stroke-width", "8px")
            .attr("id", "actionPath")
            .attr("marker-end","url(#arrow)")
            .style("stroke", "rgba(224,90,82,1)")
            .style("fill", "none")
            .style("stroke-linecap", "round")
            .style("stroke-linejoin", "round")
            .style("z-index", 1);
          //d3.select("#actionPath").lower();
          d3.select("#arrow").raise();
        }

        function dragging_d(e) {
          console.log('dragging')
          if (event.cancelable) {
            event.preventDefault();
          }
          var m = [d3.event.x, d3.event.y];
          var p = closestPoint(d3.select(this).node(), m);
          d3.select(this).attr("_x", p[0]).attr("_y", p[1]);
          var _y = String((0.4*Number(d3.select(this).attr("_y")))-(0.025*window.innerHeight));

          path_ = path_ + "L " + d3.select(this).attr("_x") + " " + d3.select(this).attr("_y") + " ";
          path_list = path_list + "L " + 0.45*Number(d3.select(this).attr("_x")) + " " + _y + " ";
          d3.select("#actionPath").remove();
          //d3.select("#arrow").remove();
          actSVG.append("path")
            .attr("d", path_)
            .attr("stroke-width", "8px")
            .attr("id", "actionPath")
            .attr("marker-end","url(#arrow)")
            .style("stroke", "rgba(224,90,82,1)")
            .style("fill", "none")
            .style("stroke-linecap", "round")
            .style("stroke-linejoin", "round")
            .style("z-index", 1);
          //d3.select("#actionPath").lower();
          d3.select("#arrow").raise();
        }

        function dragEnd_d(e) {
          console.log("drag end")
          if (event.cancelable) {
            event.preventDefault();
          }
          var m = [d3.event.x, d3.event.y];
          var p = closestPoint(d3.select(this).node(), m);
          d3.select(this).attr("_x", p[0]).attr("_y", p[1]);

          actSVG.append("circle")
            .attr("cx", p[0])
            .attr("cy", p[1])
            .attr("class", "circle-push3 selected")
            .attr("id", "dragEnd")
            .style("z-index", 1)
          d3.select("#arrow").raise();
          d3.select("#actionPath").remove();
          //d3.select("#arrow").remove();
          actSVG.append("path")
            .attr("d", path_)
            .attr("stroke-width", "8px")
            .attr("id", "actionPath")
            .attr("marker-end","url(#arrow)")
            .style("stroke", "rgba(224,90,82,1)")
            .style("fill", "none")
            .style("stroke-linecap", "round")
            .style("stroke-linejoin", "round")
            .style("z-index", 1);
          var _point = {x: Number(d3.select(this).attr("_x")), y: Number(d3.select(this).attr("_y")), type: "dragEnd"};
          pathPoints.push(_point);
          console.log(pathPoints)
        }
      }

      var pathR = new Array();
      for(i in rotateCP) {
        if(i%4 == 0) {
          pathR.push(i);
          svgCanvas.append("circle")
            .attr("cx", rotateCP[i].x)
            .attr("cy", rotateCP[i].y)
            .attr("class", "circle-pathEnd3")
            .attr("id", rotateCP[i].id)
            .style("z-index", 2)
          rotateCircleList.push(new Circle(rotateCP[i].id, rotateCP[i].x, rotateCP[i].y));
        } else if (i%4 == 1) {
          pathR.push(i);
          svgCanvas.append("circle")
            .attr("cx", rotateCP[i].x)
            .attr("cy", rotateCP[i].y)
            .attr("class", "circle-pathEnd3")
            .attr("id", rotateCP[i].id)
            .style("z-index", 2)
          rotateCircleList.push(new Circle(rotateCP[i].id, rotateCP[i].x, rotateCP[i].y));
        } else if (i%4 == 2) {
          pathR.push(i);
          svgCanvas.append("circle")
            .attr("cx", rotateCP[i].x)
            .attr("cy", rotateCP[i].y)
            .attr("class", "circle-rotate-center3")
            .attr("id", rotateCP[i].id)
            .style("z-index", 2)
          rotateCircleList.push(new Circle(rotateCP[i].id, rotateCP[i].x, rotateCP[i].y));
        } else if (i%4 == 3) {
          rotateCircleList.push(new Circle(rotateCP[i].id, rotateCP[i].x, rotateCP[i].y));
          //fromClient_command.circleIdx = Number(i);
          var j = Number(i) - 3;
          var k = Number(i) - 2;

          var _path = calcArcPath(rotateCP[j].x, rotateCP[j].y, rotateCP[k].x, rotateCP[k].y, rotateCP[i].x, rotateCP[i].y);
          var cx = findCenterPoint(rotateCP[j].x, rotateCP[j].y, rotateCP[k].x, rotateCP[k].y, rotateCP[i].x, rotateCP[i].y).x;
          var cy = findCenterPoint(rotateCP[j].x, rotateCP[j].y, rotateCP[k].x, rotateCP[k].y, rotateCP[i].x, rotateCP[i].y).y;

          svgCanvas.append("path")
            .attr("d", _path)
            .attr("stroke-width", "8px")
            .attr("class", "circle-rotateLine")
            .attr("id", "circleRotateLine_" + String((Number(i)+1)/4))
            .style("stroke", "rgba(200,200,200,1)")
            .style("stroke-linecap", "round")
            .style("z-index", 2)
            .call(
              d3.drag()
              .on("start", dragStart_r)
              .on("drag", dragging_r)
              .on("end", dragEnd_r)
            );;
          pathR.push(d3.select("#circleRotateLine_" + String((Number(i)+1)/4)));

          d3.select("#" + rotateCP[i-1].id).attr("cx", cx).attr("cy",cy);
        }

        function dragStart_r(e) {
          console.log('dragStart')
          if (event.cancelable) {
            event.preventDefault();
          }
          var m = [d3.event.x, d3.event.y];
          var p = closestPoint(d3.select(this).node(), m);
          var _r = dist(p[0],p[1],cx,cy);

          d3.select(this).attr("_x", p[0]).attr("_y", p[1]);
          actSVG.append("circle")
            .attr("cx", p[0])
            .attr("cy", p[1])
            .attr("class", "circle-push3 selected")
            .attr("id", "dragStart")
            .style("z-index", 1)

          var _point = {x: Number(d3.select(this).attr("_x")), y: Number(d3.select(this).attr("_y")), type: "rotateStart", r: Number(_r)};
          pathPoints.push(_point);
          var _y = String((0.4*Number(d3.select(this).attr("_y")))-(0.025*window.innerHeight));
          path_ = path_ + "L " + d3.select(this).attr("_x") + " " + d3.select(this).attr("_y") + " ";
          path_list = path_list + "L " + 0.45*Number(d3.select(this).attr("_x")) + " " + _y + " ";
          d3.select("#actionPath").remove();
          //d3.select("#arrow").remove();
          actSVG.append("path")
            .attr("d", path_)
            .attr("stroke-width", "8px")
            .attr("id", "actionPath")
            .attr("marker-end","url(#arrow)")
            .style("stroke", "rgba(224,90,82,1)")
            .style("fill", "none")
            .style("stroke-linecap", "round")
            .style("stroke-linejoin", "round")
            .style("z-index", 1);
          //d3.select("#actionPath").lower();
          d3.select("#arrow").raise();
        }

        function dragging_r(e) {
          console.log('dragging')
          if (event.cancelable) {
            event.preventDefault();
          }
          var m = [d3.event.x, d3.event.y];
          var p = closestPoint(d3.select(this).node(), m);
          console.log(m + ", " + p)
          d3.select(this).attr("_x", p[0]).attr("_y", p[1]);
          var _y = String((0.4*Number(d3.select(this).attr("_y")))-(0.025*window.innerHeight));
          path_ = path_ + "L " + d3.select(this).attr("_x") + " " + d3.select(this).attr("_y") + " ";
          path_list = path_list + "L " + 0.45*Number(d3.select(this).attr("_x")) + " " + _y + " ";
          d3.select("#actionPath").remove();
          //d3.select("#arrow").remove();
          actSVG.append("path")
            .attr("d", path_)
            .attr("stroke-width", "8px")
            .attr("id", "actionPath")
            .attr("marker-end","url(#arrow)")
            .style("stroke", "rgba(224,90,82,1)")
            .style("fill", "none")
            .style("stroke-linecap", "round")
            .style("stroke-linejoin", "round")
            .style("z-index", 1);
          //d3.select("#actionPath").lower();
          d3.select("#arrow").raise();
        }

        function dragEnd_r(e) {
          console.log("drag end")
          if (event.cancelable) {
            event.preventDefault();
          }
          var m = [d3.event.x, d3.event.y];
          var p = closestPoint(d3.select(this).node(), m);
          d3.select(this).attr("_x", p[0]).attr("_y", p[1]);
          var _r = dist(p[0],p[1],cx,cy);

          actSVG.append("circle")
            .attr("cx", p[0])
            .attr("cy", p[1])
            .attr("class", "circle-push3 selected")
            .attr("id", "dragEnd")
            .style("z-index", 1)
          d3.select("#arrow").raise();
          d3.select("#actionPath").remove();
          //d3.select("#arrow").remove();
          actSVG.append("path")
            .attr("d", path_)
            .attr("stroke-width", "8px")
            .attr("id", "actionPath")
            .attr("marker-end","url(#arrow)")
            .style("stroke", "rgba(224,90,82,1)")
            .style("fill", "none")
            .style("stroke-linecap", "round")
            .style("stroke-linejoin", "round")
            .style("z-index", 1);
          var _point = {x: Number(d3.select(this).attr("_x")), y: Number(d3.select(this).attr("_y")), type: "rotateEnd", r: Number(_r)};
          console.log(pathPoints)
        }

      }
    },
    error: function(err) {
      console.log(err);
    }
  })
}

function drawCP_a(_idx) {
  path_rotate = [];
  $.ajax({
    url: '/getdata_cp',
    method: 'post',
    data: {index: _idx},
    success: function(data){
      pushCP = data.pushCP;
      dragCP = data.dragCP;
      rotateCP = data.rotateCP;

      for(i in pushCP) {
        svgCanvas.append("circle")
          .attr("cx", pushCP[i].x)
          .attr("cy", pushCP[i].y)
          .attr("class", "circle-push3")
          .attr("id", pushCP[i].id)
          .style("z-index", 2)
          .on("click", dragEnd_p)
          .call(
            d3.drag()
            .on("start", function() {
              console.log('start')
            })
            .on("drag", function() {
              console.log('ing')
            })
            .on("end", function() {
              console.log('end')
            })
          );
          // .call(
          //   d3.drag()
          //   .on("end", dragEnd_p)
          // );

          function dragEnd_p(e) {
            console.log('click');
            console.log(d3.select(this).attr("cx"))
            var _point = {x: Number(d3.select(this).attr("cx")), y: Number(d3.select(this).attr("cy")), type: "push"};
            pathPoints.push(_point);
            path_ = path_ + "L " + d3.select(this).attr("cx") + " " + d3.select(this).attr("cy") + " ";
            var _y = String((0.4*Number(d3.select(this).attr("cy")))-(0.025*window.innerHeight));
            path_list = path_list + "L " + 0.45*Number(d3.select(this).attr("cx")) + " " + _y + " ";
            d3.select("#actionPath").remove();
            //d3.select("#arrow").remove();
            svgCanvasP.append("circle")
              .attr("cx", d3.select(this).attr("cx"))
              .attr("cy", d3.select(this).attr("cy"))
              .attr("id", d3.select(this).attr("id"))
              .attr("class", "circle-push3 selected")
              .style("z-index", 2)
            svgCanvasP.append("path")
              .attr("d", path_)
              .attr("stroke-width", "8px")
              .attr("id", "actionPath")
              .attr("marker-end","url(#arrow)")
              .style("stroke", "rgba(224,90,82,1)")
              .style("fill", "none")
              .style("stroke-linecap", "round")
              .style("stroke-linejoin", "round")
              .style("z-index", 1);
            //d3.select("#actionPath").lower();
            d3.select("#arrow").raise();
            console.log(pathPoints)
          }
      }

      var pathD = new Array();
      for(i in dragCP) {
        if(i%3 == 0) {
          pathD.push(i);
          svgCanvas.append("circle")
            .attr("cx", dragCP[i].x)
            .attr("cy", dragCP[i].y)
            .attr("class", "circle-pathEnd3")
            .attr("id", dragCP[i].id)
            .style("z-index", 2)
          dragCircleList.push(new Circle(dragCP[i].id, dragCP[i].x, dragCP[i].y));
          svgCanvas.append("circle")
            .attr("cx", dragCP[i].x)
            .attr("cy", dragCP[i].y)
            .attr("class", "circle-push3 selected")
            .attr("id", "dragStart")
            .style("z-index", 1)
            .style("display", "none")
        } else if (i%3 == 1) {
          svgCanvas.append("circle")
            .attr("cx", dragCP[i].x)
            .attr("cy", dragCP[i].y)
            .attr("class", "circle-pathEnd3")
            .attr("id", dragCP[i].id)
            .style("z-index", 2)
          dragCircleList.push(new Circle(dragCP[i].id, dragCP[i].x, dragCP[i].y));
        } else if (i%3 == 2) {
          pathD.push(i);
          var _path = "M"+ dragCP[i-2].x +"," + dragCP[i-2].y +" L"+ dragCP[i-1].x +"," + dragCP[i-1].y;
          svgCanvas.append("path")
            .attr("d", _path)
            .attr("stroke-width", "8px")
            .attr("class", "circle-dragLine")
            .attr("id", "circleDragLine_" + String((Number(i)+1)/3))
            .attr("_x", "none")
            .attr("_y", "none")
            .style("stroke", "rgba(200,200,200,1)")
            .style("stroke-linecap", "round")
            .style("z-index", 2)
            .call(
              d3.drag()
              .on("start", dragStart_d)
              .on("drag", dragging_d)
              .on("end", dragEnd_d)
            );
          pathD.push(d3.select("#circleDragLine_" + String((Number(i)+1)/3)));

          dragCircleList.push(new Circle(dragCP[i].id, dragCP[i].x, dragCP[i].y));
        }

        function dragStart_d(e) {
          console.log('dragStart')
          if (event.cancelable) {
            event.preventDefault();
          }
          var m = [d3.event.x, d3.event.y];
          var p = closestPoint(d3.select(this).node(), m);

          d3.select(this).attr("_x", p[0]).attr("_y", p[1]);
          d3.select("#dragStart").attr("cx", p[0]).attr("cy", p[1]);
          svgCanvasP.append("circle")
            .attr("cx", p[0])
            .attr("cy", p[1])
            .attr("class", "circle-push3 selected")
            .attr("id", "dragStart")
            .style("z-index", 1)

          var _point = {x: Number(d3.select(this).attr("_x")), y: Number(d3.select(this).attr("_y")), type: "dragStart"};
          var _y = String((0.4*Number(d3.select(this).attr("_y")))-(0.025*window.innerHeight));
          pathPoints.push(_point);
          path_ = path_ + "L " + d3.select(this).attr("_x") + " " + d3.select(this).attr("_y") + " ";
          path_list = path_list + "L " + 0.45*Number(d3.select(this).attr("_x")) + " " + _y + " ";
          d3.select("#actionPath").remove();
          console.log()
          //d3.select("#arrow").remove();
          svgCanvasP.append("path")
            .attr("d", path_)
            .attr("stroke-width", "8px")
            .attr("id", "actionPath")
            .attr("marker-end","url(#arrow)")
            .style("stroke", "rgba(224,90,82,1)")
            .style("fill", "none")
            .style("stroke-linecap", "round")
            .style("stroke-linejoin", "round")
            .style("z-index", 1);
          //d3.select("#actionPath").lower();
          d3.select("#arrow").raise();
        }

        function dragging_d(e) {
          console.log('dragging')
          if (event.cancelable) {
            event.preventDefault();
          }
          var m = [d3.event.x, d3.event.y];
          var p = closestPoint(d3.select(this).node(), m);
          d3.select(this).attr("_x", p[0]).attr("_y", p[1]);
          var _y = String((0.4*Number(d3.select(this).attr("_y")))-(0.025*window.innerHeight));

          path_ = path_ + "L " + d3.select(this).attr("_x") + " " + d3.select(this).attr("_y") + " ";
          path_list = path_list + "L " + 0.45*Number(d3.select(this).attr("_x")) + " " + _y + " ";
          d3.select("#actionPath").remove();
          //d3.select("#arrow").remove();
          svgCanvasP.append("path")
            .attr("d", path_)
            .attr("stroke-width", "8px")
            .attr("id", "actionPath")
            .attr("marker-end","url(#arrow)")
            .style("stroke", "rgba(224,90,82,1)")
            .style("fill", "none")
            .style("stroke-linecap", "round")
            .style("stroke-linejoin", "round")
            .style("z-index", 1);
          //d3.select("#actionPath").lower();
          d3.select("#arrow").raise();
        }

        function dragEnd_d(e) {
          console.log("drag end")
          if (event.cancelable) {
            event.preventDefault();
          }
          var m = [d3.event.x, d3.event.y];
          var p = closestPoint(d3.select(this).node(), m);
          d3.select(this).attr("_x", p[0]).attr("_y", p[1]);

          svgCanvasP.append("circle")
            .attr("cx", p[0])
            .attr("cy", p[1])
            .attr("class", "circle-push3 selected")
            .attr("id", "dragEnd")
            .style("z-index", 1)
          d3.select("#arrow").raise();
          d3.select("#actionPath").remove();
          //d3.select("#arrow").remove();
          svgCanvasP.append("path")
            .attr("d", path_)
            .attr("stroke-width", "8px")
            .attr("id", "actionPath")
            .attr("marker-end","url(#arrow)")
            .style("stroke", "rgba(224,90,82,1)")
            .style("fill", "none")
            .style("stroke-linecap", "round")
            .style("stroke-linejoin", "round")
            .style("z-index", 1);
          var _point = {x: Number(d3.select(this).attr("_x")), y: Number(d3.select(this).attr("_y")), type: "dragEnd"};
          pathPoints.push(_point);
          console.log(pathPoints)
        }
      }

      var pathR = new Array();
      for(i in rotateCP) {
        if(i%4 == 0) {
          pathR.push(i);
          svgCanvas.append("circle")
            .attr("cx", rotateCP[i].x)
            .attr("cy", rotateCP[i].y)
            .attr("class", "circle-pathEnd3")
            .attr("id", rotateCP[i].id)
            .style("z-index", 2)
          rotateCircleList.push(new Circle(rotateCP[i].id, rotateCP[i].x, rotateCP[i].y));
        } else if (i%4 == 1) {
          pathR.push(i);
          svgCanvas.append("circle")
            .attr("cx", rotateCP[i].x)
            .attr("cy", rotateCP[i].y)
            .attr("class", "circle-pathEnd3")
            .attr("id", rotateCP[i].id)
            .style("z-index", 2)
          rotateCircleList.push(new Circle(rotateCP[i].id, rotateCP[i].x, rotateCP[i].y));
        } else if (i%4 == 2) {
          pathR.push(i);
          svgCanvas.append("circle")
            .attr("cx", rotateCP[i].x)
            .attr("cy", rotateCP[i].y)
            .attr("class", "circle-rotate-center3")
            .attr("id", rotateCP[i].id)
            .style("z-index", 2)
          rotateCircleList.push(new Circle(rotateCP[i].id, rotateCP[i].x, rotateCP[i].y));
        } else if (i%4 == 3) {
          rotateCircleList.push(new Circle(rotateCP[i].id, rotateCP[i].x, rotateCP[i].y));
          //fromClient_command.circleIdx = Number(i);
          var j = Number(i) - 3;
          var k = Number(i) - 2;

          var _path = calcArcPath(rotateCP[j].x, rotateCP[j].y, rotateCP[k].x, rotateCP[k].y, rotateCP[i].x, rotateCP[i].y);
          var cx = findCenterPoint(rotateCP[j].x, rotateCP[j].y, rotateCP[k].x, rotateCP[k].y, rotateCP[i].x, rotateCP[i].y).x;
          var cy = findCenterPoint(rotateCP[j].x, rotateCP[j].y, rotateCP[k].x, rotateCP[k].y, rotateCP[i].x, rotateCP[i].y).y;

          svgCanvas.append("path")
            .attr("d", _path)
            .attr("stroke-width", "8px")
            .attr("class", "circle-rotateLine")
            .attr("id", "circleRotateLine_" + String((Number(i)+1)/4))
            .style("stroke", "rgba(200,200,200,1)")
            .style("stroke-linecap", "round")
            .style("z-index", 2)
            .call(
              d3.drag()
              .on("start", dragStart_r)
              .on("drag", dragging_r)
              .on("end", dragEnd_r)
            );;
          pathR.push(d3.select("#circleRotateLine_" + String((Number(i)+1)/4)));

          d3.select("#" + rotateCP[i-1].id).attr("cx", cx).attr("cy",cy);
        }

        function dragStart_r(e) {
          console.log('dragStart')
          if (event.cancelable) {
            event.preventDefault();
          }
          var m = [d3.event.x, d3.event.y];
          var p = closestPoint(d3.select(this).node(), m);
          var _r = dist(p[0],p[1],cx,cy);

          d3.select(this).attr("_x", p[0]).attr("_y", p[1]);
          svgCanvasP.append("circle")
            .attr("cx", p[0])
            .attr("cy", p[1])
            .attr("class", "circle-push3 selected")
            .attr("id", "dragStart")
            .style("z-index", 1)

          var _point = {x: Number(d3.select(this).attr("_x")), y: Number(d3.select(this).attr("_y")), type: "rotateStart", r: Number(_r)};
          pathPoints.push(_point);
          var _y = String((0.4*Number(d3.select(this).attr("_y")))-(0.025*window.innerHeight));
          path_ = path_ + "L " + d3.select(this).attr("_x") + " " + d3.select(this).attr("_y") + " ";
          path_list = path_list + "L " + 0.45*Number(d3.select(this).attr("_x")) + " " + _y + " ";
          d3.select("#actionPath").remove();
          //d3.select("#arrow").remove();
          svgCanvasP.append("path")
            .attr("d", path_)
            .attr("stroke-width", "8px")
            .attr("id", "actionPath")
            .attr("marker-end","url(#arrow)")
            .style("stroke", "rgba(224,90,82,1)")
            .style("fill", "none")
            .style("stroke-linecap", "round")
            .style("stroke-linejoin", "round")
            .style("z-index", 1);
          //d3.select("#actionPath").lower();
          d3.select("#arrow").raise();
        }

        function dragging_r(e) {
          console.log('dragging')
          if (event.cancelable) {
            event.preventDefault();
          }
          var m = [d3.event.x, d3.event.y];
          var p = closestPoint(d3.select(this).node(), m);
          console.log(m + ", " + p)
          d3.select(this).attr("_x", p[0]).attr("_y", p[1]);
          path_rotate.push({x: p[0], y: p[1], type: "rotating"});
          var _y = String((0.4*Number(d3.select(this).attr("_y")))-(0.025*window.innerHeight));
          path_ = path_ + "L " + d3.select(this).attr("_x") + " " + d3.select(this).attr("_y") + " ";
          path_list = path_list + "L " + 0.45*Number(d3.select(this).attr("_x")) + " " + _y + " ";
          d3.select("#actionPath").remove();
          //d3.select("#arrow").remove();
          svgCanvasP.append("path")
            .attr("d", path_)
            .attr("stroke-width", "8px")
            .attr("id", "actionPath")
            .attr("marker-end","url(#arrow)")
            .style("stroke", "rgba(224,90,82,1)")
            .style("fill", "none")
            .style("stroke-linecap", "round")
            .style("stroke-linejoin", "round")
            .style("z-index", 1);
          //d3.select("#actionPath").lower();
          d3.select("#arrow").raise();
        }

        function dragEnd_r(e) {
          console.log("drag end")
          if (event.cancelable) {
            event.preventDefault();
          }
          var m = [d3.event.x, d3.event.y];
          var p = closestPoint(d3.select(this).node(), m);
          d3.select(this).attr("_x", p[0]).attr("_y", p[1]);
          var _r = dist(p[0],p[1],cx,cy);

          svgCanvasP.append("circle")
            .attr("cx", p[0])
            .attr("cy", p[1])
            .attr("class", "circle-push3 selected")
            .attr("id", "dragEnd")
            .style("z-index", 1)
          d3.select("#arrow").raise();
          d3.select("#actionPath").remove();
          //d3.select("#arrow").remove();
          svgCanvasP.append("path")
            .attr("d", path_)
            .attr("stroke-width", "8px")
            .attr("id", "actionPath")
            .attr("marker-end","url(#arrow)")
            .style("stroke", "rgba(224,90,82,1)")
            .style("fill", "none")
            .style("stroke-linecap", "round")
            .style("stroke-linejoin", "round")
            .style("z-index", 1);
          var _point = {x: Number(d3.select(this).attr("_x")), y: Number(d3.select(this).attr("_y")), type: "rotateEnd", r: Number(_r)};
          var alpha = Math.round(path_rotate.length / 4);
          var beta = Math.round(path_rotate.length / 2);
          var gamma = Math.round(path_rotate.length*3/4);
          pathPoints.push(path_rotate[alpha]);
          pathPoints.push(path_rotate[beta]);
          pathPoints.push(path_rotate[gamma]);
          path_rotate = [];
          pathPoints.push(_point);
          console.log(pathPoints)
        }

      }
    },
    error: function(err) {
      console.log(err);
    }
  });
}


// -----------------------------------------------  control points 그리기
function drawCP_e(_idx) {
  $.ajax({
    url: '/getdata_cp',
    method: 'post',
    data: {index: _idx},
    success: function(data){
      pushCP = data.pushCP;
      dragCP = data.dragCP;
      rotateCP = data.rotateCP;

      for(i in pushCP) {
        generatePushCircle(pushCP[i].x, pushCP[i].y)
      }

      for(i in dragCP) {
        if(i%3 == 0) {
          var j = Number(i) + 1;
          var k = Number(i) + 2;
          generateDragCircle(dragCP[i].x, dragCP[i].y, dragCP[j].x, dragCP[j].y, dragCP[k].x, dragCP[k].y);
        }
      }

      for(i in rotateCP) {
        if(i%4 == 0) {
          var j = Number(i) + 1;
          var k = Number(j) + 1;
          var l = Number(k) + 1;
          generateRotateCircle(rotateCP[i].x, rotateCP[i].y, rotateCP[j].x, rotateCP[j].y, rotateCP[l].x, rotateCP[l].y);
        }
      }
    },
    error: function(err) {
      console.log(err);
    }
  });
}


// -----------------------------------------------  control points clear
function clearCP() {
  svgCanvas.selectAll('circle').remove();
  svgCanvas.selectAll('path').remove();
  $('.workspace_cover').hide();
  $('.cp_edit').hide();
  pushCircleList = [];
  dragCircleList = [];
  rotateCircleList = [];
  pushIndex = 1;
  dragIndex = 1;
  rotateIndex = 1;
}

// -----------------------------------------------  Mathmetics
function findCenterPoint(_x1, _y1, _x2, _y2, _x3, _y3) {
  var a1 = (_y1 - _y2) / (_x1 - _x2);
  var cT1 = (Math.pow(_y1, 2) - Math.pow(_y2, 2)) + (Math.pow(_x1, 2) - Math.pow(_x2, 2));
  var cB1 = 2 * (_y1 - _y2);
  var c1 = cT1/cB1;
  var a2 = (_y3 - _y2) / (_x3 - _x2);
  var cT2 = Math.pow(_y3, 2) - Math.pow(_y2, 2) + Math.pow(_x3, 2) - Math.pow(_x2, 2);
  var cB2 = 2 * (_y3 - _y2);
  var c2 = cT2/cB2;

  var alpha = -1 / a1;
  var beta = c1;
  var gamma = -1 / a2;
  var delta = c2;

  var cx = (delta - beta) / (alpha - gamma);
  var cy = cx*alpha + beta;

  var cP = {x: cx, y: cy};

  return cP;
}

function calcArcPath(_x1, _y1, _x2, _y2, _x3, _y3) {
  var lA = dist(_x2, _y2, _x3, _y3)
  var lB = dist(_x3, _y3, _x1, _y1)
  var lC = dist(_x1, _y1, _x2, _y2)

  var angle = Math.acos((lA*lA + lB*lB - lC*lC)/(2*lA*lB))

  //calc radius of circle
  var k = .5*lA*lB*Math.sin(angle)
  var r = lA*lB*lC/4/k
  r = Math.round(r*1000)/1000;

  //large arc flag
  var laf;
    if(Math.PI/2 > angle) {
      laf = 1;
    } else {
      laf = 0;
    }

  //sweep flag
  var saf;
    if((_x2 - _x1)*(_y3 - _y1) - (_y2 - _y1)*(_x3 - _x1) < 0) {
      saf = 1;
    } else {
      saf = 0;
    }

  var _path = "M" + _x1 + "," + _y1 + " A" + r + "," + r + " 0, " + laf + ", " + saf + ", " + _x2 + "," + _y2;

  return _path;
}

function dist(a, b, c, d){
  return Math.sqrt(Math.pow(a - c, 2) +  Math.pow(b - d, 2));
}

function toVw(_x) {
  var vw = 100*_x/window.innerWidth;
  return vw;
}

function toVh(_y) {
  var vh = 78*_y/window.innerHeight;
  return vh;
}

//screen to data (원본 이미지 상 절대 좌표 -> 캔버스 상 좌표 변환)
function d2c(_point) {
  var x_;
  var y_;
  var n = window.innerWidth / $('.workspace').prop('_w');
  var m = 0.78*window.innerHeight / $('.workspace').prop('_h');

  if(n >= m) {
    console.log('n is bigger')
    var a = $('.workspace').prop('_h')*(n-m)/2;
    x_ = n*_point.x;
    y_ = n*_point.y-a;
  } else if (n < m) {
    console.log('m is bigger')
    var a = $('.workspace').prop('_w')*(m-n)/2;
    x_ = m*_point.x-a;
    y_ = m*_point.y;
  }

  return {x: x_, y: y_};
}

//screen to data (캔버스 상 좌표 -> 원본 이미지 상 절대 좌표 변환)
function c2d(_point) {
  var x_;
  var y_;
  var n = window.innerWidth / $('.workspace').prop('_w');
  var m = 0.78*window.innerHeight / $('.workspace').prop('_h');

  if(n >= m) {
    var a = $('.workspace').prop('_h')*(n-m)/2;
    var b = _point.y;
    x_ = _point.x/n;
    y_ = (a+b)/n;
  } else if (n < m) {
    var a = $('.workspace').prop('_w')*(m-n)/2;
    var b = _point.x;
    x_ = (a+b)/m;
    y_ = _point.y/m;
  }

  return {x: x_, y: y_};
}

function closestPoint(pathNode, point) {
  var pathLength = pathNode.getTotalLength(),
      precision = 8,
      best,
      bestLength,
      bestDistance = Infinity;

  // linear scan for coarse approximation
  for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
    if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
      best = scan, bestLength = scanLength, bestDistance = scanDistance;
    }
  }

  // binary search for precise estimate
  precision /= 2;
  while (precision > 0.5) {
    var before,
        after,
        beforeLength,
        afterLength,
        beforeDistance,
        afterDistance;
    if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
      best = before, bestLength = beforeLength, bestDistance = beforeDistance;
    } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
      best = after, bestLength = afterLength, bestDistance = afterDistance;
    } else {
      precision /= 2;
    }
  }

  best = [best.x, best.y];
  best.distance = Math.sqrt(bestDistance);
  return best;

  function distance2(p) {
    var dx = p.x - point[0],
        dy = p.y - point[1];
    return dx * dx + dy * dy;
  }
}

function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate(100);
  } else {
    console.log('vibrate not provided')
  }
}
