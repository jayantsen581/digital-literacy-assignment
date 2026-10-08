/**
 * ============================================================================
 * JAYANT SEN - PORTFOLIO INTERACTIVE CORE
 * 3D WebGL Motion Graphics, Cinematic Scrolling, Interactive CLI & Audio Engine
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. DYNAMIC YEAR & AMBIENT CURSOR GLOW
  // ==========================================================================
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        cursorGlow.style.opacity = '1';
        isVisible = true;
      }
    });

    window.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
      isVisible = false;
    });

    const animateCursor = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();
  }

  // ==========================================================================
  // 2. WEB AUDIO API - FUTURISTIC SCI-FI AUDIO SYNTHESIZER
  // ==========================================================================
  let audioCtx = null;
  let isSoundEnabled = false;

  const initAudio = () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const playTone = (freq, type = 'sine', duration = 0.08, gainVal = 0.04) => {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio error suppressed gracefully
    }
  };

  const playChime = () => {
    if (!isSoundEnabled) return;
    playTone(520, 'sine', 0.1, 0.05);
    setTimeout(() => playTone(780, 'sine', 0.14, 0.04), 60);
  };

  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    const soundOnIcon = soundToggle.querySelector('.sound-icon-on');
    const soundOffIcon = soundToggle.querySelector('.sound-icon-off');
    const soundLabel = soundToggle.querySelector('.sound-label');

    soundToggle.addEventListener('click', () => {
      initAudio();
      isSoundEnabled = !isSoundEnabled;
      soundToggle.classList.toggle('active', isSoundEnabled);

      if (isSoundEnabled) {
        if (soundOnIcon) soundOnIcon.style.display = 'block';
        if (soundOffIcon) soundOffIcon.style.display = 'none';
        if (soundLabel) soundLabel.textContent = 'SFX: ON';
        playChime();
        showToast('Futuristic Audio FX Enabled');
      } else {
        if (soundOnIcon) soundOnIcon.style.display = 'none';
        if (soundOffIcon) soundOffIcon.style.display = 'block';
        if (soundLabel) soundLabel.textContent = 'SFX: OFF';
        showToast('Audio FX Muted');
      }
    });
  }

  // ==========================================================================
  // 3. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout;

  const showToast = (message, duration = 3000) => {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // ==========================================================================
  // 4. FULLSCREEN 3D WEBGL BACKGROUND MOTION ENGINE (Three.js)
  // ==========================================================================
  const bgCanvas = document.getElementById('bg-3d-canvas');
  let bgScene, bgCamera, bgRenderer, bgParticles, bgLinesMesh, bgFloatingMeshes = [];
  let mouseNormX = 0, mouseNormY = 0;

  if (bgCanvas && window.THREE) {
    try {
      bgScene = new THREE.Scene();
      bgCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
      bgCamera.position.z = 1000;

      bgRenderer = new THREE.WebGLRenderer({
        canvas: bgCanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      bgRenderer.setSize(window.innerWidth, window.innerHeight);
      bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 1. Particle Constellation
      const particleCount = 450;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorCyan = new THREE.Color(0x00f2fe);
      const colorPurple = new THREE.Color(0x8b5cf6);
      const colorWhite = new THREE.Color(0xffffff);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

        const mix = Math.random();
        const col = mix < 0.45 ? colorCyan : (mix < 0.85 ? colorPurple : colorWhite);
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Circular particle texture generator
      const getParticleTexture = () => {
        const c = document.createElement('canvas');
        c.width = 32;
        c.height = 32;
        const ctx = c.getContext('2d');
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.3, 'rgba(0,242,254,0.8)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
        return new THREE.CanvasTexture(c);
      };

      const particleMat = new THREE.PointsMaterial({
        size: 7,
        vertexColors: true,
        map: getParticleTexture(),
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      bgParticles = new THREE.Points(particleGeo, particleMat);
      bgScene.add(bgParticles);

      // 2. Floating 3D Geometric Meshes
      const wireframeMatCyan = new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        wireframe: true,
        transparent: true,
        opacity: 0.18
      });
      const wireframeMatPurple = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.16
      });

      // Mesh 1: Icosahedron
      const icosa = new THREE.Mesh(new THREE.IcosahedronGeometry(110, 1), wireframeMatCyan);
      icosa.position.set(-500, 250, -400);
      bgScene.add(icosa);
      bgFloatingMeshes.push({ mesh: icosa, rx: 0.003, ry: 0.005 });

      // Mesh 2: Torus Knot
      const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(90, 24, 64, 8), wireframeMatPurple);
      torus.position.set(550, -280, -350);
      bgScene.add(torus);
      bgFloatingMeshes.push({ mesh: torus, rx: -0.004, ry: 0.003 });

      // Mesh 3: Octahedron
      const octa = new THREE.Mesh(new THREE.OctahedronGeometry(100, 0), wireframeMatCyan);
      octa.position.set(400, 380, -500);
      bgScene.add(octa);
      bgFloatingMeshes.push({ mesh: octa, rx: 0.005, ry: -0.004 });

      // Mesh 4: Dodecahedron
      const dodeca = new THREE.Mesh(new THREE.DodecahedronGeometry(85, 0), wireframeMatPurple);
      dodeca.position.set(-450, -350, -450);
      bgScene.add(dodeca);
      bgFloatingMeshes.push({ mesh: dodeca, rx: 0.002, ry: 0.006 });

      // Mouse Parallax listener
      window.addEventListener('mousemove', (e) => {
        mouseNormX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseNormY = -(e.clientY / window.innerHeight) * 2 + 1;
      }, { passive: true });

      // Resize listener
      window.addEventListener('resize', () => {
        if (!bgRenderer || !bgCamera) return;
        bgCamera.aspect = window.innerWidth / window.innerHeight;
        bgCamera.updateProjectionMatrix();
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
      });

      // Background Animation Loop with Scroll-driven Camera Choreography
      let scrollYNorm = 0;
      const animateBg = () => {
        requestAnimationFrame(animateBg);

        const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
        scrollYNorm = window.scrollY / maxScroll;

        // Cinematic Camera Traveling across 3D coordinates on scroll
        const targetCamX = mouseNormX * 120 + Math.sin(scrollYNorm * Math.PI * 2) * 80;
        const targetCamY = mouseNormY * 90 - scrollYNorm * 400;
        const targetCamZ = 1000 - scrollYNorm * 350;

        bgCamera.position.x += (targetCamX - bgCamera.position.x) * 0.05;
        bgCamera.position.y += (targetCamY - bgCamera.position.y) * 0.05;
        bgCamera.position.z += (targetCamZ - bgCamera.position.z) * 0.05;
        bgCamera.lookAt(0, -scrollYNorm * 150, 0);

        // Rotate particles gently
        if (bgParticles) {
          bgParticles.rotation.y += 0.0006;
          bgParticles.rotation.x += 0.0003;
        }

        // Animate floating polyhedrons
        bgFloatingMeshes.forEach(item => {
          item.mesh.rotation.x += item.rx;
          item.mesh.rotation.y += item.ry;
        });

        bgRenderer.render(bgScene, bgCamera);
      };
      animateBg();

    } catch (err) {
      console.warn('Three.js background initialization error, fallback activated', err);
      initBg2DFallback();
    }
  } else if (bgCanvas) {
    initBg2DFallback();
  }

  function initBg2DFallback() {
    if (!bgCanvas) return;
    const ctx = bgCanvas.getContext('2d');
    if (!ctx) return;

    let w = bgCanvas.width = window.innerWidth;
    let h = bgCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      w = bgCanvas.width = window.innerWidth;
      h = bgCanvas.height = window.innerHeight;
    });

    const numPoints = Math.min(65, Math.floor(window.innerWidth / 20));
    const pts = [];
    for (let i = 0; i < numPoints; i++) {
      pts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 1,
        color: Math.random() > 0.5 ? 'rgba(0, 242, 254,' : 'rgba(139, 92, 246,'
      });
    }

    const render2DBg = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '0.7)';
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${(1 - dist / 115) * 0.18})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(render2DBg);
    };
    render2DBg();
  }

  // ==========================================================================
  // 5. HERO INTERACTIVE 3D HOLOGRAM CORE (Three.js Viewport)
  // ==========================================================================
  const hero3DCanvas = document.getElementById('hero-3d-canvas');
  const hero3DViewport = document.getElementById('hero3DViewport');
  const hero3dRotSpan = document.getElementById('hero3dRot');
  const hero3dVertsSpan = document.getElementById('hero3dVerts');
  const pulseEnergyBtn = document.getElementById('pulseEnergyBtn');

  if (hero3DCanvas && window.THREE) {
    let heroScene, heroCamera, heroRenderer;
    let coreGroup, currentMesh, ring1, ring2, orbitingPoints;
    let isDragging = false, prevMouseX = 0, prevMouseY = 0;
    let targetRotX = 0.3, targetRotY = 0.5;
    let curRotX = 0.3, curRotY = 0.5;
    let rotSpeedX = 0, rotSpeedY = 0;
    let currentGeoType = 'core';

    try {
      heroScene = new THREE.Scene();
      const rect = hero3DViewport ? hero3DViewport.getBoundingClientRect() : { width: 480, height: 350 };
      heroCamera = new THREE.PerspectiveCamera(45, (rect.width || 480) / (rect.height || 350), 0.1, 1000);
      heroCamera.position.z = 18;

      heroRenderer = new THREE.WebGLRenderer({
        canvas: hero3DCanvas,
        alpha: true,
        antialias: true
      });
      heroRenderer.setSize(rect.width || 480, rect.height || 350);
      heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Lighting
      const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
      heroScene.add(ambLight);

      const cyanPoint = new THREE.PointLight(0x00f2fe, 3, 40);
      cyanPoint.position.set(10, 10, 12);
      heroScene.add(cyanPoint);

      const purplePoint = new THREE.PointLight(0x8b5cf6, 3, 40);
      purplePoint.position.set(-10, -10, 12);
      heroScene.add(purplePoint);

      // Core Object Group
      coreGroup = new THREE.Group();
      heroScene.add(coreGroup);

      // Material Setup
      const wireMatCyan = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        emissive: 0x00f2fe,
        emissiveIntensity: 0.35,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8
      });

      const wireMatPurple = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        emissive: 0x8b5cf6,
        emissiveIntensity: 0.35,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8
      });

      // Rings
      const ringGeo1 = new THREE.TorusGeometry(6.2, 0.08, 16, 80);
      ring1 = new THREE.Mesh(ringGeo1, wireMatCyan);
      coreGroup.add(ring1);

      const ringGeo2 = new THREE.TorusGeometry(7.2, 0.08, 16, 80);
      ring2 = new THREE.Mesh(ringGeo2, wireMatPurple);
      ring2.rotation.x = Math.PI / 2.5;
      coreGroup.add(ring2);

      // Orbiting Sparkles
      const orbitCount = 120;
      const orbitGeo = new THREE.BufferGeometry();
      const orbitPos = new Float32Array(orbitCount * 3);
      for (let i = 0; i < orbitCount; i++) {
        const radius = 5 + Math.random() * 3.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        orbitPos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
        orbitPos[i * 3 + 1] = radius * Math.sin(phi);
        orbitPos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
      }
      orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPos, 3));
      const orbitMat = new THREE.PointsMaterial({
        color: 0x00f2fe,
        size: 0.2,
        transparent: true,
        opacity: 0.85
      });
      orbitingPoints = new THREE.Points(orbitGeo, orbitMat);
      coreGroup.add(orbitingPoints);

      // Function to build chosen geometry
      const buildGeometry = (type) => {
        if (currentMesh) {
          coreGroup.remove(currentMesh);
        }

        let geo;
        let vertexCount = '2,840 PTS';

        if (type === 'core') {
          geo = new THREE.IcosahedronGeometry(3.6, 2);
          currentMesh = new THREE.Mesh(geo, wireMatCyan);
          ring1.visible = true;
          ring2.visible = true;
          orbitingPoints.visible = true;
          vertexCount = '2,840 PTS';
        } else if (type === 'torus') {
          geo = new THREE.TorusKnotGeometry(3.2, 0.9, 80, 16);
          currentMesh = new THREE.Mesh(geo, wireMatPurple);
          ring1.visible = false;
          ring2.visible = false;
          orbitingPoints.visible = true;
          vertexCount = '4,620 PTS';
        } else if (type === 'icosa') {
          geo = new THREE.IcosahedronGeometry(4.2, 1);
          currentMesh = new THREE.Mesh(geo, wireMatCyan);
          ring1.visible = true;
          ring2.visible = false;
          orbitingPoints.visible = true;
          vertexCount = '1,920 PTS';
        } else if (type === 'matrix') {
          geo = new THREE.BoxGeometry(5.2, 5.2, 5.2, 4, 4, 4);
          currentMesh = new THREE.Mesh(geo, wireMatPurple);
          ring1.visible = true;
          ring2.visible = true;
          orbitingPoints.visible = true;
          vertexCount = '3,120 PTS';
        }

        coreGroup.add(currentMesh);
        if (hero3dVertsSpan) hero3dVertsSpan.textContent = vertexCount;
      };

      buildGeometry('core');

      // Drag to rotate handlers (Mouse & Touch)
      const onPointerDown = (clientX, clientY) => {
        isDragging = true;
        prevMouseX = clientX;
        prevMouseY = clientY;
      };

      const onPointerMove = (clientX, clientY) => {
        if (!isDragging) return;
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        prevMouseX = clientX;
        prevMouseY = clientY;

        rotSpeedY = deltaX * 0.007;
        rotSpeedX = deltaY * 0.007;
        targetRotY += rotSpeedY;
        targetRotX += rotSpeedX;
      };

      const onPointerUp = () => {
        isDragging = false;
      };

      if (hero3DViewport) {
        hero3DViewport.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', onPointerUp);

        hero3DViewport.addEventListener('touchstart', (e) => {
          if (e.touches.length > 0) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        window.addEventListener('touchmove', (e) => {
          if (e.touches.length > 0) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        window.addEventListener('touchend', onPointerUp);

        // Zoom on wheel over canvas
        hero3DViewport.addEventListener('wheel', (e) => {
          e.preventDefault();
          heroCamera.position.z += e.deltaY * 0.015;
          heroCamera.position.z = Math.min(Math.max(heroCamera.position.z, 10), 26);
        }, { passive: false });
      }

      // Geo Buttons
      const geoButtons = document.querySelectorAll('.geo-btn');
      geoButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          geoButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const type = btn.getAttribute('data-geo');
          currentGeoType = type;
          buildGeometry(type);
          playTone(660, 'sine', 0.06);
        });
      });

      // Pulse Energy Button
      if (pulseEnergyBtn) {
        pulseEnergyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          playChime();

          let scale = 1;
          const origRing1Scale = ring1.scale.x;
          let pulseCount = 0;

          const pulseStep = () => {
            pulseCount++;
            const s = 1 + Math.sin(pulseCount * 0.25) * 0.45;
            coreGroup.scale.set(s, s, s);
            cyanPoint.intensity = 3 + Math.sin(pulseCount * 0.25) * 8;

            if (pulseCount < 24) {
              requestAnimationFrame(pulseStep);
            } else {
              coreGroup.scale.set(1, 1, 1);
              cyanPoint.intensity = 3;
            }
          };
          pulseStep();
          showToast('⚡ Quantum energy pulse unleashed!');
        });
      }

      // Render Loop for Hero 3D Viewport
      const animateHero3D = () => {
        requestAnimationFrame(animateHero3D);

        // Momentum and auto rotation
        if (!isDragging) {
          targetRotY += 0.008;
          rotSpeedX *= 0.94;
          rotSpeedY *= 0.94;
          targetRotX += rotSpeedX;
          targetRotY += rotSpeedY;
        }

        curRotX += (targetRotX - curRotX) * 0.08;
        curRotY += (targetRotY - curRotY) * 0.08;

        coreGroup.rotation.x = curRotX;
        coreGroup.rotation.y = curRotY;

        // Individual ring rotations
        if (ring1) ring1.rotation.z += 0.015;
        if (ring2) ring2.rotation.z -= 0.018;
        if (orbitingPoints) orbitingPoints.rotation.y += 0.006;

        // Update telemetry HUD
        if (hero3dRotSpan) {
          const degX = Math.round(((curRotX % (Math.PI * 2)) * 180 / Math.PI + 360) % 360);
          const degY = Math.round(((curRotY % (Math.PI * 2)) * 180 / Math.PI + 360) % 360);
          hero3dRotSpan.textContent = `X: ${degX}° Y: ${degY}°`;
        }

        heroRenderer.render(heroScene, heroCamera);
      };
      animateHero3D();

      // Viewport Resize
      const resizeHero3D = () => {
        if (!hero3DViewport || !heroCamera || !heroRenderer) return;
        const width = hero3DViewport.clientWidth;
        const height = hero3DViewport.clientHeight;
        if (width > 0 && height > 0) {
          heroCamera.aspect = width / height;
          heroCamera.updateProjectionMatrix();
          heroRenderer.setSize(width, height);
        }
      };
      window.addEventListener('resize', resizeHero3D);

    } catch (err) {
      console.warn('Hero 3D core error', err);
      initHero2DFallback();
    }
  } else if (hero3DCanvas) {
    initHero2DFallback();
  }

  function initHero2DFallback() {
    if (!hero3DCanvas || !hero3DViewport) return;
    const ctx = hero3DCanvas.getContext('2d');
    if (!ctx) return;

    let rect = hero3DViewport.getBoundingClientRect();
    let cw = hero3DCanvas.width = rect.width || 480;
    let ch = hero3DCanvas.height = rect.height || 350;

    window.addEventListener('resize', () => {
      rect = hero3DViewport.getBoundingClientRect();
      cw = hero3DCanvas.width = rect.width || 480;
      ch = hero3DCanvas.height = rect.height || 350;
    });

    let rotX = 0.35, rotY = 0.45;
    let isDragging = false, lastX = 0, lastY = 0;
    let scalePulse = 1;
    let currentShape = 'core';

    const getModel = (type) => {
      if (type === 'matrix') {
        const v = [
          [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
          [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
        ].map(p => p.map(c => c * 55));
        const e = [
          [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];
        return { verts: v, edges: e, label: '3,120 PTS' };
      }
      const phi = (1 + Math.sqrt(5)) / 2;
      const raw = [
        [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
        [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
        [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
      ];
      const factor = type === 'torus' ? 42 : 50;
      const v = raw.map(p => p.map(c => c * factor));
      const e = [
        [0,11],[0,5],[0,1],[0,7],[0,10],[1,5],[1,9],[1,8],[1,7],
        [2,11],[2,4],[2,6],[2,10],[3,9],[3,4],[3,6],[3,8],[4,5],
        [4,9],[4,11],[5,9],[6,7],[6,8],[6,10],[7,8],[8,9],[10,11]
      ];
      return { verts: v, edges: e, label: type === 'torus' ? '4,620 PTS' : (type === 'icosa' ? '1,920 PTS' : '2,840 PTS') };
    };

    let model = getModel('core');

    const geoButtons = document.querySelectorAll('.geo-btn');
    geoButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        geoButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentShape = btn.getAttribute('data-geo') || 'core';
        model = getModel(currentShape);
        if (hero3dVertsSpan) hero3dVertsSpan.textContent = model.label;
        playTone(660, 'sine', 0.06);
      });
    });

    if (pulseEnergyBtn) {
      pulseEnergyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playChime();
        scalePulse = 1.6;
        showToast('⚡ Quantum energy pulse unleashed!');
      });
    }

    hero3DViewport.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      rotY += dx * 0.008;
      rotX += dy * 0.008;
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    const animate2DHero = () => {
      if (!isDragging) {
        rotY += 0.009;
        rotX += 0.003;
      }
      scalePulse += (1 - scalePulse) * 0.08;

      ctx.clearRect(0, 0, cw, ch);

      const cx = cw / 2;
      const cy = ch / 2;
      const fov = 280;

      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      const proj = model.verts.map(([vx, vy, vz]) => {
        const sx = vx * scalePulse;
        const sy = vy * scalePulse;
        const sz = vz * scalePulse;
        const x1 = sx * cosY + sz * sinY;
        const z1 = -sx * sinY + sz * cosY;
        const y2 = sy * cosX - z1 * sinX;
        const z2 = sy * sinX + z1 * cosX;
        const scale = fov / (fov + z2 + 180);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          scale
        };
      });

      ctx.lineWidth = 1.5;
      model.edges.forEach(([i, j]) => {
        if (!proj[i] || !proj[j]) return;
        ctx.beginPath();
        ctx.moveTo(proj[i].x, proj[i].y);
        ctx.lineTo(proj[j].x, proj[j].y);
        ctx.strokeStyle = currentShape === 'torus' || currentShape === 'matrix' ? 'rgba(168, 85, 247, 0.65)' : 'rgba(0, 242, 254, 0.75)';
        ctx.stroke();
      });

      proj.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (hero3dRotSpan) {
        const degX = Math.round(((rotX % (Math.PI * 2)) * 180 / Math.PI + 360) % 360);
        const degY = Math.round(((rotY % (Math.PI * 2)) * 180 / Math.PI + 360) % 360);
        hero3dRotSpan.textContent = `X: ${degX}° Y: ${degY}°`;
      }

      requestAnimationFrame(animate2DHero);
    };
    animate2DHero();
  }

  // ==========================================================================
  // 6. HERO MULTI-TAB SWITCHER (3D Core vs C Code vs Dev CLI)
  // ==========================================================================
  const heroTabBtns = document.querySelectorAll('.hero-tab-btn');
  const heroPanes = {
    '3d': document.getElementById('pane-3d'),
    'code': document.getElementById('pane-code'),
    'cli': document.getElementById('pane-cli')
  };

  heroTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      heroTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      Object.keys(heroPanes).forEach(key => {
        if (heroPanes[key]) {
          heroPanes[key].classList.remove('active');
        }
      });

      if (heroPanes[targetTab]) {
        heroPanes[targetTab].classList.add('active');
      }

      playTone(580, 'sine', 0.05);

      // Trigger resize on 3D or focus CLI input
      if (targetTab === '3d') {
        window.dispatchEvent(new Event('resize'));
      } else if (targetTab === 'cli') {
        const cliInput = document.getElementById('cliInput');
        if (cliInput) setTimeout(() => cliInput.focus(), 150);
      }
    });
  });

  // ==========================================================================
  // 7. INTERACTIVE DEV CLI (TERMINAL) & MATRIX RAIN EASTER EGG
  // ==========================================================================
  const cliForm = document.getElementById('cliForm');
  const cliInput = document.getElementById('cliInput');
  const cliOutput = document.getElementById('cliOutput');
  const matrixCanvas = document.getElementById('matrixCanvas');
  let isMatrixRunning = false;
  let matrixInterval = null;
  const commandHistory = [];
  let historyIndex = -1;

  const cliCommands = {
    help: () => `
      <div class="cli-system-resp">
        <strong>Available Dev Commands:</strong><br>
        &bull; <span class="cli-cmd-highlight">about</span>      - Jayant's background & university profile<br>
        &bull; <span class="cli-cmd-highlight">skills</span>     - Core technical skill proficiencies<br>
        &bull; <span class="cli-cmd-highlight">projects</span>   - Highlighted student projects<br>
        &bull; <span class="cli-cmd-highlight">education</span>  - JECRC University B.Tech CSE details<br>
        &bull; <span class="cli-cmd-highlight">goals</span>      - Undergraduate engineering roadmap<br>
        &bull; <span class="cli-cmd-highlight">contact</span>    - Reach out via Email, LinkedIn, GitHub<br>
        &bull; <span class="cli-cmd-highlight">matrix</span>     - Toggle green digital code rain mode<br>
        &bull; <span class="cli-cmd-highlight">whoami</span>     - Check current session identity<br>
        &bull; <span class="cli-cmd-highlight">clear</span>      - Clean up terminal output screen
      </div>`,
    about: () => `
      <div class="cli-system-resp">
        <strong>Jayant Sen &bull; 1st Year B.Tech CSE</strong><br>
        Passionate freshman undergraduate at JECRC University, Jaipur, Rajasthan.<br>
        Focus: C programming foundations, front-end web engineering, AI concepts & prompt design.
      </div>`,
    skills: () => `
      <div class="cli-system-resp">
        <strong>Technical Proficiency Matrix:</strong><br>
        [C Programming]      [##########] 80% (Pointers, Memory, Data Structures)<br>
        [HTML5 / CSS3]       [##########] 85% (Semantic UI, Flexbox, 3D CSS)<br>
        [JavaScript ES6+]    [########..] 75% (DOM, Async/Await, Events)<br>
        [AI & Prompt Eng.]   [########..] 75% (CoT, Context Structuring, LLM APIs)
      </div>`,
    projects: () => `
      <div class="cli-system-resp">
        <strong>Featured Projects:</strong><br>
        1. <em>Campus Lost & Found</em> - Categorized location-based item recovery portal.<br>
        2. <em>Campus Wi-Fi Problem Reporter</em> - Student network dead-zone diagnostic logger.<br>
        3. <em>Developer Portfolio</em> - Modern 3D WebGL developer showcase.
      </div>`,
    education: () => `
      <div class="cli-system-resp">
        <strong>Degree:</strong> Bachelor of Technology (B.Tech) in Computer Science & Engineering<br>
        <strong>Institution:</strong> JECRC University, Jaipur, Rajasthan, India<br>
        <strong>Status:</strong> 1st Year Student (2026 – Present)
      </div>`,
    goals: () => `
      <div class="cli-system-resp">
        &bull; Master memory architectures & Data Structures & Algorithms (DSA).<br>
        &bull; Deploy real campus utility tools for university peers.<br>
        &bull; Build practical AI-assisted developer applications.
      </div>`,
    contact: () => `
      <div class="cli-system-resp">
        Email:    <a href="mailto:jayantsen.dev@gmail.com" class="cli-cmd-highlight">jayantsen.dev@gmail.com</a><br>
        LinkedIn: linkedin.com/in/jayant-sen<br>
        GitHub:   github.com/jayant-sen
      </div>`,
    whoami: () => `<div class="cli-system-resp">visitor@jayant-portfolio [Welcome! You have guest inspection privileges.]</div>`,
    date: () => `<div class="cli-system-resp">${new Date().toLocaleString()} (IST)</div>`,
    sudo: () => `<div class="cli-error">sudo: Nice try! Administrator privileges reserved for Jayant.</div>`,
    clear: () => '__CLEAR__'
  };

  // Matrix Digital Rain Generator
  const toggleMatrixRain = () => {
    if (!matrixCanvas) return;
    isMatrixRunning = !isMatrixRunning;

    if (isMatrixRunning) {
      matrixCanvas.classList.add('active');
      const ctx = matrixCanvas.getContext('2d');
      matrixCanvas.width = matrixCanvas.parentElement.clientWidth;
      matrixCanvas.height = matrixCanvas.parentElement.clientHeight;

      const letters = '01JAYANT_SEN_BTECH_CSE_C_PROGRAMMING_MATRIX_AI_SYSTEMS';
      const fontSize = 14;
      const columns = Math.floor(matrixCanvas.width / fontSize);
      const drops = Array(columns).fill(1);

      matrixInterval = setInterval(() => {
        ctx.fillStyle = 'rgba(4, 7, 17, 0.1)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        ctx.fillStyle = '#00f2fe';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = letters.charAt(Math.floor(Math.random() * letters.length));
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }, 45);

      return '<div class="cli-cmd-highlight">Matrix code rain initiated! Type "matrix" again to exit.</div>';
    } else {
      matrixCanvas.classList.remove('active');
      clearInterval(matrixInterval);
      const ctx = matrixCanvas.getContext('2d');
      ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      return '<div class="cli-system-resp">Matrix rain terminated. Returning to standard shell.</div>';
    }
  };

  if (cliForm && cliInput && cliOutput) {
    cliForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawCmd = cliInput.value.trim();
      if (!rawCmd) return;

      commandHistory.push(rawCmd);
      historyIndex = commandHistory.length;

      const cmd = rawCmd.toLowerCase();
      cliInput.value = '';
      playTone(600, 'sine', 0.04);

      // Append user command line
      const userLine = document.createElement('div');
      userLine.className = 'cli-line';
      userLine.innerHTML = `<span class="cli-prompt">visitor@jayant:~$</span> <span class="cli-user-command">${rawCmd}</span>`;
      cliOutput.appendChild(userLine);

      // Execute command
      if (cmd === 'clear') {
        cliOutput.innerHTML = '';
      } else if (cmd === 'matrix') {
        const resp = toggleMatrixRain();
        const respLine = document.createElement('div');
        respLine.className = 'cli-line';
        respLine.innerHTML = resp;
        cliOutput.appendChild(respLine);
      } else if (cliCommands[cmd]) {
        const respHtml = cliCommands[cmd]();
        const respLine = document.createElement('div');
        respLine.className = 'cli-line';
        respLine.innerHTML = respHtml;
        cliOutput.appendChild(respLine);
      } else {
        const errorLine = document.createElement('div');
        errorLine.className = 'cli-line cli-error';
        errorLine.textContent = `command not found: "${rawCmd}". Type "help" for a list of available commands.`;
        cliOutput.appendChild(errorLine);
      }

      // Auto-scroll terminal
      cliOutput.scrollTop = cliOutput.scrollHeight;
    });

    // Arrow Up / Down command history
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          cliInput.value = commandHistory[historyIndex];
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          cliInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          cliInput.value = '';
        }
        e.preventDefault();
      }
    });
  }

  // ==========================================================================
  // 8. 3D CARD TILT & SPECULAR SHINE ENGINE
  // ==========================================================================
  const tiltCards = document.querySelectorAll(
    '.about-card, .skill-card, .project-card, .education-card, .goal-card, .hero-interactive-card, .channel-card'
  );

  if (window.matchMedia('(pointer: fine)').matches) {
    tiltCards.forEach(card => {
      card.classList.add('card-tilt-active');

      // Create glare overlay element if not present
      let glare = card.querySelector('.card-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
      }

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out';
      });

      card.addEventListener('mousemove', (e) => {
        card.style.transition = 'none';
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7.5;
        const rotateY = ((x - centerX) / centerX) * 7.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.018, 1.018, 1.018)`;

        // Position glare
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.14) 0%, transparent 60%)`;
        glare.style.opacity = '1';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        glare.style.opacity = '0';
      });
    });
  }

  // ==========================================================================
  // 9. TOP SCROLL PROGRESS BAR & CIRCULAR SCROLL-TO-TOP BUTTON
  // ==========================================================================
  const scrollProgressBar = document.getElementById('scrollProgress');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const progressIndicator = document.getElementById('progressIndicator');
  const circumference = 2 * Math.PI * 19; // r = 19 => ~119.38

  if (progressIndicator) {
    progressIndicator.style.strokeDasharray = `${circumference} ${circumference}`;
    progressIndicator.style.strokeDashoffset = circumference;
  }

  const updateScrollProgress = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) : 0;
    const progressPercent = Math.min(Math.max(progress * 100, 0), 100);

    // Update top linear progress bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progressPercent}%`;
    }

    // Update circular floating button
    if (scrollTopBtn && progressIndicator) {
      if (window.scrollY > 280) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }

      const offset = circumference - (progress * circumference);
      progressIndicator.style.strokeDashoffset = offset;
    }
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      playTone(550, 'sine', 0.08);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 10. FLOATING HUD SECTION NAVIGATION & NAVBAR SPY
  // ==========================================================================
  const hudDots = document.querySelectorAll('.hud-dot');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const navbar = document.getElementById('navbar');

  const updateActiveSection = () => {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    let currentSectionId = '';
    const scrollPosition = window.scrollY + 180;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      // Top nav links
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
      });
      // Drawer links
      drawerLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
      });
      // HUD Dots
      hudDots.forEach((dot) => {
        dot.classList.toggle('active', dot.getAttribute('data-section') === currentSectionId);
      });
    }
  };

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();

  // ==========================================================================
  // 11. PROJECT FILTERING SYSTEM
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      playTone(620, 'sine', 0.05);

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('filtered-out');
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });

  // ==========================================================================
  // 12. SKILL CODE SNIPPETS & MODAL CONTROLLER
  // ==========================================================================
  const skillSnippets = {
    c: {
      title: 'C Memory & Pointer Arithmetic',
      file: 'pointers_and_memory.c',
      code: `/* Jayant Sen - C Foundations: Pointer manipulation & allocation */
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

