function setupWebAudio(){
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		audioCtx = new AudioContext();
		audioCtx2 = new AudioContext();
		audioElement = document.querySelector("#songOne");
		audioElement2 = document.querySelector("#songTwo");
		
		audioElement.src = SOUND_PATH.sound3;
		audioElement2.src = SOUND_PATH.sound1;
		
		sourceNode = audioCtx.createMediaElementSource(audioElement);
		sourceNode2 = audioCtx2.createMediaElementSource(audioElement2)
		analyserNode = audioCtx.createAnalyser();
		analyserNode2 = audioCtx2.createAnalyser();
		analyserNode.fftSize = NUM_SAMPLES;
		analyserNode2.fftSize = NUM_SAMPLES;
        biquadNode = audioCtx.createBiquadFilter();
		biquadNode.type = "lowshelf";
		biquadNode2 = audioCtx2.createBiquadFilter();
        biquadNode2.type = "lowshelf";
		gainNode = audioCtx.createGain();
		gainNode2 = audioCtx2.createGain();
		gainNode.gain.value = 1;
		gainNode2.gain.value = 1;
		sourceNode.connect(analyserNode);
		sourceNode2.connect(analyserNode2);
		analyserNode.connect(biquadNode);
		analyserNode2.connect(gainNode2);
		biquadNode.connect(gainNode);
		biquadNode2.connect(gainNode2);
		gainNode.connect(audioCtx.destination);
		gainNode2.connect(audioCtx2.destination);
	}