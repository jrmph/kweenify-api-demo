// Kweenify - Responsive Text Generator Functionality
// Note: Give me Credits 
// Thats Only I want
// I will upload more project open source soon 
// Please Keep supporting me so that i get motivated to create and publish more projects
// Made by Jrmph - Jhames Rhonnielle Martin

// Global variables
let isTransparent = false;

// DOM Elements
const elements = {
    transparentToggle: null,
    textInput: null,
    loading: null,
    transparentPreview: null,
    transparentDownload: null,
    colorPreview: null,
    colorDownload: null,
    transparentDownloadLink: null,
    colorDownloadLink: null
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    setupIntersectionObserver();
    focusInput();
});

/**
 * Initialize all DOM element references
 */
function initializeElements() {
    elements.transparentToggle = document.getElementById('transparentToggle');
    elements.textInput = document.getElementById('textInput');
    elements.loading = document.getElementById('loading');
    elements.transparentPreview = document.getElementById('transparentPreview');
    elements.transparentDownload = document.getElementById('transparentDownload');
    elements.colorPreview = document.getElementById('colorPreview');
    elements.colorDownload = document.getElementById('colorDownload');
    elements.transparentDownloadLink = document.getElementById('transparentDownloadLink');
    elements.colorDownloadLink = document.getElementById('colorDownloadLink');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Enter key support for text input
    elements.textInput.addEventListener('keypress', handleEnterKey);
    
    // Input validation and real-time feedback
    elements.textInput.addEventListener('input', handleTextInput);
    
    // Resize handler for responsive adjustments
    window.addEventListener('resize', handleResize);
    
    // Window load event
    window.addEventListener('load', handleWindowLoad);
}

/**
 * Setup intersection observer for scroll animations
 */
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe elements for scroll animations
    document.querySelectorAll('.feature, .preview-item').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Toggle transparent mode
 */
function toggleTransparent() {
    isTransparent = !isTransparent;
    
    if (isTransparent) {
        elements.transparentToggle.classList.add('active');
        elements.transparentToggle.innerHTML = '<i class="bx bx-x"></i> Disable';
        elements.transparentToggle.style.background = 'linear-gradient(135deg, var(--success), #34d399)';
        elements.transparentToggle.setAttribute('aria-pressed', 'true');
        showNotification('Transparent mode enabled!', 'success');
    } else {
        elements.transparentToggle.classList.remove('active');
        elements.transparentToggle.innerHTML = '<i class="bx bx-check"></i> Enable';
        elements.transparentToggle.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-light))';
        elements.transparentToggle.setAttribute('aria-pressed', 'false');
        showNotification('Transparent mode disabled!', 'info');
    }
    
    // Add subtle haptic feedback on mobile
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

/**
 * Generate transparent text art
 */
async function generateTransparent() {
    const text = elements.textInput.value.trim();
    
    if (!text) {
        showNotification('Please type something first!', 'warning');
        elements.textInput.focus();
        return;
    }

    if (text.length < 2) {
        showNotification('Please enter at least 2 characters!', 'warning');
        elements.textInput.focus();
        return;
    }
    
    // Check for valid characters
    if (!isValidText(text)) {
        showNotification('Please use only letters, numbers, and basic punctuation!', 'warning');
        return;
    }

    // Hide all previews
    hideAllPreviews();
    
    // Show loading
    elements.loading.style.display = 'block';
    elements.loading.classList.add('slide-in');
    
    try {
        const response = await fetch('https://kweenify-api.onrender.com/api/generate', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                text: text.toUpperCase(),
                bgColor: 'transparent'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to generate transparent image');
        }

        const imgSrc = data.image;

        // Load and display the transparent image
        await loadAndDisplayImage(imgSrc, 'transparent');

        showNotification('Transparent image generated successfully!', 'success');

    } catch (err) {
        console.error('Generation error:', err);
        showNotification(`Error generating transparent image: ${err.message}`, 'error');
    } finally {
        elements.loading.style.display = 'none';
    }
}

