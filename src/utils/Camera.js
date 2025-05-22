// src/utils/Camera.js
export class Camera {
    constructor(videoElement, options = {}) {
        this.video = videoElement
        this.options = {
            width: 640,
            height: 480,
            facingMode: 'user',
            onFrame: null,
            ...options
        }
        
        this.stream = null
        this.animationId = null
        this.isRunning = false
    }
    
    async start() {
        try {
            // Request camera permissions and stream
            const constraints = {
                video: {
                    width: { ideal: this.options.width },
                    height: { ideal: this.options.height },
                    facingMode: this.options.facingMode,
                    frameRate: { ideal: 30, max: 60 }
                },
                audio: false
            }
            
            this.stream = await navigator.mediaDevices.getUserMedia(constraints)
            this.video.srcObject = this.stream
            
            // Wait for video metadata to load
            await new Promise((resolve, reject) => {
                this.video.onloadedmetadata = () => {
                    this.video.play()
                        .then(resolve)
                        .catch(reject)
                }
                
                this.video.onerror = () => {
                    reject(new Error('Video element error'))
                }
                
                // Timeout after 10 seconds
                setTimeout(() => {
                    reject(new Error('Camera initialization timeout'))
                }, 10000)
            })
            
            // Log actual video dimensions
            console.log(`📹 Camera started: ${this.video.videoWidth}x${this.video.videoHeight}`)
            
            // Start the frame processing loop
            this.isRunning = true
            this.startFrameLoop()
            
            return {
                width: this.video.videoWidth,
                height: this.video.videoHeight
            }
            
        } catch (error) {
            await this.stop()
            throw new Error(`Failed to start camera: ${error.message}`)
        }
    }
    
    startFrameLoop() {
        if (!this.isRunning) return
        
        const processFrame = async () => {
            if (!this.isRunning) return
            
            try {
                if (this.options.onFrame && typeof this.options.onFrame === 'function') {
                    await this.options.onFrame()
                }
            } catch (error) {
                console.error('Error in frame processing:', error)
            }
            
            // Schedule next frame
            this.animationId = requestAnimationFrame(processFrame)
        }
        
        processFrame()
    }
    
    async stop() {
        this.isRunning = false
        
        // Cancel animation frame
        if (this.animationId) {
            cancelAnimationFrame(this.animationId)
            this.animationId = null
        }
        
        // Stop video stream
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop()
            })
            this.stream = null
        }
        
        // Clear video source
        if (this.video) {
            this.video.srcObject = null
        }
        
        console.log('📹 Camera stopped')
    }
    
    // Get current video dimensions
    getDimensions() {
        return {
            width: this.video.videoWidth || this.options.width,
            height: this.video.videoHeight || this.options.height
        }
    }
    
    // Check if camera is currently running
    isActive() {
        return this.isRunning && this.stream && this.stream.active
    }
    
    // Get available camera devices
    static async getAvailableDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices()
            return devices.filter(device => device.kind === 'videoinput')
        } catch (error) {
            console.error('Error getting camera devices:', error)
            return []
        }
    }
    
    // Switch to a different camera device
    async switchCamera(deviceId) {
        if (this.isRunning) {
            await this.stop()
        }
        
        this.options.deviceId = deviceId
        delete this.options.facingMode // Remove facingMode when using specific device
        
        // Update constraints to use specific device
        const constraints = {
            video: {
                deviceId: { exact: deviceId },
                width: { ideal: this.options.width },
                height: { ideal: this.options.height },
                frameRate: { ideal: 30, max: 60 }
            },
            audio: false
        }
        
        this.stream = await navigator.mediaDevices.getUserMedia(constraints)
        this.video.srcObject = this.stream
        
        await new Promise((resolve) => {
            this.video.onloadedmetadata = () => {
                this.video.play()
                resolve()
            }
        })
        
        this.isRunning = true
        this.startFrameLoop()
        
        return this.getDimensions()
    }
    
    // Take a photo from the current video stream
    takePhoto(format = 'image/png', quality = 0.9) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        canvas.width = this.video.videoWidth
        canvas.height = this.video.videoHeight
        
        // Draw current video frame
        ctx.drawImage(this.video, 0, 0)
        
        // Return as data URL
        return canvas.toDataURL(format, quality)
    }
    
    // Check camera permissions
    static async checkPermissions() {
        try {
            const permission = await navigator.permissions.query({ name: 'camera' })
            return {
                state: permission.state,
                granted: permission.state === 'granted'
            }
        } catch (error) {
            console.warn('Cannot check camera permissions:', error)
            return {
                state: 'unknown',
                granted: false
            }
        }
    }
}
