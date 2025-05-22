// src/utils/SnapshotManager.js
export class SnapshotManager {
    constructor(app) {
        this.app = app
        this.snapshots = []
        this.maxSnapshots = 10
        this.container = null
        
        this.initContainer()
    }
    
    initContainer() {
        console.log('📦 Initializing snapshot container...')
        
        // Create container if it doesn't exist
        this.container = document.getElementById('snapshot-container')
        if (!this.container) {
            console.log('📦 Creating new snapshot container...')
            this.container = this.createContainer()
        } else {
            console.log('📦 Snapshot container already exists')
        }
        
        return this.container
    }
    
    createContainer() {
        console.log('🏗️ Building snapshot container structure...')
        
        const container = document.createElement('div')
        container.id = 'snapshot-container'
        container.style.cssText = `
            margin-top: 30px;
            padding: 20px;
            border: 2px solid #ecf0f1;
            border-radius: 12px;
            background: #f8f9fa;
        `
        
        const header = document.createElement('h3')
        header.textContent = '📸 Gesture Analysis Snapshots'
        header.style.cssText = `
            margin: 0 0 15px 0;
            color: #2c3e50;
            text-align: center;
        `
        container.appendChild(header)
        
        const description = document.createElement('p')
        description.textContent = 'Capture moments during gesture detection for analysis and debugging'
        description.style.cssText = `
            text-align: center;
            color: #666;
            margin-bottom: 20px;
            font-style: italic;
        `
        container.appendChild(description)
        
        // Control buttons
        const controls = document.createElement('div')
        controls.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        `
        
        const clearAllBtn = document.createElement('button')
        clearAllBtn.textContent = '🗑️ Clear All'
        clearAllBtn.style.backgroundColor = '#e74c3c'
        clearAllBtn.addEventListener('click', () => {
            console.log('🗑️ Clearing all snapshots...')
            this.clearAllSnapshots()
        })
        controls.appendChild(clearAllBtn)
        
        const exportBtn = document.createElement('button')
        exportBtn.textContent = '💾 Export'
        exportBtn.style.backgroundColor = '#9b59b6'
        exportBtn.addEventListener('click', () => {
            console.log('💾 Exporting snapshots...')
            this.exportSnapshots()
        })
        controls.appendChild(exportBtn)
        
        // Add capture mode toggle
        const videoOnlyBtn = document.createElement('button')
        videoOnlyBtn.textContent = '📹 Video Only'
        videoOnlyBtn.style.backgroundColor = '#3498db'
        videoOnlyBtn.style.fontSize = '14px'
        videoOnlyBtn.style.padding = '8px 12px'
        videoOnlyBtn.addEventListener('click', () => {
            console.log('📹 Taking video-only snapshot from container...')
            this.takeVideoOnlySnapshot()
        })
        controls.appendChild(videoOnlyBtn)
        
        const overlayBtn = document.createElement('button')
        overlayBtn.textContent = '🎯 With Overlay'
        overlayBtn.style.backgroundColor = '#2ecc71'
        overlayBtn.style.fontSize = '14px'
        overlayBtn.style.padding = '8px 12px'
        overlayBtn.addEventListener('click', () => {
            console.log('🎯 Taking overlay snapshot from container...')
            this.takeSnapshot()
        })
        controls.appendChild(overlayBtn)
        
        container.appendChild(controls)
        
        // Snapshots grid
        const grid = document.createElement('div')
        grid.id = 'snapshots-grid'
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        `
        container.appendChild(grid)
        
        // Add to main container
        const mainContainer = document.querySelector('.container')
        if (mainContainer) {
            mainContainer.appendChild(container)
            console.log('🏗️ Snapshot container added to main container')
        } else {
            console.error('🏗️ Main container not found!')
            document.body.appendChild(container)
            console.log('🏗️ Snapshot container added to body as fallback')
        }
        
        return container
    }
    