/**
 * Generate text art with color background
 */
async function generateWithColor() {
    const text = elements.textInput.value.trim();
    const bgColor = document.getElementById('bgColor').value;
    
    if (!text) {
        showNotification('Please type something first!', 'warning');
        elements.textInput.focus();
        return;
    }

    if (text.length < 2) {
        showNotification('Please enter at least 2 characters!', 'warning');
        elements.textInput.focus();
        return;
    }
    
    // Check for valid characters
    if (!isValidText(text)) {
        showNotification('Please use only letters, numbers, and basic punctuation!', 'warning');
        return;
    }
    
    // Hide all previews
    hideAllPreviews();
    
    // Show loading
    elements.loading.style.display = 'block';
    elements.loading.classList.add('slide-in');

    try {
        // First generate transparent image
        const res = await fetch('https://kweenify-api.onrender.com/api/generate', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                text: text.toUpperCase(),
                bgColor: 'transparent'
            })
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        if (!data.success) {
            throw new Error(data.error || 'Failed to generate image');
        }

        const transparentImgSrc = data.image;

        // Apply background color using canvas
        const finalImage = await applyBackgroundColor(transparentImgSrc, bgColor);

        await loadAndDisplayImage(finalImage, 'color');

        showNotification('Color background image generated successfully!', 'success');

    } catch (err) {
        console.error('Generation error:', err);
        showNotification(`Error generating image: ${err.message}`, 'error');
    } finally {
        elements.loading.style.display = 'none';
    }
}

/**
 * Apply background color to transparent image using canvas
 * @param {string} imgSrc - Source image URL
 * @param {string} bgColor - Background color
 * @returns {Promise<string>} Data URL of the processed image
 */
function applyBackgroundColor(imgSrc, bgColor) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 1200;
                canvas.height = 630;
                const ctx = canvas.getContext('2d');

                // Draw background color
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, 1200, 630);

                // Draw the kweenify image on top
                ctx.drawImage(img, 0, 0, 1200, 630);

                const finalImage = canvas.toDataURL('image/png');
                resolve(finalImage);
            } catch (err) {
                reject(err);
            }
        };
        
        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };
        
        img.src = imgSrc;
    });
}

/**
 * Load and display image with animation
 * @param {string} imgSrc - Image source URL
 * @param {string} type - Type of image (transparent or color)
 */
async function loadAndDisplayImage(imgSrc, type) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        img.onload = () => {
            if (type === 'transparent') {
                elements.transparentPreview.src = imgSrc;
                elements.transparentPreview.style.display = 'block';
                elements.transparentPreview.classList.add('bounce-in');
                
                // Setup download link
                const text = elements.textInput.value.trim().toLowerCase();
                elements.transparentDownloadLink.href = imgSrc;
                elements.transparentDownloadLink.download = `kweenify-transparent-${text.replace(/[^a-z0-9]/g,'-')}.png`;
                
                elements.transparentDownload.style.display = 'block';
                elements.transparentDownload.classList.add('fade-in');
            } else {
                elements.colorPreview.src = imgSrc;
                elements.colorPreview.style.display = 'block';
                elements.colorPreview.classList.add('bounce-in');
                
                // Setup download link
                const text = elements.textInput.value.trim().toLowerCase();
                const bgColor = document.getElementById('bgColor').value;
                elements.colorDownloadLink.href = imgSrc;
                elements.colorDownloadLink.download = `kweenify-${bgColor.replace('#','')}-${text.replace(/[^a-z0-9]/g,'-')}.png`;
                
                elements.colorDownload.style.display = 'block';
                elements.colorDownload.classList.add('fade-in');
            }
            
            resolve();
        };
        
        img.onerror = () => {
            reject(new Error('Failed to load generated image'));
        };
        
        img.src = imgSrc;
    });
}

/**
 * Hide all preview sections
 */
function hideAllPreviews() {
    elements.transparentPreview.style.display = 'none';
    elements.colorPreview.style.display = 'none';
    elements.transparentDownload.style.display = 'none';
    elements.colorDownload.style.display = 'none';
}

