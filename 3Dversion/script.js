var scene, camera, renderer, car;

function init() {
  const assetPath = "assets/";

  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0x00aaff);
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1, 3);

  const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.8);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 0.7);
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.near = 1;
  light.shadow.far = 100;
  const shadowSize = 5;
  light.shadow.left = -shadowSize;
  light.shadow.right = shadowSize;
  light.shadow.top = shadowSize;
  light.shadow.bottom = -shadowSize;
  light.position.set(-1, 10, 6);
  scene.add(light);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 0);
  scene.background = null;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  document.body.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  //Load meshes here
  const loader = new THREE.GLTFLoader();
  loader.setPath(assetPath);
  loader.load("testdugrosbuck.gltf", (object) => {
    car = new THREE.Object3D();
    car.add(object.scene.children[0]);
    scene.add(car);
    scene.add(object.scene);
  });

  window.addEventListener("resize", resize, false);

  update();
}

function update() {
  requestAnimationFrame(update);
  renderer.render(scene, camera);
  if (car !== undefined) {
    car.rotation.y += 0.01;
  }
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("load", () => {
  const cam = new CameraView();
  cam.init({
    container: document.querySelector("#camera-app"),
  });
});

class CameraView {
  constructor() {}

  async init({ container, stickers }) {
    this.dom = {
      takenPreview: container.querySelector(".cam__takenPreview"),
      triggerBtn: container.querySelector(".cam__triggerBtn"),
      shareBtn: container.querySelector(".cam__shareBtn"),
    };

    this.stickers = {};
    this.shownStickers = [];

    this.dom.triggerBtn.onclick = () => this.takePicture();
    this.dom.shareBtn.onclick = () => this.shareImage("image.png");
    // this.dom.shareBtn.onclick = this.shareImage.bind(this);

    this.cameraView = await this.enableCam();

    this.container = container;
    this.canvas = container.querySelector(".cam__canvas");
    this.ctx = this.canvas.getContext("2d");

    this.initInteraction();

    this.canvas.width = this.cameraView.videoWidth;
    this.canvas.height = this.cameraView.videoHeight;

    this.updateView();
  }

  initInteraction() {
    interact(this.canvas)
      .gesturable({
        listeners: {
          start(event) {
            // angleScale.angle -= event.angle;
            // clearTimeout(resetTimeout);
            // scaleElement.classList.remove("reset");
          },
          move(event) {
            console.log(event);
            // // document.body.appendChild(new Text(event.scale))
            // var currentAngle = event.angle + angleScale.angle;
            // var currentScale = event.scale * angleScale.scale;
            // scaleElement.style.transform =
            //   "rotate(" + currentAngle + "deg)" + "scale(" + currentScale + ")";
            // function dragMoveListener(event) {
            //   var target = event.target;
            //   // keep the dragged position in the data-x/data-y attributes
            //   var x =
            //     (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
            //   var y =
            //     (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
            //   // translate the element
            //   target.style.transform = "translate(" + x + "px, " + y + "px)";
            //   // update the posiion attributes
            //   target.setAttribute("data-x", x);
            //   target.setAttribute("data-y", y);
            // }
            // uses the dragMoveListener from the draggable demo above
            // dragMoveListener(event);
          },
          end(event) {
            // angleScale.angle = angleScale.angle + event.angle;
            // angleScale.scale = angleScale.scale * event.scale;
            // resetTimeout = setTimeout(reset, 1000);
            // scaleElement.classList.add("reset");
          },
        },
      })
      .draggable({
        listeners: {
          move: (event) => {
            console.log(event);
          },
        },
      });

    function reset() {
      scaleElement.style.transform = "scale(1)";

      angleScale.angle = 0;
      angleScale.scale = 1;
    }
  }

  async shareImage(name) {
    // const response = await fetch(canvas.toDataURL("image/png"));
    this.canvas.toBlob((blob) => {
      const files = [
        new File([blob], name, {
          type: "image/png",
          lastModified: new Date().getTime(),
        }),
      ];

      const shareData = {
        files,
      };
      navigator.share(shareData);
    }, "image/png");
  }

  takePicture() {
    const { takenPreview, shareBtn } = this.dom;
    takenPreview.src = this.canvas.toDataURL("image/png");
    showElement(takenPreview);
    showElement(shareBtn);
  }

  updateView() {
    this.ctx.drawImage(this.cameraView, 0, 0);

    this.shownStickers.forEach((stickerName) => {
      this.ctx.drawImage(this.stickers[stickerName], 0, 0);
    });

    requestAnimationFrame(this.updateView.bind(this));
  }

  getAllCameras() {
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
  }

  enableCam() {
    // <video id="camera--view" autoplay playsinline></video>

    const cameraView = document.createElement("video");
    cameraView.autoplay = true;
    cameraView.setAttribute("playsinline", null);

    return new Promise((resolve) => {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 3840 },
            height: { ideal: 2160 },
          },
          audio: false,
        })
        .then((stream) => {
          const track = stream.getTracks()[0];
          cameraView.srcObject = stream;

          // wait till webcam is init
          cameraView.oncanplay = () => {
            resolve(cameraView);
          };
        })
        .catch((error) => {
          console.error("Oops. Something is broken.", error);
        });
    });
  }
}

function showElement(elem) {
  elem.removeAttribute("hidden");
}

function hideElement(elem) {
  elem.setAttribute("hidden", "true");
}

init();
