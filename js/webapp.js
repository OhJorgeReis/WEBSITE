var constraints = {
  video: { facingMode: "environment" },
  width: { ideal: 1936 },
  height: { ideal: 2592 },
  audio: false,
};

const cameraView = document.querySelector("#camera--view"),
  cameraOutput = document.querySelector("#camera--output"),
  cameraSensor = document.querySelector("#camera--sensor"),
  cameraTrigger = document.querySelector("#camera--trigger");

function cameraStart() {
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

interact(".draggable").draggable({
  inertia: true,
  autoScroll: true,

  listeners: {
    move: dragMoveListener,
  },
});

function dragMoveListener(event) {
  var target = event.target;

  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  target.style.transform = "translate(" + x + "px, " + y + "px)";

  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

window.dragMoveListener = dragMoveListener;
