// src/utils/systemCheck.js

export function showStartupMessage() {
    const statusElement = document.getElementById('status')
    if (statusElement) {
        statusElement.textContent = '🚀 Initializing Hand Gesture Typing System...'
        statusElement.className = 'status'
    }
}

export async function checkSystemCompatibility() {
    const issues = []
    let isCompatible = true
    
    try {
        // Check for required APIs
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            issues.push('Camera access not supported')
            isCompatible = false
        }
        
        // Check for WebGL support (important for MediaPipe)
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        if (!gl) {
            issues.push('WebGL not supported - performance may be degraded')
        }
        
        // Check for Web Workers support
        if (typeof Worker === 'undefined') {
            issues.push('Web Workers not supported - will use main thread processing')
        }
        
        // Check camera permissions
        try {
            const permissionStatus = await checkCameraPermissions()
            if (!permissionStatus.granted && permissionStatus.state === 'denied') {
                issues.push('Camera permissions denied')
                isCompatible = false
            }
        } catch (error) {
            console.warn('Could not check camera permissions:', error)
        }
        
        // Check browser compatibility
        const browserInfo = getBrowserInfo()
        if (browserInfo.isUnsupported) {
            issues.push(`Browser may not be fully supported: ${browserInfo.name}`)
        }
        
        // Check performance capabilities
        const performanceInfo = await checkPerformanceCapabilities()
        if (performanceInfo.isLowEnd) {
            issues.push('Low-end device detected - consider reducing video quality')
        }
        
        // Check network connectivity (for MediaPipe models)
        const networkInfo = await checkNetworkConnectivity()
        if (!networkInfo.isOnline) {
            issues.push('No internet connection - MediaPipe models may not load')
            isCompatible = false
        }
        
    } catch (error) {
        console.error('System compatibility check failed:', error)
        issues.push('System compatibility check failed')
    }
    
    return {
        isCompatible,
        issues,
        recommendations: generateRecommendations(issues)
    }
}

async function checkCameraPermissions() {
    try {
        if (navigator.permissions) {
            const permission = await navigator.permissions.query({ name: 'camera' })
            return {
                state: permission.state,
                granted: permission.state === 'granted'
            }
        }
        return { state: 'unknown', granted: false }
    } catch (error) {
        return { state: 'unknown', granted: false }
    }
}

function getBrowserInfo() {
    const userAgent = navigator.userAgent.toLowerCase()
    let name = 'Unknown'
    let isUnsupported = false
    
    if (userAgent.includes('chrome')) {
        name = 'Chrome'
    } else if (userAgent.includes('firefox')) {
        name = 'Firefox'
    } else if (userAgent.includes('safari')) {
        name = 'Safari'
    } else if (userAgent.includes('edge')) {
        name = 'Edge'
    } else {
        name = 'Unknown Browser'
        isUnsupported = true
    }
    
    // Check for mobile browsers
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    if (isMobile) {
        name += ' (Mobile)'
        // Mobile browsers may have limited MediaPipe support
        isUnsupported = true
    }
    
    return { name, isUnsupported, isMobile }
}

async function checkPerformanceCapabilities() {
    let isLowEnd = false
    
    try {
        // Check hardware concurrency (CPU cores)
        const cores = navigator.hardwareConcurrency || 1
        if (cores < 4) {
            isLowEnd = true
        }
        
        // Check available memory (if supported)
        if (navigator.deviceMemory && navigator.deviceMemory < 4) {
            isLowEnd = true
        }
        
        // Basic performance test
        const start = performance.now()
        for (let i = 0; i < 100000; i++) {
            Math.random()
        }
        const duration = performance.now() - start
        
        if (duration > 10) { // If basic operations are slow
            isLowEnd = true
        }
        
    } catch (error) {
        console.warn('Performance check failed:', error)
    }
    
    return { isLowEnd }
}

