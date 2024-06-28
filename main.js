
var startButton = document.getElementById('startButton');

var stopButton = document.getElementById('stopButton');

var captureButton = document.getElementById('captureButton');

var video = document.getElementById('video');

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var stream;

startButton.addEventListener('click', function() {

    startCamera();
});

stopButton.addEventListener('click', function() {

    stopCamera();
});


captureButton.addEventListener('click', function() {

    if (!stream) {
        alert("Web kameraga ruxsat berilmagan. Kamerani yoqing va so'ng qayta urinib ko'ring.");
        return;
    }

    captureAndSendEmail();
});


function startCamera() {

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

        navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(str) {

            stream = str;

            video.srcObject = stream;
        })
        .catch(function(error) {
            console.log("Kamera xatosi: ", error);
        });
    }
}


function stopCamera() {

    var tracks = stream.getTracks();
    tracks.forEach(function(track) {
        track.stop();
    });

    video.srcObject = null;
}


function captureAndSendEmail() {

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    var imageDataURL = canvas.toDataURL('image/png');

    sendEmail(imageDataURL);
}


function sendEmail(imageDataURL) {
 
    var blob = dataURLtoBlob(imageDataURL);
    

    var imageData = imageDataURL.split(',')[1];
    

    var file = new File([blob], "rasim.png", {type: blob.type});
    var formData = new FormData();
    formData.append('file', file);
    

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Rasim muvaffaqiyatli yuborildi');
        } else {
            console.error('Rasimni yuborishda xatolik yuz berdi:', xhr.statusText);
        }
    };
 
    xhr.onerror = function () {
        console.error('Yuborishda xatolik yuz berdi');
    };
    

    xhr.send(formData);
}


function dataURLtoBlob(dataURL) {
    var parts = dataURL.split(';base64,');
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
}

