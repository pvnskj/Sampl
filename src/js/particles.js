const MOBILE_PARTICLE_COUNT = 5600;
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
    this.motionLevel = reducedMotion ? 0.05 : 0.6;
    this.motionTarget = this.motionLevel;
    this.pointSize = reducedMotion ? 5.2 : 6.4;
    this.pointTarget = this.pointSize;
    this.tintTarget = hexToVector3('#e6f0ff');
    this.uniforms = {
      uTime: { value: 0 },
      uTint: { value: hexToVector3('#e6f0ff') },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMotion: { value: this.motionLevel },
      uPointSize: { value: this.pointSize }
    };
    this.clock = new THREE.Clock();
    this.burstActive = false;
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
        transformed.x += sin(t + position.y * 0.2) * 14.0 * uMotion;
        transformed.y += cos(t + position.x * 0.12) * 9.5 * uMotion;
        transformed.z += sin(t + position.x * 0.16) * 7.5 * uMotion;
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        vec2 projected = (mvPosition.xy / -mvPosition.z) * 120.0;
        float distToMouse = length(projected - uMouse);
        float influence = clamp(1.0 - distToMouse / 120.0, 0.0, 1.0);
        vInfluence = influence;
        mvPosition.xy += normalize(projected - uMouse) * influence * 16.0 * uMotion;
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
        vec3 glow = mix(uTint, vec3(0.92, 0.98, 1.0), vInfluence * 0.85);
        float alpha = softness * (0.48 + vInfluence * 0.42);
        gl_FragColor = vec4(glow, alpha);
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

    this.tintTarget = this.uniforms.uTint.value.clone();

    this.points = new THREE.Points(geometry, this.material);
    this.scene.add(this.points);

    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('pointermove', this.handlePointerMove.bind(this), { passive: true });

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
    if (this.reducedMotion) return;
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.uniforms.uMouse.value.set(x * 80, y * 80);
  }

  animate() {
    if (!this.renderer) return;
    const elapsed = this.clock.getElapsedTime();
    this.uniforms.uTime.value = elapsed;

    if (!this.reducedMotion) {
      this.motionLevel += (this.motionTarget - this.motionLevel) * 0.08;
      this.pointSize += (this.pointTarget - this.pointSize) * 0.12;
      this.uniforms.uTint.value.lerp(this.tintTarget, 0.08);
    } else {
      this.motionLevel = this.motionTarget;
      this.pointSize = this.pointTarget;
      this.uniforms.uTint.value.copy(this.tintTarget);
    }

    this.uniforms.uMotion.value = this.motionLevel;
    this.uniforms.uPointSize.value = this.pointSize;

    this.renderer.render(this.scene, this.camera);
    if (!this.reducedMotion) {
      requestAnimationFrame(this.animate);
    }
  }

  setTint(hex) {
    if (!this.material) return;
    this.tintTarget = hexToVector3(hex);
    if (this.reducedMotion) {
      this.uniforms.uTint.value.copy(this.tintTarget);
    }
  }

  setInteractivity({ motionLevel = 0.6, pointSize = 6 } = {}) {
    if (this.reducedMotion) {
      this.motionTarget = 0.08;
      this.pointTarget = Math.max(4.2, pointSize * 0.7);
      this.motionLevel = this.motionTarget;
      this.pointSize = this.pointTarget;
      this.uniforms.uMotion.value = this.motionLevel;
      this.uniforms.uPointSize.value = this.pointSize;
      return;
    }
    this.motionTarget = Math.min(1.15, motionLevel);
    this.pointTarget = pointSize;
  }

  burstFlower({ strength = 1 } = {}) {
    if (!this.material || this.reducedMotion) return;
    if (this.burstActive) return;
    this.burstActive = true;
    const startTarget = this.motionTarget;
    this.motionTarget = Math.min(1.2, startTarget + strength * 0.4);
    setTimeout(() => {
      this.motionTarget = startTarget;
      this.burstActive = false;
    }, 900);
  }

  waveSwell(strength = 0.3, duration = 800) {
    if (!this.material || this.reducedMotion) return;
    const start = this.motionTarget;
    this.motionTarget = Math.min(1.1, start + strength);
    setTimeout(() => {
      this.motionTarget = start;
    }, duration);
  }
}
