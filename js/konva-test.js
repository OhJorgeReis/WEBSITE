const params = new URLSearchParams(window.location.search);
const query = window.location.search;
const images = {};
const layers = {};
const dom = {};
let imageBlob;
let mode3D = false;

async function init() {
  TouchEmulator();

  const container = document.querySelector("#camera-app");
  dom.takenPreview = container.querySelector(".cam__takenPreview");
  dom.triggerBtn = container.querySelector(".cam__triggerBtn");
  dom.shareBtn = container.querySelector(".cam__shareBtn");
  dom.konva = container.querySelector(".cam__canvas");
  dom.infoafter = container.querySelector(".info_after");
  dom.infobefore = container.querySelector(".info_before");
  dom.goback = container.querySelector(".heading_selection");

  dom.triggerBtn.onclick = () => takePicture();
  dom.shareBtn.onclick = () => shareImage("image.png");

  mode3D = params.has("model");

  Konva.hitOnDragEnabled = true;
  Konva.captureTouchEventsEnabled = true;
  // resize
  let width = window.innerWidth;
  let height = window.innerHeight;

  const konvaElem = dom.konva;

  let stage = new Konva.Stage({
    container: konvaElem,
    width: konvaElem.offsetWidth,
    height: konvaElem.offsetHeight,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  const canvas = stage.content.firstChild;

  //add webcam
  const webcamElem = new KonvaWebcam({
    stage,
    layer,
    mirrored: false,
  });

  await webcamElem.activate();

  if (mode3D) {
    //

    // /webapp.html?model=test
    const model = await KonvaModel3D.loadModel(
      `./models/${params.get("model")}.gltf`
    );
    // console.log(model);

    new KonvaModel3D({
      model,
      x: stage.width() / 2,
      y: stage.height() / 2,
      stage,
      layer,
    });
  } else {
    // /webapp.html?sticker=pose3
    images.pose1 = await loadImg(`./stickers/${params.get("stickers")}.png`);

    new Sticker({
      x: stage.width() / 2,
      y: stage.height() / 2,
      image: images.pose1,
      stage,
      layer,
    });
  }

  // YOOOOOOOOO
  if (query.includes("BRUNOPOSE1")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "ok"
      );
  }

  function takePicture() {
    const { takenPreview, shareBtn, infoafter, infobefore } = dom;
    canvas.toBlob((blob) => {
      imageBlob = blob;
      const objectURL = URL.createObjectURL(blob);
      takenPreview.src = objectURL;
      showElement(takenPreview);
      showElement(shareBtn);
      showElement(infoafter);
      hideElement(infobefore);
    }, "image/png");
  }

  async function shareImage(name) {
    // canvas.toBlob((blob) => {
    const files = [
      new File([imageBlob], name, {
        type: "image/png",
        lastModified: new Date().getTime(),
      }),
    ];

    const shareData = {
      files,
    };
    navigator.share(shareData);
    // }, "image/png");
  }
}

function loadImg(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = src;
  });
}

function showElement(elem) {
  elem.removeAttribute("hidden");
}

function hideElement(elem) {
  elem.setAttribute("hidden", "true");
}

window.addEventListener("load", (e) => init());
