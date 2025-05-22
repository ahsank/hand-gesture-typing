// src/components/HandGestureTypingSystem.js
import { Hands } from '@mediapipe/hands'
import { drawConnectors, drawLandmarks, HAND_CONNECTIONS } from '@mediapipe/drawing_utils'
import { GESTURE_MAPPINGS } from '../config/gestureMappings.js'
import { Camera } from '../utils/Camera.js'
import { PerformanceMonitor } from '../utils/PerformanceMonitor.js'
import { SnapshotManager } from '../utils/SnapshotManager.js'
import { GestureDetector } from '../utils/GestureDetector.js'

export class HandGestureTypingSystem {
    constructor() {
        // DOM elements
        this.videoElement = document.getElementById('video-input')
        this.canvasElement = document.getElementById('canvas-output')
        this.canvasCtx = this.canvasElement.getContext('2d')
        this.textOutput = document.getElementById('text-output')
        this.statusElement = document.getElementById('status')
        this.keyMapGrid = document.getElementById('key-map-grid')
        
        // MediaPipe components
        this.hands = null
        this.camera = null
        
        // Application state
        this.detectionEnabled = true
        this.debugMode = import.meta.env.DEV // Enable debug mode in development
        
        // Configuration
        this.config = {
            touchDistance: 0.04,
            gestureTimeout: 200, // ms
            handSpeedThreshold: 0.02,
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.3,
            minTrackingConfidence: 0.5
        }
        
        // Utility classes
        this.performanceMonitor = new PerformanceMonitor()
        this.snapshotManager = new SnapshotManager(this)
        this.gestureDetector = new GestureDetector(this.config)
        
        // State tracking
        this.previousHandPosition = null
        this.currentActiveGesture = null
        this.lastDetectedGestures = {}
        this.currentTouches = new Set()
        
        // Initialize components
        this.setupEventListeners()
        this.initKeyMap()
    }
    
