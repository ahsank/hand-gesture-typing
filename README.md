# 🤏 Hand Gesture Typing System

A modern web application that enables typing through hand gestures using computer vision and MediaPipe. Touch different knuckles with your fingertips to type letters and symbols!

## ✨ Features

- **Real-time Hand Detection**: Uses MediaPipe for accurate hand landmark detection
- **Gesture-to-Text Mapping**: Touch fingertips to knuckles to type specific letters
- **Visual Debugging**: See distance calculations and gesture detection in real-time
- **Performance Monitoring**: Built-in FPS tracking and performance analysis
- **Snapshot System**: Capture moments during detection for analysis
- **Responsive Design**: Works on desktop and mobile devices
- **Modern Architecture**: Built with Vite and ES6 modules

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- A modern web browser with camera support
- Good lighting conditions for optimal hand detection

### Installation

1. Clone or download the project files
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`
5. Allow camera permissions when prompted
6. Start making gestures to type!

## 📝 Gesture Mapping

The system maps finger-to-knuckle touches to letters and symbols:

### Letters (a-z)
- **Thumb** touching different knuckles produces letters a-l
- **Index finger** touching knuckles produces letters m-t  
- **Middle finger** touching knuckles produces letters u-z

### Special Characters
- **Ring finger** to thumb knuckles: `.`, `,`, `?`
- **Pinky finger** to thumb knuckles: `!`, `-`, `'`

## 🎮 Controls

### Mouse/Touch Controls
- **Clear Text**: Remove all typed text
- **Space**: Add a space character
- **Backspace**: Delete last character
- **Pause/Resume**: Toggle gesture detection
- **Debug Mode**: Show/hide distance calculations
- **Take Snapshot**: Capture current moment for analysis

### Keyboard Shortcuts
- `Space` - Add space
- `Backspace` - Delete character
- `Esc` - Toggle detection on/off
- `Ctrl/Cmd + D` - Toggle debug mode
- `Ctrl/Cmd + S` - Take snapshot

## 🔧 Configuration

### Sensitivity Adjustment
Use the sensitivity slider to adjust touch detection threshold:
- **Lower values** (0.01-0.03): More sensitive, detects touches easier
- **Higher values** (0.05-0.15): Less sensitive, requires closer contact

### Performance Settings
The system automatically adjusts based on your device capabilities, but you can:
- Close other browser tabs for better performance
- Use good lighting for more accurate detection
- Keep your hand steady for consistent recognition

## 🏗️ Project Structure

```
src/
├── components/
│   └── HandGestureTypingSystem.js  # Main application class
├── config/
│   └── gestureMappings.js          # Gesture-to-letter mappings
├── utils/
│   ├── Camera.js                   # Camera handling utilities
│   ├── GestureDetector.js          # Gesture detection logic
│   ├── PerformanceMonitor.js       # Performance tracking
│   ├── SnapshotManager.js          # Snapshot functionality
│   └── systemCheck.js              # System compatibility checks
└── main.js                         # Application entry point
```

## 🛠️ Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Serve with external access
npm run serve
```

## 🔍 Debugging Features

### Debug Mode
Enable debug mode to see:
- Distance calculations between fingers and knuckles
- Active touch pairs with color coding
- Performance metrics (FPS, frame timing)
- Hand stability indicators

### Snapshot Analysis
Take snapshots during gesture detection to analyze:
- Gesture detection accuracy
- Performance metrics at capture time
- Debug information and touch data
- Video quality and lighting conditions

### Performance Monitoring
Real-time tracking of:
- Frames per second (FPS)
- Frame drop detection
- Hand movement stability
- Memory usage (when supported)

## 🎯 Tips for Best Performance

1. **Lighting**: Use bright, even lighting for better hand detection
2. **Background**: Plain backgrounds work better than cluttered ones
3. **Hand Position**: Keep your hand centered in the camera view
4. **Stability**: Hold your hand steady when making gestures
5. **Distance**: Maintain 1-2 feet from the camera for optimal detection

## 🌐 Browser Compatibility

**Recommended Browsers:**
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

**Required Features:**
- WebRTC (camera access)
- WebGL (for MediaPipe)
- ES6 Modules
- Web Workers (optional, for performance)

## 🐛 Troubleshooting

### Camera Issues
- Ensure camera permissions are granted
- Check if other applications are using the camera
- Try refreshing the page
- Verify camera works in other applications

### Performance Issues
- Close other browser tabs
- Ensure good lighting conditions
- Try reducing sensitivity if detection is too aggressive
- Check system performance in debug mode

### Detection Issues
- Adjust sensitivity slider
- Ensure your hand is clearly visible
- Check lighting conditions
- Try repositioning your hand in the frame

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service.

### Hosting Considerations
- **HTTPS Required**: Camera access requires HTTPS in production
- **CORS Headers**: Ensure MediaPipe CDN resources can be loaded
- **Memory**: Application uses ~50-100MB RAM during operation

## 🔮 Future Enhancements

- [ ] Custom gesture mapping editor
- [ ] Multi-hand support
- [ ] Voice commands integration
- [ ] Machine learning model training
- [ ] Mobile app version
- [ ] Accessibility improvements
- [ ] Cloud gesture analytics

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional gesture mappings
- Performance optimizations
- Mobile device support
- Accessibility features
- Documentation improvements

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify system compatibility using built-in checks
3. Review the troubleshooting section
4. Check camera and browser permissions

---

Built with ❤️ using MediaPipe, Vite, and modern web technologies.
