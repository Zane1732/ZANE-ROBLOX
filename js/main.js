// Optimized Roblox Profile Page JavaScript
(function() {
    'use strict';

    // Get user data from meta tags - cached for performance
    const getUserData = () => {
        const userDataMeta = document.querySelector('meta[name="user-data"]');
        if (!userDataMeta) return null;
        
        return {
            userId: userDataMeta.getAttribute('data-userid'),
            name: userDataMeta.getAttribute('data-name'),
            displayName: userDataMeta.getAttribute('data-displayName'),
            isUnder13: userDataMeta.getAttribute('data-isunder13') === 'true',
            created: userDataMeta.getAttribute('data-created'),
            isPremiumUser: userDataMeta.getAttribute('data-ispremiumuser') === 'true',
            hasVerifiedBadge: userDataMeta.getAttribute('data-hasverifiedbadge') === 'true'
        };
    };

    // Initialize mobile navigation
    const initMobileNav = () => {
        // Add mobile navigation toggle functionality here if needed
        console.log('Mobile navigation initialized');
    };

    // Tab navigation functionality - Optimized for performance
    const initTabs = () => {
        const tabItems = document.querySelectorAll('.tab-item');
        const tabContentsMap = {}; // Cache tab content elements
        
        // Pre-cache tab contents for faster access
        document.querySelectorAll('.tab-content').forEach(content => {
            // Extract tab name from class (e.g., "about-tab" becomes "about")
            const className = Array.from(content.classList)
                .find(cls => cls.endsWith('-tab'));
                
            if (className) {
                const tabName = className.replace('-tab', '');
                tabContentsMap[tabName] = content;
                
                // Hide all tab contents except the first one
                if (!content.classList.contains('about-tab')) {
                    content.style.display = 'none';
                }
            }
        });
        
        // Use event delegation for better performance
        const tabsContainer = document.querySelector('.tabs-navigation');
        if (tabsContainer) {
            tabsContainer.addEventListener('click', (e) => {
                // Only process clicks on tab items
                const tabItem = e.target.closest('.tab-item');
                if (!tabItem) return;
                
                e.preventDefault();
                
                // Get the tab name from the tab text
                const tabName = tabItem.textContent.trim().toLowerCase();
                
                // Remove active class from all tabs (more efficient than forEach)
                for (let i = 0; i < tabItems.length; i++) {
                    tabItems[i].classList.remove('active');
                }
                
                // Add active class to clicked tab
                tabItem.classList.add('active');
                
                // Hide all tab contents
                for (const key in tabContentsMap) {
                    tabContentsMap[key].style.display = 'none';
                }
                
                // Show the corresponding tab content
                const targetContent = tabContentsMap[tabName];
                if (targetContent) {
                    targetContent.style.display = 'block';
                } else if (tabName === 'about' && tabContentsMap['about']) {
                    // Default to about tab if specific tab not found
                    tabContentsMap['about'].style.display = 'block';
                }
            });
        }
    };

    // Friend request button functionality
    const initFriendButton = () => {
        const friendButton = document.querySelector('.action-button.primary');
        if (!friendButton) return;
        
        friendButton.addEventListener('click', () => {
            // Toggle button text between "Add Friend" and "Friend Request Sent"
            if (friendButton.textContent === 'Add Friend') {
                friendButton.textContent = 'Friend Request Sent';
                friendButton.style.backgroundColor = '#5CB85C';
            } else {
                friendButton.textContent = 'Add Friend';
                friendButton.style.backgroundColor = '';
            }
        });
    };

    // Initialize responsive design adjustments with debounce for better performance
    const initResponsive = () => {
        let resizeTimeout;
        
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            const searchContainer = document.querySelector('.search-container');
            
            // Adjust search container visibility based on screen width
            if (searchContainer) {
                searchContainer.style.display = windowWidth <= 576 ? 'none' : 'block';
            }
        };
        
        // Run on load
        handleResize();
        
        // Add resize listener with debounce
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 150); // Debounce by 150ms
        });
    };

    // Play button functionality removed to improve performance

    // Initialize avatar view controls with event delegation
    const initAvatarViewControls = () => {
        const controlsContainer = document.querySelector('.avatar-view-controls');
        if (!controlsContainer) return;
        
        controlsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.view-control-button');
            if (button) {
                alert(`This is a static demo. In a real Roblox environment, clicking this button would change the avatar view to ${button.textContent.trim()} mode.`);
            }
        });
    };
    
    // Initialize background video with audio controls and glitch effects
    const initBackgroundVideo = () => {
        const video = document.getElementById('background-video');
        const audioToggle = document.getElementById('toggle-audio');
        
        if (!video) {
            console.log('Background video element not found');
            return;
        }
        
        if (!audioToggle) {
            console.log('Audio toggle element not found');
            return;
        }
        
        const audioIcon = audioToggle.querySelector('.audio-icon');
        const glitchNoise = document.querySelector('.glitch-noise');
        const glitchOverlay = document.querySelector('.glitch-overlay');
        
        // Make sure video is muted by default
        video.muted = true;
        
        // Remove all glitch effects
        const noGlitchEffect = () => {
            // Do nothing - glitch effects removed
            console.log("Glitch effects disabled");
        };
        
        // No random glitches
        const startRandomGlitches = () => {
            return null; // No interval to return
        };
        
        // Do not start glitch effects
        
        // Toggle audio on/off when button is clicked
        audioToggle.addEventListener('click', () => {
            video.muted = !video.muted;
            
            // No glitch effect when audio is toggled
            noGlitchEffect();
            
            // Update icon
            if (video.muted) {
                audioIcon.textContent = '🔇';
            } else {
                audioIcon.textContent = '🔊';
                // Ensure video is playing when unmuting
                video.play().catch(err => {
                    console.log('Error playing video with audio:', err);
                    // If autoplay with sound is blocked, revert to muted
                    video.muted = true;
                    audioIcon.textContent = '🔇';
                });
            }
        });
        
        // No glitch effects on page elements interaction
        document.querySelectorAll('.action-button, .tab-item, .avatar-image').forEach(element => {
            element.addEventListener('click', noGlitchEffect);
            // No hover effects
        });
        
        // Ensure video loops and plays
        video.loop = true;
        video.playbackRate = 1.0; // Normal playback speed
        
        video.play().catch(err => {
            console.log('Error playing video initially:', err);
        });
    };
    
    // Document ready function - simplified
    const ready = (callback) => {
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    };

    // Initialize all components when document is ready
    ready(() => {
        console.log('Roblox profile page initialized');
        const userData = getUserData();
        console.log('User data:', userData);
        
        // Initialize components
        initMobileNav();
        initTabs();
        initFriendButton();
        initResponsive();
        initBackgroundVideo();
        initAvatarViewControls();
    });
})();
