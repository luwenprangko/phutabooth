const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");
const polaroid = document.getElementById("polaroid");
const startCameraButton = document.getElementById("start-camera");
const captureButton = document.getElementById("capture");
const downloadButton = document.getElementById("download");
const context = canvas.getContext("2d");

// Function to start the camera (ensures Safari compatibility)
function startCamera() {
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" }, // Front camera
    audio: false
  })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
    startCameraButton.style.display = "none"; // Hide the start button
    captureButton.style.display = "block"; // Show the capture button
  })
  .catch((err) => {
    console.error("Camera access error:", err);
    alert("Error accessing camera: " + err.message);
  });
}

// Function to start a 3-second countdown before capturing
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

// Function to take the picture and correct mirroring
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

// Function to download the Polaroid preview in high quality
function downloadPolaroid() {
  html2canvas(polaroid, { scale: 3 }).then((canvasResult) => {
    const imageURL = canvasResult.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "polaroid-photo.png";
    link.click();
  });
}

// Event listeners
startCameraButton.addEventListener("click", startCamera);
captureButton.addEventListener("click", startCountdown);
downloadButton.addEventListener("click", downloadPolaroid);