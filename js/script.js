// Main JavaScript for SUDAN GREEN website

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.getElementById('upload-area');
    const processBtn = document.getElementById('process-btn');
    const resultSection = document.getElementById('result-section');
    const originalImage = document.getElementById('original-image');
    const greenImage = document.getElementById('green-image');
    const downloadBtn = document.getElementById('download-btn');
    const uploadIcon = document.getElementById('upload-icon');
    const visitorCountElement = document.getElementById('visitor-count');

    // Variables to store image data
    let uploadedImage = null;
    let processedImage = null;

    // Define the specific green color requested by the user
    const SUDAN_GREEN = {
        r: 85,  // #55
        g: 215, // #d7
        b: 109  // #6d
    };

    // Initialize and update visitor counter
    initVisitorCounter();

    // Create a placeholder upload icon if it doesn't exist
    if (uploadIcon && uploadIcon.naturalWidth === 0) {
        createUploadIcon();
    }

    // Function to initialize and update visitor counter
    function initVisitorCounter() {
        if (!visitorCountElement) return;
        
        // Get current count from localStorage
        let count = localStorage.getItem('sudanGreenVisitorCount');
        
        // If no count exists, initialize to 0
        if (count === null) {
            count = 0;
        } else {
            count = parseInt(count);
        }
        
        // Increment count for this visit
        count++;
        
        // Save updated count to localStorage
        localStorage.setItem('sudanGreenVisitorCount', count);
        
        // Display the count
        visitorCountElement.textContent = count.toLocaleString('ar-EG'); // Format in Arabic numerals
        
        // Animate the counter to draw attention
        animateCounter();
    }

    // Function to animate the counter
    function animateCounter() {
        visitorCountElement.style.transition = 'transform 0.5s ease-in-out';
        visitorCountElement.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            visitorCountElement.style.transform = 'scale(1)';
        }, 500);
    }

    // Function to create upload icon programmatically
    function createUploadIcon() {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        // Draw upload icon with the new green color
        ctx.fillStyle = '#55d76d';
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
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

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
    }

    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    if (processBtn) {
        processBtn.addEventListener('click', processImage);
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadImage);
    }

    // Handle file selection
    function handleFileSelect(e) {
        const file = e.target.files[0] || (e.dataTransfer && e.dataTransfer.files[0]);
        
        if (!file) return;
        
        // Check if file is an image
        if (!file.type.match('image.*')) {
            alert('الرجاء اختيار ملف صورة.');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Display the selected image in the upload area
            uploadArea.innerHTML = `<img src="${e.target.result}" alt="الصورة المرفوعة" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
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
            
            // Apply green effect using the specific green color (#55d76d)
            for (let i = 0; i < data.length; i += 4) {
                // Get the grayscale value to maintain image details
                const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
                
                // Calculate the intensity factor (how much of the original image to keep)
                const intensity = gray / 255;
                
                // Apply the specific green color with varying intensity based on the original image
                data[i] = Math.min(255, SUDAN_GREEN.r * intensity);     // Red channel
                data[i + 1] = Math.min(255, SUDAN_GREEN.g * intensity); // Green channel
                data[i + 2] = Math.min(255, SUDAN_GREEN.b * intensity); // Blue channel
                
                // Alpha channel remains unchanged
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
});
