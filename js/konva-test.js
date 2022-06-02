const params = new URLSearchParams(window.location.search);
const images = {};
const layers = {};
const dom = {};

async function init() {
  TouchEmulator();

  const container = document.querySelector("#camera-app");
  dom.takenPreview = container.querySelector(".cam__takenPreview");
  dom.triggerBtn = container.querySelector(".cam__triggerBtn");
  dom.shareBtn = container.querySelector(".cam__shareBtn");
  dom.konva = container.querySelector(".cam__canvas");

  dom.triggerBtn.onclick = () => takePicture();
  dom.shareBtn.onclick = () => shareImage("image.png");

  images.pose1 = await loadImg(`/stickers/${params.get("sticker")}.png`);

  console.log("images preloaded");

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
  console.log(stage);

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
  // add sticker
  new Sticker({
    x: stage.width() / 2,
    y: stage.height() / 2,
    image: images.pose1,
    stage,
    layer,
  });

  function takePicture() {
    const { takenPreview, shareBtn } = dom;
    takenPreview.src = canvas.toDataURL("image/png");
    showElement(takenPreview);
    showElement(shareBtn);
  }

  async function shareImage(name) {
    // const response = await fetch(canvas.toDataURL("image/png"));
    canvas.toBlob((blob) => {
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
}

window.addEventListener("load", (e) => init());

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
