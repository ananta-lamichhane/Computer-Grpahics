
import ImageWidget from './imageWidget';
// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';
import * as THREE from 'three';
import * as utils from './lib/utils';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Application, createWindow} from './lib/window';
import RenderWidget from './lib/rendererWidget';
import * as dat from 'dat.gui';

// load shaders
var lights: THREE.PointLight;
var mat : THREE.RawShaderMaterial;

function cleanUpScene(sc: THREE.Scene){
    sc.traverseVisible(function(child) {
        if (child.type == 'Mesh') {
           sc.remove(child);
        }
     });
}







function main(){

    var img_source : string = "";
    var scene : THREE.Scene;
    var geom: THREE.Geometry;
    var material: THREE.Material;
    function handleGUI(changed: utils.KeyValuePair<helper.Settings>){
        
        if (changed.key == "texture") { // assings the name in the input box as the title of the document (tab heading)
        console.log("khulja simsim");
            if(changed.value == "Colors"){
                console.log("change");
                img_source = "./textures/colors.jpg";
                console.log("img_source = "+ img_source);
            }

        }
        if (changed.key == "geometry") { // create a geometry according to the input.
            if(changed.value == "Box"){
                geom = helper.createBox();
            }
            if(changed.value == "Sphere"){
                geom = helper.createSphere();
            }
            if(changed.value == "Knot"){
                geom = helper.createKnot();
            }
    
        }
        if (changed.key == "shader") { // apply the change in scale to the created body
            
        }
        if (changed.key == "normalmap") { // assings the name in the input box as the title of the document (tab heading)
            
        }
        if (changed.key == "pen") { // create a geometry according to the input.
            
    
        }
        if (changed.key == "enviroment") { // apply the change in scale to the created body
            
    
        }

        material = new THREE.MeshLambertMaterial();

        var mesh = new THREE.Mesh(geom, material);
        cleanUpScene(scene);
        scene.add(lights);
        scene.add(mesh);
    }
    










    /---------------------------------------* INITIAL SETUP*-------------------------------------------------/

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
    root.appendChild(rendererDiv);
    root.appendChild(r2div);
    lights = new THREE.PointLight( "yellow", 1, 100 );

    lights.position.set(4,4,4);
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 'black');
    var camera = new THREE.PerspectiveCamera();
    camera = helper.setupCamera(camera, scene);
    var settings = new helper.Settings();
    settings.addCallback(handleGUI);
    var gui = helper.createGUI(settings);
    gui.open();
    var ctrl = new OrbitControls(camera, rendererDiv);
    var controls = helper.setupControls(ctrl);

    var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
    var wid2 = new ImageWidget(r2div);
    img_source == ""? img_source = "./textures/checker.jpg" : img_source;
    console.log("img_source2 = "+ img_source);
    wid2.setImage(img_source);
    wid.animate();
}

// call main entrypoint
main();