    takeSnapshot() {
        try {
            console.log('📸 Taking snapshot...')
            
            if (!this.app.handLandmarker || !this.app.videoElement) {
                console.error('📸 Cannot take snapshot: system not ready')
                this.app.updateStatus('Cannot take snapshot: system not ready', 'status warning')
                return
            }
            
            // Check if video is actually playing
            if (this.app.videoElement.readyState < 2) {
                console.error('📸 Cannot take snapshot: video not ready')
                this.app.updateStatus('Cannot take snapshot: video not ready', 'status warning')
                return
            }
            
            console.log('📸 Creating snapshot data...')
            const snapshot = this.createSnapshotData()
            
            if (!snapshot.image || snapshot.image.length < 100) {
                console.error('📸 Snapshot image is invalid or too small')
                this.app.updateStatus('Snapshot capture failed', 'status warning')
                return
            }
            
            console.log('📸 Adding snapshot to collection...')
            this.addSnapshot(snapshot)
            
            console.log('📸 Displaying snapshot...')
            this.displaySnapshot(snapshot)
            
            // Visual feedback
            this.app.flashGestureDetection('rgba(138, 43, 226, 0.4)') // Purple for snapshot
            this.app.updateStatus(`📸 Snapshot #${this.snapshots.length} captured`, 'status success')
            
            console.log('📸 Snapshot completed successfully')
            
        } catch (error) {
            console.error('📸 Error taking snapshot:', error)
            this.app.updateStatus(`Snapshot error: ${error.message}`, 'status warning')
        }
    }
    
    // Method to take video-only snapshot
    takeVideoOnlySnapshot() {
        try {
            console.log('📹 Taking video-only snapshot...')
            
            if (!this.app.videoElement) {
                console.error('📹 Cannot take snapshot: video not ready')
                this.app.updateStatus('Cannot take snapshot: video not ready', 'status warning')
                return
            }
            
            // Check if video is actually playing
            if (this.app.videoElement.readyState < 2) {
                console.error('📹 Cannot take snapshot: video not loaded')
                this.app.updateStatus('Cannot take snapshot: video not loaded', 'status warning')
                return
            }
            
            const timestamp = new Date()
            const snapshot = {
                id: Date.now(),
                timestamp: timestamp.toISOString(),
                displayTime: timestamp.toLocaleTimeString(),
                image: this.captureVideoOnly(),
                type: 'video-only', // Mark as video-only type
                activeGesture: this.app.currentActiveGesture,
                config: { ...this.app.config },
                touches: Array.from(this.app.currentTouches || []),
                debugInfo: 'Video-only snapshot - no overlay data',
                performance: this.app.performanceMonitor.createReport(),
                videoInfo: {
                    width: this.app.videoElement.videoWidth,
                    height: this.app.videoElement.videoHeight
                }
            }
            
            if (!snapshot.image || snapshot.image.length < 100) {
                console.error('📹 Video snapshot image is invalid')
                this.app.updateStatus('Video snapshot capture failed', 'status warning')
                return
            }
            
            this.addSnapshot(snapshot)
            this.displaySnapshot(snapshot)
            
            // Visual feedback with different color
            this.app.flashGestureDetection('rgba(52, 152, 219, 0.4)') // Blue for video-only
            this.app.updateStatus(`📹 Video snapshot #${this.snapshots.length} captured`, 'status success')
            
            console.log('📹 Video-only snapshot completed successfully')
            
        } catch (error) {
            console.error('📹 Error taking video snapshot:', error)
            this.app.updateStatus(`Video snapshot error: ${error.message}`, 'status warning')
        }
    }
    captureVideoOnly() {
        try {
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')
            
            tempCanvas.width = this.app.videoElement.videoWidth || 640
            tempCanvas.height = this.app.videoElement.videoHeight || 480
            
            // Mirror the video to match display
            tempCtx.save()
            tempCtx.scale(-1, 1)
            tempCtx.translate(-tempCanvas.width, 0)
            tempCtx.drawImage(this.app.videoElement, 0, 0, tempCanvas.width, tempCanvas.height)
            tempCtx.restore()
            
            return tempCanvas.toDataURL('image/png', 0.8)
            
        } catch (error) {
            console.error('Error capturing video only:', error)
            return null
        }
    }
    
