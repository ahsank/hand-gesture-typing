// src/config/gestureMappings.js
// Constants for hand landmarks (MediaPipe provides 21 landmarks per hand)

export const FINGER_TIPS = {
    THUMB: 4,
    INDEX: 8,
    MIDDLE: 12,
    RING: 16,
    PINKY: 20
}

export const KNUCKLES = {
    THUMB_CMC: 1,     // Thumb Carpometacarpal
    THUMB_MCP: 2,     // Thumb Metacarpophalangeal
    THUMB_IP: 3,      // Thumb Interphalangeal
    INDEX_MCP: 5,     // Index Metacarpophalangeal
    INDEX_PIP: 6,     // Index Proximal Interphalangeal
    INDEX_DIP: 7,     // Index Distal Interphalangeal
    MIDDLE_MCP: 9,    // Middle Metacarpophalangeal
    MIDDLE_PIP: 10,   // Middle Proximal Interphalangeal
    MIDDLE_DIP: 11,   // Middle Distal Interphalangeal
    RING_MCP: 13,     // Ring Metacarpophalangeal
    RING_PIP: 14,     // Ring Proximal Interphalangeal
    RING_DIP: 15,     // Ring Distal Interphalangeal
    PINKY_MCP: 17,    // Pinky Metacarpophalangeal
    PINKY_PIP: 18,    // Pinky Proximal Interphalangeal
    PINKY_DIP: 19     // Pinky Distal Interphalangeal
}

// Mapping between finger-to-knuckle touches and letters
export const LETTER_MAPPINGS = {
    // Thumb to index finger knuckles
    [`${FINGER_TIPS.THUMB}_${KNUCKLES.INDEX_MCP}`]: 'a',
    [`${FINGER_TIPS.THUMB}_${KNUCKLES.INDEX_PIP}`]: 'b',
    [`${FINGER_TIPS.THUMB}_${KNUCKLES.INDEX_DIP}`]: 'c',
    
    // Thumb to middle finger knuckles
    [`${FINGER_TIPS.THUMB}_${KNUCKLES.MIDDLE_MCP}`]: 'd',
    [`${FINGER_TIPS.THUMB}_${KNUCKLES.MIDDLE_PIP}`]: 'e',
    [`${FINGER_TIPS.THUMB}_${KNUCKLES.MIDDLE_DIP}`]: 'f',
    
    // Thumb to ring finger knuckles
    [`${FINGER_TIPS.THUMB}_${KNUCKLES.RING_MCP}`]: 'g',    // This should be 'g'
    [`${FINGER_TIPS.THUMB}_${KNUCKLES.RING_PIP}`]: 'h',
    [`${FINGER_TIPS.THUMB}_${KNUCKLES.RING_DIP}`]: 'i',
    
    // Thumb to pinky finger knuckles
    [`${FINGER_TIPS.THUMB}_${KNUCKLES.PINKY_MCP}`]: 'j',   // This should be 'j'
    [`${FINGER_TIPS.THUMB}_${KNUCKLES.PINKY_PIP}`]: 'k',
    [`${FINGER_TIPS.THUMB}_${KNUCKLES.PINKY_DIP}`]: 'l',
    
    // Index finger to thumb knuckles
    [`${FINGER_TIPS.INDEX}_${KNUCKLES.THUMB_CMC}`]: 'm',
    [`${FINGER_TIPS.INDEX}_${KNUCKLES.THUMB_MCP}`]: 'n',
    [`${FINGER_TIPS.INDEX}_${KNUCKLES.THUMB_IP}`]: 'o',
    
    // // Index finger to other knuckles
    // [`${FINGER_TIPS.INDEX}_${KNUCKLES.MIDDLE_MCP}`]: 'p',
    // [`${FINGER_TIPS.INDEX}_${KNUCKLES.MIDDLE_PIP}`]: 'q',
    // [`${FINGER_TIPS.INDEX}_${KNUCKLES.MIDDLE_DIP}`]: 'r',
    // [`${FINGER_TIPS.INDEX}_${KNUCKLES.RING_MCP}`]: 's',
    // [`${FINGER_TIPS.INDEX}_${KNUCKLES.RING_PIP}`]: 't',
    
    // // Middle finger mappings
    // [`${FINGER_TIPS.MIDDLE}_${KNUCKLES.THUMB_CMC}`]: 'u',
    // [`${FINGER_TIPS.MIDDLE}_${KNUCKLES.THUMB_MCP}`]: 'v',
    // [`${FINGER_TIPS.MIDDLE}_${KNUCKLES.THUMB_IP}`]: 'w',
    // [`${FINGER_TIPS.MIDDLE}_${KNUCKLES.INDEX_MCP}`]: 'x',
    // [`${FINGER_TIPS.MIDDLE}_${KNUCKLES.INDEX_PIP}`]: 'y',
    // [`${FINGER_TIPS.MIDDLE}_${KNUCKLES.INDEX_DIP}`]: 'z'
}

