const startCameraButton = document.getElementById("startCamera");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");
const polaroid = document.getElementById("polaroid");
const captureButton = document.getElementById("capture");
const downloadButton = document.getElementById("download");
const context = canvas.getContext("2d");

// Start camera manually (for Safari and older browsers)
startCameraButton.addEventListener("click", startCamera);

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      video.style.display = "block";
      startCameraButton.style.display = "none"; // Hide the button
    })
    .catch((err) => {
      alert("Error accessing camera: " + err.message);
    });
}

// Start 3-second countdown before capturing
function startCountdown() {
  let countdown = 3;
  captureButton.disabled = true;

  const interval = setInterval(() => {
    if (countdown > 0) {
      captureButton.textContent = `Capturing in ${countdown}...`;
      countdown--;
    } else {
      clearInterval(interval);
      captureButton.textContent = "Taking Picture...";
      captureButton.style.display = "none";
      takePicture();
    }
  }, 1000);
}

// Take the picture and correct mirroring
function takePicture() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.save();
  // Flip horizontally to capture a non-mirrored image
  context.scale(-1, 1);
  context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
  context.restore();

  const imageData = canvas.toDataURL("image/png");
  preview.src = imageData;

  // Hide the video and show the Polaroid preview
  video.style.display = "none";
  polaroid.style.display = "block";
  downloadButton.style.display = "inline-block";
}

// Start countdown on button click
captureButton.addEventListener("click", startCountdown);

// Download Polaroid exactly as shown, with high quality using html2canvas (scale: 3)
downloadButton.addEventListener("click", () => {
  html2canvas(polaroid, { scale: 3, useCORS: true }).then((canvasResult) => {
    const imageURL = canvasResult.toDataURL("image/png");

    // Create a temporary link
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "polaroid-photo.png";

    // Fix for iOS Safari (opens image in a new tab instead of failing silently)
    if (navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome")) {
      const newTab = window.open();
      newTab.document.write('<img src="' + imageURL + '" />');
    } else {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
});