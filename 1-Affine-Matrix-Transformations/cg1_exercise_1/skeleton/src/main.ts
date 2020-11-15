// put your imports here
import * as THREE from 'three';
//import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as utils from './lib/utils';
import * as helper from './helper';
//import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import RenderWidget from './lib/rendererWidget';
import {Application, createWindow} from './lib/window';
import {generateEnvModule} from "snowpack/dist-types/build/build-import-proxy";
import {Object3D} from "three";

function rotateUsingMatrix(a, b, g, objMatrix){ // rotation along z, y and x respectively.
    console.log("rotating object now");
    const trMatrix = new THREE.Matrix4();
    trMatrix.set(Math.cos(a) * Math.cos(b), (Math.cos(a) * Math.sin(b) * Math.sin(g)) - (Math.sin(a) * Math.cos(g)), (Math.cos(a) * Math.sin(b) * Math.cos(g))- (Math.sin(a) * Math.sin(g)), 0,
                    Math.sin(a) * Math.cos(b), (Math.sin(a) * Math.sin(b) * Math.sin(g))+(Math.cos(a) * Math.cos(g)), (Math.sin(a) * Math.sin(b) * Math.cos(g))-(Math.cos(a) * Math.sin(g)), 0,
                    (-1) * Math.sin(b) , (Math.cos(b) * Math.sin(g)), Math.cos(b) * Math.cos(g), 0,
                        0, 0, 0, 1);

    return objMatrix.multiply(trMatrix); // multiply the transformation matrix of the object with the matrix we got from parameter.
}

function highlightChild(curr){
    //curr.material.color.set('red');
    var ret;
    var child;
    for(var i=0; i<curr.children.length; i++){
        if(curr.children[i] instanceof  THREE.Mesh){
            child = curr.children[i]; // find the first child of type Mesh.
            console.log(child);
            (curr.children[i]).material.color.set('red'); // color its paretn green and it red (highlight)
            child.parent.material.color.set('green'); // " remove highlight"
            break;
        }
        window.addEventListener("keydown", event => { // do highlighting recursively
            if(event.key == "s"){
               child = highlightChild(child);
            }
        });
    }
    return child;
}

function selectNextSibling(curr){ // find next sibling which is Mesh, cycle through if not found
    const siblings = curr.parent.children;
    var i = siblings.indexOf(curr);
    for(var j=i; j< siblings.length; j++){
        console.log("j = " + j + " i= "+i + "len = "+ siblings.length);
        if(j == siblings.length -1){
            j= -1;
        }
        if(siblings[j+1] instanceof THREE.Mesh){
            curr.material.color.set('green');
            siblings[j+1].material.color.set('red');
            return siblings[j+1];
        }
    }
}

function selectPrevSibling(curr){//find previous sibling which is Mesh, cycle through if not found
    const siblings = curr.parent.children;
    var i = siblings.indexOf(curr);
    for(var j=i; j>0; j--){
        console.log("j = " + j + " i= "+i + "len = "+ siblings.length);
        if(j == 1){
            j= siblings.length;
        }
        if(siblings[j-1] instanceof THREE.Mesh){
            curr.material.color.set('green');
            siblings[j-1].material.color.set('red');
            return siblings[j-1];
        }
    }
}

function highlightParent(curr){ // go to parent, highlight if of type mesh (nested mesh geometry)
    if(curr.parent instanceof THREE.Mesh){ // parent not mesh means there's only scene after this.
        curr.material.color.set('green');
        curr.parent.material.color.set('red');
        return(curr.parent);
    }else{
        return curr;
    }
}

function main(){

    /* --------------------------------setup-------------------------------------------------------------*/

    var root = Application("Robot"); // taken from ex0
    root.setLayout([
        ["renderer", "."],
        [".", "."]
    ]);
    root.setLayoutColumns(["2fr", "1fr"]);
    root.setLayoutRows(["60%", "40%"]);

    var rendererDiv = createWindow("renderer");
    root.appendChild(rendererDiv);


    var renderer = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });
    var scene = new THREE.Scene();

    /*--------------------------Adding Robot Parts ---------------------------------------*/

    var geometry = new THREE.BoxGeometry(0.2,0.5,0.2);
    var material = new THREE.MeshLambertMaterial({color:'green'});
    var cube = new THREE.Mesh(geometry, material);

    var geometry2 = new THREE.BoxGeometry(0.5,0.1,0.1);
    var material2 = new THREE.MeshLambertMaterial({color:'green'});
    var cube2 = new THREE.Mesh(geometry2, material2);

    var geometry2_1 = new THREE.BoxGeometry(0.9,0.3,0.1);
    var material2_1 = new THREE.MeshLambertMaterial({color:'green'});
    var cube2_1 = new THREE.Mesh(geometry2_1, material2_1);

    var geometry3 = new THREE.BoxGeometry(0.2,0.6,0.1);
    var material3 = new THREE.MeshLambertMaterial({color:'green'});
    var cube3 = new THREE.Mesh(geometry3, material3);


    const axesHelper = new THREE.AxesHelper(5);
    const axesHelper2 = new THREE.AxesHelper(2);
    cube.add(axesHelper);
    cube.add(cube2);
    cube.add(cube2_1);
    cube2.add(axesHelper2);
    cube2.add(cube3);

    cube.matrixAutoUpdate = false;
    cube2.matrixAutoUpdate = false;
    cube2_1.matrixAutoUpdate = false;
    cube3.matrixAutoUpdate = false;
    scene.add(cube);

    /*----------------------------------------keyboard Input --------------------------------------------*/
var curr = cube;

    window.addEventListener("keydown", event => { //can't be included in callBack().wont't function right away.

        if(curr == cube){
            console.log("not working properly");
        }
        console.log(curr);
        console.log("pressed key : "+ event.key);
        if (event.key == "ArrowUp") {
            curr.matrix = rotateUsingMatrix(0, 0, 0.1, curr.matrix);
        }
        if (event.key == "ArrowDown") {
            curr.matrix = rotateUsingMatrix(0, 0, -0.1, curr.matrix);

        }
        if (event.key == "ArrowLeft") {
           curr.matrix= rotateUsingMatrix(0, 0.1, 0, curr.matrix);
        }
        if (event.key == "ArrowRight") {
           curr.matrix= rotateUsingMatrix(0, -0.1, 0, curr.matrix);

        }
        if (event.key == "s") {
            if(curr.children.length < 1 ){
                alert("reached maximum depth of object");
            }else {
                curr = highlightChild(curr);
            }
        }

        if(event.key == "d"){
            curr = selectNextSibling(curr);
        }
        if(event.key == "a"){
            curr = selectPrevSibling(curr);
        }
        if(event.key == "w"){
            curr = highlightParent(curr);
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