// Let's also add a debugging function to verify mappings
export function debugGestureMapping() {
    console.log('🗺️ All Gesture Mappings:')
    Object.entries(ALL_GESTURES).forEach(([gestureKey, letter]) => {
        const [fingerTipIndex, knuckleIndex] = gestureKey.split('_')
        const fingerName = getFingerName(parseInt(fingerTipIndex))
        const knuckleName = getKnuckleName(parseInt(knuckleIndex))
        console.log(`  ${fingerName} → ${knuckleName} = "${letter}" (${gestureKey})`)
    })
    
    // Specific checks for the problematic gestures
    const thumbRingMCP = getGestureKey(FINGER_TIPS.THUMB, KNUCKLES.RING_MCP)
    const thumbPinkyMCP = getGestureKey(FINGER_TIPS.THUMB, KNUCKLES.PINKY_MCP)
    
    console.log(`\n🔍 Specific mappings:`)
    console.log(`  THUMB → RING_MCP (${thumbRingMCP}) = "${getLetterForGesture(thumbRingMCP)}"`)
    console.log(`  THUMB → PINKY_MCP (${thumbPinkyMCP}) = "${getLetterForGesture(thumbPinkyMCP)}"`)
}

// Special gestures for control functions
export const SPECIAL_MAPPINGS = {
    // Using ring finger to touch thumb knuckles for special characters
    [`${FINGER_TIPS.RING}_${KNUCKLES.THUMB_CMC}`]: '.',
    [`${FINGER_TIPS.RING}_${KNUCKLES.THUMB_MCP}`]: ',',
    [`${FINGER_TIPS.RING}_${KNUCKLES.THUMB_IP}`]: '?',
    
    // Using pinky finger for more special characters
    [`${FINGER_TIPS.PINKY}_${KNUCKLES.THUMB_CMC}`]: '!',
    [`${FINGER_TIPS.PINKY}_${KNUCKLES.THUMB_MCP}`]: '-',
    [`${FINGER_TIPS.PINKY}_${KNUCKLES.THUMB_IP}`]: "'",
    
    // // Additional special characters using different combinations
    // [`${FINGER_TIPS.RING}_${KNUCKLES.INDEX_MCP}`]: ':',
    // [`${FINGER_TIPS.RING}_${KNUCKLES.INDEX_PIP}`]: ';',
    // [`${FINGER_TIPS.PINKY}_${KNUCKLES.INDEX_MCP}`]: '"',
    // [`${FINGER_TIPS.PINKY}_${KNUCKLES.INDEX_PIP}`]: '('
}

// Combine all gesture mappings
export const ALL_GESTURES = { ...LETTER_MAPPINGS, ...SPECIAL_MAPPINGS }

// Export combined mappings object
export const GESTURE_MAPPINGS = {
    FINGER_TIPS,
    KNUCKLES,
    LETTER_MAPPINGS,
    SPECIAL_MAPPINGS,
    ALL_GESTURES
}

// Helper functions for gesture mapping
export function getFingerName(fingerTipIndex) {
    return Object.keys(FINGER_TIPS).find(key => FINGER_TIPS[key] === fingerTipIndex)
}

export function getKnuckleName(knuckleIndex) {
    return Object.keys(KNUCKLES).find(key => KNUCKLES[key] === knuckleIndex)
}

export function getGestureKey(fingerTipIndex, knuckleIndex) {
    return `${fingerTipIndex}_${knuckleIndex}`
}

export function isValidGesture(gestureKey) {
    return gestureKey in ALL_GESTURES
}

export function getLetterForGesture(gestureKey) {
    return ALL_GESTURES[gestureKey] || null
}

// Get all finger tip indices as array
export function getFingerTipIndices() {
    return Object.values(FINGER_TIPS)
}

// Get all knuckle indices as array
export function getKnuckleIndices() {
    return Object.values(KNUCKLES)
}
