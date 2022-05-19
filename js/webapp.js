var constraints = {
  video: {
    facingMode: "environment",
    width: { ideal: 3840 },
    height: { ideal: 2160 },
  },
  audio: false,
};

const cameraView = document.querySelector("#camera--view"),
  cameraOutput = document.querySelector("#camera--output"),
  cameraSensor = document.querySelector("#camera--sensor"),
  cameraTrigger = document.querySelector("#camera--trigger");

function cameraStart() {
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      devices.forEach(function (device) {
        console.log(device);
      });
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      track = stream.getTracks()[0];
      cameraView.srcObject = stream;
    })
    .catch(function (error) {
      console.error("Oops. Something is broken.", error);
    });
}
// Prends la pic
cameraTrigger.onclick = function () {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraOutput.classList.add("taken");
};

window.addEventListener("load", cameraStart, false);

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

        resetTimeout = setTimeout(reset, 50000);
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
