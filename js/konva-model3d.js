// window.addEventListener("load", function () {
//   setTimeout(function open(event) {
//     document.querySelector(".popup").style.display = "none";
//   }, 65000);
// });

// document.querySelector(".close").addEventListener("click", function () {
//   document.querySelector(".popup").style.display = "none";
// });

class KonvaModel3D {
  constructor({ x, y, model, stage, layer }) {
    const originalAttrs = {
      x,
      y,
      scaleX: 1,
      scaleY: 1,
      draggable: true,
      rotation: 0,
    };

    let group = new Konva.Group(originalAttrs);
    layer.add(group);

    const imgWidth = stage.width();
    const imgHeight = stage.height();
    const canvas = document.createElement("canvas");
    canvas.width = imgWidth;
    canvas.height = imgHeight;

    // scene setup
    this.scene = new THREE.Scene();
    this.scene.background = null;

    const gui = new dat.GUI();
    console.log("gui");

    // camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      imgWidth / imgHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1, 3);

    // renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff, 0);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    const { container } = stage.attrs;

    const controls = new THREE.OrbitControls(this.camera, container);
    controls.target.set(0, 0.8, 0);
    controls.update();
    // console.log(container);
    // model setup
    // this.model.add(model);
    const object3D = new THREE.Object3D();
    object3D.add(model.scene.children[0]);
    this.scene.add(object3D);
    this.scene.add(model.scene);

    class ColorGUIHelper {
      constructor(object, prop) {
        this.object = object;
        this.prop = prop;
      }
      get value() {
        return `#${this.object[this.prop].getHexString()}`;
      }
      set value(hexString) {
        this.object[this.prop].set(hexString);
      }
    }

    // light setup
    const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.8);
    this.scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 0.7);
    light.position.set(-1, 10, 6);
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
    light.intensity = 1;
    light.skyColor = 0xb1e1ff; // light blue
    light.groundColor = 0xb97a20; // brownish orange
    this.scene.add(light);

    let folderLight = gui.addFolder("Scene lights");
    folderLight.closed = false;
    folderLight.add(light.position, "x", -50, 50, 2).name("Light direction");
    folderLight.add(light, "intensity", 0, 2, 0.01).name("Light intensity");
    folderLight
      .addColor(new ColorGUIHelper(light, "color"), "value")
      .name("skyColor");

    const konvaImage = new Konva.Image({
      x: -imgWidth / 2,
      y: -imgHeight / 2,
      image: canvas,
      width: imgWidth,
      height: imgHeight,
    });

    group.add(konvaImage);

    let posX = 0;

    this.anim = new Konva.Animation((frame) => {
      //   console.log("hello");
      this.renderer.render(this.scene, this.camera);
    });

    this.anim.start();

    stage.add(layer);

    this.layer = layer;
  }

  static loadModel(path) {
    const loader = new THREE.GLTFLoader();

    return new Promise((resolve) => {
      //   loader.setPath(assetPath);
      loader.load(path, (object) => {
        resolve(object);
      });
    });
    //Load meshes here
  }
}
