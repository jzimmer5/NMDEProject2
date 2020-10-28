//this function retrieves the canvas from the HTML and sets it to drawCtx so that I can draw on it
function setupCanvas() {
    canvasElement = document.querySelector('canvas');
    drawCtx = canvasElement.getContext("2d");
    document.querySelector('#triangle').checked
}

//this function creates all the changes on the canvas every 60th of a second
function update() {
    canvasElement = document.querySelector('canvas');
    //this calls the function making it happen every 60th of a second
    requestAnimationFrame(update);
    //this if-else changes the sound data to frequency or waveForm
    if (soundType = "freq") {
        analyserNode.getByteFrequencyData(audioData);
        analyserNode2.getByteFrequencyData(audioData2);
    }
    if (soundType = "wave") {
        analyserNode.getByteTimeDomainData(audioData);
        analyserNode2.getByteTimeDomainData(audioData2);
    }
    //clears the canvas before drawing anything on it again (gives a sense of animation)
    drawCtx.clearRect(0, 0, $(window).width(), $(window).height());

    if (document.querySelector('#triangle').checked) {
        document.querySelector('#circle').checked = false;
        let spacing = 5;
        let barWidth = 8;
        //walks through the data that is sent in from audioData to create the bars inside of the triangle
        for (let i = 0; i < audioData.length; i++) {
            let percent = audioData[i] / 255;
            let percent2 = audioData2[i] / 255;
            drawCtx.fillStyle = barColor;
            //when one song is playing the sides are linked
            if (singleSong) {
                if (i % 2 == 0) {
                    drawCtx.fillRect(421 + (i * spacing), 500, barWidth, -(440 * percent));
                } else {
                    drawCtx.fillRect(419 - (i * spacing), 500, barWidth, -(440 * percent));
                }
            }
            //when two songs are playing the sides are opposite
            else {
                if (i % 2 == 0) {
                    drawCtx.fillRect(421 + (i * spacing), 500, barWidth, -(440 * percent2));
                } else {
                    drawCtx.fillRect(419 - (i * spacing), 500, barWidth, -(440 * percent));
                }
            }
        }

        //draws the triangle 
        drawCtx.strokeStyle = "white";
        drawCtx.lineWidth = 5;
        drawCtx.beginPath();
        drawCtx.moveTo(140, 500);
        drawCtx.lineTo(420, 60);
        drawCtx.lineTo(700, 500);
        drawCtx.closePath();
        drawCtx.stroke();

        //creates the line down the middle
        drawCtx.beginPath();
        drawCtx.moveTo(420, 60);
        drawCtx.lineTo(420, 500);
        drawCtx.closePath();
        drawCtx.stroke();

        //creates space in the middle of the triangle
        drawCtx.strokeStyle = "black";
        drawCtx.fillStyle = "black";
        drawCtx.fillRect(140, 140, 500, 110);

        //blocks off the right side of the triangle so that the sound bars don't show up outside of it
        drawCtx.save();
        drawCtx.translate(455, 0);
        drawCtx.rotate(122.5 * Math.PI / 180);
        drawCtx.fillRect(0, 0, 800, 500);
        drawCtx.restore();

        //blocks off the left side of the triangle so that the sound bars don't show up outside of it
        drawCtx.save();
        drawCtx.translate(385, 0);
        drawCtx.rotate(57.5 * Math.PI / 180);
        drawCtx.fillRect(0, 0, 800, -500);
        drawCtx.restore();

        //connects the top triangle so that theres a bottom line
        drawCtx.strokeStyle = "white";
        drawCtx.beginPath();
        drawCtx.moveTo(367, 140);
        drawCtx.lineTo(473, 140);
        drawCtx.closePath();
        drawCtx.stroke();

        //connects the bottom triangle so that theres a top line
        drawCtx.beginPath();
        drawCtx.moveTo(298, 250);
        drawCtx.lineTo(542, 250);
        drawCtx.closePath();
        drawCtx.stroke();

        //walks through the data that is sent in from audioData to create the bars inside of the triangle
        for (let i = 0; i < audioData.length; i++) {
            //if one song is playing both crazy light show rays are linked to it
            if (singleSong) {
                let percent = audioData[i] / 255;
                lightShow((lightLength * percent), (840 - (lightLength * percent)));
            }

            //if two songs are playing it links each side to the respective song
            else {
                let percent = audioData[i] / 255;
                let percent2 = audioData2[i] / 255;
                lightShow((lightLength * percent), (840 - (lightLength * percent2)));
            }
        }
        manipulatePixels(drawCtx);
    }

    if (document.querySelector('#circle').checked) {
        document.querySelector('#triangle').checked = false;
        let maxRadius = drawCtx.canvas.height / 4;
        drawCtx.save();
        drawCtx.globalAlpha = 1;

        let percent = audioData[1] / 255;

        let circleRadius = percent * maxRadius;



        drawCtx.beginPath();
        drawCtx.fillStyle = "white";
        drawCtx.arc(drawCtx.canvas.width / 2 - 3, drawCtx.canvas.height / 2 - 20, circleRadius * 1.8, 0, 2 * Math.PI, false);
        drawCtx.fill();
        drawCtx.closePath();
        drawCtx.restore();
    }
}



function manipulatePixels(ctx) {
    let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

    let i;
    for (i = 0; i < length; i += 4) {
        if (tintRed) {
            data[i] = data[i] + 100;
        }
        if (invert) {
            let red = data[i],
                green = data[i + 1],
                blue = data[i + 2];
            data[i] = 255 - red;
            data[i + 1] = 255 - green;
            data[i + 2] = 255 - blue;
            //data[i+3] is alpha ;)
        }
        if (sepia) {
            let red = (data[i] * .393) + (data[i + 1] * .769) + (data[i + 2] * .189);
            let green = (data[i] * .349) + (data[i + 1] * .686) + (data[i + 2] * .168);
            let blue = (data[i] * .272) + (data[i + 1] * .534) + (data[i + 2] * .131);
            data[i] = red;
            data[i + 1] = green;
            data[i + 2] = blue;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function randomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return 'rgba(' + r + ',' + g + ',' + b + ',.5)';
}

function lightShow(startX, endX) {
    drawCtx.strokeStyle = randomColor();
    drawCtx.beginPath();
    drawCtx.moveTo(50, 580);
    drawCtx.lineTo(startX, 0);
    drawCtx.closePath();
    drawCtx.stroke();

    drawCtx.strokeStyle = randomColor();
    drawCtx.beginPath();
    drawCtx.moveTo(($('#canvas').width() - 50), 580);
    drawCtx.lineTo(endX, 0);
    drawCtx.closePath();
    drawCtx.stroke();
}

$(window).on('resize', function(){
    resizeCanvas();
});

function resizeCanvas()
{
    //canvas.css("width", $(window).width());
    canvasElement.width = $(window).width();
    canvasElement.height = $(window).height();
    //canvas.css("height", $(window).height());
}

$(document).ready(resizeCanvas());