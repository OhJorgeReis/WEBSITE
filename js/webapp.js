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
  canvas = document.querySelector("#camera--sensor"),
  cameraTrigger = document.querySelector("#camera--trigger"),
  cameraShare = document.querySelector("#camera--share");

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
  canvas.width = cameraView.videoWidth;
  canvas.height = cameraView.videoHeight;
  canvas.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = canvas.toDataURL("image/webp");
  cameraOutput.classList.add("taken");
  cameraOutput.classList.add("show-camera--share");
  cameraOutput.classList.add("camera--share");
};

cameraShare.addEventListener("click", () => {
  shareImage();
});

async function shareImage() {
  const response = await fetch(canvas.toDataURL("image/webp"));
  const blob = await response.blob();
  const filesArray = [
    new File([blob], "Karla.jpg", {
      type: "image/webp",
      lastModified: new Date().getTime(),
    }),
  ];
  const shareData = {
    files: filesArray,
  };
  navigator.share(shareData);
}

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

        function dragMoveListener(event) {
          var target = event.target;
          // keep the dragged position in the data-x/data-y attributes
          var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

          // translate the element
          target.style.transform = "translate(" + x + "px, " + y + "px)";

          // update the posiion attributes
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        }

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
