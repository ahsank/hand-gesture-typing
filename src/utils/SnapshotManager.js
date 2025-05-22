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
        // Create container if it doesn't exist
        this.container = document.getElementById('snapshot-container')
        if (!this.container) {
            this.container = this.createContainer()
        }
    }
    
    createContainer() {
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
        `
        
        const clearAllBtn = document.createElement('button')
        clearAllBtn.textContent = '🗑️ Clear All'
        clearAllBtn.style.backgroundColor = '#e74c3c'
        clearAllBtn.addEventListener('click', () => this.clearAllSnapshots())
        controls.appendChild(clearAllBtn)
        
        const exportBtn = document.createElement('button')
        exportBtn.textContent = '💾 Export'
        exportBtn.style.backgroundColor = '#9b59b6'
        exportBtn.addEventListener('click', () => this.exportSnapshots())
        controls.appendChild(exportBtn)
        
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
        mainContainer.appendChild(container)
        
        return container
    }
    
    takeSnapshot() {
        try {
            if (!this.app.hands || !this.app.videoElement) {
                this.app.updateStatus('Cannot take snapshot: system not ready', 'status warning')
                return
            }
            
            const snapshot = this.createSnapshotData()
            this.addSnapshot(snapshot)
            this.displaySnapshot(snapshot)
            
            // Visual feedback
            this.app.flashGestureDetection('rgba(138, 43, 226, 0.4)') // Purple for snapshot
            this.app.updateStatus(`📸 Snapshot #${this.snapshots.length} captured`, 'status success')
            
        } catch (error) {
            console.error('Error taking snapshot:', error)
            this.app.updateStatus('Error taking snapshot', 'status warning')
        }
    }
    
    createSnapshotData() {
        const timestamp = new Date()
        const debugDiv = document.getElementById('debug-info')
        
        return {
            id: Date.now(),
            timestamp: timestamp.toISOString(),
            displayTime: timestamp.toLocaleTimeString(),
            image: this.app.canvasElement.toDataURL('image/png', 0.8),
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
    
    addSnapshot(snapshot) {
        this.snapshots.push(snapshot)
        
        // Remove oldest if exceeding limit
        if (this.snapshots.length > this.maxSnapshots) {
            const removed = this.snapshots.shift()
            this.removeSnapshotDisplay(removed.id)
        }
    }
    
    displaySnapshot(snapshot) {
        const grid = document.getElementById('snapshots-grid')
        if (!grid) return
        
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
        `
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)'
            card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'
        })
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)'
            card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'
        })
        
        card.innerHTML = this.createSnapshotHTML(snapshot)
        
        // Add event listeners
        this.addSnapshotEventListeners(card, snapshot)
        
        // Insert at the beginning
        grid.insertBefore(card, grid.firstChild)
    }
    
    createSnapshotHTML(snapshot) {
        const performanceGrade = snapshot.performance.performanceGrade
        const gradeColor = this.getGradeColor(performanceGrade.grade)
        
        return `
            <div class="snapshot-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #2c3e50;">Snapshot #${this.snapshots.length}</h4>
                <span style="font-size: 12px; color: #666;">${snapshot.displayTime}</span>
            </div>
            
            <div class="snapshot-image" style="text-align: center; margin-bottom: 15px;">
                <img src="${snapshot.image}" 
                     style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 5px; cursor: pointer;"
                     onclick="this.style.transform = this.style.transform ? '' : 'scale(1.5)'; this.style.zIndex = this.style.zIndex ? '' : '1000'; this.style.position = this.style.position ? '' : 'relative';">
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
                
                <div class="debug-section" style="background: #f8f9fa; padding: 8px; border-radius: 4px; margin: 10px 0;">
                    <strong>Debug Info:</strong>
                    <div style="font-family: monospace; font-size: 10px; max-height: 60px; overflow-y: auto; margin-top: 5px;">
                        ${snapshot.debugInfo}
                    </div>
                </div>
                
                <div class="controls" style="display: flex; gap: 8px; margin-top: 10px;">
                    <button class="analyze-btn" data-id="${snapshot.id}" 
                            style="flex: 1; padding: 5px; font-size: 11px; background: #3498db; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        📊 Analyze
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
