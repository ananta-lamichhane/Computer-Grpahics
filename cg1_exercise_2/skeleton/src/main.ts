// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';
import * as THREE from 'three';
import * as utils from './lib/utils';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Application, createWindow} from './lib/window';
import RenderWidget from './lib/rendererWidget';
import * as dat from 'dat.gui';
import { BoxGeometry, CameraHelper, Matrix4, Vector3, WebGL1Renderer } from 'three';
import { forEachChild } from 'typescript';
var camera:THREE.PerspectiveCamera; // declarations so as to make callback work.
var cam2 : THREE.OrthographicCamera;
var cam3 : THREE.PerspectiveCamera;
var bear1 : THREE.Object3D;
var bear2: THREE.Object3D;
var ch1: THREE.CameraHelper;
var ch2:THREE.CameraHelper;
var r2 :THREE.WebGLRenderer;

/*acts as callback for changes in settings GUI
Cotains actiosn for camera, model and clipping planes controls
*/
function moveCamera(changed: utils.KeyValuePair<helper.Settings>){
    var left, right, bottom, top, back, front = 10;
    if (changed.key == "near") { // assings the name in the input box as the title of the document (tab heading)
        camera.near = changed.value;
    }
    if (changed.key == "far") { // create a geometry according to the input.
        camera.far= changed.value;

    }
    if (changed.key == "fov") { // apply the change in scale to the created body
         camera.fov = changed.value;
    }

    if (changed.key == "rotateX") { // rotate both bears simultaneously
       bear1.rotation.x = changed.value;
        bear2.rotation.x = changed.value;
    }
    if (changed.key == "rotateY") { 
        bear1.rotation.y = changed.value;
        bear2.rotation.y = changed.value;
    }
    if (changed.key == "rotateZ") {
       bear1.rotation.z = changed.value;
        bear2.rotation.z = changed.value;
    }
    if (changed.key == "translateX") { 
        bear1.position.x = changed.value;
        bear2.position.x = changed.value;
    }
    if (changed.key == "translateY") { 
       bear1.position.y = changed.value;
       bear2.position.y = changed.value;
    }
    if (changed.key == "translateZ") {
       bear1.position.z = changed.value;
       bear2.position.z = changed.value;
    }
    if(changed.key == "planeX0"){ // left clipping plane (custom made to show effect because NDC doesnt work)
         //should be 1 on normal case (while active)
       changed.value?left=2:left=0.5; // if true set to 2 (not clipping if false set to 0.5, clipping)
       var left_vec = new THREE.Vector3(1,0,0);
       r2.clippingPlanes = [new THREE.Plane(left_vec, left)];
    }
    if(changed.key == "planeX1"){ // right
        changed.value?right=2:right=0.5;
        var right_vec = new THREE.Vector3(-1,0,0);
        r2.clippingPlanes = [new THREE.Plane(right_vec, right)];
     }
     if(changed.key == "planeY0"){ // bottom
        changed.value?bottom=2:bottom=0.5;
        var bottom_vec = new THREE.Vector3(0,1,0);
        r2.clippingPlanes = [new THREE.Plane(bottom_vec, bottom)];
     }
     if(changed.key == "planeY1"){// top
        changed.value?top=2:top=0.5;
        var top_vec = new THREE.Vector3(0,-1,0);
        r2.clippingPlanes = [new THREE.Plane(top_vec,top)];
     }
     if(changed.key == "planeZ0"){ // back
        changed.value?back=2:back=0.2;
        var back_vec = new THREE.Vector3(0,0,1);
        r2.clippingPlanes = [new THREE.Plane(back_vec,back)];
        
     }
     if(changed.key == "planeZ1"){// front
        changed.value?front=2:front=0.2;
        var front_vec = new THREE.Vector3(0,0,-1);
        r2.clippingPlanes = [new THREE.Plane(front_vec,front)];
        
     }
     if(changed.key == "checkParallelProj"){// front
        if(changed.value == true){
            bear2 = projectParallel(bear2);
        }else{
            bear2 = helper.createTeddyBear();
        }
        
     }

     // update projection matrix after every change.
    camera.updateProjectionMatrix();
    cam2.updateProjectionMatrix();
    cam3.updateProjectionMatrix();
    // update models matrix world after every change.
    bear2.updateMatrixWorld();
    bear1.updateMatrixWorld();
    //update the cameraHelper after every change
    ch1.update();

}

