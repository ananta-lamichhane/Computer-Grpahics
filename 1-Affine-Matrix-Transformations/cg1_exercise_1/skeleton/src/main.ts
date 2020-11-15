// put your imports here
import * as THREE from 'three';
//import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as utils from './lib/utils';
import * as helper from './helper';
//import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import RenderWidget from './lib/rendererWidget';
import {Application, createWindow} from './lib/window';
import {generateEnvModule} from "snowpack/dist-types/build/build-import-proxy";

function rotateUsingMatrix(a, b, g, objMatrix){ // rotation along z, y and x respectively.
    const trMatrix = new THREE.Matrix4();
    trMatrix.set(Math.cos(a) * Math.cos(b), (Math.cos(a) * Math.sin(b) * Math.sin(g)) - (Math.sin(a) * Math.cos(g)), (Math.cos(a) * Math.sin(b) * Math.cos(g))- (Math.sin(a) * Math.sin(g)), 0,
                    Math.sin(a) * Math.cos(b), (Math.sin(a) * Math.sin(b) * Math.sin(g))+(Math.cos(a) * Math.cos(g)), (Math.sin(a) * Math.sin(b) * Math.cos(g))-(Math.cos(a) * Math.sin(g)), 0,
                    (-1) * Math.sin(b) , (Math.cos(b) * Math.sin(g)), Math.cos(b) * Math.cos(g), 0,
                        0, 0, 0, 1);

    return objMatrix.multiply(trMatrix); // multiply the transformation matrix of the object with the matrix we got from parameter.
}

function highlightChild(curr){
    curr.traverse(function (child){
        if(child instanceof  THREE.Mesh){
            curr.material.color.set('red');
            child.material.color.set('orange');
        }
    });




    //var curr = obj;
   /* curr.material.color.set('orange');
    for(var i=0; i<curr.children.length; i++){
        if((curr.children[i]) instanceof THREE.Mesh){
            window.addEventListener("keydown", even => {
                if(even.key =="s"){
                    curr.material.color.set('red');
                    highlightChild(curr.children[i]);
                }
            });
         //   return curr;
        }
    }*/
}



function main(){

    /* --------------------------------setup-------------------------------------------------------------*/

    var root = Application("Robot"); // taken from ex0
    root.setLayout([
        ["renderer", "."],
        [".", "."]
    ]);
    root.setLayoutColumns(["3fr", "0fr"]);
    root.setLayoutRows(["100%", "0%"]);

    var rendererDiv = createWindow("renderer");
    root.appendChild(rendererDiv);


    var renderer = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });
    var scene = new THREE.Scene();

    /*--------------------------Adding Robot Parts ---------------------------------------*/

    var geometry = new THREE.BoxGeometry(1,1,1);
    var material = new THREE.MeshLambertMaterial({color:'purple'});
    var cube = new THREE.Mesh(geometry, material);

    var geometry2 = new THREE.BoxGeometry(2,0.1,0.1);
    var material2 = new THREE.MeshLambertMaterial({color:'blue'});
    var cube2 = new THREE.Mesh(geometry2, material2);

    var geometry3 = new THREE.BoxGeometry(0.2,4,0.1);
    var material3 = new THREE.MeshLambertMaterial({color:'white'});
    var cube3 = new THREE.Mesh(geometry3, material3);


    const axesHelper = new THREE.AxesHelper(5);
    const axesHelper2 = new THREE.AxesHelper(2);
    cube.add(axesHelper);
    cube.add(cube2);
    cube2.add(axesHelper2);
    cube2.add(cube3);

    cube.matrixAutoUpdate = false;
    scene.add(cube);

    /*----------------------------------------keyboard Input --------------------------------------------*/

    window.addEventListener("keydown", event => { //can't be included in callBack().wont't function right away.

        console.log("pressed key : "+ event.key);
        if (event.key == "ArrowUp") {
            rotateUsingMatrix(0, 0, 0.1, cube.matrix);
        }
        if (event.key == "ArrowDown") {
            rotateUsingMatrix(0, 0, -0.1, cube.matrix);

        }
        if (event.key == "ArrowLeft") {
            rotateUsingMatrix(0, 0.1, 0, cube.matrix);
        }
        if (event.key == "ArrowRight") {
            rotateUsingMatrix(0, -0.1, 0, cube.matrix);

        }
        if (event.key == "s") {
            cube.traverse(function (child){
                if(child instanceof  THREE.Mesh) {
                    console.log(child);
                   // child.visible = false;
                    child.material.color.set('orange');
                }
            });
        }

    });

    /*-------------------------- Lights, camera , Render.... ------------------------------------------------*/

    var camera = new THREE.PerspectiveCamera();
    helper.setupLight(scene);
    helper.setupCamera(camera, scene);
  //var controls = new OrbitControls(camera, rendererDiv);
   // helper.setupControls(controls);

    var wid = new RenderWidget(rendererDiv, renderer, camera, scene);//,controls);

    wid.animate();


}

// call main entrypoint
main();
