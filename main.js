// Kamera yoqish tugmasini tanlash
var startButton = document.getElementById('startButton');
// Kamera o'chirish tugmasini tanlash
var stopButton = document.getElementById('stopButton');
// Tasvirni tushurish va yuklash tugmasini tanlash
var captureButton = document.getElementById('captureButton');
// Video elementini tanlash
var video = document.getElementById('video');
// Tasvir olish uchun rasmni tanlash
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
// Kamera potokini saqlash uchun global o'zgaruvchi
var stream;

// Kamera yoqish tugmasi bosilganda
startButton.addEventListener('click', function() {
    // Kamera yoqish funksiyasini chaqirish
    startCamera();
});

// Kamera o'chirish tugmasi bosilganda
stopButton.addEventListener('click', function() {
    // Kamera o'chirish funksiyasini chaqirish
    stopCamera();
});

// Tasvirni tushurish va yuklash tugmasi bosilganda
captureButton.addEventListener('click', function() {
    // Kamera ruxsat bermasa, foydalanuvchiga xabar berish
    if (!stream) {
        alert("Web kameraga ruxsat berilmagan. Kamerani yoqing va so'ng qayta urinib ko'ring.");
        return;
    }
    // Tasvirni olish va yuklash funksiyasini chaqirish
    captureAndUpload();
});

// Kamera yoqish funksiyasi
function startCamera() {
    // Kamera bilan ishlash uchun API-ni tekshirish
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Kamera uchun so'rovnoma
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(str) {
            // Kamera potokini saqlash
            stream = str;
            // Video elementiga kamera potokini bog'lash
            video.srcObject = stream;
        })
        .catch(function(error) {
            console.log("Kamera xatosi: ", error);
        });
    }
}

// Kamera o'chirish funksiyasi
function stopCamera() {
    // Kamera potokini to'xtatish
    var tracks = stream.getTracks();
    tracks.forEach(function(track) {
        track.stop();
    });
    // Video elementini bekor qilish
    video.srcObject = null;
}

// Tasvirni olish va yuklash funksiyasi
function captureAndUpload() {
    // Tasvirni olish
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Tasvirni yuklash
    var imageDataURL = canvas.toDataURL('image/png');
    // Rasimni yuklash tugmasi orqali yuklash
    uploadImage(imageDataURL);
}

// Rasimni yuklash funksiyasi
function uploadImage(imageDataURL) {
    // Yuklash uchun Blob obyektini yaratish
    var blob = dataURLtoBlob(imageDataURL);
    // Yuklab olish uchun "a" tegi yaratish
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'rasim.png'; // Foydalanuvchiga rasimni qanday nom bilan yuklab olishini aytish
    // "a" tegini qo'shish
    document.body.appendChild(link);
    // Foydalanuvchi uchun rasimni yuklab olishni boshlash
    link.click();
    // "a" tegini o'chirish
    document.body.removeChild(link);
}

// Data URL ni Blobga o'girish uchun yordamchi funksiya
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