function projectParallel(obj: THREE.Object3D):THREE.Object3D{
        obj.traverse(elem =>{
            if(elem instanceof THREE.Mesh){
                elem.geometry.verticesNeedUpdate = true;
                for(var v=0; v< elem.geometry.vertices.length; v++){
                    var x_co = elem.geometry.vertices[v].x;
                    var y_co = elem.geometry.vertices[v].y;
                    var z_co = elem.geometry.vertices[v].z;
                    
                    elem.geometry.vertices[v].x = camera.near * elem.geometry.vertices[v].x /( elem.geometry.vertices[v].z);
                    elem.geometry.vertices[v].y = camera.near * elem.geometry.vertices[v].y /( elem.geometry.vertices[v].z);
                    elem.geometry.vertices[v].z = (z_co * (camera.near + camera.far)/ camera.near)- (camera.far*camera.near/z_co);
                }
                elem.geometry.verticesNeedUpdate = true;
            }
        });
        return obj
}

function main(){

    var root = Application("TeddyBear"); // taken from ex0
    root.setLayout([
        ["renderer", "r2", "r3"],
    ]);

    root.setLayoutColumns(["1fr", "1fr", "1fr"]); // divide into three equal columns

    var rendererDiv = createWindow("renderer"); // renderer for left
    var r2div = createWindow("r2"); // middle window renderer
    var r3div = createWindow("r3"); // right window renderer
    root.appendChild(r2div);
    root.appendChild(r3div);
    root.appendChild(rendererDiv);

    var renderer = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });

     r2 = new THREE.WebGLRenderer({ // declared before to use callback for clipping
        antialias : true,
    });
    r2.localClippingEnabled = true;
    r2.clippingPlanes = [];

    var r3 = new THREE.WebGLRenderer({
        antialias : true,
    });


    var scene = new THREE.Scene(); // same scene for left and right
    scene.background = new THREE.Color( 'white');
    var scene2 = new THREE.Scene(); // scene for the middle
    scene2.background = new THREE.Color( 'white' );

    bear1 = helper.createTeddyBear(); // bear for left and righ

    bear2 = helper.createTeddyBear(); // new teddy bear for the mid window
    helper.setupCube(scene2) // cube for the mid window

    scene.add(bear1);
    scene2.add(bear2);



    camera = new THREE.PerspectiveCamera(); // fixed camera with frustum visible
    cam2 = helper.createCanonicalCamera(); // camera for the middle window
    cam3 = new THREE.PerspectiveCamera(); // cam for the first window which responds to control
    var cam4 = new THREE.PerspectiveCamera();
    helper.setupCamera(cam3, scene, 1,20, 60);
    helper.setupCamera(camera, scene, 1,10, 60);
    var lights = new THREE.AmbientLight(); // lights to first and third window
    var lights2 = new THREE.AmbientLight(); // lights to mid window
    ch1 = new THREE.CameraHelper(camera); // shows camera frustum, near and far plane
    ch2 = new THREE.CameraHelper(cam2); // shows camera frustum, near and far plane
    scene.add(ch1);  // add camerahelper to the scene

    var controls = new OrbitControls(cam3, rendererDiv); // control world camera on left window
    helper.setupControls(controls);
    var controls2 = new OrbitControls(cam2, r2div); // control orthographic camera on mid window
    helper.setupControls(controls2);
    var controls3 = new OrbitControls(camera, r3div); // control perspectivecamera on left/right window
    var controls4 = new OrbitControls(cam2, r3div); // control perspectivecamera on left/right window
    helper.setupControls(controls4);
    helper.setupControls(controls3);

    // handle the input from gui controls
    var settings = new helper.Settings();
    settings.addCallback(moveCamera);
    var gui = helper.createGUI(settings);
    gui.open();

    var wid = new RenderWidget(rendererDiv, renderer, cam3, scene,controls);
    var wid2 = new RenderWidget(r2div,r2 , cam2, scene2,controls2);
    //var wid4 = new RenderWidget(r2div, r2, cam2, scene2, controls4);
    var wid3 = new RenderWidget(r3div,r3 , camera, scene, controls3);


    wid.animate();
    wid2.animate();
    wid3.animate();
   // wid4.animate();

}

// call main entrypoint
main();
