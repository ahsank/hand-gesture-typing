// src/utils/PerformanceMonitor.js
export class PerformanceMonitor {
    constructor() {
        this.frameCount = 0
        this.lastFpsUpdate = Date.now()
        this.fps = 0
        this.frameTimestamps = []
        this.maxFrameHistory = 60 // Keep last 60 frames for analysis
        
        this.isRunning = false
        this.startTime = null
        
        // Performance metrics
        this.metrics = {
            averageFps: 0,
            minFps: Infinity,
            maxFps: 0,
            frameDrops: 0,
            totalFrames: 0
        }
    }
    
    start() {
        this.isRunning = true
        this.startTime = Date.now()
        this.lastFpsUpdate = this.startTime
        this.frameCount = 0
        this.frameTimestamps = []
        
        // Reset metrics
        this.metrics = {
            averageFps: 0,
            minFps: Infinity,
            maxFps: 0,
            frameDrops: 0,
            totalFrames: 0
        }
        
        console.log('📊 Performance monitoring started')
    }
    
    stop() {
        this.isRunning = false
        console.log('📊 Performance monitoring stopped')
        this.logSummary()
    }
    
    recordFrame() {
        if (!this.isRunning) return
        
        const now = Date.now()
        this.frameCount++
        this.metrics.totalFrames++
        
        // Add to frame history
        this.frameTimestamps.push(now)
        if (this.frameTimestamps.length > this.maxFrameHistory) {
            this.frameTimestamps.shift()
        }
        
        // Update FPS every second
        if (now - this.lastFpsUpdate >= 1000) {
            this.fps = Math.round(this.frameCount * 1000 / (now - this.lastFpsUpdate))
            
            // Update metrics
            this.updateMetrics(this.fps)
            
            // Reset for next measurement
            this.frameCount = 0
            this.lastFpsUpdate = now
        }
    }
    
    updateMetrics(currentFps) {
        // Update min/max FPS
        if (currentFps > 0) {
            this.metrics.minFps = Math.min(this.metrics.minFps, currentFps)
            this.metrics.maxFps = Math.max(this.metrics.maxFps, currentFps)
        }
        
        // Calculate average FPS
        const runningTime = (Date.now() - this.startTime) / 1000
        this.metrics.averageFps = Math.round(this.metrics.totalFrames / runningTime)
        
        // Detect frame drops (FPS below 20)
        if (currentFps < 20 && currentFps > 0) {
            this.metrics.frameDrops++
        }
    }
    
    getFPS() {
        return this.fps
    }
    
    getMetrics() {
        return { ...this.metrics }
    }
    
    // Get frame time statistics from recent frames
    getFrameTimeStats() {
        if (this.frameTimestamps.length < 2) {
            return {
                averageFrameTime: 0,
                minFrameTime: 0,
                maxFrameTime: 0,
                frameTimeVariance: 0
            }
        }
        
        const frameTimes = []
        for (let i = 1; i < this.frameTimestamps.length; i++) {
            frameTimes.push(this.frameTimestamps[i] - this.frameTimestamps[i - 1])
        }
        
        const sum = frameTimes.reduce((a, b) => a + b, 0)
        const average = sum / frameTimes.length
        const min = Math.min(...frameTimes)
        const max = Math.max(...frameTimes)
        
        // Calculate variance
        const variance = frameTimes.reduce((acc, time) => {
            return acc + Math.pow(time - average, 2)
        }, 0) / frameTimes.length
        
        return {
            averageFrameTime: Math.round(average * 100) / 100,
            minFrameTime: min,
            maxFrameTime: max,
            frameTimeVariance: Math.round(variance * 100) / 100
        }
    }
    
    // Get performance grade based on metrics
    getPerformanceGrade() {
        const avgFps = this.metrics.averageFps
        const frameDropRatio = this.metrics.frameDrops / (this.metrics.totalFrames || 1)
        
        if (avgFps >= 55 && frameDropRatio < 0.01) {
            return { grade: 'A', description: 'Excellent performance' }
        } else if (avgFps >= 45 && frameDropRatio < 0.05) {
            return { grade: 'B', description: 'Good performance' }
        } else if (avgFps >= 30 && frameDropRatio < 0.1) {
            return { grade: 'C', description: 'Acceptable performance' }
        } else if (avgFps >= 20 && frameDropRatio < 0.2) {
            return { grade: 'D', description: 'Poor performance' }
        } else {
            return { grade: 'F', description: 'Very poor performance' }
        }
    }
    
    // Check if performance is degraded
    isPerformanceDegraded() {
        return this.metrics.averageFps < 20 || this.metrics.frameDrops > this.metrics.totalFrames * 0.1
    }
    
    // Get performance recommendations
    getRecommendations() {
        const recommendations = []
        
        if (this.metrics.averageFps < 30) {
            recommendations.push('Consider reducing video resolution or model complexity')
        }
        
        if (this.metrics.frameDrops > this.metrics.totalFrames * 0.05) {
            recommendations.push('Frequent frame drops detected - close other applications')
        }
        
        const frameStats = this.getFrameTimeStats()
        if (frameStats.frameTimeVariance > 100) {
            recommendations.push('Inconsistent frame timing - check system load')
        }
        
        if (recommendations.length === 0) {
            recommendations.push('Performance is good!')
        }
        
        return recommendations
    }
    
    // Log performance summary
    logSummary() {
        const runningTime = this.startTime ? (Date.now() - this.startTime) / 1000 : 0
        const grade = this.getPerformanceGrade()
        const frameStats = this.getFrameTimeStats()
        
        console.group('📊 Performance Summary')
        console.log(`Running time: ${runningTime.toFixed(1)}s`)
        console.log(`Total frames: ${this.metrics.totalFrames}`)
        console.log(`Average FPS: ${this.metrics.averageFps}`)
        console.log(`FPS range: ${this.metrics.minFps === Infinity ? 0 : this.metrics.minFps} - ${this.metrics.maxFps}`)
        console.log(`Frame drops: ${this.metrics.frameDrops}`)
        console.log(`Performance grade: ${grade.grade} (${grade.description})`)
        console.log(`Average frame time: ${frameStats.averageFrameTime}ms`)
        console.log('Recommendations:')
        this.getRecommendations().forEach(rec => console.log(`  • ${rec}`))
        console.groupEnd()
    }
    
    // Create a performance report object
    createReport() {
        const runningTime = this.startTime ? (Date.now() - this.startTime) / 1000 : 0
        
        return {
            timestamp: new Date().toISOString(),
            runningTime: runningTime,
            metrics: this.getMetrics(),
            frameTimeStats: this.getFrameTimeStats(),
            performanceGrade: this.getPerformanceGrade(),
            recommendations: this.getRecommendations(),
            isDegraded: this.isPerformanceDegraded()
        }
    }
}
