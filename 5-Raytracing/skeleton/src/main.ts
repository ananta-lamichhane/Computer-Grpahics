// custom imports
import { CanvasWidget, ImageData } from './canvasWidget';
import * as helper from './helper';
import RenderWidget from './lib/rendererWidget';
import {Application, createWindow} from './lib/window';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Raycaster, RGB_ETC2_Format, Shape, ShapeUtils, SphereGeometry, Vector3 } from 'three';
import { objectFlip, radToDeg } from './lib/utils';

function checkRayIntersection(obj: THREE.Mesh, ray:THREE.Raycaster, target: THREE.Vector3):Boolean{
    //reference:https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection
    var O = new THREE.Vector3(0,0,0);//Origin of ray (camera position)
    var O_copy = new THREE.Vector3(0,0,0);// vector arithmatic modifies O
    obj.geometry.computeBoundingSphere();
    var R = obj.geometry.boundingSphere?.radius; // radius of the sphere in question
    var L = new THREE.Vector3(0,0,0);// dist from camera to centre of circle
    var L_orig = new THREE.Vector3(0,0,0);//copy
    var C = new THREE.Vector3(0,0,0);//centre of circle
    var C_orig = new THREE.Vector3(0,0,0);//copy
    var ray_dir = new THREE.Vector3(0,0,0); // ray actual direction , camera to the destination point
    O.copy(ray.camera.position);
    O_copy.copy(ray.camera.position);
    
    C.copy(obj.position); // centre of sphere
    C_orig.copy(obj.position); // centre of sphere
    L.copy(C_orig.sub( O_copy));
    ray_dir.copy(target);
    ray_dir.sub(O);
    var proj = L.projectOnVector(ray_dir); // project L onto the ray direction
    var d = C_orig.distanceTo(proj); // distance from centre of circle to the ray

    if(d< R){
        return true;
    }
    return false;

}
function calculatePixelColors(camera: THREE.Camera, scene: THREE.Scene, wid: CanvasWidget){
    for(var i=1; i< 256; i=i+ 1){
        for(var j=1; j< 256; j= j+ 1){
        var vec = new THREE.Vector2(i/256 *2 -1 ,(-1 *j /256 * 2) +1); // coordinate in NDC space
        var rc = new THREE.Raycaster();
        rc.setFromCamera(vec, camera); 
            wid.setPixel(i, j, rc.intersectObjects(scene.children)[0].object.material.color);
 
    }
}
}
function calculatePixelColors_cor(camera: THREE.Camera, scene: THREE.Scene, wid: CanvasWidget){
    for(var i=1; i< 256; i=i+ 1){
        for(var j=1; j< 256; j= j+ 1){
        var vec = new THREE.Vector3(i/256 *2 -1 ,(-1 *j /256 * 2) +1, 0.06); // coordinate in NDC space
        //vec.unproject(camera);
        var rc = new THREE.Raycaster();
        var arr: THREE.Mesh[] = [];
        scene.traverse(elem =>{
            if (elem instanceof THREE.Mesh){
                arr.push(elem);
            }
        });
        rc.setFromCamera(vec, camera);
        var first = rc.intersectObjects(scene.children)[0].object;
        var col = false;
        arr.forEach(shape =>{
            if((<THREE.Mesh>shape).geometry instanceof THREE.SphereGeometry){ // check to see if the pixel belong to one of the spheres
                if(checkRayIntersection(shape, rc, vec)){
                    wid.setPixel(i, j, (<THREE.Mesh>shape).material.color);
                    col = true;
                }
            }
        });
        if(col == false){
            if(!((<THREE.Mesh> first).geometry instanceof THREE.SphereGeometry)){
                wid.setPixel(i, j, (<THREE.Mesh>first).material.color);
            }
            
        }
        }
    }
}


function main(){

    var root = Application("ShaderFun"); // taken from ex0
    root.setLayout([
        ["r2", "renderer"]
    ]);
    root.setLayoutColumns(["50%", "50%"]);
    var rendererDiv = createWindow("renderer"); // renderer for left
    var renderer = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });
    var r2div = createWindow("r2");
    var wid2 = new CanvasWidget(r2div, 256, 256); // new widget type to load image on the left side

    root.appendChild(rendererDiv);
    root.appendChild(r2div);
    var scene = new THREE.Scene();
    
    scene.background = new THREE.Color( 'black');
    var lights = helper.setupLight(scene);
    var geom = helper.setupGeometry(scene);
    var settings = new helper.Settings();
    
    var camera = new THREE.PerspectiveCamera();
    camera = helper.setupCamera(camera);

/////code here
    calculatePixelColors(camera, scene, wid2);
    //calculatePixelColors_cor(camera, scene, wid2);
    var gui = helper.createGUI(settings);
    gui.open();
    
    var ctrl = new OrbitControls(camera, rendererDiv);
    var controls = helper.setupControls(ctrl);
    
    var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
    wid.animate();

    wid2.savePNG("test.jpg");


}

// call main entrypoint
main();