Node* createNode(int value) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    if (newNode == NULL) {
        fprintf(stderr, "Memory allocation error\\n");
        exit(1);
    }
    newNode->data = value;
    newNode->next = NULL;
    return newNode;
}

int main(void) {
    Node* head = createNode(42);
    head->next = createNode(99);
    
    printf("Head data: %d\\n", head->data);
    printf("Next data: %d\\n", head->next->data);
    
    free(head->next);
    free(head);
    return 0;
}`
    },
    html: {
      title: 'Accessible & Semantic HTML5 Architecture',
      file: 'semantic_layout.html',
      code: `<!-- Jayant Sen - Semantic & SEO-Optimized Layout -->
<header class="site-header" role="banner">
  <nav aria-label="Main Navigation">
    <ul class="nav-list">
      <li><a href="#projects" class="nav-anchor">Projects</a></li>
      <li><a href="#skills" class="nav-anchor">Skills</a></li>
    </ul>
  </nav>
</header>

<main id="main-content" role="main">
  <article class="featured-project" aria-labelledby="proj-title">
    <h2 id="proj-title">Campus Lost & Found</h2>
    <p>Empowering students to recover misplaced university items.</p>
  </article>
</main>`
    },
    css: {
      title: 'Modern CSS Glassmorphism & 3D Keyframes',
      file: 'glassmorphism_3d.css',
      code: `/* Jayant Sen - Cyber Glassmorphism & Neon Glow */
