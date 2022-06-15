class KonvaWebcam {
  constructor({ stage, mirrored = true, layer }) {
    const mirror = mirrored ? -1 : 1;

    const cameraView = document.createElement("video");
    cameraView.autoplay = true;
    cameraView.setAttribute("playsinline", true);
    this.cameraView = cameraView;

    this.konvaCam = new Konva.Image({
      image: cameraView,
      draggable: false,
      x: 0,
      y: 0,
    });

    layer.add(this.konvaCam);

    this.anim = new Konva.Animation(() => {
      // do nothing, animation just need to update the layer
    }, layer);

    cameraView.addEventListener("loadedmetadata", (e) => {
      // console.log("trigger");
      const { videoHeight, videoWidth } = cameraView;
      const stageWidth = stage.width();
      const stageHeight = stage.height();

      const videoRatio = videoHeight / videoWidth;
      const stageRatio = stageHeight / stageWidth;

      let width, height;

      if (videoRatio < stageRatio) {
        height = stageHeight;
        width = stageHeight / videoRatio;
      } else {
        height = stageWidth * videoRatio;
        width = stageWidth;
      }

      this.konvaCam.setAttrs({
        x: stageWidth / 2 - (mirror * width) / 2,
        y: stageHeight / 2 - height / 2,
        scaleX: mirror,
      });

      // console.log(this.konvaCam);

      this.konvaCam.height(height);
      this.konvaCam.width(width);

      cameraView.play();
      this.anim.start();
    });
  }

  activate() {
    // <video id="camera--view" autoplay playsinline></video>

    return new Promise((resolve) => {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 3840 / 2 },
            height: { ideal: 2160 / 2 },
          },
          audio: false,
        })
        .then((stream) => {
          const track = stream.getTracks()[0];
          this.cameraView.srcObject = stream;

          // wait till webcam is init
          this.cameraView.oncanplay = () => {
            resolve(this.cameraView);
          };
        })
        .catch((error) => {
          console.error("Oops. Something is broken.", error);
        });
    });
  }
}
