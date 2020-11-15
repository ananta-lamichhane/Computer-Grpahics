import * as THREE from 'three';

import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


export function setupLight(scene: THREE.Scene){
  // add two point lights and a basic ambient light
  // https://threejs.org/docs/#api/lights/PointLight
  var light = new THREE.PointLight(0xffffcc, 1, 100);
  light.position.set( 10, 30, 15 );
  scene.add(light);

  var light2 = new THREE.PointLight(0xffffcc, 1, 100);
  light2.position.set( 10, -30, -15 );
  scene.add(light2);

  //https://threejs.org/docs/#api/en/lights/AmbientLight
  scene.add(new THREE.AmbientLight(0x999999));
  return scene;
};

// define camera that looks into scene
export function setupCamera(camera: THREE.PerspectiveCamera, scene: THREE.Scene){
  // https://threejs.org/docs/#api/cameras/PerspectiveCamera
  camera.near = 0.01;
  camera.far = 10;
  camera.fov = 70;
  camera.position.z = 4; // default value 1.
  camera.lookAt(scene.position);
  camera.updateProjectionMatrix();
  return camera
}

// define controls (mouse interaction with the renderer)
export function setupControls(controls: OrbitControls){
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.enableZoom = true;
  controls.enableKeys = false;
  controls.minDistance = 0.1;
  controls.maxDistance = 5;
  return controls;
};
