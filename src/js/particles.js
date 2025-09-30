const MOBILE_PARTICLE_COUNT = 6000;
const DESKTOP_PARTICLE_COUNT = 9000;

function hexToVector3(hex) {
  const color = new THREE.Color(hex);
  return new THREE.Vector3(color.r, color.g, color.b);
}

export class MagnoliaParticles {
  constructor({ canvas, reducedMotion = false } = {}) {
    this.canvas = canvas;
    this.reducedMotion = reducedMotion;
    this.pointer = new THREE.Vector2(0, 0);
    this.interactivitySettings = { motionLevel: reducedMotion ? 0.05 : 0.6, pointSize: 6 };
    this.motionLevel = this.interactivitySettings.motionLevel;
    this.uniforms = {
      uTime: { value: 0 },
      uTint: { value: new THREE.Vector3(0.93, 0.82, 0.86) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMotion: { value: reducedMotion ? 0.05 : 0.6 },
      uPointSize: { value: 6 }
    };
    this.clock = new THREE.Clock();
    this.burstActive = false;
    this.rafId = null;
  }

  init() {
    if (!this.canvas || !window.THREE) {
      console.warn('Three.js unavailable, MagnoliaParticles falling back to CSS background.');
      return;
    }

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 400);
    this.camera.position.set(0, 0, 140);

    const particleCount = window.innerWidth < 768 ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i += 1) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 220;
      positions[idx + 1] = (Math.random() - 0.5) * 140;
      positions[idx + 2] = (Math.random() - 0.5) * 220;
      speeds[i] = Math.random() * 0.8 + 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));

    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uMotion;
      uniform float uPointSize;
      attribute float aSpeed;
      varying float vInfluence;
      void main() {
        vec3 transformed = position;
        float t = uTime * aSpeed * 0.05;
        transformed.x += sin(t + position.y * 0.15) * 12.0 * uMotion;
        transformed.y += cos(t + position.x * 0.08) * 8.0 * uMotion;
        transformed.z += sin(t + position.x * 0.12) * 6.0 * uMotion;
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        vec2 projected = (mvPosition.xy / -mvPosition.z) * 120.0;
        float distToMouse = length(projected - uMouse);
        float influence = clamp(1.0 - distToMouse / 120.0, 0.0, 1.0);
        vInfluence = influence;
        mvPosition.xy += normalize(projected - uMouse) * influence * 18.0 * uMotion;
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = (uPointSize + 18.0 * influence) * (150.0 / -mvPosition.z);
      }
    `;

    const fragmentShader = `
      uniform vec3 uTint;
      varying float vInfluence;
      void main() {
        vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;
        float dist = dot(uv, uv);
        if (dist > 1.0) discard;
        float softness = smoothstep(1.0, 0.0, dist);
        vec3 color = mix(uTint, vec3(1.0, 0.95, 0.98), vInfluence * 0.8);
        float alpha = softness * (0.55 + vInfluence * 0.4);
        gl_FragColor = vec4(color, alpha);
      }
    `;

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader,
      fragmentShader
    });

    this.points = new THREE.Points(geometry, this.material);
    this.scene.add(this.points);

    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('pointermove', this.handlePointerMove.bind(this));

    this.animate = this.animate.bind(this);
    this.animate();
  }

  handleResize() {
    if (!this.renderer || !this.camera) return;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  handlePointerMove(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.uniforms.uMouse.value.set(x * 80, y * 80);
  }

  animate() {
    if (!this.renderer) return;
    const elapsed = this.clock.getElapsedTime();
    this.uniforms.uTime.value = elapsed;
    this.uniforms.uMotion.value = this.motionLevel;
    this.renderer.render(this.scene, this.camera);
    if (!this.reducedMotion) {
      this.rafId = requestAnimationFrame(this.animate);
    } else {
      this.rafId = null;
    }
  }

  setTint(hex) {
    if (!this.material) return;
    this.uniforms.uTint.value = hexToVector3(hex);
  }

  setInteractivity({ motionLevel = 0.6, pointSize = 6 } = {}) {
    this.interactivitySettings = { motionLevel, pointSize };
    this.motionLevel = this.reducedMotion ? 0.05 : motionLevel;
    if (this.uniforms) {
      this.uniforms.uMotion.value = this.motionLevel;
    }
    this.uniforms.uPointSize.value = this.reducedMotion ? pointSize * 0.8 : pointSize;
  }

  setReducedMotion(enabled) {
    this.reducedMotion = Boolean(enabled);
    const { motionLevel = 0.6, pointSize = 6 } = this.interactivitySettings;
    this.motionLevel = this.reducedMotion ? 0.05 : motionLevel;

    if (this.uniforms) {
      this.uniforms.uMotion.value = this.motionLevel;
      this.uniforms.uPointSize.value = this.reducedMotion ? pointSize * 0.8 : pointSize;
    }

    if (this.reducedMotion) {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    } else if (!this.rafId && this.renderer) {
      this.animate();
    }
  }

  burstFlower({ strength = 1 } = {}) {
    if (!this.material) return;
    if (this.burstActive) return;
    this.burstActive = true;
    const startStrength = this.motionLevel;
    this.motionLevel = Math.min(1.2, startStrength + strength * 0.4);
    setTimeout(() => {
      this.motionLevel = startStrength;
      this.burstActive = false;
    }, 900);
  }

  waveSwell(strength = 0.3, duration = 800) {
    if (!this.material) return;
    const start = this.motionLevel;
    this.motionLevel = Math.min(1.1, start + strength);
    setTimeout(() => {
      this.motionLevel = start;
    }, duration);
  }
}
