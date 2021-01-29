// custom imports
import { CanvasWidget } from './canvasWidget';
import * as helper from './helper';
import RenderWidget from './lib/rendererWidget';
import {Application, createWindow} from './lib/window';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


function main(){

    var root = Application("ShaderFun"); // taken from ex0
    root.setLayout([
        ["r2", "renderer"]
       // [".", "."]
    ]);
    root.setLayoutColumns(["50%", "50%"]);
    // root.setLayoutRows(["100%", "50%"]);
    var rendererDiv = createWindow("renderer"); // renderer for left
    var renderer = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });
    var r2div = createWindow("r2");
    var wid2 = new CanvasWidget(r2div); // new widget type to load image on the left side
    wid2.setPixel(256, 256, new THREE.Color('red'));


    root.appendChild(rendererDiv);
    root.appendChild(r2div);
    var scene = new THREE.Scene();
    
    scene.background = new THREE.Color( 'blue');
    var lights = helper.setupLight(scene);
    var geom = helper.setupGeometry(scene);
    var settings = new helper.Settings();
    
    var camera = new THREE.PerspectiveCamera();
    camera = helper.setupCamera(camera);
    var gui = helper.createGUI(settings);
    gui.open();
    
    var ctrl = new OrbitControls(camera, rendererDiv);
    var controls = helper.setupControls(ctrl);
    
    var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
    wid.animate();


}

// call main entrypoint
main();
