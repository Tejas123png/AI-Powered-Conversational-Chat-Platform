import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./GhostCursor.css";

export default function GhostCursor({
  color = "#6366F1",
  brightness = 0.7,
  trailLength = 35,
  inertia = 0.35,
  grainIntensity = 0.025,
  bloomStrength = 0.08,
  fadeDelayMs = 800,
  fadeDurationMs = 1200,
  zIndex = 0,
}) {
  const canvasRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    // Disable on mobile / no pointer
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Check WebGL support
    const testCanvas = document.createElement("canvas");
    const gl =
      testCanvas.getContext("webgl") ||
      testCanvas.getContext("experimental-webgl");
    if (!gl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -width / 2, width / 2, height / 2, -height / 2, 0.1, 100
    );
    camera.position.z = 10;

    // Parse color
    const col = new THREE.Color(color);

    // Trail points
    const trail = [];
    for (let i = 0; i < trailLength; i++) {
      trail.push(new THREE.Vector2(width / 2, height / 2));
    }

    const positions = new Float32Array(trailLength * 3);
    const alphas = new Float32Array(trailLength);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          gl_PointSize = mix(12.0, 2.0, 1.0 - alpha);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        uniform vec3 uColor;
        uniform float uBrightness;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float fade = 1.0 - smoothstep(0.0, 0.5, d);
          gl_FragColor = vec4(uColor * uBrightness, vAlpha * fade);
        }
      `,
      uniforms: {
        uColor: { value: col },
        uBrightness: { value: brightness },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let mouse = new THREE.Vector2(width / 2, height / 2);
    let smoothMouse = new THREE.Vector2(width / 2, height / 2);
    let fadeTimeout = null;
    let fadeStartTime = null;
    let isFading = false;
    let globalAlpha = 1;

    const onMouseMove = (e) => {
      mouse.set(
        e.clientX - width / 2,
        -(e.clientY - height / 2)
      );
      isFading = false;
      globalAlpha = 1;
      clearTimeout(fadeTimeout);
      fadeTimeout = setTimeout(() => {
        isFading = true;
        fadeStartTime = performance.now();
      }, fadeDelayMs);
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    let animId;
    const animate = () => {
      if (!mountedRef.current) return;
      animId = requestAnimationFrame(animate);

      // Smooth follow
      smoothMouse.lerp(mouse, inertia);
      trail.unshift(smoothMouse.clone());
      if (trail.length > trailLength) trail.pop();

      // Update geometry
      for (let i = 0; i < trailLength; i++) {
        const t = trail[i] || trail[trail.length - 1];
        positions[i * 3] = t.x;
        positions[i * 3 + 1] = t.y;
        positions[i * 3 + 2] = 0;
        alphas[i] = ((1 - i / trailLength) ** 1.5) * globalAlpha;
      }

      if (isFading && fadeStartTime) {
        const elapsed = performance.now() - fadeStartTime;
        globalAlpha = Math.max(0, 1 - elapsed / fadeDurationMs);
        if (globalAlpha <= 0) {
          isFading = false;
          globalAlpha = 0;
        }
      }

      // Film grain overlay via alpha jitter
      if (grainIntensity > 0) {
        for (let i = 0; i < trailLength; i++) {
          alphas[i] = Math.max(
            0,
            alphas[i] + (Math.random() - 0.5) * grainIntensity
          );
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.alpha.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(animId);
      clearTimeout(fadeTimeout);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [color, brightness, trailLength, inertia, grainIntensity, fadeDelayMs, fadeDurationMs]);

  return (
    <canvas
      ref={canvasRef}
      className="ghost-cursor-canvas"
      style={{ zIndex }}
      aria-hidden="true"
    />
  );
}
