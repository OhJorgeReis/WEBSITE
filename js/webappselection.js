$(document).ready(function () {
  $("#autoWidth").lightSlider({
    autoWidth: true,
    loop: true,
    onSliderLoad: function () {
      $("#autoWidth").removeClass("cS-hidden");
    },
  });
});

new ClipboardJS(".sticker");

var angleScale = {
  angle: 0,
  scale: 1,
};
var gestureArea = document.getElementById("gesture-area");
var scaleElement = document.getElementById("scale-element");
var resetTimeout;

interact(gestureArea)
  .gesturable({
    listeners: {
      start(event) {
        angleScale.angle -= event.angle;

        clearTimeout(resetTimeout);
        scaleElement.classList.remove("reset");
      },
      move(event) {
        // document.body.appendChild(new Text(event.scale))
        var currentAngle = event.angle + angleScale.angle;
        var currentScale = event.scale * angleScale.scale;

        scaleElement.style.transform =
          "rotate(" + currentAngle + "deg)" + "scale(" + currentScale + ")";

        // uses the dragMoveListener from the draggable demo above
        dragMoveListener(event);
      },
      end(event) {
        angleScale.angle = angleScale.angle + event.angle;
        angleScale.scale = angleScale.scale * event.scale;

        resetTimeout = setTimeout(reset, 1000);
        scaleElement.classList.add("reset");
      },
    },
  })
  .draggable({
    listeners: { move: dragMoveListener },
  });

function reset() {
  scaleElement.style.transform = "scale(1)";

  angleScale.angle = 0;
  angleScale.scale = 1;
}