    createSnapshotData() {
        const timestamp = new Date()
        const debugDiv = document.getElementById('debug-info')
        
        return {
            id: Date.now(),
            timestamp: timestamp.toISOString(),
            displayTime: timestamp.toLocaleTimeString(),
            image: this.captureVideoWithOverlay(), // Updated to capture video + overlay
            activeGesture: this.app.currentActiveGesture,
            config: { ...this.app.config },
            touches: Array.from(this.app.currentTouches || []),
            debugInfo: debugDiv ? debugDiv.textContent : 'Debug info not available',
            performance: this.app.performanceMonitor.createReport(),
            videoInfo: {
                width: this.app.videoElement.videoWidth,
                height: this.app.videoElement.videoHeight
            }
        }
    }
    
    captureVideoWithOverlay() {
        try {
            // Create a temporary canvas to combine video and overlay
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')
            
            // Set canvas size to match video
            tempCanvas.width = this.app.videoElement.videoWidth || 640
            tempCanvas.height = this.app.videoElement.videoHeight || 480
            
            console.log('📸 Capturing video with overlay, canvas size:', tempCanvas.width, 'x', tempCanvas.height)
            
            // Save the current state
            tempCtx.save()
            
            // Mirror the canvas to match the display
            tempCtx.scale(-1, 1)
            tempCtx.translate(-tempCanvas.width, 0)
            
            // Draw the video frame
            tempCtx.drawImage(this.app.videoElement, 0, 0, tempCanvas.width, tempCanvas.height)
            
            // Restore to normal orientation for overlay
            tempCtx.restore()
            tempCtx.save()
            
            // Mirror again for the overlay to match
            tempCtx.scale(-1, 1)
            tempCtx.translate(-tempCanvas.width, 0)
            
            // Draw the canvas overlay (landmarks and debug info)
            if (this.app.canvasElement) {
                tempCtx.drawImage(this.app.canvasElement, 0, 0)
                console.log('📸 Added overlay to snapshot')
            } else {
                console.warn('📸 Canvas overlay not available')
            }
            
            tempCtx.restore()
            
            // Convert to data URL
            const dataUrl = tempCanvas.toDataURL('image/png', 0.8)
            console.log('📸 Generated data URL, length:', dataUrl.length)
            
            return dataUrl
            
        } catch (error) {
            console.error('Error capturing video with overlay:', error)
            // Fallback to just the canvas
            if (this.app.canvasElement) {
                console.log('📸 Falling back to canvas only')
                return this.app.canvasElement.toDataURL('image/png', 0.8)
            }
            // Ultimate fallback - return a placeholder
            return this.createErrorPlaceholder()
        }
    }
    
    // Alternative method to capture just the video without overlay
    captureVideoOnly() {
        try {
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')
            
            tempCanvas.width = this.app.videoElement.videoWidth || 640
            tempCanvas.height = this.app.videoElement.videoHeight || 480
            
            console.log('📹 Capturing video only, canvas size:', tempCanvas.width, 'x', tempCanvas.height)
            
            // Check if video is ready
            if (!this.app.videoElement.videoWidth || !this.app.videoElement.videoHeight) {
                console.warn('📹 Video not ready, dimensions are 0')
                return this.createErrorPlaceholder()
            }
            
            // Mirror the video to match display
            tempCtx.save()
            tempCtx.scale(-1, 1)
            tempCtx.translate(-tempCanvas.width, 0)
            tempCtx.drawImage(this.app.videoElement, 0, 0, tempCanvas.width, tempCanvas.height)
            tempCtx.restore()
            
            const dataUrl = tempCanvas.toDataURL('image/png', 0.8)
            console.log('📹 Generated video-only data URL, length:', dataUrl.length)
            
            return dataUrl
            
        } catch (error) {
            console.error('Error capturing video only:', error)
            return this.createErrorPlaceholder()
        }
    }
    
