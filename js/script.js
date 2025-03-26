// Main JavaScript for SUDAN GREEN website

// DOM Elements
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const processBtn = document.getElementById('process-btn');
const resultSection = document.getElementById('result-section');
const originalImage = document.getElementById('original-image');
const greenImage = document.getElementById('green-image');
const downloadBtn = document.getElementById('download-btn');
const uploadIcon = document.getElementById('upload-icon');

// Variables to store image data
let uploadedImage = null;
let processedImage = null;

// Create a placeholder upload icon if it doesn't exist
window.addEventListener('load', function() {
    if (uploadIcon.naturalWidth === 0) {
        createUploadIcon();
    }
});

// Function to create upload icon programmatically
function createUploadIcon() {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    // Draw upload icon
    ctx.fillStyle = '#008751';
    ctx.beginPath();
    ctx.arc(50, 50, 40, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    // Draw arrow
    ctx.beginPath();
    ctx.moveTo(50, 25);
    ctx.lineTo(30, 45);
    ctx.lineTo(45, 45);
    ctx.lineTo(45, 75);
    ctx.lineTo(55, 75);
    ctx.lineTo(55, 45);
    ctx.lineTo(70, 45);
    ctx.closePath();
    ctx.fill();
    
    // Set the icon
    uploadIcon.src = canvas.toDataURL('image/png');
}

// Event Listeners
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', handleFileSelect);

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('active');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('active');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('active');
    
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelect(e);
    }
});

processBtn.addEventListener('click', processImage);
downloadBtn.addEventListener('click', downloadImage);

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0] || e.dataTransfer.files[0];
    
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
        alert('Please select an image file.');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Display the selected image in the upload area
        uploadArea.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
        uploadedImage = e.target.result;
        processBtn.disabled = false;
    };
    
    reader.readAsDataURL(file);
}

// Process image to apply green effect
function processImage() {
    if (!uploadedImage) return;
    
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply green effect
        for (let i = 0; i < data.length; i += 4) {
            // Keep the green channel, reduce red and blue
            const green = data[i + 1];
            data[i] = data[i] * 0.1;     // Reduce red
            // Green stays the same
            data[i + 2] = data[i + 2] * 0.1; // Reduce blue
            
            // Enhance green slightly
            data[i + 1] = Math.min(255, green * 1.2);
        }
        
        // Put the modified image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Store the processed image
        processedImage = canvas.toDataURL('image/png');
        
        // Display the original and processed images
        originalImage.src = uploadedImage;
        greenImage.src = processedImage;
        
        // Show the result section
        resultSection.style.display = 'block';
        
        // Scroll to result section
        resultSection.scrollIntoView({ behavior: 'smooth' });
    };
    
    img.src = uploadedImage;
}

// Download the processed image
function downloadImage() {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'sudan-green-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
