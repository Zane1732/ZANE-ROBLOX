document.addEventListener('DOMContentLoaded', function() {
    // Main background canvas with low visual effects
    function setupBackground() {
        const canvas = document.createElement('canvas');
        canvas.id = 'background-canvas';
        canvas.className = 'network-background';
        document.body.appendChild(canvas);
        
        // Canvas setup
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to window size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        // Initial resize
        resizeCanvas();
        
        // Handle window resize
        window.addEventListener('resize', resizeCanvas);
        
        // Network properties - Reduced for low effects
        const nodes = [];
        const nodeCount = 50; // Reduced node count
        const connectionDistance = 120; // Reduced connection distance
        const colors = ['#4F52C9', '#5E2CD5', '#00A2FF'];
        
        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            // Bias more nodes toward the top using skewed random distribution
            const yPos = Math.pow(Math.random(), 1.5) * canvas.height;
            
            nodes.push({
                x: Math.random() * canvas.width,
                y: yPos,
                radius: Math.random() * 1.5 + 0.5, // Smaller dots
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: Math.random() * 0.2 - 0.1, // Slower motion
                vy: Math.random() * 0.2 - 0.05 // Slower motion
            });
        }
        
        // Animation loop with reduced framerate
        let lastFrameTime = 0;
        const frameInterval = 1000 / 20; // 20 FPS
        
        function animate(currentTime) {
            // Limit framerate
            if (currentTime - lastFrameTime < frameInterval) {
                requestAnimationFrame(animate);
                return;
            }
            lastFrameTime = currentTime;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw nodes
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                
                // Move nodes
                node.x += node.vx;
                node.y += node.vy;
                
                // Boundary check
                if (node.x < 0 || node.x > canvas.width) node.vx = -node.vx;
                if (node.y < 0 || node.y > canvas.height) node.vy = -node.vy;
                
                // Draw node
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.fill();
                
                // Draw fewer connections - only every other node for efficiency
                if (i % 2 === 0) {
                    for (let j = i + 2; j < nodes.length; j += 2) {
                        const other = nodes[j];
                        const dx = node.x - other.x;
                        const dy = node.y - other.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < connectionDistance) {
                            // Calculate opacity based on distance
                            const opacity = 1 - (distance / connectionDistance);
                            
                            // Draw line
                            ctx.beginPath();
                            ctx.moveTo(node.x, node.y);
                            ctx.lineTo(other.x, other.y);
                            ctx.strokeStyle = `rgba(100, 100, 255, ${opacity * 0.15})`; // Reduced opacity
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
            }
            
            // Loop
            requestAnimationFrame(animate);
        }
        
        // Start animation
        requestAnimationFrame(animate);
    }
    
    // Profile section canvas with minimal effects
    function setupProfileCardBackground() {
        // Target elements to add the effect to
        const targets = [
            '.profile-header-section',
            '.tabs-container'
            // Removed tab-content to reduce the number of canvases
        ];
        
        targets.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            
            elements.forEach(element => {
                // Create canvas for this element
                const canvas = document.createElement('canvas');
                canvas.className = 'card-network-background';
                element.prepend(canvas);
                
                // Get element dimensions
                const updateCanvasSize = () => {
                    const rect = element.getBoundingClientRect();
                    canvas.width = rect.width;
                    canvas.height = rect.height;
                };
                
                updateCanvasSize();
                window.addEventListener('resize', updateCanvasSize);
                
                // Canvas setup
                const ctx = canvas.getContext('2d');
                
                // Network properties
                const points = [];
                const pointCount = Math.min(15, Math.floor((canvas.width * canvas.height) / 10000)); // Much lower density
                const connectionDistance = 80; // Reduced connection distance
                const pointSize = 1.5; // Smaller points
                
                // Define colors for the wireframe network - simpler colors
                const colors = {
                    c1: 'rgba(143, 77, 172, 0.5)', // Purple
                    c2: 'rgba(91, 119, 190, 0.5)'  // Blue
                };
                
                // Create points with more density at the top
                for (let i = 0; i < pointCount; i++) {
                    const colorKeys = Object.keys(colors);
                    const colorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
                    
                    // Bias more points toward the top using skewed random distribution
                    const yPos = Math.pow(Math.random(), 1.5) * canvas.height;
                    
                    points.push({
                        x: Math.random() * canvas.width,
                        y: yPos,
                        vx: (Math.random() - 0.5) * 0.2, // Slower movement
                        vy: Math.random() * 0.2 - 0.05,  // Slower movement
                        color: colors[colorKey]
                    });
                }
                
                // Animation loop at reduced framerate
                let lastFrameTime = 0;
                const frameInterval = 1000 / 15; // 15 FPS - even lower
                
                function animate(currentTime) {
                    // Limit framerate
                    if (currentTime - lastFrameTime < frameInterval) {
                        requestAnimationFrame(animate);
                        return;
                    }
                    lastFrameTime = currentTime;
                    
                    // Clear canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Update and draw points
                    for (let i = 0; i < points.length; i++) {
                        const point = points[i];
                        
                        // Move points
                        point.x += point.vx;
                        point.y += point.vy;
                        
                        // Boundary check with bounce
                        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
                        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
                        
                        // Draw point
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, pointSize, 0, Math.PI * 2);
                        ctx.fillStyle = point.color;
                        ctx.fill();
                        
                        // Simplified connection drawing - no gradients
                        for (let j = i + 1; j < points.length; j++) {
                            const otherPoint = points[j];
                            const dx = point.x - otherPoint.x;
                            const dy = point.y - otherPoint.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            if (distance < connectionDistance) {
                                // Simple line with opacity
                                const opacity = 0.1; // Fixed low opacity
                                
                                // Draw line
                                ctx.beginPath();
                                ctx.moveTo(point.x, point.y);
                                ctx.lineTo(otherPoint.x, otherPoint.y);
                                ctx.strokeStyle = 'rgba(143, 77, 172, ' + opacity + ')';
                                ctx.lineWidth = 0.5;
                                ctx.stroke();
                            }
                        }
                    }
                    
                    // Loop
                    requestAnimationFrame(animate);
                }
                
                // Start animation
                requestAnimationFrame(animate);
            });
        });
    }
    
    // Setup both effects
    setupBackground();
    setupProfileCardBackground();
});