    createErrorPlaceholder() {
        // Create a simple error placeholder image
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = 640
        canvas.height = 480
        
        // Fill with gray background
        ctx.fillStyle = '#f0f0f0'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Add error text
        ctx.fillStyle = '#666'
        ctx.font = '24px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('Snapshot Error', canvas.width / 2, canvas.height / 2 - 20)
        ctx.fillText('Unable to capture video', canvas.width / 2, canvas.height / 2 + 20)
        
        return canvas.toDataURL('image/png', 0.8)
    }
    
    addSnapshot(snapshot) {
        this.snapshots.push(snapshot)
        
        // Remove oldest if exceeding limit
        if (this.snapshots.length > this.maxSnapshots) {
            const removed = this.snapshots.shift()
            this.removeSnapshotDisplay(removed.id)
        }
    }
    
    displaySnapshot(snapshot) {
        console.log('🖼️ Displaying snapshot:', snapshot.id)
        
        const grid = document.getElementById('snapshots-grid')
        if (!grid) {
            console.error('🖼️ Snapshots grid not found, creating container...')
            this.initContainer()
            const newGrid = document.getElementById('snapshots-grid')
            if (!newGrid) {
                console.error('🖼️ Failed to create snapshots grid')
                return
            }
        }
        
        const finalGrid = document.getElementById('snapshots-grid')
        
        const card = document.createElement('div')
        card.className = 'snapshot-card'
        card.id = `snapshot-${snapshot.id}`
        card.style.cssText = `
            border: 2px solid #ddd;
            border-radius: 10px;
            padding: 15px;
            background: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transition: transform 0.2s ease;
            margin-bottom: 15px;
        `
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)'
            card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'
        })
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)'
            card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
        })
        
        console.log('🖼️ Creating snapshot HTML...')
        card.innerHTML = this.createSnapshotHTML(snapshot)
        
        // Add event listeners
        console.log('🖼️ Adding event listeners...')
        this.addSnapshotEventListeners(card, snapshot)
        
        // Insert at the beginning
        console.log('🖼️ Inserting card into grid...')
        finalGrid.insertBefore(card, finalGrid.firstChild)
        
        console.log('🖼️ Snapshot displayed successfully')
        
        // Scroll the container into view
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }, 100)
    }
    
    createSnapshotHTML(snapshot) {
        const performanceGrade = snapshot.performance.performanceGrade
        const gradeColor = this.getGradeColor(performanceGrade.grade)
        const snapshotType = snapshot.type === 'video-only' ? '📹 Video Only' : '🎯 Video + Overlay'
        const typeColor = snapshot.type === 'video-only' ? '#3498db' : '#2ecc71'
        
        return `
            <div class="snapshot-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #2c3e50;">Snapshot #${this.snapshots.length}</h4>
                <div style="display: flex; flex-direction: column; align-items: flex-end;">
                    <span style="font-size: 12px; color: #666;">${snapshot.displayTime}</span>
                    <span style="font-size: 10px; color: ${typeColor}; font-weight: bold;">${snapshotType}</span>
                </div>
            </div>
            
            <div class="snapshot-image" style="text-align: center; margin-bottom: 15px;">
                <img src="${snapshot.image}" 
                     style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; transition: transform 0.2s;"
                     onclick="this.style.transform = this.style.transform ? '' : 'scale(2)'; this.style.zIndex = this.style.zIndex ? '' : '1000'; this.style.position = this.style.position ? '' : 'fixed'; this.style.top = this.style.top ? '' : '50%'; this.style.left = this.style.left ? '' : '50%'; this.style.marginTop = this.style.marginTop ? '' : '-25vh'; this.style.marginLeft = this.style.marginLeft ? '' : '-25vw';"
                     title="Click to zoom in/out">
            </div>
            
            <div class="snapshot-info" style="font-size: 12px; line-height: 1.4;">
                <div style="margin-bottom: 8px;">
                    <strong>Active Gesture:</strong> 
                    <span style="color: ${snapshot.activeGesture ? '#27ae60' : '#e74c3c'};">
                        ${snapshot.activeGesture || 'None'}
                    </span>
                </div>
                
                <div style="margin-bottom: 8px;">
                    <strong>Touch Sensitivity:</strong> ${snapshot.config.touchDistance.toFixed(3)}
                </div>
                
                <div style="margin-bottom: 8px;">
                    <strong>Performance:</strong> 
                    <span style="color: ${gradeColor}; font-weight: bold;">
                        ${performanceGrade.grade} (${snapshot.performance.metrics.averageFps} FPS avg)
                    </span>
                </div>
                
                <div style="margin-bottom: 8px;">
                    <strong>Active Touches:</strong> ${snapshot.touches.length}
                </div>
                
                <div style="margin-bottom: 8px;">
                    <strong>Video Resolution:</strong> ${snapshot.videoInfo.width}x${snapshot.videoInfo.height}
                </div>
                
                ${snapshot.type !== 'video-only' ? `
                <div class="debug-section" style="background: #f8f9fa; padding: 8px; border-radius: 4px; margin: 10px 0;">
                    <strong>Debug Info:</strong>
                    <div style="font-family: monospace; font-size: 10px; max-height: 60px; overflow-y: auto; margin-top: 5px;">
                        ${snapshot.debugInfo}
                    </div>
                </div>
                ` : '<div style="text-align: center; color: #666; font-style: italic; margin: 10px 0;">Clean video capture without overlay</div>'}
                
                <div class="controls" style="display: flex; gap: 8px; margin-top: 10px;">
                    <button class="analyze-btn" data-id="${snapshot.id}" 
                            style="flex: 1; padding: 5px; font-size: 11px; background: #3498db; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        📊 Analyze
                    </button>
                    <button class="download-btn" data-id="${snapshot.id}"
                            style="flex: 1; padding: 5px; font-size: 11px; background: #2ecc71; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        💾 Download
                    </button>
                    <button class="delete-btn" data-id="${snapshot.id}"
                            style="flex: 1; padding: 5px; font-size: 11px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `
    }
    
    addSnapshotEventListeners(card, snapshot) {
        // Delete button
        const deleteBtn = card.querySelector('.delete-btn')
        deleteBtn.addEventListener('click', () => {
            this.deleteSnapshot(snapshot.id)
        })
        
        // Analyze button
        const analyzeBtn = card.querySelector('.analyze-btn')
        analyzeBtn.addEventListener('click', () => {
            this.analyzeSnapshot(snapshot)
        })
        
        // Download button
        const downloadBtn = card.querySelector('.download-btn')
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadSnapshot(snapshot)
            })
        }
    }
    
    downloadSnapshot(snapshot) {
        try {
            // Create download link
            const link = document.createElement('a')
            link.href = snapshot.image
            link.download = `gesture-snapshot-${snapshot.id}.png`
            
            // Trigger download
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            this.app.updateStatus(`Downloaded snapshot #${snapshot.id}`, 'status success')
            
        } catch (error) {
            console.error('Download error:', error)
            this.app.updateStatus('Download failed', 'status warning')
        }
    }
    
    deleteSnapshot(id) {
        this.snapshots = this.snapshots.filter(s => s.id !== id)
        this.removeSnapshotDisplay(id)
    }
    
    removeSnapshotDisplay(id) {
        const card = document.getElementById(`snapshot-${id}`)
        if (card && card.parentNode) {
            card.parentNode.removeChild(card)
        }
    }
    
    analyzeSnapshot(snapshot) {
        // Create detailed analysis modal/popup
        const modal = document.createElement('div')
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        `
        
        const content = document.createElement('div')
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        `
        
        content.innerHTML = this.createAnalysisHTML(snapshot)
        
        // Close button
        const closeBtn = document.createElement('button')
        closeBtn.textContent = '✕'
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        `
        closeBtn.addEventListener('click', () => document.body.removeChild(modal))
        content.appendChild(closeBtn)
        
        modal.appendChild(content)
        document.body.appendChild(modal)
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal)
            }
        })
    }
    
    createAnalysisHTML(snapshot) {
        const perf = snapshot.performance
        
        return `
            <h2 style="margin-top: 0; color: #2c3e50;">📊 Snapshot Analysis</h2>
            <p style="color: #666; margin-bottom: 25px;">Captured at ${new Date(snapshot.timestamp).toLocaleString()}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                <div>
                    <h3>🎯 Gesture Detection</h3>
                    <p><strong>Active Gesture:</strong> ${snapshot.activeGesture || 'None'}</p>
                    <p><strong>Touch Sensitivity:</strong> ${snapshot.config.touchDistance.toFixed(3)}</p>
                    <p><strong>Active Touches:</strong> ${snapshot.touches.length}</p>
                    <p><strong>Gesture Timeout:</strong> ${snapshot.config.gestureTimeout}ms</p>
                </div>
                
                <div>
                    <h3>⚡ Performance Metrics</h3>
                    <p><strong>Grade:</strong> <span style="color: ${this.getGradeColor(perf.performanceGrade.grade)};">${perf.performanceGrade.grade}</span> (${perf.performanceGrade.description})</p>
                    <p><strong>Average FPS:</strong> ${perf.metrics.averageFps}</p>
                    <p><strong>FPS Range:</strong> ${perf.metrics.minFps} - ${perf.metrics.maxFps}</p>
                    <p><strong>Frame Drops:</strong> ${perf.metrics.frameDrops}</p>
                    <p><strong>Running Time:</strong> ${perf.runningTime.toFixed(1)}s</p>
                </div>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3>📹 Video Information</h3>
                <p><strong>Resolution:</strong> ${snapshot.videoInfo.width}x${snapshot.videoInfo.height}</p>
                <p><strong>Frame Time Stats:</strong> 
                   Avg: ${perf.frameTimeStats.averageFrameTime}ms, 
                   Range: ${perf.frameTimeStats.minFrameTime}-${perf.frameTimeStats.maxFrameTime}ms
                </p>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3>🔧 Recommendations</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    ${perf.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3>🐛 Debug Information</h3>
                <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; font-size: 12px;">${snapshot.debugInfo}</pre>
            </div>
            
            <div style="text-align: center;">
                <img src="${snapshot.image}" style="max-width: 100%; border: 2px solid #ddd; border-radius: 8px;">
            </div>
        `
    }
    
    getGradeColor(grade) {
        const colors = {
            'A': '#27ae60',
            'B': '#2ecc71',
            'C': '#f39c12',
            'D': '#e67e22',
            'F': '#e74c3c'
        }
        return colors[grade] || '#666'
    }
    
    clearAllSnapshots() {
        this.snapshots = []
        const grid = document.getElementById('snapshots-grid')
        if (grid) {
            grid.innerHTML = ''
        }
        this.app.updateStatus('All snapshots cleared', 'status')
    }
    
    exportSnapshots() {
        if (this.snapshots.length === 0) {
            this.app.updateStatus('No snapshots to export', 'status warning')
            return
        }
        
        try {
            const exportData = {
                exportTime: new Date().toISOString(),
                appVersion: '1.0.0',
                snapshotCount: this.snapshots.length,
                snapshots: this.snapshots.map(s => ({
                    ...s,
                    image: s.image.length > 100 ? `${s.image.substring(0, 100)}...` : s.image // Truncate for JSON size
                }))
            }
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            
            const a = document.createElement('a')
            a.href = url
            a.download = `gesture-snapshots-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            
            URL.revokeObjectURL(url)
            
            this.app.updateStatus(`Exported ${this.snapshots.length} snapshots`, 'status success')
            
        } catch (error) {
            console.error('Export error:', error)
            this.app.updateStatus('Export failed', 'status warning')
        }
    }
}
