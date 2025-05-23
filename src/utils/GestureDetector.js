// src/utils/GestureDetector.js
import { 
    GESTURE_MAPPINGS, 
    getFingerName, 
    getKnuckleName, 
    getGestureKey,
    getLetterForGesture,
    getFingerTipIndices,
    getKnuckleIndices
} from '../config/gestureMappings.js'

export class GestureDetector {
    constructor(config = {}) {
        this.config = {
            // touchDistance: 0.04,
            // gestureTimeout: 200,
            ...config
        }
        
        this.lastDetectedGestures = new Map()
        this.worker = null
        
        // Initialize web worker for distance calculations
        this.initWorker()
    }
    
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig }
    }
    
    initWorker() {
        try {
            const workerCode = `
                self.onmessage = function(e) {
                    const { landmarks, fingerTips, knuckles, touchDistance } = e.data;
                    const results = [];
                    
                    for (let i = 0; i < fingerTips.length; i++) {
                        const fingerTipIndex = fingerTips[i];
                        const fingerTip = landmarks[fingerTipIndex];
                        
                        for (let j = 0; j < knuckles.length; j++) {
                            const knuckleIndex = knuckles[j];
                            const knuckle = landmarks[knuckleIndex];
                            
                            // Calculate 3D Euclidean distance
                            const dx = fingerTip.x - knuckle.x;
                            const dy = fingerTip.y - knuckle.y;
                            const dz = fingerTip.z - knuckle.z;
                            const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                            
                            if (distance < touchDistance * 2) { // Include near-touches for debug
                                results.push({
                                    fingerTipIndex,
                                    knuckleIndex,
                                    distance,
                                    isTouch: distance < touchDistance
                                });
                            }
                        }
                    }
                    
                    self.postMessage(results);
                };
            `
            
            const blob = new Blob([workerCode], { type: 'application/javascript' })
            this.worker = new Worker(URL.createObjectURL(blob))
        } catch (error) {
            console.warn('Web Worker not supported, using main thread for calculations')
            this.worker = null
        }
    }
    
    async detectGestures(landmarks) {
        const currentTime = Date.now()
        
        // Calculate distances (using worker if available)
        const distanceResults = await this.calculateDistances(landmarks)
        
        // Process results
        const detection = this.processDistanceResults(distanceResults, currentTime)
        
        return detection
    }
    
    async calculateDistances(landmarks) {
        const fingerTips = getFingerTipIndices()
        const knuckles = getKnuckleIndices()
        
        if (this.worker) {
            // Use web worker for calculations
            return new Promise((resolve) => {
                this.worker.onmessage = (e) => resolve(e.data)
                this.worker.postMessage({
                    landmarks,
                    fingerTips,
                    knuckles,
                    touchDistance: this.config.touchDistance
                })
            })
        } else {
            // Fallback to main thread
            return this.calculateDistancesMainThread(landmarks, fingerTips, knuckles)
        }
    }
    
    calculateDistancesMainThread(landmarks, fingerTips, knuckles) {
        return new Promise((resolve) => {
            const results = [];
            
            for (const fingerTipIndex of fingerTips) {
                const fingerTip = landmarks[fingerTipIndex];
                
                for (const knuckleIndex of knuckles) {
                    const knuckle = landmarks[knuckleIndex];
                    
                    // Calculate 3D Euclidean distance
                    const dx = fingerTip.x - knuckle.x;
                    const dy = fingerTip.y - knuckle.y;
                    const dz = fingerTip.z - knuckle.z;
                    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                    
                    if (distance < this.config.touchDistance * 2) {
                        results.push({
                            fingerTipIndex,
                            knuckleIndex,
                            distance,
                            isTouch: distance < this.config.touchDistance
                        });
                    }
                }
            }
            
            // To better mimic the worker's asynchronous behavior, 
            // use setTimeout with 0ms delay to push to next event loop cycle
            setTimeout(() => resolve(results), 0);
        });
    }
    
    processDistanceResults(distanceResults, currentTime) {
        // Find the closest valid gesture
        let bestGesture = null
        let shortestDistance = this.config.touchDistance
        
        // Sort by distance for debug info
        const sortedResults = distanceResults.sort((a, b) => a.distance - b.distance)
        
        // Find valid touches
        const validTouches = sortedResults.filter(result => {
            const gestureKey = getGestureKey(result.fingerTipIndex, result.knuckleIndex)
            return result.isTouch && gestureKey in GESTURE_MAPPINGS.ALL_GESTURES
        })
        
        // Check for the best gesture (closest touch that's not in cooldown)
        for (const result of validTouches) {
            const gestureKey = getGestureKey(result.fingerTipIndex, result.knuckleIndex)
            
            // Check cooldown
            //const lastDetected = this.lastDetectedGestures.get(gestureKey)
            //if (!lastDetected || currentTime - lastDetected > this.config.gestureTimeout) {
                if (result.distance < shortestDistance) {
                    bestGesture = {
                        gesture: gestureKey,
                        distance: result.distance,
                        fingerTipIndex: result.fingerTipIndex,
                        knuckleIndex: result.knuckleIndex
                    }
                    shortestDistance = result.distance
                }
            //}
        }
        
        // If we found a gesture, update its timestamp
        if (bestGesture) {
            this.lastDetectedGestures.set(bestGesture.gesture, currentTime)
            
            const letter = getLetterForGesture(bestGesture.gesture)
            const fingerName = getFingerName(bestGesture.fingerTipIndex)
            const knuckleName = getKnuckleName(bestGesture.knuckleIndex)
            
            return {
                gesture: bestGesture.gesture,
                letter,
                distance: bestGesture.distance,
                fingerName,
                knuckleName,
                touches: this.createTouchesSet(sortedResults)
            }
        }
        
        return {
            gesture: null,
            letter: null,
            distance: null,
            fingerName: null,
            knuckleName: null,
            touches: this.createTouchesSet(sortedResults)
        }
    }
    
    createTouchesSet(distanceResults) {
        const touches = new Set()
        
        distanceResults.forEach(result => {
            const fingerName = getFingerName(result.fingerTipIndex)
            const knuckleName = getKnuckleName(result.knuckleIndex)
            touches.add(`${fingerName} → ${knuckleName}: ${result.distance.toFixed(4)}`)
        })
        
        return touches
    }
    
    getDebugInfo(landmarks) {
        // Get all distance calculations for debug display
        const fingerTips = getFingerTipIndices()
        const knuckles = getKnuckleIndices()
        const closePairs = []
        
        for (const fingerTipIndex of fingerTips) {
            const fingerTip = landmarks[fingerTipIndex]
            
            for (const knuckleIndex of knuckles) {
                const knuckle = landmarks[knuckleIndex]
                
                const dx = fingerTip.x - knuckle.x
                const dy = fingerTip.y - knuckle.y
                const dz = fingerTip.z - knuckle.z
                const distance = Math.sqrt(dx*dx + dy*dy + dz*dz)
                
                if (distance < this.config.touchDistance * 1.5) {
                    const gestureKey = getGestureKey(fingerTipIndex, knuckleIndex)
                    const letter = getLetterForGesture(gestureKey)
                    
                    closePairs.push({
                        fingerTip,
                        knuckle,
                        distance,
                        fingerName: getFingerName(fingerTipIndex),
                        knuckleName: getKnuckleName(knuckleIndex),
                        gestureKey,
                        hasMapping: !!letter,
                        letter: letter || '?',
                        isActive: distance < this.config.touchDistance
                    })
                }
            }
        }
        
        // Sort by distance for better debugging
        closePairs.sort((a, b) => a.distance - b.distance)
        
        return { closePairs }
    }
    
    // Clean up old gesture timestamps to prevent memory leaks
    cleanupOldGestures(currentTime) {
        const cutoffTime = currentTime - (this.config.gestureTimeout * 10) // Keep 10x timeout
        
        for (const [gesture, timestamp] of this.lastDetectedGestures.entries()) {
            if (timestamp < cutoffTime) {
                this.lastDetectedGestures.delete(gesture)
            }
        }
    }
    
    // Get statistics about gesture detection
    getStats() {
        return {
            trackedGestures: this.lastDetectedGestures.size,
            totalMappings: Object.keys(GESTURE_MAPPINGS.ALL_GESTURES).length,
            config: { ...this.config }
        }
    }
    
    // Reset gesture detection state
    reset() {
        this.lastDetectedGestures.clear()
    }
    
    // Cleanup method
    destroy() {
        if (this.worker) {
            this.worker.terminate()
            this.worker = null
        }
        this.reset()
    }
}
