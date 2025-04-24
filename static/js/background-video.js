document.addEventListener('DOMContentLoaded', function() {
    // Get the video element
    const video = document.getElementById('background-video');
    if (!video) {
        console.log('Error: Background video element not found');
        return;
    }
    
    // Log video source information
    console.log('Video sources:');
    const sources = video.querySelectorAll('source');
    sources.forEach((source, index) => {
        console.log(`Source ${index + 1}: ${source.src}, type: ${source.type}`);
    });
    
    // Get control elements
    const playPauseBtn = document.getElementById('video-control-btn');
    const audioBtn = document.getElementById('toggle-audio');
    
    // Initialize video (start muted to ensure autoplay works in all browsers)
    video.muted = true; // Start muted to ensure autoplay
    video.loop = true;
    video.volume = 0.7; // Set initial volume to 70%
    
    // Add loading events
    video.addEventListener('loadstart', () => console.log('Video: loadstart event'));
    video.addEventListener('loadeddata', () => console.log('Video: loadeddata event - can play but not smoothly yet'));
    video.addEventListener('canplay', () => console.log('Video: canplay event - can play now'));
    video.addEventListener('canplaythrough', () => console.log('Video: canplaythrough event - can play smoothly'));
    
    // Play the video - will work in most browsers because it's muted
    video.play().catch(err => {
        console.log('Error playing video initially:', err);
    });
    
    // Add click event to body to enable audio on first user interaction
    document.body.addEventListener('click', function bodyClick() {
        // Try to unmute and play on first click
        video.muted = false;
        video.play().catch(err => {
            console.log('Could not play with sound on interaction:', err);
            video.muted = true; // Keep muted if failed
            
            // Update audio icon
            const audioIcon = audioBtn?.querySelector('.audio-icon');
            if (audioIcon) audioIcon.textContent = '🔇';
        });
        
        // Remove this listener after first click
        document.body.removeEventListener('click', bodyClick);
    }, { once: true });
    
    // Setup play/pause button
    if (playPauseBtn) {
        const icon = playPauseBtn.querySelector('i');
        
        playPauseBtn.addEventListener('click', function() {
            if (video.paused) {
                video.play().catch(err => {
                    console.log('Error playing video on button click:', err);
                });
                
                if (icon) {
                    icon.classList.remove('fa-play');
                    icon.classList.add('fa-pause');
                }
            } else {
                video.pause();
                if (icon) {
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                }
            }
        });
    }
    
    // Setup audio toggle button
    if (audioBtn) {
        const audioIcon = audioBtn.querySelector('.audio-icon');
        
        audioBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering body click event
            
            video.muted = !video.muted;
            
            if (audioIcon) {
                audioIcon.textContent = video.muted ? '🔇' : '🔊';
            }
            
            if (!video.muted) {
                video.play().catch(err => {
                    console.log('Error playing video with sound:', err);
                    video.muted = true;
                    if (audioIcon) {
                        audioIcon.textContent = '🔇';
                    }
                });
            }
        });
    }
    
    // Handle video errors
    video.addEventListener('error', function() {
        console.error('Error loading video');
        const fallbackBg = document.querySelector('.fallback-background');
        if (fallbackBg) {
            fallbackBg.style.display = 'block';
        }
        if (playPauseBtn) {
            playPauseBtn.style.display = 'none';
        }
        if (audioBtn) {
            audioBtn.style.display = 'none';
        }
    });
    
    console.log('Background video initialized successfully');
});