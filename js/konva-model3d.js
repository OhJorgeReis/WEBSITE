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

    let size = 200;

    const image = {
      width: 100,
      height: 150,
    };

    const ratio = image.height / image.width;
    const imgWidth = stage.width();
    const imgHeight = ratio * imgWidth;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "yellow";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const konvaImage = new Konva.Image({
      x: -imgWidth / 2,
      y: -imgHeight / 2,
      image: canvas,
      width: imgWidth,
      height: imgHeight,
    });

    group.add(konvaImage);

    let posX = 0;
    ctx.fillStyle = "black";

    this.anim = new Konva.Animation((frame) => {
      //   console.log("hello");
    });

    this.anim.start();

    // attach modified version of Hammer.js
    // "domEvents" property will allow triggering events on group
    // instead of "hammertime" instance
    let hammertime = new Hammer(group, { domEvents: true });

    // add rotate gesture
    hammertime.get("rotate").set({ enable: true });

    // now attach all possible events
    group.on("swipe", (ev) => {
      //   text.text("swiping");
      //   group.to({
      //     x: group.x() + ev.evt.gesture.deltaX,
      //     y: group.y() + ev.evt.gesture.deltaY,
      //     onFinish: () => {
      //       //   group.to(Object.assign({}, originalAttrs));
      //       text.text(defaultText);
      //     },
      //   });
    });

    group.on("touchstart", (ev) => {
      // text.text("Under press");
      //   rect.to({
      //     fill: "green",
      //   });
    });

    group.on("touchend", (ev) => {
      //   rect.to({
      //     fill: "yellow",
      //   });

      setTimeout(() => {
        // text.text(defaultText);
      }, 300);
    });

    group.on("dragend", () => {
      //   group.to(Object.assign({}, originalAttrs));
    });

    let oldRotation = 0;
    let startScale = 0;
    group.on("rotatestart", (ev) => {
      oldRotation = ev.evt.gesture.rotation;
      startScale = rect.scaleX();
      group.stopDrag();
      group.draggable(false);
      // text.text("rotating...");
    });

    group.on("rotate", (ev) => {
      let delta = oldRotation - ev.evt.gesture.rotation;
      group.rotate(-delta);
      oldRotation = ev.evt.gesture.rotation;
      group.scaleX(startScale * ev.evt.gesture.scale);
      group.scaleY(startScale * ev.evt.gesture.scale);
    });

    group.on("rotateend rotatecancel", (ev) => {
      //   group.to(Object.assign({}, originalAttrs));
      // text.text(defaultText);
      group.draggable(true);
    });

    stage.add(layer);

    this.layer = layer;
  }
}
