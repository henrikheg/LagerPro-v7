import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function ThreeView() {
  const mount = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.current.clientWidth / mount.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.current.clientWidth, mount.current.clientHeight);
    mount.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 3;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
    return () => mount.current.removeChild(renderer.domElement);
  }, []);

  return <div style={{ width: "100%", height: 300 }} ref={mount}></div>;
}
