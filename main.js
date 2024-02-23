const video = document.getElementById('kameraVideo');
const captureButton = document.getElementById('captureButton');

// Kamerani ochish
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((error) => {
    console.error('Kameraga kirishda xatolik yuz berdi: ', error);
  });

// Rasmni olish va yuklash
captureButton.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Rasmni faylga olish
  canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append('image', blob, 'rasm.jpg');
    
    // Faylni yuborish uchun POST so'rovi
    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Yuklangan fayl URL:', data.fileUrl);
      alert('Rasm muvaffaqiyatli yuklandi!');
    })
    .catch(error => {
      console.error('Xatolik yuz berdi:', error);
      alert('Rasm yuklashda xatolik yuz berdi.');
    });
  }, 'image/jpeg');
});