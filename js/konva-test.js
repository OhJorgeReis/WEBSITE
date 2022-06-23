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
        "Outside or inside, in an environment that seems professional like an office."
      );
  }

  if (query.includes("BRUNOPOSE2")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Somewhere where movement happens, looks even better if you can capture more people."
      );
  }

  if (query.includes("BRUNOPOSE3")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Against an object outside, good for showing a more calm side of Bruno."
      );
  }

  if (query.includes("BRUNOPOSE4")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "In front of an impressive building, or in a good looking street."
      );
  }

  if (query.includes("BRUNOPOSE5")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "In any place where waiting is necessary. Show's Bruno's bossy side."
      );
  }

  if (query.includes("BRUNOPOSE6")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Inside, in a great looking building, or in an office looking place."
      );
  }

  if (query.includes("BRUNOPOSE7")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Outside, in a place that looks more relaxed than the usual office environment."
      );
  }

  if (query.includes("PAULPOSE2")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Outside, in front of a good looking natural landscape, like a lake."
      );
  }

  if (query.includes("PAULPOSE3")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Perfect for a trek shot. Positon Paul in a road in nature on a sunny day."
      );
  }

  if (query.includes("PAULPOSE4")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Natural environment will look better but a street in a city can work too."
      );
  }

  if (query.includes("PAULPOSE5")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "At the gym, or in a outside gym. Around other workout machines."
      );
  }

  if (query.includes("PAULPOSE6")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Perfect for group shots, position Bruno outside with your friends."
      );
  }

  if (query.includes("PAULPOSE7")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "In a natural landscape, good for stories posting and a laid-back vibe."
      );
  }

  if (query.includes("PAULPOSE8")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Works good on a workout mat, or on the beach, after workout shot."
      );
  }

  if (query.includes("PAULPOSE9")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Workout shot, works inside in a gym or outside on a sports field."
      );
  }

  if (query.includes("PAULPOSE10")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "After workout shot, works inside in a gym or outside on a sports field."
      );
  }

  if (query.includes("PATRICIA2")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Perfect for outdoors shot, near a lake or a water point."
      );
  }

  if (query.includes("PATRICIA3")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Works great inside, against a solid colored wall. Perfect on a workout mat."
      );
  }

  if (query.includes("PATRICIA8")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Outside, nature, sunny, in a flat terrain without a lot of elements."
      );
  }

  if (query.includes("PATRICIA9")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Any romantic landscape outside, around nature."
      );
  }

  if (query.includes("PATRICIA4")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Any romantic landscape outside, around nature."
      );
  }

  if (query.includes("PATRICIA5")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Outside around nature or inside with a yoga mat on the floor."
      );
  }

  if (query.includes("PATRICIA6")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Outside around nature or inside with a yoga mat on the floor."
      );
  }

  if (query.includes("PATRICIA7")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Works great outside in front of an impressive landscape like a mountain."
      );
  }

  if (query.includes("POSE4")) {
    var elements = document.getElementsByClassName("info_before");
    for (var i = 0; i < elements.length; ++i)
      elements[i].textContent = elements[i].textContent.replace(
        "Outside, Nature, sunny, everywhere in nature would look great",
        "Its perfect for shots in front of large mountains or the sea."
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
