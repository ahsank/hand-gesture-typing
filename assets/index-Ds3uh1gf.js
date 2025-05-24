import{P as $,g as D,L}from"./mediapipe-kb82tygh.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();const F="modulepreload",N=function(i){return"/hand-gesture-typing/"+i},I={},M=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let r=function(d){return Promise.all(d.map(u=>Promise.resolve(u).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),c=a?.nonce||a?.getAttribute("nonce");s=r(t.map(d=>{if(d=N(d),d in I)return;I[d]=!0;const u=d.endsWith(".css"),m=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${m}`))return;const p=document.createElement("link");if(p.rel=u?"stylesheet":F,u||(p.as="script"),p.crossOrigin="",p.href=d,c&&p.setAttribute("nonce",c),document.head.appendChild(p),u)return new Promise((g,v)=>{p.addEventListener("load",g),p.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${d}`)))})}))}function o(r){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=r,window.dispatchEvent(a),!a.defaultPrevented)throw r}return s.then(r=>{for(const a of r||[])a.status==="rejected"&&o(a.reason);return e().catch(o)})},l={THUMB:4,INDEX:8,MIDDLE:12,RING:16,PINKY:20},h={THUMB_CMC:1,THUMB_MCP:2,THUMB_IP:3,INDEX_MCP:5,INDEX_PIP:6,INDEX_DIP:7,MIDDLE_MCP:9,MIDDLE_PIP:10,MIDDLE_DIP:11,RING_MCP:13,RING_PIP:14,RING_DIP:15,PINKY_MCP:17,PINKY_PIP:18,PINKY_DIP:19},T={[`${l.THUMB}_${h.INDEX_MCP}`]:"a",[`${l.THUMB}_${h.INDEX_PIP}`]:"b",[`${l.THUMB}_${h.INDEX_DIP}`]:"c",[`${l.THUMB}_${h.MIDDLE_MCP}`]:"d",[`${l.THUMB}_${h.MIDDLE_PIP}`]:"e",[`${l.THUMB}_${h.MIDDLE_DIP}`]:"f",[`${l.THUMB}_${h.RING_MCP}`]:"g",[`${l.THUMB}_${h.RING_PIP}`]:"h",[`${l.THUMB}_${h.RING_DIP}`]:"i",[`${l.THUMB}_${h.PINKY_MCP}`]:"j",[`${l.THUMB}_${h.PINKY_PIP}`]:"k",[`${l.THUMB}_${h.PINKY_DIP}`]:"l",[`${l.INDEX}_${h.THUMB_CMC}`]:"m",[`${l.INDEX}_${h.THUMB_MCP}`]:"n",[`${l.INDEX}_${h.THUMB_IP}`]:"o"};function G(){console.log("🗺️ All Gesture Mappings:"),Object.entries(E).forEach(([t,n])=>{const[s,o]=t.split("_"),r=x(parseInt(s)),a=b(parseInt(o));console.log(`  ${r} → ${a} = "${n}" (${t})`)});const i=y(l.THUMB,h.RING_MCP),e=y(l.THUMB,h.PINKY_MCP);console.log(`
🔍 Specific mappings:`),console.log(`  THUMB → RING_MCP (${i}) = "${w(i)}"`),console.log(`  THUMB → PINKY_MCP (${e}) = "${w(e)}"`)}const S={[`${l.RING}_${h.THUMB_CMC}`]:".",[`${l.RING}_${h.THUMB_MCP}`]:",",[`${l.RING}_${h.THUMB_IP}`]:"?",[`${l.PINKY}_${h.THUMB_CMC}`]:"!",[`${l.PINKY}_${h.THUMB_MCP}`]:"-",[`${l.PINKY}_${h.THUMB_IP}`]:"'"},E={...T,...S},f={FINGER_TIPS:l,KNUCKLES:h,LETTER_MAPPINGS:T,SPECIAL_MAPPINGS:S,ALL_GESTURES:E};function x(i){return Object.keys(l).find(e=>l[e]===i)}function b(i){return Object.keys(h).find(e=>h[e]===i)}function y(i,e){return`${i}_${e}`}function _(i){return i in E}function w(i){return E[i]||null}function C(){return Object.values(l)}function k(){return Object.values(h)}const P=Object.freeze(Object.defineProperty({__proto__:null,ALL_GESTURES:E,FINGER_TIPS:l,GESTURE_MAPPINGS:f,KNUCKLES:h,LETTER_MAPPINGS:T,SPECIAL_MAPPINGS:S,debugGestureMapping:G,getFingerName:x,getFingerTipIndices:C,getGestureKey:y,getKnuckleIndices:k,getKnuckleName:b,getLetterForGesture:w,isValidGesture:_},Symbol.toStringTag,{value:"Module"}));class R{constructor(e,t={}){this.video=e,this.options={width:640,height:480,facingMode:"user",onFrame:null,...t},this.stream=null,this.animationId=null,this.isRunning=!1}async start(){try{const e={video:{width:{ideal:this.options.width},height:{ideal:this.options.height},facingMode:this.options.facingMode,frameRate:{ideal:30,max:60}},audio:!1};return this.stream=await navigator.mediaDevices.getUserMedia(e),this.video.srcObject=this.stream,await new Promise((t,n)=>{this.video.onloadedmetadata=()=>{this.video.play().then(t).catch(n)},this.video.onerror=()=>{n(new Error("Video element error"))},setTimeout(()=>{n(new Error("Camera initialization timeout"))},1e4)}),console.log(`📹 Camera started: ${this.video.videoWidth}x${this.video.videoHeight}`),this.isRunning=!0,this.startFrameLoop(),{width:this.video.videoWidth,height:this.video.videoHeight}}catch(e){throw await this.stop(),new Error(`Failed to start camera: ${e.message}`)}}startFrameLoop(){if(!this.isRunning)return;const e=async()=>{if(this.isRunning){try{this.options.onFrame&&typeof this.options.onFrame=="function"&&await this.options.onFrame()}catch(t){console.error("Error in frame processing:",t)}this.animationId=requestAnimationFrame(e)}};e()}async stop(){this.isRunning=!1,this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null),this.stream&&(this.stream.getTracks().forEach(e=>{e.stop()}),this.stream=null),this.video&&(this.video.srcObject=null),console.log("📹 Camera stopped")}getDimensions(){return{width:this.video.videoWidth||this.options.width,height:this.video.videoHeight||this.options.height}}isActive(){return this.isRunning&&this.stream&&this.stream.active}static async getAvailableDevices(){try{return(await navigator.mediaDevices.enumerateDevices()).filter(t=>t.kind==="videoinput")}catch(e){return console.error("Error getting camera devices:",e),[]}}async switchCamera(e){this.isRunning&&await this.stop(),this.options.deviceId=e,delete this.options.facingMode;const t={video:{deviceId:{exact:e},width:{ideal:this.options.width},height:{ideal:this.options.height},frameRate:{ideal:30,max:60}},audio:!1};return this.stream=await navigator.mediaDevices.getUserMedia(t),this.video.srcObject=this.stream,await new Promise(n=>{this.video.onloadedmetadata=()=>{this.video.play(),n()}}),this.isRunning=!0,this.startFrameLoop(),this.getDimensions()}takePhoto(e="image/png",t=.9){const n=document.createElement("canvas"),s=n.getContext("2d");return n.width=this.video.videoWidth,n.height=this.video.videoHeight,s.drawImage(this.video,0,0),n.toDataURL(e,t)}static async checkPermissions(){try{const e=await navigator.permissions.query({name:"camera"});return{state:e.state,granted:e.state==="granted"}}catch(e){return console.warn("Cannot check camera permissions:",e),{state:"unknown",granted:!1}}}}class H{constructor(){this.frameCount=0,this.lastFpsUpdate=Date.now(),this.fps=0,this.frameTimestamps=[],this.maxFrameHistory=60,this.isRunning=!1,this.startTime=null,this.metrics={averageFps:0,minFps:1/0,maxFps:0,frameDrops:0,totalFrames:0}}start(){this.isRunning=!0,this.startTime=Date.now(),this.lastFpsUpdate=this.startTime,this.frameCount=0,this.frameTimestamps=[],this.metrics={averageFps:0,minFps:1/0,maxFps:0,frameDrops:0,totalFrames:0},console.log("📊 Performance monitoring started")}stop(){this.isRunning=!1,console.log("📊 Performance monitoring stopped"),this.logSummary()}recordFrame(){if(!this.isRunning)return;const e=Date.now();this.frameCount++,this.metrics.totalFrames++,this.frameTimestamps.push(e),this.frameTimestamps.length>this.maxFrameHistory&&this.frameTimestamps.shift(),e-this.lastFpsUpdate>=1e3&&(this.fps=Math.round(this.frameCount*1e3/(e-this.lastFpsUpdate)),this.updateMetrics(this.fps),this.frameCount=0,this.lastFpsUpdate=e)}updateMetrics(e){e>0&&(this.metrics.minFps=Math.min(this.metrics.minFps,e),this.metrics.maxFps=Math.max(this.metrics.maxFps,e));const t=(Date.now()-this.startTime)/1e3;this.metrics.averageFps=Math.round(this.metrics.totalFrames/t),e<20&&e>0&&this.metrics.frameDrops++}getFPS(){return this.fps}getMetrics(){return{...this.metrics}}getFrameTimeStats(){if(this.frameTimestamps.length<2)return{averageFrameTime:0,minFrameTime:0,maxFrameTime:0,frameTimeVariance:0};const e=[];for(let a=1;a<this.frameTimestamps.length;a++)e.push(this.frameTimestamps[a]-this.frameTimestamps[a-1]);const n=e.reduce((a,c)=>a+c,0)/e.length,s=Math.min(...e),o=Math.max(...e),r=e.reduce((a,c)=>a+Math.pow(c-n,2),0)/e.length;return{averageFrameTime:Math.round(n*100)/100,minFrameTime:s,maxFrameTime:o,frameTimeVariance:Math.round(r*100)/100}}getPerformanceGrade(){const e=this.metrics.averageFps,t=this.metrics.frameDrops/(this.metrics.totalFrames||1);return e>=55&&t<.01?{grade:"A",description:"Excellent performance"}:e>=45&&t<.05?{grade:"B",description:"Good performance"}:e>=30&&t<.1?{grade:"C",description:"Acceptable performance"}:e>=20&&t<.2?{grade:"D",description:"Poor performance"}:{grade:"F",description:"Very poor performance"}}isPerformanceDegraded(){return this.metrics.averageFps<20||this.metrics.frameDrops>this.metrics.totalFrames*.1}getRecommendations(){const e=[];return this.metrics.averageFps<30&&e.push("Consider reducing video resolution or model complexity"),this.metrics.frameDrops>this.metrics.totalFrames*.05&&e.push("Frequent frame drops detected - close other applications"),this.getFrameTimeStats().frameTimeVariance>100&&e.push("Inconsistent frame timing - check system load"),e.length===0&&e.push("Performance is good!"),e}logSummary(){const e=this.startTime?(Date.now()-this.startTime)/1e3:0,t=this.getPerformanceGrade(),n=this.getFrameTimeStats();console.group("📊 Performance Summary"),console.log(`Running time: ${e.toFixed(1)}s`),console.log(`Total frames: ${this.metrics.totalFrames}`),console.log(`Average FPS: ${this.metrics.averageFps}`),console.log(`FPS range: ${this.metrics.minFps===1/0?0:this.metrics.minFps} - ${this.metrics.maxFps}`),console.log(`Frame drops: ${this.metrics.frameDrops}`),console.log(`Performance grade: ${t.grade} (${t.description})`),console.log(`Average frame time: ${n.averageFrameTime}ms`),console.log("Recommendations:"),this.getRecommendations().forEach(s=>console.log(`  • ${s}`)),console.groupEnd()}createReport(){const e=this.startTime?(Date.now()-this.startTime)/1e3:0;return{timestamp:new Date().toISOString(),runningTime:e,metrics:this.getMetrics(),frameTimeStats:this.getFrameTimeStats(),performanceGrade:this.getPerformanceGrade(),recommendations:this.getRecommendations(),isDegraded:this.isPerformanceDegraded()}}}class B{constructor(e){this.app=e,this.snapshots=[],this.maxSnapshots=10,this.container=null,this.initContainer()}initContainer(){return console.log("📦 Initializing snapshot container..."),this.container=document.getElementById("snapshot-container"),this.container?console.log("📦 Snapshot container already exists"):(console.log("📦 Creating new snapshot container..."),this.container=this.createContainer()),this.container}createContainer(){console.log("🏗️ Building snapshot container structure...");const e=document.createElement("div");e.id="snapshot-container",e.style.cssText=`
            margin-top: 30px;
            padding: 20px;
            border: 2px solid #ecf0f1;
            border-radius: 12px;
            background: #f8f9fa;
        `;const t=document.createElement("h3");t.textContent="📸 Gesture Analysis Snapshots",t.style.cssText=`
            margin: 0 0 15px 0;
            color: #2c3e50;
            text-align: center;
        `,e.appendChild(t);const n=document.createElement("p");n.textContent="Capture moments during gesture detection for analysis and debugging",n.style.cssText=`
            text-align: center;
            color: #666;
            margin-bottom: 20px;
            font-style: italic;
        `,e.appendChild(n);const s=document.createElement("div");s.style.cssText=`
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        `;const o=document.createElement("button");o.textContent="🗑️ Clear All",o.style.backgroundColor="#e74c3c",o.addEventListener("click",()=>{console.log("🗑️ Clearing all snapshots..."),this.clearAllSnapshots()}),s.appendChild(o);const r=document.createElement("button");r.textContent="💾 Export",r.style.backgroundColor="#9b59b6",r.addEventListener("click",()=>{console.log("💾 Exporting snapshots..."),this.exportSnapshots()}),s.appendChild(r);const a=document.createElement("button");a.textContent="📹 Video Only",a.style.backgroundColor="#3498db",a.style.fontSize="14px",a.style.padding="8px 12px",a.addEventListener("click",()=>{console.log("📹 Taking video-only snapshot from container..."),this.takeVideoOnlySnapshot()}),s.appendChild(a);const c=document.createElement("button");c.textContent="🎯 With Overlay",c.style.backgroundColor="#2ecc71",c.style.fontSize="14px",c.style.padding="8px 12px",c.addEventListener("click",()=>{console.log("🎯 Taking overlay snapshot from container..."),this.takeSnapshot()}),s.appendChild(c),e.appendChild(s);const d=document.createElement("div");d.id="snapshots-grid",d.style.cssText=`
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        `,e.appendChild(d);const u=document.querySelector(".container");return u?(u.appendChild(e),console.log("🏗️ Snapshot container added to main container")):(console.error("🏗️ Main container not found!"),document.body.appendChild(e),console.log("🏗️ Snapshot container added to body as fallback")),e}takeSnapshot(){try{if(console.log("📸 Taking snapshot..."),!this.app.handLandmarker||!this.app.videoElement){console.error("📸 Cannot take snapshot: system not ready"),this.app.updateStatus("Cannot take snapshot: system not ready","status warning");return}if(this.app.videoElement.readyState<2){console.error("📸 Cannot take snapshot: video not ready"),this.app.updateStatus("Cannot take snapshot: video not ready","status warning");return}console.log("📸 Creating snapshot data...");const e=this.createSnapshotData();if(!e.image||e.image.length<100){console.error("📸 Snapshot image is invalid or too small"),this.app.updateStatus("Snapshot capture failed","status warning");return}console.log("📸 Adding snapshot to collection..."),this.addSnapshot(e),console.log("📸 Displaying snapshot..."),this.displaySnapshot(e),this.app.flashGestureDetection("rgba(138, 43, 226, 0.4)"),this.app.updateStatus(`📸 Snapshot #${this.snapshots.length} captured`,"status success"),console.log("📸 Snapshot completed successfully")}catch(e){console.error("📸 Error taking snapshot:",e),this.app.updateStatus(`Snapshot error: ${e.message}`,"status warning")}}takeVideoOnlySnapshot(){try{if(console.log("📹 Taking video-only snapshot..."),!this.app.videoElement){console.error("📹 Cannot take snapshot: video not ready"),this.app.updateStatus("Cannot take snapshot: video not ready","status warning");return}if(this.app.videoElement.readyState<2){console.error("📹 Cannot take snapshot: video not loaded"),this.app.updateStatus("Cannot take snapshot: video not loaded","status warning");return}const e=new Date,t={id:Date.now(),timestamp:e.toISOString(),displayTime:e.toLocaleTimeString(),image:this.captureVideoOnly(),type:"video-only",activeGesture:this.app.currentActiveGesture,config:{...this.app.config},touches:Array.from(this.app.currentTouches||[]),debugInfo:"Video-only snapshot - no overlay data",performance:this.app.performanceMonitor.createReport(),videoInfo:{width:this.app.videoElement.videoWidth,height:this.app.videoElement.videoHeight}};if(!t.image||t.image.length<100){console.error("📹 Video snapshot image is invalid"),this.app.updateStatus("Video snapshot capture failed","status warning");return}this.addSnapshot(t),this.displaySnapshot(t),this.app.flashGestureDetection("rgba(52, 152, 219, 0.4)"),this.app.updateStatus(`📹 Video snapshot #${this.snapshots.length} captured`,"status success"),console.log("📹 Video-only snapshot completed successfully")}catch(e){console.error("📹 Error taking video snapshot:",e),this.app.updateStatus(`Video snapshot error: ${e.message}`,"status warning")}}captureVideoOnly(){try{const e=document.createElement("canvas"),t=e.getContext("2d");return e.width=this.app.videoElement.videoWidth||640,e.height=this.app.videoElement.videoHeight||480,t.save(),t.scale(-1,1),t.translate(-e.width,0),t.drawImage(this.app.videoElement,0,0,e.width,e.height),t.restore(),e.toDataURL("image/png",.8)}catch(e){return console.error("Error capturing video only:",e),null}}createSnapshotData(){const e=new Date,t=document.getElementById("debug-info");return{id:Date.now(),timestamp:e.toISOString(),displayTime:e.toLocaleTimeString(),image:this.captureVideoWithOverlay(),activeGesture:this.app.currentActiveGesture,config:{...this.app.config},touches:Array.from(this.app.currentTouches||[]),debugInfo:t?t.textContent:"Debug info not available",performance:this.app.performanceMonitor.createReport(),videoInfo:{width:this.app.videoElement.videoWidth,height:this.app.videoElement.videoHeight}}}captureVideoWithOverlay(){try{const e=document.createElement("canvas"),t=e.getContext("2d");e.width=this.app.videoElement.videoWidth||640,e.height=this.app.videoElement.videoHeight||480,console.log("📸 Capturing video with overlay, canvas size:",e.width,"x",e.height),t.save(),t.scale(-1,1),t.translate(-e.width,0),t.drawImage(this.app.videoElement,0,0,e.width,e.height),t.restore(),t.save(),t.scale(-1,1),t.translate(-e.width,0),this.app.canvasElement?(t.drawImage(this.app.canvasElement,0,0),console.log("📸 Added overlay to snapshot")):console.warn("📸 Canvas overlay not available"),t.restore();const n=e.toDataURL("image/png",.8);return console.log("📸 Generated data URL, length:",n.length),n}catch(e){return console.error("Error capturing video with overlay:",e),this.app.canvasElement?(console.log("📸 Falling back to canvas only"),this.app.canvasElement.toDataURL("image/png",.8)):this.createErrorPlaceholder()}}captureVideoOnly(){try{const e=document.createElement("canvas"),t=e.getContext("2d");if(e.width=this.app.videoElement.videoWidth||640,e.height=this.app.videoElement.videoHeight||480,console.log("📹 Capturing video only, canvas size:",e.width,"x",e.height),!this.app.videoElement.videoWidth||!this.app.videoElement.videoHeight)return console.warn("📹 Video not ready, dimensions are 0"),this.createErrorPlaceholder();t.save(),t.scale(-1,1),t.translate(-e.width,0),t.drawImage(this.app.videoElement,0,0,e.width,e.height),t.restore();const n=e.toDataURL("image/png",.8);return console.log("📹 Generated video-only data URL, length:",n.length),n}catch(e){return console.error("Error capturing video only:",e),this.createErrorPlaceholder()}}createErrorPlaceholder(){const e=document.createElement("canvas"),t=e.getContext("2d");return e.width=640,e.height=480,t.fillStyle="#f0f0f0",t.fillRect(0,0,e.width,e.height),t.fillStyle="#666",t.font="24px Arial",t.textAlign="center",t.fillText("Snapshot Error",e.width/2,e.height/2-20),t.fillText("Unable to capture video",e.width/2,e.height/2+20),e.toDataURL("image/png",.8)}addSnapshot(e){if(this.snapshots.push(e),this.snapshots.length>this.maxSnapshots){const t=this.snapshots.shift();this.removeSnapshotDisplay(t.id)}}displaySnapshot(e){if(console.log("🖼️ Displaying snapshot:",e.id),!document.getElementById("snapshots-grid")&&(console.error("🖼️ Snapshots grid not found, creating container..."),this.initContainer(),!document.getElementById("snapshots-grid"))){console.error("🖼️ Failed to create snapshots grid");return}const n=document.getElementById("snapshots-grid"),s=document.createElement("div");s.className="snapshot-card",s.id=`snapshot-${e.id}`,s.style.cssText=`
            border: 2px solid #ddd;
            border-radius: 10px;
            padding: 15px;
            background: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transition: transform 0.2s ease;
            margin-bottom: 15px;
        `,s.addEventListener("mouseenter",()=>{s.style.transform="translateY(-5px)",s.style.boxShadow="0 8px 16px rgba(0,0,0,0.15)"}),s.addEventListener("mouseleave",()=>{s.style.transform="translateY(0)",s.style.boxShadow="0 4px 8px rgba(0,0,0,0.1)"}),console.log("🖼️ Creating snapshot HTML..."),s.innerHTML=this.createSnapshotHTML(e),console.log("🖼️ Adding event listeners..."),this.addSnapshotEventListeners(s,e),console.log("🖼️ Inserting card into grid..."),n.insertBefore(s,n.firstChild),console.log("🖼️ Snapshot displayed successfully"),setTimeout(()=>{s.scrollIntoView({behavior:"smooth",block:"nearest"})},100)}createSnapshotHTML(e){const t=e.performance.performanceGrade,n=this.getGradeColor(t.grade),s=e.type==="video-only"?"📹 Video Only":"🎯 Video + Overlay",o=e.type==="video-only"?"#3498db":"#2ecc71";return`
            <div class="snapshot-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #2c3e50;">Snapshot #${this.snapshots.length}</h4>
                <div style="display: flex; flex-direction: column; align-items: flex-end;">
                    <span style="font-size: 12px; color: #666;">${e.displayTime}</span>
                    <span style="font-size: 10px; color: ${o}; font-weight: bold;">${s}</span>
                </div>
            </div>
            
            <div class="snapshot-image" style="text-align: center; margin-bottom: 15px;">
                <img src="${e.image}" 
                     style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; transition: transform 0.2s;"
                     onclick="this.style.transform = this.style.transform ? '' : 'scale(2)'; this.style.zIndex = this.style.zIndex ? '' : '1000'; this.style.position = this.style.position ? '' : 'fixed'; this.style.top = this.style.top ? '' : '50%'; this.style.left = this.style.left ? '' : '50%'; this.style.marginTop = this.style.marginTop ? '' : '-25vh'; this.style.marginLeft = this.style.marginLeft ? '' : '-25vw';"
                     title="Click to zoom in/out">
            </div>
            
            <div class="snapshot-info" style="font-size: 12px; line-height: 1.4;">
                <div style="margin-bottom: 8px;">
                    <strong>Active Gesture:</strong> 
                    <span style="color: ${e.activeGesture?"#27ae60":"#e74c3c"};">
                        ${e.activeGesture||"None"}
                    </span>
                </div>
                
                <div style="margin-bottom: 8px;">
                    <strong>Touch Sensitivity:</strong> ${e.config.touchDistance.toFixed(3)}
                </div>
                
                <div style="margin-bottom: 8px;">
                    <strong>Performance:</strong> 
                    <span style="color: ${n}; font-weight: bold;">
                        ${t.grade} (${e.performance.metrics.averageFps} FPS avg)
                    </span>
                </div>
                
                <div style="margin-bottom: 8px;">
                    <strong>Active Touches:</strong> ${e.touches.length}
                </div>
                
                <div style="margin-bottom: 8px;">
                    <strong>Video Resolution:</strong> ${e.videoInfo.width}x${e.videoInfo.height}
                </div>
                
                ${e.type!=="video-only"?`
                <div class="debug-section" style="background: #f8f9fa; padding: 8px; border-radius: 4px; margin: 10px 0;">
                    <strong>Debug Info:</strong>
                    <div style="font-family: monospace; font-size: 10px; max-height: 60px; overflow-y: auto; margin-top: 5px;">
                        ${e.debugInfo}
                    </div>
                </div>
                `:'<div style="text-align: center; color: #666; font-style: italic; margin: 10px 0;">Clean video capture without overlay</div>'}
                
                <div class="controls" style="display: flex; gap: 8px; margin-top: 10px;">
                    <button class="analyze-btn" data-id="${e.id}" 
                            style="flex: 1; padding: 5px; font-size: 11px; background: #3498db; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        📊 Analyze
                    </button>
                    <button class="download-btn" data-id="${e.id}"
                            style="flex: 1; padding: 5px; font-size: 11px; background: #2ecc71; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        💾 Download
                    </button>
                    <button class="delete-btn" data-id="${e.id}"
                            style="flex: 1; padding: 5px; font-size: 11px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer;">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `}addSnapshotEventListeners(e,t){e.querySelector(".delete-btn").addEventListener("click",()=>{this.deleteSnapshot(t.id)}),e.querySelector(".analyze-btn").addEventListener("click",()=>{this.analyzeSnapshot(t)});const o=e.querySelector(".download-btn");o&&o.addEventListener("click",()=>{this.downloadSnapshot(t)})}downloadSnapshot(e){try{const t=document.createElement("a");t.href=e.image,t.download=`gesture-snapshot-${e.id}.png`,document.body.appendChild(t),t.click(),document.body.removeChild(t),this.app.updateStatus(`Downloaded snapshot #${e.id}`,"status success")}catch(t){console.error("Download error:",t),this.app.updateStatus("Download failed","status warning")}}deleteSnapshot(e){this.snapshots=this.snapshots.filter(t=>t.id!==e),this.removeSnapshotDisplay(e)}removeSnapshotDisplay(e){const t=document.getElementById(`snapshot-${e}`);t&&t.parentNode&&t.parentNode.removeChild(t)}analyzeSnapshot(e){const t=document.createElement("div");t.style.cssText=`
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
        `;const n=document.createElement("div");n.style.cssText=`
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        `,n.innerHTML=this.createAnalysisHTML(e);const s=document.createElement("button");s.textContent="✕",s.style.cssText=`
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        `,s.addEventListener("click",()=>document.body.removeChild(t)),n.appendChild(s),t.appendChild(n),document.body.appendChild(t),t.addEventListener("click",o=>{o.target===t&&document.body.removeChild(t)})}createAnalysisHTML(e){const t=e.performance;return`
            <h2 style="margin-top: 0; color: #2c3e50;">📊 Snapshot Analysis</h2>
            <p style="color: #666; margin-bottom: 25px;">Captured at ${new Date(e.timestamp).toLocaleString()}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                <div>
                    <h3>🎯 Gesture Detection</h3>
                    <p><strong>Active Gesture:</strong> ${e.activeGesture||"None"}</p>
                    <p><strong>Touch Sensitivity:</strong> ${e.config.touchDistance.toFixed(3)}</p>
                    <p><strong>Active Touches:</strong> ${e.touches.length}</p>
                    <p><strong>Gesture Timeout:</strong> ${e.config.gestureTimeout}ms</p>
                </div>
                
                <div>
                    <h3>⚡ Performance Metrics</h3>
                    <p><strong>Grade:</strong> <span style="color: ${this.getGradeColor(t.performanceGrade.grade)};">${t.performanceGrade.grade}</span> (${t.performanceGrade.description})</p>
                    <p><strong>Average FPS:</strong> ${t.metrics.averageFps}</p>
                    <p><strong>FPS Range:</strong> ${t.metrics.minFps} - ${t.metrics.maxFps}</p>
                    <p><strong>Frame Drops:</strong> ${t.metrics.frameDrops}</p>
                    <p><strong>Running Time:</strong> ${t.runningTime.toFixed(1)}s</p>
                </div>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3>📹 Video Information</h3>
                <p><strong>Resolution:</strong> ${e.videoInfo.width}x${e.videoInfo.height}</p>
                <p><strong>Frame Time Stats:</strong> 
                   Avg: ${t.frameTimeStats.averageFrameTime}ms, 
                   Range: ${t.frameTimeStats.minFrameTime}-${t.frameTimeStats.maxFrameTime}ms
                </p>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3>🔧 Recommendations</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    ${t.recommendations.map(n=>`<li>${n}</li>`).join("")}
                </ul>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3>🐛 Debug Information</h3>
                <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; font-size: 12px;">${e.debugInfo}</pre>
            </div>
            
            <div style="text-align: center;">
                <img src="${e.image}" style="max-width: 100%; border: 2px solid #ddd; border-radius: 8px;">
            </div>
        `}getGradeColor(e){return{A:"#27ae60",B:"#2ecc71",C:"#f39c12",D:"#e67e22",F:"#e74c3c"}[e]||"#666"}clearAllSnapshots(){this.snapshots=[];const e=document.getElementById("snapshots-grid");e&&(e.innerHTML=""),this.app.updateStatus("All snapshots cleared","status")}exportSnapshots(){if(this.snapshots.length===0){this.app.updateStatus("No snapshots to export","status warning");return}try{const e={exportTime:new Date().toISOString(),appVersion:"1.0.0",snapshotCount:this.snapshots.length,snapshots:this.snapshots.map(o=>({...o,image:o.image.length>100?`${o.image.substring(0,100)}...`:o.image}))},t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),n=URL.createObjectURL(t),s=document.createElement("a");s.href=n,s.download=`gesture-snapshots-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(n),this.app.updateStatus(`Exported ${this.snapshots.length} snapshots`,"status success")}catch(e){console.error("Export error:",e),this.app.updateStatus("Export failed","status warning")}}}class U{constructor(e={}){this.config={...e},this.lastDetectedGestures=new Map,this.worker=null,this.initWorker()}updateConfig(e){this.config={...this.config,...e}}initWorker(){try{const e=`
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
            `,t=new Blob([e],{type:"application/javascript"});this.worker=new Worker(URL.createObjectURL(t))}catch{console.warn("Web Worker not supported, using main thread for calculations"),this.worker=null}}async detectGestures(e){const t=Date.now(),n=await this.calculateDistances(e);return this.processDistanceResults(n,t)}async calculateDistances(e){const t=C(),n=k();return this.worker?new Promise(s=>{this.worker.onmessage=o=>s(o.data),this.worker.postMessage({landmarks:e,fingerTips:t,knuckles:n,touchDistance:this.config.touchDistance})}):this.calculateDistancesMainThread(e,t,n)}calculateDistancesMainThread(e,t,n){return new Promise(s=>{const o=[];for(const r of t){const a=e[r];for(const c of n){const d=e[c],u=a.x-d.x,m=a.y-d.y,p=a.z-d.z,g=Math.sqrt(u*u+m*m+p*p);g<this.config.touchDistance*2&&o.push({fingerTipIndex:r,knuckleIndex:c,distance:g,isTouch:g<this.config.touchDistance})}}setTimeout(()=>s(o),0)})}processDistanceResults(e,t){let n=null,s=this.config.touchDistance;const o=e.sort((a,c)=>a.distance-c.distance),r=o.filter(a=>{const c=y(a.fingerTipIndex,a.knuckleIndex);return a.isTouch&&c in f.ALL_GESTURES});for(const a of r){const c=y(a.fingerTipIndex,a.knuckleIndex);a.distance<s&&(n={gesture:c,distance:a.distance,fingerTipIndex:a.fingerTipIndex,knuckleIndex:a.knuckleIndex},s=a.distance)}if(n){this.lastDetectedGestures.set(n.gesture,t);const a=w(n.gesture),c=x(n.fingerTipIndex),d=b(n.knuckleIndex);return{gesture:n.gesture,letter:a,distance:n.distance,fingerName:c,knuckleName:d,touches:this.createTouchesSet(o)}}return{gesture:null,letter:null,distance:null,fingerName:null,knuckleName:null,touches:this.createTouchesSet(o)}}createTouchesSet(e){const t=new Set;return e.forEach(n=>{const s=x(n.fingerTipIndex),o=b(n.knuckleIndex);t.add(`${s} → ${o}: ${n.distance.toFixed(4)}`)}),t}getDebugInfo(e){const t=C(),n=k(),s=[];for(const o of t){const r=e[o];for(const a of n){const c=e[a],d=r.x-c.x,u=r.y-c.y,m=r.z-c.z,p=Math.sqrt(d*d+u*u+m*m);if(p<this.config.touchDistance*1.5){const g=y(o,a),v=w(g);s.push({fingerTip:r,knuckle:c,distance:p,fingerName:x(o),knuckleName:b(a),gestureKey:g,hasMapping:!!v,letter:v||"?",isActive:p<this.config.touchDistance})}}}return s.sort((o,r)=>o.distance-r.distance),{closePairs:s}}cleanupOldGestures(e){const t=e-this.config.gestureTimeout*10;for(const[n,s]of this.lastDetectedGestures.entries())s<t&&this.lastDetectedGestures.delete(n)}getStats(){return{trackedGestures:this.lastDetectedGestures.size,totalMappings:Object.keys(f.ALL_GESTURES).length,config:{...this.config}}}reset(){this.lastDetectedGestures.clear()}destroy(){this.worker&&(this.worker.terminate(),this.worker=null),this.reset()}}class A{constructor(){this.videoElement=document.getElementById("video-input"),this.canvasElement=document.getElementById("canvas-output"),this.canvasCtx=this.canvasElement.getContext("2d"),this.textOutput=document.getElementById("text-output"),this.statusElement=document.getElementById("status"),this.keyMapGrid=document.getElementById("key-map-grid"),this.handLandmarker=null,this.vision=null,this.camera=null,this.drawingUtils=null,this.detectionEnabled=!0,this.debugMode=!1,this.config={touchDistance:.04,gestureTimeout:200,handSpeedThreshold:.02,maxNumHands:1,minHandDetectionConfidence:.5,minHandPresenceConfidence:.5,minTrackingConfidence:.5},this.performanceMonitor=new H,this.snapshotManager=new B(this),this.gestureDetector=new U(this.config),this.previousHandPosition=null,this.currentActiveGesture=null,this.lastDetectedGestures={},this.currentTouches=new Set,this.lastDebugTime=0,console.log("🚀 HandGestureTypingSystem initialized with MediaPipe Tasks Vision"),console.log("📊 Configuration:",this.config),M(()=>Promise.resolve().then(()=>P),void 0).then(e=>{const t=`${e.FINGER_TIPS.THUMB}_${e.KNUCKLES.RING_MCP}`,n=`${e.FINGER_TIPS.THUMB}_${e.KNUCKLES.PINKY_MCP}`;console.log("🗝️ Key Mappings Check:"),console.log(`  THUMB → RING_MCP: "${e.ALL_GESTURES[t]||"NOT FOUND"}"`),console.log(`  THUMB → PINKY_MCP: "${e.ALL_GESTURES[n]||"NOT FOUND"}"`),console.log(`  Total mappings: ${Object.keys(e.ALL_GESTURES).length}`),console.log("🎯 System optimized to only detect mapped combinations!")}),this.setupEventListeners(),this.initKeyMap()}async init(){try{this.updateStatus("Initializing MediaPipe Tasks Vision...","status"),this.vision=await $.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"),this.handLandmarker=await D.createFromOptions(this.vision,{baseOptions:{modelAssetPath:"https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",delegate:"GPU"},runningMode:"VIDEO",numHands:this.config.maxNumHands,minHandDetectionConfidence:this.config.minHandDetectionConfidence,minHandPresenceConfidence:this.config.minHandPresenceConfidence,minTrackingConfidence:this.config.minTrackingConfidence}),this.drawingUtils=new L(this.canvasCtx),this.updateStatus("Starting camera...","status"),this.camera=new R(this.videoElement,{onFrame:async()=>{if(this.handLandmarker&&this.detectionEnabled)try{await this.detectHands()}catch(e){console.error("Error in hand detection:",e),this.updateStatus("Hand detection error - retrying...","status warning")}},width:640,height:480}),await this.camera.start(),this.canvasElement.width=this.videoElement.videoWidth||640,this.canvasElement.height=this.videoElement.videoHeight||480,this.updateStatus("✅ Ready to detect gestures! Touch fingertips to knuckles to type.","status success"),this.performanceMonitor.start(),setTimeout(()=>this.checkLighting(),2e3)}catch(e){throw console.error("Initialization error:",e),this.updateStatus(`❌ Initialization failed: ${e.message}`,"status warning"),e.message.includes("FilesetResolver")?this.updateStatus("❌ MediaPipe Tasks Vision failed to load. Please check your internet connection.","status warning"):e.message.includes("camera")&&this.updateStatus("❌ Camera access denied. Please allow camera permissions and refresh.","status warning"),e}}async detectHands(){if(!this.videoElement.videoWidth||!this.videoElement.videoHeight)return;const e=performance.now(),t=this.handLandmarker.detectForVideo(this.videoElement,e);this.onResults(t)}onResults(e){if(this.performanceMonitor.recordFrame(),this.canvasCtx.save(),this.canvasCtx.clearRect(0,0,this.canvasElement.width,this.canvasElement.height),e.landmarks&&e.landmarks.length>0){const t=e.landmarks[0];if(!t||!Array.isArray(t)||t.length<21){console.warn("Invalid landmarks received:",t),this.updateStatus("⚠️ Invalid hand data received","status warning"),this.canvasCtx.restore();return}const n=this.calculateHandCenter(t),s=this.isHandStable(n);this.drawHandVisualization(t),this.debugMode&&this.visualizeDebugInfo(t),this.detectionEnabled&&s&&this.detectAndProcessGestures(t),this.displayPerformanceInfo(s)}else this.updateStatus("👋 Show your hand to the camera","status"),this.currentActiveGesture=null;this.canvasCtx.restore()}drawHandVisualization(e){try{this.drawingUtils?(this.drawingUtils.drawConnectors(e,D.HAND_CONNECTIONS,{color:"#00FF00",lineWidth:2}),this.drawingUtils.drawLandmarks(e,{color:"#FF0000",lineWidth:1,radius:3})):(console.warn("Drawing utilities not available, using fallback"),this.drawHandLandmarksFallback(e))}catch(t){console.warn("Error drawing with MediaPipe utilities:",t),this.drawHandLandmarksFallback(e)}}drawHandLandmarksFallback(e){this.canvasCtx.fillStyle="#FF0000",e.forEach(t=>{this.canvasCtx.beginPath(),this.canvasCtx.arc(t.x*this.canvasElement.width,t.y*this.canvasElement.height,3,0,2*Math.PI),this.canvasCtx.fill()})}setupEventListeners(){document.getElementById("clear-btn")?.addEventListener("click",()=>{this.textOutput.textContent=""}),document.getElementById("space-btn")?.addEventListener("click",()=>{this.textOutput.textContent+=" "}),document.getElementById("backspace-btn")?.addEventListener("click",()=>{this.textOutput.textContent=this.textOutput.textContent.slice(0,-1)}),this.createAdvancedControls()}createAdvancedControls(){const e=document.querySelector(".controls"),t=document.createElement("button");t.id="toggle-btn",t.textContent="⏸️ Pause Detection",t.addEventListener("click",()=>this.toggleDetection()),e.appendChild(t);const n=document.createElement("div");n.style.cssText="margin: 10px 0; text-align: center; width: 100%;",n.innerHTML=`
            <label for="sensitivity-slider" style="display: block; margin-bottom: 5px; font-weight: 500;">
                Touch Sensitivity: <span id="sensitivity-value">${this.config.touchDistance.toFixed(3)}</span>
            </label>
            <input type="range" id="sensitivity-slider" 
                   min="0.01" max="0.15" step="0.01" 
                   value="${this.config.touchDistance}" 
                   style="width: 80%; margin: 0 auto;">
        `,e.appendChild(n);const s=document.getElementById("sensitivity-slider"),o=document.getElementById("sensitivity-value");s.addEventListener("input",d=>{this.config.touchDistance=parseFloat(d.target.value),this.gestureDetector.updateConfig(this.config),o.textContent=this.config.touchDistance.toFixed(3),this.updateStatus(`Sensitivity: ${this.config.touchDistance.toFixed(3)}`,"status")});const r=document.createElement("button");r.id="debug-btn",r.textContent=this.debugMode?"🐛 Debug: ON":"🐛 Debug: OFF",r.style.backgroundColor=this.debugMode?"#27ae60":"#e74c3c",r.addEventListener("click",()=>this.toggleDebugMode()),r.addEventListener("dblclick",()=>{console.log("🔍 Running gesture mapping debug..."),M(()=>Promise.resolve().then(()=>P),void 0).then(d=>{d.debugGestureMapping&&d.debugGestureMapping()})}),e.appendChild(r);const a=document.createElement("div");a.style.position="relative",a.style.display="inline-block";const c=document.createElement("button");c.id="snapshot-btn",c.textContent="📸 Snapshot",c.style.backgroundColor="#9b59b6",c.addEventListener("click",()=>this.takeSnapshot()),c.addEventListener("contextmenu",d=>{d.preventDefault(),this.showSnapshotMenu(d)}),a.appendChild(c),e.appendChild(a)}showSnapshotMenu(e){const t=document.createElement("div");t.style.cssText=`
            position: fixed;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 10000;
            min-width: 150px;
        `;const n=document.createElement("div");n.textContent="🎯 With Overlay",n.style.cssText="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;",n.addEventListener("click",()=>{this.takeSnapshot(),document.body.removeChild(t)});const s=document.createElement("div");s.textContent="📹 Video Only",s.style.cssText="padding: 10px; cursor: pointer;",s.addEventListener("click",()=>{this.snapshotManager.takeVideoOnlySnapshot(),document.body.removeChild(t)}),[n,s].forEach(o=>{o.addEventListener("mouseenter",()=>{o.style.backgroundColor="#f0f0f0"}),o.addEventListener("mouseleave",()=>{o.style.backgroundColor="white"})}),t.appendChild(n),t.appendChild(s),document.body.appendChild(t),setTimeout(()=>{const o=r=>{t.contains(r.target)||(document.body.removeChild(t),document.removeEventListener("click",o))};document.addEventListener("click",o)},100)}initKeyMap(){Object.entries(f.ALL_GESTURES).forEach(([e,t])=>{const[n,s]=e.split("_"),o=Object.keys(f.FINGER_TIPS).find(c=>f.FINGER_TIPS[c]==n),r=Object.keys(f.KNUCKLES).find(c=>f.KNUCKLES[c]==s),a=document.createElement("div");a.className="key-map-item",a.innerHTML=`
                <span>${t}</span>
                <div>
                    <strong>${o?.replace("_"," ")}</strong> tip → 
                    <strong>${r?.replace(/_/g," ")}</strong>
                </div>
            `,this.keyMapGrid.appendChild(a)})}visualizeDebugInfo(e){const t=this.gestureDetector.getDebugInfo(e);t.closePairs.forEach(n=>{this.drawDistanceLine(n)}),this.updateDebugDisplay(t)}drawDistanceLine(e){const{fingerTip:t,knuckle:n,distance:s,isActive:o,letter:r}=e,a=t.x*this.canvasElement.width,c=t.y*this.canvasElement.height,d=n.x*this.canvasElement.width,u=n.y*this.canvasElement.height,m=s/this.config.touchDistance,p=o?"#00FF00":`rgb(${Math.min(255,100+m*155)}, ${Math.max(0,255-m*255)}, 0)`;if(this.canvasCtx.strokeStyle=p,this.canvasCtx.lineWidth=o?3:1,this.canvasCtx.beginPath(),this.canvasCtx.moveTo(a,c),this.canvasCtx.lineTo(d,u),this.canvasCtx.stroke(),o){const g=(a+d)/2,v=(c+u)/2;this.canvasCtx.fillStyle="rgba(255, 255, 255, 0.9)",this.canvasCtx.fillRect(g-20,v-15,40,30),this.canvasCtx.fillStyle="black",this.canvasCtx.font="12px Arial",this.canvasCtx.textAlign="center",this.canvasCtx.fillText(r,g,v+5),this.canvasCtx.textAlign="left"}}async detectAndProcessGestures(e){const t=Date.now();(!this.lastDebugTime||t-this.lastDebugTime>1e3)&&(this.lastDebugTime=t,console.log("🔍 Running gesture detection with enhanced debugging..."));try{const n=await this.gestureDetector.detectGestures(e);n&&n.gesture&&n.gesture!==this.currentActiveGesture?(console.log(`🎯 Processing new gesture: ${n.gesture} = "${n.letter}"`),this.processNewGesture(n)):n&&!n.gesture&&this.currentActiveGesture&&(console.log("🔄 Clearing current active gesture"),this.currentActiveGesture=null),this.currentTouches=n?n.touches:new Set}catch(n){console.error("Error in gesture detection:",n)}}processNewGesture(e){const{gesture:t,letter:n,distance:s,fingerName:o,knuckleName:r}=e;this.addLetter(n),this.updateStatus(`✋ ${o} → ${r} = "${n}" (${s.toFixed(3)})`,"status success"),this.flashGestureDetection(),this.currentActiveGesture=t,this.lastDetectedGestures[t]=Date.now()}calculateHandCenter(e){if(!e||!Array.isArray(e)||e.length<21)return console.warn("Invalid landmarks array:",e),{x:0,y:0,z:0};const t=e[0],n=e[f.KNUCKLES.MIDDLE_MCP];return!t||!n||typeof t.x!="number"||typeof n.x!="number"?(console.warn("Invalid landmark structure:",{wrist:t,middleMCP:n}),{x:0,y:0,z:0}):{x:(t.x+n.x)/2,y:(t.y+n.y)/2,z:(t.z+n.z)/2}}isHandStable(e){if(!this.previousHandPosition)return this.previousHandPosition=e,!0;const t=Math.sqrt(Math.pow(e.x-this.previousHandPosition.x,2)+Math.pow(e.y-this.previousHandPosition.y,2)+Math.pow(e.z-this.previousHandPosition.z,2));return this.previousHandPosition=e,t<this.config.handSpeedThreshold}displayPerformanceInfo(e){const t=this.performanceMonitor.getFPS();this.canvasCtx.fillStyle="rgba(0, 0, 0, 0.7)",this.canvasCtx.fillRect(10,10,220,50),this.canvasCtx.font="12px Arial",this.canvasCtx.fillStyle="white",this.canvasCtx.fillText(`FPS: ${t}`,15,25),this.canvasCtx.fillText(`Hand: ${e?"✅ Stable":"⚠️ Moving"}`,15,40),this.canvasCtx.fillText(`Active: ${this.currentActiveGesture||"none"}`,15,55)}updateDebugDisplay(e){let t=document.getElementById("debug-info");if(t||(t=document.createElement("div"),t.id="debug-info",t.style.cssText=`
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 10px;
                margin: 10px 0;
                font-family: monospace;
                font-size: 12px;
                white-space: pre-wrap;
            `,document.querySelector(".container").insertBefore(t,this.keyMapGrid.parentElement)),e.closePairs.length===0){t.textContent="Debug Info: No mapped gestures within detection range";return}const n=e.closePairs.slice(0,5).map(s=>`${s.fingerName} → ${s.knuckleName}: ${s.distance.toFixed(4)} = "${s.letter}" ${s.isActive?"✓ ACTIVE":""}`).join(`
`);t.textContent=`Debug Info (Mapped gestures only):
${n}`}flashGestureDetection(e="rgba(0, 255, 0, 0.3)"){const t=document.createElement("div");t.style.cssText=`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${e};
            pointer-events: none;
            z-index: 10;
            opacity: 0.7;
            transition: opacity 0.3s ease-out;
        `,document.querySelector(".video-container").appendChild(t),setTimeout(()=>{t.style.opacity="0",setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},300)},100)}addLetter(e){this.textOutput.textContent+=e,this.textOutput.scrollTop=this.textOutput.scrollHeight}updateStatus(e,t="status"){this.statusElement.textContent=e,this.statusElement.className=t}async checkLighting(){try{const e=document.createElement("canvas"),t=e.getContext("2d");e.width=50,e.height=50,t.drawImage(this.videoElement,0,0,50,50);const n=t.getImageData(0,0,50,50).data;let s=0;for(let r=0;r<n.length;r+=4)s+=(n[r]+n[r+1]+n[r+2])/3;s/(n.length/4)<50&&this.showLightingWarning()}catch(e){console.warn("Could not check lighting conditions:",e)}}showLightingWarning(){const e=document.createElement("div");e.style.cssText=`
            background: linear-gradient(45deg, #ffe082, #ffcc02);
            color: #5d4037;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            text-align: center;
            font-weight: 500;
            box-shadow: 0 2px 10px rgba(255, 204, 2, 0.3);
        `,e.innerHTML="💡 <strong>Low light detected!</strong> Hand detection works best in bright lighting conditions.",document.querySelector(".container").insertBefore(e,this.videoElement.parentElement),setTimeout(()=>{e.parentNode&&e.parentNode.removeChild(e)},1e4)}toggleDetection(){this.detectionEnabled=!this.detectionEnabled;const e=document.getElementById("toggle-btn");e&&(e.textContent=this.detectionEnabled?"⏸️ Pause Detection":"▶️ Resume Detection",e.style.backgroundColor=this.detectionEnabled?"#e74c3c":"#27ae60"),this.updateStatus(this.detectionEnabled?"✅ Detection enabled":"⏸️ Detection paused",this.detectionEnabled?"status success":"status warning")}toggleDebugMode(){this.debugMode=!this.debugMode;const e=document.getElementById("debug-btn");if(e&&(e.textContent=this.debugMode?"🐛 Debug: ON":"🐛 Debug: OFF",e.style.backgroundColor=this.debugMode?"#27ae60":"#e74c3c"),!this.debugMode){const t=document.getElementById("debug-info");t&&t.remove()}this.updateStatus(`Debug mode ${this.debugMode?"enabled":"disabled"}`,"status")}takeSnapshot(){console.log("🖱️ Snapshot button clicked");try{this.snapshotManager.takeSnapshot()}catch(e){console.error("🖱️ Error in takeSnapshot method:",e),this.updateStatus(`Snapshot failed: ${e.message}`,"status warning")}}pauseDetection(){this.detectionEnabled&&(this.detectionEnabled=!1,this.updateStatus("⏸️ Detection paused (page not visible)","status warning"))}resumeDetection(){this.detectionEnabled||(this.detectionEnabled=!0,this.updateStatus("▶️ Detection resumed","status success"))}destroy(){this.camera&&this.camera.stop(),this.handLandmarker&&this.handLandmarker.close(),this.performanceMonitor.stop(),window.removeEventListener("beforeunload",this.destroy.bind(this))}}function O(){const i=document.getElementById("status");i&&(i.textContent="🚀 Initializing Hand Gesture Typing System...",i.className="status")}async function z(){const i=[];let e=!0;try{(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)&&(i.push("Camera access not supported"),e=!1);const t=document.createElement("canvas");t.getContext("webgl")||t.getContext("experimental-webgl")||i.push("WebGL not supported - performance may be degraded"),typeof Worker>"u"&&i.push("Web Workers not supported - will use main thread processing");try{const a=await K();!a.granted&&a.state==="denied"&&(i.push("Camera permissions denied"),e=!1)}catch(a){console.warn("Could not check camera permissions:",a)}const s=V();s.isUnsupported&&i.push(`Browser may not be fully supported: ${s.name}`),(await j()).isLowEnd&&i.push("Low-end device detected - consider reducing video quality"),(await W()).isOnline||(i.push("No internet connection - MediaPipe models may not load"),e=!1)}catch(t){console.error("System compatibility check failed:",t),i.push("System compatibility check failed")}return{isCompatible:e,issues:i,recommendations:q(i)}}async function K(){try{if(navigator.permissions){const i=await navigator.permissions.query({name:"camera"});return{state:i.state,granted:i.state==="granted"}}return{state:"unknown",granted:!1}}catch{return{state:"unknown",granted:!1}}}function V(){const i=navigator.userAgent.toLowerCase();let e="Unknown",t=!1;i.includes("chrome")?e="Chrome":i.includes("firefox")?e="Firefox":i.includes("safari")?e="Safari":i.includes("edge")?e="Edge":(e="Unknown Browser",t=!0);const n=/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(i);return n&&(e+=" (Mobile)",t=!0),{name:e,isUnsupported:t,isMobile:n}}async function j(){let i=!1;try{(navigator.hardwareConcurrency||1)<4&&(i=!0),navigator.deviceMemory&&navigator.deviceMemory<4&&(i=!0);const t=performance.now();for(let s=0;s<1e5;s++)Math.random();performance.now()-t>10&&(i=!0)}catch(e){console.warn("Performance check failed:",e)}return{isLowEnd:i}}async function W(){try{if(navigator.onLine)try{const e=new AbortController,t=setTimeout(()=>e.abort(),5e3);return await fetch("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",{method:"HEAD",signal:e.signal}),clearTimeout(t),{isOnline:!0,canReachCDN:!0}}catch{return{isOnline:!0,canReachCDN:!1}}return{isOnline:!1,canReachCDN:!1}}catch{return{isOnline:!1,canReachCDN:!1}}}function q(i){const e=[];return i.some(t=>t.includes("Camera access"))&&(e.push("Enable camera permissions in browser settings"),e.push("Make sure no other applications are using the camera")),i.some(t=>t.includes("WebGL"))&&(e.push("Update your graphics drivers"),e.push("Try using a different browser")),i.some(t=>t.includes("Low-end device"))&&(e.push("Close other browser tabs and applications"),e.push("Consider using a more powerful device"),e.push("Reduce video resolution in settings")),i.some(t=>t.includes("internet connection"))&&(e.push("Check your internet connection"),e.push("Try refreshing the page once connected")),i.some(t=>t.includes("Browser may not be fully supported"))&&(e.push("Use Chrome, Firefox, or Edge for best compatibility"),e.push("Update your browser to the latest version")),e.length===0&&e.push("System appears to be compatible!"),e}async function Y(){try{O();const i=await z();if(!i.isCompatible){const t=document.getElementById("status");t.textContent=`System compatibility issues: ${i.issues.join(", ")}`,t.className="status warning",console.warn("System compatibility issues detected:",i.issues)}const e=new A;await e.init(),window.handGestureApp=e,X(e),console.log("✅ Hand Gesture Typing System initialized successfully")}catch(i){console.error("❌ Failed to initialize application:",i);const e=document.getElementById("status");e.textContent=`Initialization failed: ${i.message}`,e.className="status warning"}}function X(i){document.addEventListener("keydown",e=>{if(document.activeElement!==i.textOutput)switch(e.code){case"Space":i.textOutput.textContent+=" ",e.preventDefault();break;case"Backspace":i.textOutput.textContent=i.textOutput.textContent.slice(0,-1),e.preventDefault();break;case"Escape":i.toggleDetection(),e.preventDefault();break;case"KeyD":(e.ctrlKey||e.metaKey)&&(i.toggleDebugMode(),e.preventDefault());break;case"KeyS":(e.ctrlKey||e.metaKey)&&(i.takeSnapshot(),e.preventDefault());break}}),J()}function J(){const i=document.createElement("div");i.style.cssText=`
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
    `,i.innerHTML=`
        <strong>⌨️ Keyboard Shortcuts</strong><br>
        <kbd>Space</kbd> - Add space<br>
        <kbd>Backspace</kbd> - Delete character<br>
        <kbd>Esc</kbd> - Toggle detection<br>
        <kbd>Ctrl/Cmd + D</kbd> - Toggle debug<br>
        <kbd>Ctrl/Cmd + S</kbd> - Take snapshot
    `,i.addEventListener("mouseenter",()=>{i.style.opacity="1"}),i.addEventListener("mouseleave",()=>{i.style.opacity="0.7"}),document.body.appendChild(i)}document.addEventListener("DOMContentLoaded",Y);document.addEventListener("visibilitychange",()=>{window.handGestureApp&&(document.hidden?window.handGestureApp.pauseDetection():window.handGestureApp.resumeDetection())});window.addEventListener("error",i=>{if(console.error("Global error:",i.error),window.handGestureApp){const e=document.getElementById("status");e.textContent=`Runtime error: ${i.error.message}`,e.className="status warning"}});window.addEventListener("unhandledrejection",i=>{if(console.error("Unhandled promise rejection:",i.reason),window.handGestureApp){const e=document.getElementById("status");e.textContent=`Promise rejection: ${i.reason}`,e.className="status warning"}});
//# sourceMappingURL=index-Ds3uh1gf.js.map
