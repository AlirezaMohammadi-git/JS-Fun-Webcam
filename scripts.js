const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
let redFilter = false;
let rgbSpliteFilter = false;


// facingMode ==> 'user' is front camera, 'environment' is back camera
// for more info visit : https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
function startStreamCamera() {
  video.style.display = 'block';
  canvas.style.display = 'block'
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
    .then(localMediaStream => {
      video.srcObject = localMediaStream;
      video.addEventListener('load', video.play())
    })
    .catch(err => {
      console.log('error on show camera...')
    })


}

function stopCamera() {
  // reference : https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
  const stream = video.srcObject;
  const trancks = stream.getTracks();
  trancks.forEach(tranck => {
    tranck.stop()
  });
  video.style.display = "none";
  canvas.style.display = 'none';
}

function drawVideoInCanvas() {
  // reference : https://stackoverflow.com/questions/4429440/html5-display-video-inside-canvas
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  // draw only when video is playing:
  // draw video at 30 fps
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    // reference : https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
    // how I can create filters? ==>  https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData
    let pixels = ctx.getImageData(0, 0, width, height)
    if (redFilter) {
      pixels = redEffect(pixels);
      ctx.putImageData(pixels,0,0);
    }
    if (rgbSpliteFilter) {
      pixels = rgbSplit(pixels);
      ctx.putImageData(pixels, 0, 0);
    }
  }, 1000 / 30)
}

function takePhoto() {
  // reference : https://stackoverflow.com/questions/10257781/can-i-get-image-from-canvas-element-and-use-it-in-img-src-tag
  snap.currentTime = 0;
  snap.play()
  const imageLink = canvas.toDataURL();
  const link = document.createElement('a');
  link.href = imageLink;
  link.setAttribute('download', 'handsome')
  link.innerHTML = `<img src="${imageLink}" alt="handsome" />`;
  strip.insertBefore(link, strip.firstChild)


  const pixels = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight);
  console.log(pixels)
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 50; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}



video.addEventListener('canplay', drawVideoInCanvas)