    async init() {
        try {
            this.updateStatus('Initializing MediaPipe Hands...', 'status')
            
            // Initialize MediaPipe Hands
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
                }
            })
            
            // Configure hand detection
            this.hands.setOptions({
                maxNumHands: this.config.maxNumHands,
                modelComplexity: this.config.modelComplexity,
                minDetectionConfidence: this.config.minDetectionConfidence,
                minTrackingConfidence: this.config.minTrackingConfidence
            })
            
            // Set up results callback
            this.hands.onResults((results) => this.onResults(results))
            
            this.updateStatus('Starting camera...', 'status')
            
            // Initialize camera
            this.camera = new Camera(this.videoElement, {
                onFrame: async () => {
                    if (this.hands && this.detectionEnabled) {
                        try {
                            await this.hands.send({ image: this.videoElement })
                        } catch (error) {
                            console.error('Error in hand detection:', error)
                        }
                    }
                },
                width: 640,
                height: 480
            })
            
            await this.camera.start()
            
            // Ensure canvas size matches video
            this.canvasElement.width = this.videoElement.videoWidth || 640
            this.canvasElement.height = this.videoElement.videoHeight || 480
            
            this.updateStatus('✅ Ready to detect gestures! Touch fingertips to knuckles to type.', 'status success')
            
            // Start performance monitoring
            this.performanceMonitor.start()
            
            // Check lighting after a delay
            setTimeout(() => this.checkLighting(), 2000)
            
        } catch (error) {
            console.error('Initialization error:', error)
            this.updateStatus(`❌ Initialization failed: ${error.message}`, 'status warning')
            throw error
        }
    }
    
    setupEventListeners() {
        // Control buttons
        document.getElementById('clear-btn')?.addEventListener('click', () => {
            this.textOutput.textContent = ''
        })
        
        document.getElementById('space-btn')?.addEventListener('click', () => {
            this.textOutput.textContent += ' '
        })
        
        document.getElementById('backspace-btn')?.addEventListener('click', () => {
            this.textOutput.textContent = this.textOutput.textContent.slice(0, -1)
        })
        
        // Create additional controls
        this.createAdvancedControls()
    }
    
    createAdvancedControls() {
        const controlsDiv = document.querySelector('.controls')
        
        // Toggle detection button
        const toggleBtn = document.createElement('button')
        toggleBtn.id = 'toggle-btn'
        toggleBtn.textContent = '⏸️ Pause Detection'
        toggleBtn.addEventListener('click', () => this.toggleDetection())
        controlsDiv.appendChild(toggleBtn)
        
        // Sensitivity control
        const sensitivityDiv = document.createElement('div')
        sensitivityDiv.style.cssText = 'margin: 10px 0; text-align: center; width: 100%;'
        sensitivityDiv.innerHTML = `
            <label for="sensitivity-slider" style="display: block; margin-bottom: 5px; font-weight: 500;">
                Touch Sensitivity: <span id="sensitivity-value">${this.config.touchDistance.toFixed(3)}</span>
            </label>
            <input type="range" id="sensitivity-slider" 
                   min="0.01" max="0.15" step="0.01" 
                   value="${this.config.touchDistance}" 
                   style="width: 80%; margin: 0 auto;">
        `
        controlsDiv.appendChild(sensitivityDiv)
        
        // Sensitivity slider event
        const slider = document.getElementById('sensitivity-slider')
        const valueDisplay = document.getElementById('sensitivity-value')
        
        slider.addEventListener('input', (e) => {
            this.config.touchDistance = parseFloat(e.target.value)
            this.gestureDetector.updateConfig(this.config)
            valueDisplay.textContent = this.config.touchDistance.toFixed(3)
            this.updateStatus(`Sensitivity: ${this.config.touchDistance.toFixed(3)}`, 'status')
        })
        
        // Debug toggle button
        const debugBtn = document.createElement('button')
        debugBtn.id = 'debug-btn'
        debugBtn.textContent = this.debugMode ? '🐛 Debug: ON' : '🐛 Debug: OFF'
        debugBtn.style.backgroundColor = this.debugMode ? '#27ae60' : '#e74c3c'
        debugBtn.addEventListener('click', () => this.toggleDebugMode())
        controlsDiv.appendChild(debugBtn)
        
        // Snapshot button
        const snapshotBtn = document.createElement('button')
        snapshotBtn.id = 'snapshot-btn'
        snapshotBtn.textContent = '📸 Snapshot'
        snapshotBtn.style.backgroundColor = '#9b59b6'
        snapshotBtn.addEventListener('click', () => this.takeSnapshot())
        controlsDiv.appendChild(snapshotBtn)
    }
    
    initKeyMap() {
        // Populate the key mapping display
        Object.entries(GESTURE_MAPPINGS.ALL_GESTURES).forEach(([gestureKey, letter]) => {
            const [fingerTipIndex, knuckleIndex] = gestureKey.split('_')
            
            const fingerName = Object.keys(GESTURE_MAPPINGS.FINGER_TIPS)
                .find(key => GESTURE_MAPPINGS.FINGER_TIPS[key] == fingerTipIndex)
            const knuckleName = Object.keys(GESTURE_MAPPINGS.KNUCKLES)
                .find(key => GESTURE_MAPPINGS.KNUCKLES[key] == knuckleIndex)
            
            const item = document.createElement('div')
            item.className = 'key-map-item'
            item.innerHTML = `
                <span>${letter}</span>
                <div>
                    <strong>${fingerName?.replace('_', ' ')}</strong> tip → 
                    <strong>${knuckleName?.replace(/_/g, ' ')}</strong>
                </div>
            `
            
            this.keyMapGrid.appendChild(item)
        })
    }
    
    onResults(results) {
        this.performanceMonitor.recordFrame()
        
        // Clear canvas
        this.canvasCtx.save()
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0]
            
            try {
                // Check hand stability
                const handCenter = this.calculateHandCenter(landmarks)
                const handIsStable = this.isHandStable(handCenter)
                
                // Draw hand landmarks and connections
                this.drawHandVisualization(landmarks)
                
                // Debug visualization
                if (this.debugMode) {
                    this.visualizeDebugInfo(landmarks)
                }
                
                // Detect gestures
                if (this.detectionEnabled && handIsStable) {
                    this.detectAndProcessGestures(landmarks)
                }
                
                // Display performance info
                this.displayPerformanceInfo(handIsStable)
            } catch (error) {
                console.warn('Error processing hand landmarks:', error)
                this.updateStatus('⚠️ Hand landmark processing error', 'status warning')
            }
            
        } else {
            this.updateStatus('👋 Show your hand to the camera', 'status')
            this.currentActiveGesture = null
        }
        
        this.canvasCtx.restore()
    }
    
    drawHandVisualization(landmarks) {
        try {
            // Draw connections and landmarks using MediaPipe utilities
            drawConnectors(this.canvasCtx, landmarks, HAND_CONNECTIONS, {
                color: '#00FF00',
                lineWidth: 2
            })
            drawLandmarks(this.canvasCtx, landmarks, {
                color: '#FF0000',
                lineWidth: 1,
                radius: 3
            })
        } catch (error) {
            console.warn('Error drawing with MediaPipe utilities:', error)
            // Fallback to manual drawing
            this.drawHandLandmarksFallback(landmarks)
        }
    }
    
    drawHandLandmarksFallback(landmarks) {
        // Fallback manual drawing
        this.canvasCtx.fillStyle = '#FF0000'
        landmarks.forEach(landmark => {
            this.canvasCtx.beginPath()
            this.canvasCtx.arc(
                landmark.x * this.canvasElement.width,
                landmark.y * this.canvasElement.height,
                3, 0, 2 * Math.PI
            )
            this.canvasCtx.fill()
        })
    }
    
    visualizeDebugInfo(landmarks) {
        const debugInfo = this.gestureDetector.getDebugInfo(landmarks)
        
        // Draw distance lines and labels
        debugInfo.closePairs.forEach(pair => {
            this.drawDistanceLine(pair)
        })
        
        // Update debug text
        this.updateDebugDisplay(debugInfo)
    }
    
    drawDistanceLine(pair) {
        const { fingerTip, knuckle, distance, isActive, letter } = pair
        
        const startX = fingerTip.x * this.canvasElement.width
        const startY = fingerTip.y * this.canvasElement.height
        const endX = knuckle.x * this.canvasElement.width
        const endY = knuckle.y * this.canvasElement.height
        
        // Color based on proximity to threshold
        const ratio = distance / this.config.touchDistance
        const color = isActive ? '#00FF00' : `rgb(${Math.min(255, 100 + ratio * 155)}, ${Math.max(0, 255 - ratio * 255)}, 0)`
        
        // Draw line
        this.canvasCtx.strokeStyle = color
        this.canvasCtx.lineWidth = isActive ? 3 : 1
        this.canvasCtx.beginPath()
        this.canvasCtx.moveTo(startX, startY)
        this.canvasCtx.lineTo(endX, endY)
        this.canvasCtx.stroke()
        
        // Draw label if active
        if (isActive) {
            const midX = (startX + endX) / 2
            const midY = (startY + endY) / 2
            
            this.canvasCtx.fillStyle = 'rgba(255, 255, 255, 0.9)'
            this.canvasCtx.fillRect(midX - 20, midY - 15, 40, 30)
            this.canvasCtx.fillStyle = 'black'
            this.canvasCtx.font = '12px Arial'
            this.canvasCtx.textAlign = 'center'
            this.canvasCtx.fillText(letter, midX, midY + 5)
            this.canvasCtx.textAlign = 'left'
        }
    }
    
    detectAndProcessGestures(landmarks) {
        const detection = this.gestureDetector.detectGestures(landmarks)
        
        if (detection.gesture && detection.gesture !== this.currentActiveGesture) {
            this.processNewGesture(detection)
        } else if (!detection.gesture && this.currentActiveGesture) {
            this.currentActiveGesture = null
        }
        
        // Update current touches for snapshots
        this.currentTouches = detection.touches
    }
    
    processNewGesture(detection) {
        const { gesture, letter, distance, fingerName, knuckleName } = detection
        
        // Add letter to output
        this.addLetter(letter)
        
        // Update status
        this.updateStatus(
            `✋ ${fingerName} → ${knuckleName} = "${letter}" (${distance.toFixed(3)})`,
            'status success'
        )
        
        // Visual feedback
        this.flashGestureDetection()
        
        // Update state
        this.currentActiveGesture = gesture
        this.lastDetectedGestures[gesture] = Date.now()
    }
    
    calculateHandCenter(landmarks) {
        // Ensure wrist landmark exists
        const wrist = landmarks[0];
        
        // Validate that the middle MCP landmark index is valid and exists
        const middleMCPIndex = GESTURE_MAPPINGS.KNUCKLES.MIDDLE_MCP;
        if (middleMCPIndex === undefined || !landmarks[middleMCPIndex]) {
            // Fallback to using just the wrist if middle MCP is not available
            return { x: wrist.x, y: wrist.y, z: wrist.z };
        }
        
        const middleMCP = landmarks[middleMCPIndex];
        
        return {
            x: (wrist.x + middleMCP.x) / 2,
            y: (wrist.y + middleMCP.y) / 2,
            z: (wrist.z + middleMCP.z) / 2
        };
    }
    
    isHandStable(handCenter) {
        if (!this.previousHandPosition) {
            this.previousHandPosition = handCenter
            return true
        }
        
        const distance = Math.sqrt(
            Math.pow(handCenter.x - this.previousHandPosition.x, 2) +
            Math.pow(handCenter.y - this.previousHandPosition.y, 2) +
            Math.pow(handCenter.z - this.previousHandPosition.z, 2)
        )
        
        this.previousHandPosition = handCenter
        return distance < this.config.handSpeedThreshold
    }
    
    displayPerformanceInfo(handIsStable) {
        const fps = this.performanceMonitor.getFPS()
        
        this.canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        this.canvasCtx.fillRect(10, 10, 220, 50)
        this.canvasCtx.font = '12px Arial'
        this.canvasCtx.fillStyle = 'white'
        this.canvasCtx.fillText(`FPS: ${fps}`, 15, 25)
        this.canvasCtx.fillText(`Hand: ${handIsStable ? '✅ Stable' : '⚠️ Moving'}`, 15, 40)
        this.canvasCtx.fillText(`Active: ${this.currentActiveGesture || 'none'}`, 15, 55)
    }
    
    updateDebugDisplay(debugInfo) {
        let debugDiv = document.getElementById('debug-info')
        if (!debugDiv) {
            debugDiv = document.createElement('div')
            debugDiv.id = 'debug-info'
            debugDiv.style.cssText = `
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 10px;
                margin: 10px 0;
                font-family: monospace;
                font-size: 12px;
                white-space: pre-wrap;
            `
            
            const container = document.querySelector('.container')
            container.insertBefore(debugDiv, this.keyMapGrid.parentElement)
        }
        
        const debugText = debugInfo.closePairs
            .slice(0, 5) // Show top 5 closest pairs
            .map(pair => `${pair.fingerName} → ${pair.knuckleName}: ${pair.distance.toFixed(4)} ${pair.hasMapping ? '✓' : '✗'}`)
            .join('\n')
        
        debugDiv.textContent = `Debug Info (Top 5 closest pairs):\n${debugText}`
    }
    
    flashGestureDetection(color = 'rgba(0, 255, 0, 0.3)') {
        const overlay = document.createElement('div')
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${color};
            pointer-events: none;
            z-index: 10;
            opacity: 0.7;
            transition: opacity 0.3s ease-out;
        `
        
        const videoContainer = document.querySelector('.video-container')
        videoContainer.appendChild(overlay)
        
        setTimeout(() => {
            overlay.style.opacity = '0'
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay)
                }
            }, 300)
        }, 100)
    }
    
    addLetter(letter) {
        this.textOutput.textContent += letter
        
        // Auto-scroll to bottom if needed
        this.textOutput.scrollTop = this.textOutput.scrollHeight
    }
    
    updateStatus(message, className = 'status') {
        this.statusElement.textContent = message
        this.statusElement.className = className
    }
    
    async checkLighting() {
        try {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            canvas.width = 50
            canvas.height = 50
            
            context.drawImage(this.videoElement, 0, 0, 50, 50)
            const imageData = context.getImageData(0, 0, 50, 50).data
            
            let sum = 0
            for (let i = 0; i < imageData.length; i += 4) {
                sum += (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3
            }
            const avgBrightness = sum / (imageData.length / 4)
            
            if (avgBrightness < 50) {
                this.showLightingWarning()
            }
        } catch (error) {
            console.warn('Could not check lighting conditions:', error)
        }
    }
    
    showLightingWarning() {
        const warningDiv = document.createElement('div')
        warningDiv.style.cssText = `
            background: linear-gradient(45deg, #ffe082, #ffcc02);
            color: #5d4037;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            text-align: center;
            font-weight: 500;
            box-shadow: 0 2px 10px rgba(255, 204, 2, 0.3);
        `
        warningDiv.innerHTML = '💡 <strong>Low light detected!</strong> Hand detection works best in bright lighting conditions.'
        
        const container = document.querySelector('.container')
        container.insertBefore(warningDiv, this.videoElement.parentElement)
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (warningDiv.parentNode) {
                warningDiv.parentNode.removeChild(warningDiv)
            }
        }, 10000)
    }
    
    // Public methods for external control
    toggleDetection() {
        this.detectionEnabled = !this.detectionEnabled
        const toggleBtn = document.getElementById('toggle-btn')
        
        if (toggleBtn) {
            toggleBtn.textContent = this.detectionEnabled ? '⏸️ Pause Detection' : '▶️ Resume Detection'
            toggleBtn.style.backgroundColor = this.detectionEnabled ? '#e74c3c' : '#27ae60'
        }
        
        this.updateStatus(
            this.detectionEnabled ? '✅ Detection enabled' : '⏸️ Detection paused',
            this.detectionEnabled ? 'status success' : 'status warning'
        )
    }
    
    toggleDebugMode() {
        this.debugMode = !this.debugMode
        const debugBtn = document.getElementById('debug-btn')
        
        if (debugBtn) {
            debugBtn.textContent = this.debugMode ? '🐛 Debug: ON' : '🐛 Debug: OFF'
            debugBtn.style.backgroundColor = this.debugMode ? '#27ae60' : '#e74c3c'
        }
        
        // Remove debug display if turning off
        if (!this.debugMode) {
            const debugDiv = document.getElementById('debug-info')
            if (debugDiv) {
                debugDiv.remove()
            }
        }
        
        this.updateStatus(`Debug mode ${this.debugMode ? 'enabled' : 'disabled'}`, 'status')
    }
    
    takeSnapshot() {
        this.snapshotManager.takeSnapshot()
    }
    
    pauseDetection() {
        if (this.detectionEnabled) {
            this.detectionEnabled = false
            this.updateStatus('⏸️ Detection paused (page not visible)', 'status warning')
        }
    }
    
    resumeDetection() {
        if (!this.detectionEnabled) {
            this.detectionEnabled = true
            this.updateStatus('▶️ Detection resumed', 'status success')
        }
    }
    
    // Cleanup method
    destroy() {
        if (this.camera) {
            this.camera.stop()
        }
        
        if (this.hands) {
            this.hands.close()
        }
        
        this.performanceMonitor.stop()
        
        // Remove event listeners
        window.removeEventListener('beforeunload', this.destroy.bind(this))
    }
}