/**
 * Validate input text
 * @param {string} text - Text to validate
 * @returns {boolean} - True if valid
 */
function isValidText(text) {
    // Allow letters, numbers, spaces, and basic punctuation
    const validPattern = /^[a-zA-Z0-9\s.,!?@#$%^&*()_+\-=\[\]{}|;:'",.<>/?]+$/;
    return validPattern.test(text);
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${getNotificationColor(type)};
        color: white;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.9rem;
        z-index: 1000;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        transform: translateX(400px);
        transition: all 0.3s ease;
        max-width: min(350px, 90vw);
        word-wrap: break-word;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    // Add icon based on type
    const icon = getNotificationIcon(type);
    notification.innerHTML = `<i class="bx ${icon}"></i> ${message}`;
    
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3500); // Show for 3.5 seconds
}

/**
 * Get notification color based on type
 * @param {string} type - Notification type
 * @returns {string} - CSS gradient
 */
function getNotificationColor(type) {
    switch (type) {
        case 'success':
            return 'linear-gradient(135deg, #10b981, #34d399)';
        case 'error':
            return 'linear-gradient(135deg, #ef4444, #f87171)';
        case 'warning':
            return 'linear-gradient(135deg, #f59e0b, #fbbf24)';
        default:
            return 'linear-gradient(135deg, #3b82f6, #60a5fa)';
    }
}

/**
 * Get notification icon based on type
 * @param {string} type - Notification type
 * @returns {string} - Boxicon class
 */
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'bx-check-circle';
        case 'error':
            return 'bx-error-circle';
        case 'warning':
            return 'bx-warning';
        default:
            return 'bx-info-circle';
    }
}

/**
 * Handle Enter key press
 * @param {KeyboardEvent} e - Key event
 */
function handleEnterKey(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (isTransparent) {
            generateTransparent();
        } else {
            generateWithColor();
        }
    }
}

/**
 * Handle text input changes
 * @param {InputEvent} e - Input event
 */
function handleTextInput(e) {
    const text = e.target.value;
    
    // Real-time character count feedback
    if (text.length > 70) {
        e.target.style.borderColor = '#f59e0b';
    } else if (text.length > 80) {
        e.target.style.borderColor = '#ef4444';
    } else {
        e.target.style.borderColor = '';
    }
    
    // Auto-convert to uppercase
    if (text !== text.toUpperCase()) {
        const cursorPosition = e.target.selectionStart;
        e.target.value = text.toUpperCase();
        e.target.setSelectionRange(cursorPosition, cursorPosition);
    }
}

/**
 * Handle window resize events
 */
function handleResize() {
    // Debounce resize handler
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        // Trigger any necessary recalculations
        document.querySelectorAll('.feature, .preview-item').forEach(el => {
            el.style.transition = 'none';
            setTimeout(() => {
                el.style.transition = '';
            }, 10);
        });
    }, 250);
}

/**
 * Handle window load event
 */
function handleWindowLoad() {
    focusInput();
    
    // Add any additional initialization here
    console.log('Kweenify loaded successfully!');
}

/**
 * Focus on text input
 */
function focusInput() {
    setTimeout(() => {
        if (elements.textInput) {
            elements.textInput.focus();
        }
    }, 500); // Small delay to ensure DOM is ready
}

// Export functions for global access
window.toggleTransparent = toggleTransparent;
window.generateTransparent = generateTransparent;
window.generateWithColor = generateWithColor;

// Additional utility functions for external use
window.KweenifyApp = {
    isTransparent: () => isTransparent,
    getCurrentText: () => elements.textInput ? elements.textInput.value : '',
    clearInput: () => {
        if (elements.textInput) {
            elements.textInput.value = '';
            hideAllPreviews();
        }
    },
    setTransparentMode: (enabled) => {
        if (enabled && !isTransparent) {
            toggleTransparent();
        } else if (!enabled && isTransparent) {
            toggleTransparent();
        }
    }
};
