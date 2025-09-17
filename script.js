let script = [];
let currentScene = 0;
let mediaRecorder;
let recordedChunks = [];

function generateScript() {
  const notes = document.getElementById('notes').value.split('\n');
  script = notes.map((line, index) => ({
    text: line,
    image: `https://source.unsplash.com/800x400/?education,${index}`
  }));
  alert("Script तयार झाले!");
}

function playScenes() {
  if (script.length === 0) {
    alert("कृपया आधी notes टाका!");
    return;
  }
  currentScene = 0;
  playScene();
}

function playScene() {
  if (currentScene >= script.length) return;
  const scene = script[currentScene];
  document.getElementById('scene-text').innerText = scene.text;
  document.getElementById('background').style.backgroundImage = `url('${scene.image}')`;

  // Speech synthesis (TTS)
  let utter = new SpeechSynthesisUtterance(scene.text);
  utter.lang = "mr-IN"; // Marathi voice (change if not available)
  utter.onend = () => {
    currentScene++;
    setTimeout(playScene, 1000);
  };
  speechSynthesis.speak(utter);
}

function startRecording() {
  let stream = document.querySelector("body").captureStream();
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = function(e) {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };
  mediaRecorder.onstop = function() {
    let blob = new Blob(recordedChunks, {type: "video/webm"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "AutoTeachApp_v5_output.webm";
    a.click();
    recordedChunks = [];
  };
  mediaRecorder.start();
  alert("Recording सुरू झाले!");
}

function stopRecording() {
  mediaRecorder.stop();
  alert("Recording थांबले आणि video सेव्ह झाले!");
}
