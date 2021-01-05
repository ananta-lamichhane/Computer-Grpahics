import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// local from us provided utilities
import * as utils from './lib/utils';

// load shader
import basicVertexShader from './shader/basic.v.glsl';
import basicFragmentShader from './shader/basic.f.glsl';
import ambientVertexShader from './shader/ambient.v.glsl'
import ambientFragmentShader from './shader/ambient.f.glsl'
import { Vector4 } from 'three';


/*******************************************************************************
 * Defines Settings and GUI will later be seperated into settings.ts
 ******************************************************************************/

// enum(s)
export enum Shaders {
  basic = "Basic",
  ambient = "Ambient",
  normal = "Normal",
  toon = "Toon",
  lambert = "Lambert",
  gouraud_phong = "Gouraud",
  phong_phong = "Phong",
  phong_blinnPhong = "Blinn-Phong",
}

// (default) Settings.
export class Settings extends utils.Callbackable{
  // different setting types are possible (e.g. string, enum, number, boolean)
  shader: Shaders = Shaders.basic;
  ambient_reflectance: number = 0.5;
  ambient_color: [number, number, number] = [104, 13, 13];
  diffuse_reflectance: number = 1;
  diffuse_color: [number, number, number] = [204, 25, 25];
  specular_reflectance: number = 1;
  specular_color: [number, number, number] = [255, 255, 255];
  magnitude: number = 128;
  lightX: number = 2;
  lightY: number = 2;
  lightZ: number = 2;
}

// create GUI given a Settings object
export function createGUI(params: Settings): dat.GUI {
  // we are using dat.GUI (https://github.com/dataarts/dat.gui)
  var gui: dat.GUI = new dat.GUI();

  // build GUI
  gui.add(params, 'shader', utils.enumOptions(Shaders)).name('Shader');

  gui.add(params, 'ambient_reflectance', 0, 1, 0.01).name('Ambient reflec...');
  gui.addColor(params, 'ambient_color').name('Ambient color');

  gui.add(params, 'diffuse_reflectance', 0, 1, 0.01).name('Diffuse reflect...');
  gui.addColor(params, 'diffuse_color').name('Diffuse color');

  gui.add(params, 'specular_reflectance', 0, 1, 0.01).name('Specular reflec...');
  gui.addColor(params, 'specular_color').name('Specular color');

  gui.add(params, 'magnitude', 0, 128, 1).name('Magnitude');

  var lightFolder = gui.addFolder("Light");
  lightFolder.add(params, 'lightX', -10, 10, 0.5).name('X');
  lightFolder.add(params, 'lightY', -10, 10, 0.5).name('Y');
  lightFolder.add(params, 'lightZ', -10, 10, 0.5).name('Z');
  lightFolder.open();

  return gui;
}

//var ambient_color = new Vector4(1,0.5,0.5,0.5);


/*******************************************************************************
 * helper functions to build scene (geometry, light), camera and controls.
 ******************************************************************************/

export function setupGeometry(scene: THREE.Scene, material: THREE.RawShaderMaterial){


    // https://threejs.org/docs/#api/en/geometries/BoxGeometry
    var torusKnotGeo = new THREE.TorusKnotGeometry(1, 0.3, 100, 32)
    var sphereGeo1 = new THREE.SphereGeometry(1.4, 20, 20);
    var boxGeo = new THREE.BoxGeometry(2, 2, 2);
    var sphereGeo2 = new THREE.SphereGeometry(1.4, 20, 20);
    
   /* var material = new THREE.RawShaderMaterial( {
    uniforms:{
      col : {value: ambient_color}
    },
     vertexShader: vshader,
     fragmentShader: fshader
    });*/

    var model0 = new THREE.Mesh(torusKnotGeo, material);
    scene.add(model0);

    sphereGeo1.scale(1, 0.5, 1);
    var model1 = new THREE.Mesh(sphereGeo1, material);
    model1.rotateX(3.141592/2);
    model1.translateX(-4);
    model1.translateZ(-1.5);
    scene.add(model1);

    var model2 = new THREE.Mesh(sphereGeo2, material);
    model2.scale.set(1, 0.5, 1);
    model2.rotateX(3.141592/2);
    model2.translateX(-4);
    model2.translateZ(1.5);
    scene.add(model2);

    var model3 = new THREE.Mesh(boxGeo, material);
    model3.translateX(4);
    scene.add(model3);

    return { material, model0, model1, model2, model3 };
 };

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
