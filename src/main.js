import './style.css'

const micBtn = document.getElementById('mic-btn');
const transcriptText = document.getElementById('transcript-text');
const statusMessage = document.getElementById('status-message');

// Cross-browser Speech Recognition API Hook Check
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  statusMessage.textContent = "Error: Speech API not supported on this browser.";
  statusMessage.style.color = "var(--accent-red)";
  micBtn.disabled = true;
} else {
  // Initialize standard Recognition configuration parameters
  const recognition = new SpeechRecognition();
  
  recognition.continuous = false; // Stops recording automatically when user stops speaking
  recognition.interimResults = false; // Only updates once it has a finalized match
  recognition.lang = 'en-US'; // Sets language target matching constraints

  let isListening = false;

  // Toggle Functionality
  micBtn.addEventListener('click', () => {
    if (isListening) {
      recognition.stop();
    } else {
      // Clear legacy visual markers
      transcriptText.textContent = "Listening...";
      transcriptText.classList.add('placeholder');
      
      try {
        recognition.start();
      } catch (err) {
        console.error("Recognition start error: ", err);
      }
    }
  });

  // Event hook: Browser finishes audio pipeline configuration channel setup
  recognition.onstart = () => {
    isListening = true;
    micBtn.classList.add('listening');
    statusMessage.textContent = "Listening... Speak now";
    statusMessage.className = "status-listening";
    
    if (navigator.vibrate) navigator.vibrate(40); // Feedback vibration burst
  };

  // Event hook: User stops talking or connection breaks down
  recognition.onend = () => {
    isListening = false;
    micBtn.classList.remove('listening');
    if (statusMessage.className === "status-listening") {
      statusMessage.textContent = "Tap mic to start";
      statusMessage.className = "status-idle";
    }
  };

  // Event hook: Process resulting translation tokens successfully 
  recognition.onresult = (event) => {
    statusMessage.textContent = "Processing voice patterns...";
    statusMessage.className = "status-processing";

    // Grab transcript payload string text chunk
    const speechToTextResult = event.results[0][0].transcript;

    transcriptText.textContent = speechToTextResult;
    transcriptText.classList.remove('placeholder');
    
    statusMessage.textContent = "Success! Tap to talk again";
    statusMessage.className = "status-idle";
    
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
  };

  // Error management wrapper
  recognition.onerror = (event) => {
    console.error("Speech Recognition Error: ", event.error);
    micBtn.classList.remove('listening');
    isListening = false;
    
    if (event.error === 'not-allowed') {
      statusMessage.textContent = "Permission Blocked! Check settings.";
    } else {
      statusMessage.textContent = `Error encountered: ${event.error}`;
    }
    statusMessage.className = "status-listening";
    statusMessage.style.color = "var(--accent-red)";
  };
}