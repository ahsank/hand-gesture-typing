// src/main.js
import { HandGestureTypingSystem } from './components/HandGestureTypingSystem.js'
import { checkSystemCompatibility, showStartupMessage } from './utils/systemCheck.js'

// Initialize the application
async function initApp() {
    try {
        // Show startup message
        showStartupMessage()
        
        // Check system compatibility
        const compatibility = await checkSystemCompatibility()
        
        if (!compatibility.isCompatible) {
            const statusElement = document.getElementById('status')
            statusElement.textContent = `System compatibility issues: ${compatibility.issues.join(', ')}`
            statusElement.className = 'status warning'
            
            // Still try to run but with warnings
            console.warn('System compatibility issues detected:', compatibility.issues)
        }
        
        // Initialize the main application
        const app = new HandGestureTypingSystem()
        await app.init()
        
        // Store app globally for debugging and keyboard shortcuts
        window.handGestureApp = app
        
        // Set up keyboard shortcuts
        setupKeyboardShortcuts(app)
        
        console.log('✅ Hand Gesture Typing System initialized successfully')
        
    } catch (error) {
        console.error('❌ Failed to initialize application:', error)
        
        const statusElement = document.getElementById('status')
        statusElement.textContent = `Initialization failed: ${error.message}`
        statusElement.className = 'status warning'
        
        // Show detailed error information in development
        if (import.meta.env.DEV) {
            console.error('Detailed error:', error)
        }
    }
}

// Set up keyboard shortcuts for the application
function setupKeyboardShortcuts(app) {
    document.addEventListener('keydown', (event) => {
        // Only process keyboard events if the text output isn't focused
        if (document.activeElement !== app.textOutput) {
            switch (event.code) {
                case 'Space':
                    app.textOutput.textContent += ' '
                    event.preventDefault()
                    break
                    
                case 'Backspace':
                    app.textOutput.textContent = app.textOutput.textContent.slice(0, -1)
                    event.preventDefault()
                    break
                    
                case 'Escape':
                    // Toggle detection on/off with Escape key
                    app.toggleDetection()
                    event.preventDefault()
                    break
                    
                case 'KeyD':
                    // Toggle debug mode with 'D' key
                    if (event.ctrlKey || event.metaKey) {
                        app.toggleDebugMode()
                        event.preventDefault()
                    }
                    break
                    
                case 'KeyS':
                    // Take snapshot with Ctrl/Cmd + S
                    if (event.ctrlKey || event.metaKey) {
                        app.takeSnapshot()
                        event.preventDefault()
                    }
                    break
            }
        }
    })
    
    // Add help text for keyboard shortcuts
    addKeyboardShortcutsHelp()
}

// Add help information for keyboard shortcuts
function addKeyboardShortcutsHelp() {
    const helpDiv = document.createElement('div')
    helpDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-size: 12px;
        max-width: 250px;
        opacity: 0.7;
        z-index: 1000;
        transition: opacity 0.3s ease;
    `
    
    helpDiv.innerHTML = `
        <strong>⌨️ Keyboard Shortcuts</strong><br>
        <kbd>Space</kbd> - Add space<br>
        <kbd>Backspace</kbd> - Delete character<br>
        <kbd>Esc</kbd> - Toggle detection<br>
        <kbd>Ctrl/Cmd + D</kbd> - Toggle debug<br>
        <kbd>Ctrl/Cmd + S</kbd> - Take snapshot
    `
    
    helpDiv.addEventListener('mouseenter', () => {
        helpDiv.style.opacity = '1'
    })
    
    helpDiv.addEventListener('mouseleave', () => {
        helpDiv.style.opacity = '0.7'
    })
    
    document.body.appendChild(helpDiv)
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp)

// Handle page visibility changes to pause/resume detection
document.addEventListener('visibilitychange', () => {
    if (window.handGestureApp) {
        if (document.hidden) {
            window.handGestureApp.pauseDetection()
        } else {
            window.handGestureApp.resumeDetection()
        }
    }
})

// Handle errors globally
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    
    if (window.handGestureApp) {
        const statusElement = document.getElementById('status')
        statusElement.textContent = `Runtime error: ${event.error.message}`
        statusElement.className = 'status warning'
    }
})

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    if (window.handGestureApp) {
        const statusElement = document.getElementById('status')
        statusElement.textContent = `Promise rejection: ${event.reason}`
        statusElement.className = 'status warning'
    }
})
