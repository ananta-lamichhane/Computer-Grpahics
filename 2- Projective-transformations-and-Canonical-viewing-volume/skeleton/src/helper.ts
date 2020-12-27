import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// local from us provided utilities
import * as utils from './lib/utils';

/*******************************************************************************
 * helper functions to build scene (geometry, light), camera and controls.
 ******************************************************************************/

export { createTeddyBear } from './teddy';

/*******************************************************************************
 * Defines Settings and GUI will later be seperated into settings.ts
 ******************************************************************************/

// (default) Settings.
export class Settings extends utils.Callbackable{
  // different setting types are possible (e.g. string, enum, number, boolean)
  near: number = 1;
  far: number = 5;
  fov: number = 40;
  planeX0: boolean = true;
  planeX1: boolean = true;
  planeY0: boolean = true;
  planeY1: boolean = true;
  planeZ0: boolean = true;
  planeZ1: boolean = true;
  rotateX: number = 0;
  rotateY: number = 0;
  rotateZ: number = 0;
  translateX: number = 0;
  translateY: number = 0;
  translateZ: number = 0;
  checkParallelProj:boolean = false;
}

// create GUI given a Settings object
export function createGUI(params: Settings): dat.GUI {
  // we are using dat.GUI (https://github.com/dataarts/dat.gui)
  var gui: dat.GUI = new dat.GUI();

  // build GUI
  var cameraFolder = gui.addFolder('Camera');
  var checkPersctiveProj = gui.addFolder("NDC:not working, refresh to restore");
  checkPersctiveProj.add(params, "checkParallelProj").name("checkout my art:)");
  cameraFolder.add(params, 'near', 0.25, 5, 0.25).name('Near Plane');
  cameraFolder.add(params, 'far', 0.25, 5, 0.25).name('Far Plane');
  cameraFolder.add(params, 'fov', 1, 180, 1).name('Field of View');

  var planeFolder = gui.addFolder('Planes');
  planeFolder.add(params, 'planeX0').name('Plane left');
  planeFolder.add(params, 'planeX1').name('Plane right');
  planeFolder.add(params, 'planeY0').name('Plane bottom');
  planeFolder.add(params, 'planeY1').name('Plane top');
  planeFolder.add(params, 'planeZ0').name('Plane back');
  planeFolder.add(params, 'planeZ1').name('Plane front');

  var modelFolder = gui.addFolder('Model');
  modelFolder.add(params, 'rotateX', -Math.PI, Math.PI, 0.05).name('RotateX');
  modelFolder.add(params, 'rotateY', -Math.PI, Math.PI, 0.05).name('RotateY');
  modelFolder.add(params, 'rotateZ', -Math.PI, Math.PI, 0.05).name('RotateZ');

  modelFolder.add(params, 'translateX', -2, 2, 0.05).name('TranslateX');
  modelFolder.add(params, 'translateY', -2, 2, 0.05).name('TranslateY');
  modelFolder.add(params, 'translateZ', -2, 2, 0.05).name('TransalteZ');

  return gui;
}

 // define camera that looks into scene
export function setupCamera(camera: THREE.PerspectiveCamera, scene: THREE.Scene, near: number, far: number, fov: number){
  // https://threejs.org/docs/#api/cameras/PerspectiveCamera
  camera.near = near;
  camera.far = far;
  camera.fov = fov;
  camera.position.z = 3;
  camera.lookAt(scene.position);
  camera.updateProjectionMatrix()
  return camera
}

export function createCanonicalCamera(){
  var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 1, 10 );
  camera.position.z = 3;
  return camera;
}

export function setupCube(scene: THREE.Scene){
  var geometry = new THREE.BoxGeometry( 2, 2, 2);
  var geo = new THREE.EdgesGeometry( geometry );
  var cubeMat = new THREE.LineBasicMaterial( { color: 0xff8010, linewidth: 2} );
  var wireframe = new THREE.LineSegments( geo, cubeMat);
  wireframe.position.set(0, 0, 0);
  scene.add(wireframe);
  return scene
}

 // define controls (mouse interaction with the renderer)
export function setupControls(controls: OrbitControls){
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.keys = {LEFT: 65, UP:87, RIGHT: 68, BOTTOM:83};
  controls.minDistance = 0.1;
  controls.maxDistance = 25;
  return controls;
 };
