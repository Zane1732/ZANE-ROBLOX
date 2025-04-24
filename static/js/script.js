// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get references to elements
    const video = document.getElementById('background-video');
    const controlBtn = document.getElementById('video-control-btn');
    const controlIcon = controlBtn.querySelector('i');
    const fallbackBg = document.querySelector('.fallback-background');
    
    // Function to handle the play/pause toggle
    function togglePlayPause() {
        if (video.paused) {
            video.play();
            controlIcon.classList.remove('fa-play');
            controlIcon.classList.add('fa-pause');
        } else {
            video.pause();
            controlIcon.classList.remove('fa-pause');
            controlIcon.classList.add('fa-play');
        }
    }
    
    // Add click event listener to the control button
    controlBtn.addEventListener('click', togglePlayPause);
    
    // Handle video loading errors
    video.addEventListener('error', function() {
        console.error('Error loading video');
        // Show fallback background if video fails to load
        fallbackBg.style.display = 'block';
        // Hide the video controls since they won't be needed
        controlBtn.style.display = 'none';
    });
    
    // Set initial state
    video.addEventListener('loadeddata', function() {
        console.log('Video loaded successfully');
        
        // If video autoplays, ensure icon shows pause
        if (!video.paused) {
            controlIcon.classList.remove('fa-play');
            controlIcon.classList.add('fa-pause');
        }
    });
    
    // Handle potential autoplay restrictions by checking play state
    video.addEventListener('play', function() {
        controlIcon.classList.remove('fa-play');
        controlIcon.classList.add('fa-pause');
    });
    
    video.addEventListener('pause', function() {
        controlIcon.classList.remove('fa-pause');
        controlIcon.classList.add('fa-play');
    });
    
    // Handle case where autoplay is prevented by browser
    video.addEventListener('canplay', function() {
        // Some browsers prevent autoplay, check if video is actually playing
        if (video.paused) {
            controlIcon.classList.remove('fa-pause');
            controlIcon.classList.add('fa-play');
        }
    });
    
    // Function to check if device is mobile or touch-enabled
    function isMobileDevice() {
        return (typeof window.orientation !== 'undefined') || 
               (navigator.userAgent.indexOf('IEMobile') !== -1) ||
               ('ontouchstart' in document.documentElement);
    }
    
    // Add special handling for mobile devices
    if (isMobileDevice()) {
        // Remove muted attribute to allow user interaction to enable sound
        // (Mobile browsers often require user interaction for sound)
        video.removeAttribute('muted');
        
        // Add click on video to toggle play/pause (mobile-friendly)
        video.addEventListener('click', function(e) {
            // Prevent the click from reaching elements below
            e.stopPropagation();
            togglePlayPause();
        });
        
        // Add poster attribute for better mobile experience
        video.setAttribute('poster', '');
    }
    
    // Handle window resize for responsive adjustments
    window.addEventListener('resize', function() {
        // Adjust any necessary styles for different screen sizes
        // This could be handled by CSS, but JS can be used for complex adjustments
    });
    
    // Log initialization complete
    console.log('Video background initialized');
});