.glass-cyber-card {
  background: rgba(13, 21, 40, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 242, 254, 0.25);
  border-radius: 16px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.6),
    0 0 25px rgba(0, 242, 254, 0.15);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  transform-style: preserve-3d;
}

.glass-cyber-card:hover {
  transform: perspective(1000px) translateY(-6px) rotateX(4deg);
  border-color: #00f2fe;
}`
    },
    js: {
      title: 'Async/Await Data Retrieval & DOM State',
      file: 'async_search.js',
      code: `// Jayant Sen - Asynchronous Client Logic & Debounce
const searchItems = async (query, category) => {
  try {
    const response = await fetch(\`/api/items?q=\${encodeURIComponent(query)}&cat=\${category}\`);
    if (!response.ok) {
      throw new Error(\`HTTP Error: \${response.status}\`);
    }
    const data = await response.json();
    return data.items;
  } catch (err) {
    console.error('Failed to fetch campus items:', err);
    return [];
  }
};

const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};`
    },
    ai: {
      title: 'AI Principles & Student Workflow Architecture',
      file: 'ai_pipeline_concept.md',
      code: `# Jayant Sen - Applied AI & Student Engineering Workflow

1. Problem Deconstruction:
   - Identify repetitive campus processes (lost notices, network logging).
   
2. Data Flow Representation:
   - Input Prompt -> System Constraint -> Reasoning Steps -> Verified JSON Output.

3. Evaluation:
   - Cross-check generated algorithmic logic against C test suites.
   - Guard against hallucinations with strict zero-shot role specifications.`
    },
    prompt: {
      title: 'Chain-of-Thought (CoT) Prompt Engineering Matrix',
      file: 'chain_of_thought.txt',
      code: `[ROLE]
You are a senior systems programming tutor assisting a 1st-year B.Tech CSE student.

[TASK]
Deconstruct the memory overhead of a 64-bit C linked list vs contiguous array.

[CONSTRAINTS]
1. Explain step-by-step using first principles.
2. Calculate struct padding on x86_64 architecture.
3. Provide pointer diagram in ASCII format.

[OUTPUT FORMAT]
- Step 1: Memory Footprint Breakdown
- Step 2: Cache Locality Comparison
- Step 3: Concluding Synthesis`
    }
  };

  const snippetModal = document.getElementById('snippetModal');
  const snippetTitle = document.getElementById('snippetTitle');
  const snippetFileName = document.getElementById('snippetFileName');
  const snippetCodeContent = document.getElementById('snippetCodeContent');
  const snippetClose = document.getElementById('snippetClose');
  const snippetCloseBtn = document.getElementById('snippetCloseBtn');
  const copySnippetBtn = document.getElementById('copySnippetBtn');
  const snippetTriggers = document.querySelectorAll('.skill-snippet-trigger');

  const openSnippetModal = (skillKey) => {
    const data = skillSnippets[skillKey];
    if (!data) return;

    snippetTitle.textContent = data.title;
    snippetFileName.textContent = data.file;
    snippetCodeContent.textContent = data.code;

    snippetModal.classList.add('active');
    snippetModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    playTone(600, 'sine', 0.06);
  };

  const closeSnippetModal = () => {
    if (!snippetModal) return;
    snippetModal.classList.remove('active');
    snippetModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  snippetTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const skill = btn.getAttribute('data-skill');
      openSnippetModal(skill);
    });
  });

  if (snippetClose) snippetClose.addEventListener('click', closeSnippetModal);
  if (snippetCloseBtn) snippetCloseBtn.addEventListener('click', closeSnippetModal);

  if (copySnippetBtn) {
    copySnippetBtn.addEventListener('click', async () => {
      const code = snippetCodeContent.textContent;
      try {
        await navigator.clipboard.writeText(code);
        copySnippetBtn.textContent = 'Copied!';
        showToast('Snippet code copied to clipboard!');
        setTimeout(() => {
          copySnippetBtn.textContent = 'Copy Code';
        }, 2000);
      } catch (err) {
        showToast('Could not copy snippet');
      }
    });
  }

  // ==========================================================================
  // 13. PROJECT DETAILS MODAL DATA & CONTROLLER
  // ==========================================================================
  const projectDetails = {
    'lost-and-found': {
      title: 'Campus Lost & Found Portal',
      tag: 'Campus Utility & Community Service',
      content: `
        <h4>The Motivation</h4>
        <p>Across large university campuses with multiple academic blocks, libraries, and food courts, students frequently misplace ID cards, water bottles, textbooks, and electronic items. Disorganized social group chats lead to missed claims.</p>
        
        <h4>Key Features & Architecture</h4>
        <ul>
          <li><strong>Categorized Submissions:</strong> Form with structured tags (Electronics, Documents, Personal Accessories) and block drop-downs.</li>
          <li><strong>Instant Search Filter:</strong> Real-time keyword and category filtering without page reloads.</li>
          <li><strong>Proof of Ownership Check:</strong> Prompts claimants to specify a unique identifying detail before revealing contact info.</li>
          <li><strong>Client-Side State Storage:</strong> Uses LocalStorage with JSON parsing for persistent testing.</li>
        </ul>

        <h4>What I Learned Building It</h4>
        <p>Practiced modular JavaScript functions, deep DOM manipulation, dynamic HTML template generation, and input sanitization to ensure safe and clean form handling.</p>
      `
    },
    'wifi-reporter': {
      title: 'Campus Wi-Fi Problem Reporter',
      tag: 'Campus Infrastructure Tool',
      content: `
        <h4>The Motivation</h4>
        <p>University hostels and department auditoriums often suffer from erratic signal dead zones or sudden bandwidth dips. When students complain verbally, network administrators lack organized diagnostic data.</p>
        
        <h4>Key Features & Architecture</h4>
        <ul>
          <li><strong>Issue Categorization:</strong> Dropdown to categorize outages (e.g., Portal Disconnect, High Latency, Weak Signal, Router Reboot).</li>
          <li><strong>Block & Floor Mapping:</strong> Granular zone selection covering academic wings, hostel dorms, and central lawns.</li>
          <li><strong>Timestamped Report Logging:</strong> Automatic client timestamp generation and issue priority badge flagging.</li>
          <li><strong>Formatted Export:</strong> Generates a clean tabular summary format ready to forward to campus IT support.</li>
        </ul>

        <h4>What I Learned Building It</h4>
        <p>Gained hands-on experience in structured form validation, managing complex UI state changes, writing clean Flexbox layouts, and designing accessible interfaces.</p>
      `
    },
    'personal-portfolio': {
      title: 'Personal Developer Portfolio',
      tag: 'Web Design & Engineering Showcase',
      content: `
        <h4>The Motivation</h4>
        <p>To craft an authentic, high-performance personal portfolio from the ground up—avoiding heavy boilerplate themes in favor of clean, hand-crafted code with 3D motion graphics and scrolling effects.</p>
        
        <h4>Key Features & Architecture</h4>
        <ul>
          <li><strong>Interactive 3D Motion Graphics:</strong> Real-time Three.js WebGL universe background and interactive 3D Hologram core.</li>
          <li><strong>High-End Scrolling Effects:</strong> Top neon progress indicator, circular floating scroll button, and smooth section tracking.</li>
          <li><strong>Interactive Dev CLI:</strong> Real Linux-style terminal with command interpretation and Matrix digital rain mode.</li>
          <li><strong>3D Card Tilt:</strong> Perspective gyroscopic mouse tilt with specular glare reflection on all cards.</li>
        </ul>

        <h4>What I Learned Building It</h4>
        <p>Deepened expertise in Three.js WebGL programming, CSS custom properties, keyframe animations, audio synthesis with Web Audio API, and writing maintainable, accessible JavaScript.</p>
      `
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalTag = document.getElementById('modalTag');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContactBtn = document.getElementById('modalContactBtn');
  const modalTriggers = document.querySelectorAll('.modal-trigger');

  const openProjectModal = (projectId) => {
    const data = projectDetails[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalTag.textContent = data.tag;
    modalBody.innerHTML = data.content;

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    playTone(580, 'sine', 0.06);
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  modalTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalContactBtn) modalContactBtn.addEventListener('click', closeProjectModal);

  // Close modals when clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
    if (e.target === snippetModal) closeSnippetModal();
  });

  // Escape key listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeSnippetModal();
      const mobileDrawer = document.getElementById('mobileDrawer');
      const backdrop = document.getElementById('backdrop');
      if (mobileDrawer) mobileDrawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ==========================================================================
  // 14. MOBILE DRAWER NAVIGATION
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const closeDrawer = document.getElementById('closeDrawer');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('backdrop');

  const openDrawer = () => {
    if (!mobileDrawer || !backdrop || !menuToggle) return;
    mobileDrawer.classList.add('open');
    backdrop.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawerMenu = () => {
    if (!mobileDrawer || !backdrop || !menuToggle) return;
    mobileDrawer.classList.remove('open');
    backdrop.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (closeDrawer) closeDrawer.addEventListener('click', closeDrawerMenu);
  if (backdrop) backdrop.addEventListener('click', closeDrawerMenu);
  drawerLinks.forEach((link) => link.addEventListener('click', closeDrawerMenu));

  // ==========================================================================
  // 15. SUBTITLE TYPEWRITER ROTATION
  // ==========================================================================
  const typingText = document.getElementById('typingText');
  if (typingText) {
    const roles = [
      'B.Tech CSE Student & Aspiring Problem Solver',
      'C Programming & Foundational Logic Enthusiast',
      'Modern Web Interfaces Builder',
      'Exploring AI & Prompt Engineering'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 60;

    const typeRole = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 70;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2200; // Pause when complete
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // Pause before next
      }

      setTimeout(typeRole, typingSpeed);
    };

    setTimeout(typeRole, 1000);
  }

  // ==========================================================================
  // 16. COPY EMAIL CLIPBOARD HANDLER
  // ==========================================================================
  const emailToCopy = 'jayantsen.dev@gmail.com';
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyEmailQuickBtn = document.getElementById('copyEmailQuickBtn');
  const quickCopyLabel = document.getElementById('quickCopyLabel');

  const executeCopy = async () => {
    playTone(700, 'sine', 0.08);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = emailToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      showToast(`Copied ${emailToCopy} to clipboard!`);

      if (quickCopyLabel) {
        const originalText = quickCopyLabel.textContent;
        quickCopyLabel.textContent = 'Copied!';
        setTimeout(() => {
          quickCopyLabel.textContent = originalText;
        }, 2200);
      }

      if (copyEmailBtn) {
        const copyText = copyEmailBtn.querySelector('.copy-text');
        if (copyText) {
          copyText.textContent = 'Copied!';
          setTimeout(() => {
            copyText.textContent = 'Copy';
          }, 2200);
        }
      }
    } catch (err) {
      showToast('Email: ' + emailToCopy);
    }
  };

  if (copyEmailBtn) copyEmailBtn.addEventListener('click', executeCopy);
  if (copyEmailQuickBtn) copyEmailQuickBtn.addEventListener('click', executeCopy);

  // ==========================================================================
  // 17. CONTACT FORM INTERACTION
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('messageSubject').value.trim();
      const message = document.getElementById('messageBody').value.trim();

      if (!name || !email || !message) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please fill out all required fields.';
        return;
      }

      formStatus.className = 'form-status success';
      formStatus.textContent = `Thanks ${name}! Launching email client to send your message...`;
      playChime();

      const mailtoUrl = `mailto:jayantsen.dev@gmail.com?subject=${encodeURIComponent(
        `[Portfolio] ${subject || 'New Message from ' + name}`
      )}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;

      if (submitBtn) {
        submitBtn.disabled = true;
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>Opening email...</span>`;

        setTimeout(() => {
          window.location.href = mailtoUrl;
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          showToast('Draft opened in your email client!');
          contactForm.reset();
        }, 800);
      }
    });
  }

  // ==========================================================================
  // 18. REVEAL-ON-SCROLL ANIMATION (INTERSECTION OBSERVER)
  // ==========================================================================
  const animatedElements = document.querySelectorAll(
    '.about-card, .skill-card, .project-card, .education-card, .goal-card, .contact-info-panel, .contact-form-panel'
  );

  animatedElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
          setTimeout(() => {
            if (entry.target.style.opacity === '1') {
              entry.target.style.transform = '';
              entry.target.style.transition = '';
            }
          }, 700);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  animatedElements.forEach((el) => revealObserver.observe(el));
});
