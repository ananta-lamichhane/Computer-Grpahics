// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';
import * as THREE from 'three';
import * as utils from './lib/utils';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Application, createWindow} from './lib/window';
import RenderWidget from './lib/rendererWidget';
import * as dat from 'dat.gui';
import {createTeddyBear} from './teddy'



function main(){
    /---------------------------------------* INITIAL SETUP*-------------------------------------------------/

    var root = Application("3D Vision"); // taken from ex0
    root.setLayout([
        ["renderer", "r2"],
        //[".", "."]
    ]);
    root.setLayoutColumns(["50%", "50%"]);
    var rendererDiv = createWindow("renderer"); // renderer for left
    var r2div = createWindow("r2"); // renderer for left
    var renderer = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });
    var r2 = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });
    root.appendChild(rendererDiv);
    root.appendChild(r2div);

    var ted = createTeddyBear(); // teddy from 3.
    

    var lights = new THREE.PointLight( "yellow", 1, 100 );
    var scene = new THREE.Scene();
    scene.background = new THREE.Color( 'purple');
    var camera_left = new THREE.PerspectiveCamera();
    camera_left = helper.setupCamera(camera_left, scene);
    var camera_right = new THREE.PerspectiveCamera();
    camera_right = helper.setupCamera(camera_right, scene);

    camera_right.position.x = camera_left.position.x-0.5; // camera should vary slightly
    camera_right.position.x = camera_left.position.x+0.5; // making bit symmetric

    var settings = new helper.Settings();
    settings.addCallback(processGUIInputs);
    var gui = helper.createGUI(settings);
    gui.open();
    scene.add(lights);
    scene.add(ted);


    var ctrl = new OrbitControls(camera_left, rendererDiv);
    var controls = helper.setupControls(ctrl);
    var ctrl2 = new OrbitControls(camera_right, r2div);
    var controls2 = helper.setupControls(ctrl2);



    function processGUIInputs(changed: utils.KeyValuePair<helper.Settings>){
        if(changed.key == "distance"){
            changed.value= changed.value-2; // teddys from left and right meet at eye distance.. make 0 of scale to -2 here.
            camera_left.position.x = changed.value>-2? changed.value:-4-changed.value; // object at centre need to account for offset
            camera_right.position.x = -camera_left.position.x;
           
        }
    }
    var wid3 = new RenderWidget(rendererDiv, renderer, camera_left ,scene);
    var wid4 = new RenderWidget(r2div,r2, camera_right, scene);

    wid3.animate();
    wid4.animate();
}

// call main entrypoint
main();
