//import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// local from us provided utilities
import * as utils from './lib/utils';



/*******************************************************************************
 * Defines Settings and GUI will later be seperated into settings.ts
 ******************************************************************************/


// (default) Settings.
export class Settings extends utils.Callbackable{
  // different setting types are possible (e.g. string, enum, number, boolean)
  distance:number =0;
}

// create GUI given a Settings object
export function createGUI(params: Settings): dat.GUI {
  // we are using dat.GUI (https://github.com/dataarts/dat.gui)
  var gui: dat.GUI = new dat.GUI();
  gui.add(params, 'distance', -10, 10, 0.1).name('Eye Distance');
  return gui;
}

//var ambient_color = new Vector4(1,0.5,0.5,0.5);


/*******************************************************************************
 * helper functions to build scene (geometry, light), camera and controls.
 ******************************************************************************/

 // define camera that looks into scene
export function setupCamera(camera: THREE.PerspectiveCamera, scene: THREE.Scene){
  // https://threejs.org/docs/#api/cameras/PerspectiveCamera
  camera.near = 0.01;
  camera.far = 20;
  camera.fov = 70;
  camera.position.z = 6;
  camera.lookAt(scene.position);
  camera.updateProjectionMatrix()
  return camera
}

 // define controls (mouse interaction with the renderer)
export function setupControls(controls: OrbitControls){
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.enableZoom = true;
  controls.keys = {LEFT: 65, UP:87, RIGHT: 68, BOTTOM:83};
  controls.minDistance = 0.1;
  controls.maxDistance = 9;
  return controls;
};