async function checkNetworkConnectivity() {
    try {
        // Check if online
        const isOnline = navigator.onLine
        
        // Try to fetch a small resource to verify actual connectivity
        if (isOnline) {
            try {
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), 5000)
                
                await fetch('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js', {
                    method: 'HEAD',
                    signal: controller.signal
                })
                
                clearTimeout(timeoutId)
                return { isOnline: true, canReachCDN: true }
            } catch (error) {
                return { isOnline: true, canReachCDN: false }
            }
        }
        
        return { isOnline: false, canReachCDN: false }
    } catch (error) {
        return { isOnline: false, canReachCDN: false }
    }
}

function generateRecommendations(issues) {
    const recommendations = []
    
    if (issues.some(issue => issue.includes('Camera access'))) {
        recommendations.push('Enable camera permissions in browser settings')
        recommendations.push('Make sure no other applications are using the camera')
    }
    
    if (issues.some(issue => issue.includes('WebGL'))) {
        recommendations.push('Update your graphics drivers')
        recommendations.push('Try using a different browser')
    }
    
    if (issues.some(issue => issue.includes('Low-end device'))) {
        recommendations.push('Close other browser tabs and applications')
        recommendations.push('Consider using a more powerful device')
        recommendations.push('Reduce video resolution in settings')
    }
    
    if (issues.some(issue => issue.includes('internet connection'))) {
        recommendations.push('Check your internet connection')
        recommendations.push('Try refreshing the page once connected')
    }
    
    if (issues.some(issue => issue.includes('Browser may not be fully supported'))) {
        recommendations.push('Use Chrome, Firefox, or Edge for best compatibility')
        recommendations.push('Update your browser to the latest version')
    }
    
    if (recommendations.length === 0) {
        recommendations.push('System appears to be compatible!')
    }
    
    return recommendations
}

// Additional utility functions for system monitoring
export function getSystemInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        connection: navigator.connection ? {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt
        } : null,
        screen: {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth
        },
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }
}

export function logSystemInfo() {
    const info = getSystemInfo()
    console.group('🖥️ System Information')
    console.log('Platform:', info.platform)
    console.log('User Agent:', info.userAgent)
    console.log('CPU Cores:', info.hardwareConcurrency)
    console.log('Device Memory:', info.deviceMemory ? `${info.deviceMemory}GB` : 'Unknown')
    console.log('Screen Resolution:', `${info.screen.width}x${info.screen.height}`)
    console.log('Viewport:', `${info.viewport.width}x${info.viewport.height}`)
    console.log('Online Status:', info.onLine)
    if (info.connection) {
        console.log('Connection Type:', info.connection.effectiveType)
        console.log('Download Speed:', `${info.connection.downlink}Mbps`)
        console.log('Network RTT:', `${info.connection.rtt}ms`)
    }
    console.groupEnd()
}

// Performance monitoring utilities
export function createPerformanceObserver() {
    if (typeof PerformanceObserver === 'undefined') {
        return null
    }
    
    try {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            entries.forEach(entry => {
                if (entry.entryType === 'measure') {
                    console.log(`⏱️ ${entry.name}: ${entry.duration.toFixed(2)}ms`)
                }
            })
        })
        
        observer.observe({ entryTypes: ['measure', 'navigation'] })
        return observer
    } catch (error) {
        console.warn('Performance Observer not supported:', error)
        return null
    }
}

// Memory usage monitoring
export function getMemoryInfo() {
    if (performance.memory) {
        return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
            usedMB: Math.round(performance.memory.usedJSHeapSize / 1048576),
            totalMB: Math.round(performance.memory.totalJSHeapSize / 1048576),
            limitMB: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
        }
    }
    return null
}

export function logMemoryUsage() {
    const memory = getMemoryInfo()
    if (memory) {
        console.log(`💾 Memory Usage: ${memory.usedMB}MB / ${memory.totalMB}MB (Limit: ${memory.limitMB}MB)`)
    }
}
