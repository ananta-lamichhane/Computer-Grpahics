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

function moveObject(x,y,z, obj){
    const trMatrix = new THREE.Matrix4();
    trMatrix.set(1,0,0,x,
                    0,1,0,y,
                    0, 0, 1, z,
                    0,0,0,1);
    obj.matrix.multiply(trMatrix);
    return obj;
}

function moveObject2(x,y,z, obj){
    const trMatrix = new THREE.Matrix4();
    trMatrix.set(1,0,0,x,
        0,1,0,y,
        0, 0, 1, z,
        0,0,0,1);
    obj.geometry.matrixWorld.multiply(trMatrix);
    return obj;
}

function highlightChild(curr){
    //curr.material.color.set('red');
    var child;
    for(var i=0; i<curr.children.length; i++) {
        if (curr.children[i] instanceof THREE.Mesh) {
            child = curr.children[i]; // find the first child of type Mesh.
            //console.log(child);
            (curr.children[i]).material.color.set('red'); // color its paretn green and it red (highlight)
            child.parent.material.color.set('green'); // " remove highlight"
            return child;
        }
    }
    return curr;

}

function selectNextSibling(curr){ // find next sibling which is Mesh, cycle through if not found
    const siblings = curr.parent.children;
    var i = siblings.indexOf(curr);
    if(siblings.length <= 1){
        return curr;
    }else {
        for (var j = i; j < siblings.length; j++) {
           // console.log("j = " + j + " i= " + i + "len = " + siblings.length);
            if (j == siblings.length - 1) {
                j = -1;
            }
            if (siblings[j + 1] instanceof THREE.Mesh) {
                curr.children.forEach(curr.children.material.color.set('green'));
                siblings[j + 1].material.color.set('red');
                return siblings[j + 1];
            }
        }
        return curr;
    }
}


function selectPrevSibling(curr){//find previous sibling which is Mesh, cycle through if not found
    const siblings = curr.parent.children;
    var i = siblings.indexOf(curr);
    if(siblings.length == 1){
        return curr;
    }else {
        for (var j = i; j > 0; j--) {
            console.log("j = " + j + " i= " + i + "len = " + siblings.length);
            if (j == 1) {
                j = siblings.length;
            }
            if (siblings[j - 1] instanceof THREE.Group) {
                curr.traverse(elem => elem.material.color.set("blue"));//curr.material.color.set('green');
                //siblings[j - 1].material.color.set('red');
                return siblings[j - 1];
            }
        }
        return curr;
    }
}

function highlightParent(curr){ // go to parent, highlight if of type mesh (nested mesh geometry)
    if(curr.parent instanceof THREE.Mesh){ // parent not mesh means there's only scene after this.
        curr.material.color.set('green');
        curr.parent.material.color.set('red');
        return(curr.parent);
    }else{
        curr.material.color.set('red');
        return curr;
    }
}


function changeRotCenter(obj, vec, rad){ // change axis origin to arbitrary point
    console.log("what the hell");
    var orig = obj.geometry.computeBoundingBox();
    console.log("now this");
    console.log(orig);
}

function showHideAxes(obj){
    for(var i=0; i<obj.children.length; i++){
        if(obj.children[i] instanceof THREE.AxesHelper){
            obj.children[i].material.visible = obj.children[i].material.visible == false;
        }
    }
}

function moveObjectEx(x, y, z, obj){
    for(var i=0; i< obj.geometry.vertices.length; i++){
        obj.geometry.vertices[i].add(new THREE.Vector3(x,y,z));
    }

    return obj;
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

    var geometry2 = new THREE.BoxGeometry(0.2,0.1,0.1);
    var material2 = new THREE.MeshLambertMaterial({color:'green'});
    var cube2 = new THREE.Mesh(geometry2, material2);

    var geometry2_1 = new THREE.BoxGeometry(0.4,0.1,0.1);
    var material2_1 = new THREE.MeshLambertMaterial({color:'green'});
    var cube2_1 = new THREE.Mesh(geometry2_1, material2_1);

    var geometry2_2 = new THREE.BoxGeometry(0.4,0.1,0.1);
    var material2_2 = new THREE.MeshLambertMaterial({color:'green'});
    var cube2_2 = new THREE.Mesh(geometry2_2, material2_2);

    var grp0 = new THREE.Group();

    var grp5 = new THREE.Group();
    var grp3 = new THREE.Group();
    var grp2 = new THREE.Group();
    var grp1 = new THREE.Group();
    var grp4 = new THREE.Group();



    var geometry3 = new THREE.BoxGeometry(0.06,0.3,0.1);
    var material3 = new THREE.MeshLambertMaterial({color:'green'});
    var cube3 = new THREE.Mesh(geometry3, material3);

    var geometry3_1 = new THREE.BoxGeometry(0.06,0.3,0.1);
    var material3_1 = new THREE.MeshLambertMaterial({color:'green'});
    var cube3_1 = new THREE.Mesh(geometry3_1, material3_1);

    var geometry4 = new THREE.BoxGeometry(0.05,0.05,0.1);
    var material4 = new THREE.MeshLambertMaterial({color:'white'});
    var cube4 = new THREE.Mesh(geometry4, material4);

    var geometry4_1 = new THREE.BoxGeometry(0.05,0.05,0.1);
    var material4_1 = new THREE.MeshLambertMaterial({color:'white'});
    var cube4_1 = new THREE.Mesh(geometry4_1, material4_1);


    const axesHelper = new THREE.AxesHelper(5);
    const axesHelper2 = new THREE.AxesHelper(2);


    grp1.matrixAutoUpdate = false;
    grp2.matrixAutoUpdate = false;
    grp3.matrixAutoUpdate = false;
    grp4.matrixAutoUpdate = false;
    grp5.matrixAutoUpdate = false;
    grp0.matrixAutoUpdate = false;


    cube.matrixAutoUpdate = false;
    cube2.matrixAutoUpdate = false;
    cube2_1.matrixAutoUpdate = false;
    cube3.matrixAutoUpdate = false;
    cube2_2.matrixAutoUpdate = false;
    cube3_1.matrixAutoUpdate = false;
    cube4.matrixAutoUpdate = false;
    cube4_1.matrixAutoUpdate = false;


    grp1.add(cube);
    grp1.add(axesHelper);
    var vec = new THREE.Vector3(1,1,1);

   // cube2 = moveObject(0, 0.4,0, cube2);
    grp2 = moveObject(0, 0.4,0, grp2);
    grp2.add(cube2);


    grp3 = moveObject(-0.05, -0.45, 0,grp3);
    grp3.add(cube3);


    console.log("---------------------------");

    console.log(cube.geometry.vertices);
    console.log("---------------------------")

    grp0.add(grp1);
    grp0.add(grp2);
    grp0.add(grp3);



    //cube2_2 = moveObject(-0.4, 0, 0, cube2_2);
   // cube3 = moveObject(-0.05, -0.45, 0, cube3);
    //cube3.geometry.center();
   // cube3_1 = moveObject(0.05, -0.45, 0, cube3_1);

   // cube.add(cube2_1);
    //cube2_1 = moveObject(0.4, 0, 0, cube2_1);
    //cube.add(cube2_2);
   // cube2.add(axesHelper2);
    //cube.add(cube3);
    //scube3.add(new THREE.AxesHelper(0.2));
    //cube3.add(cube4);
    //cube3_1.add(cube4_1);
    //cube4_1.matrix = moveObject(0.1, 0.1, 0, cube4_1.matrix);
    //cube4.matrix = moveObject(0.1, 0.1, 0, cube4.matrix);
   // cube.add(cube3_1);

    const orig = grp0;
    scene.add(grp0);

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

                curr = highlightChild(curr);
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
        if(event.key == "w"){
            curr = orig;
        }
        if(event.key == "c"){
            showHideAxes(curr);
        }
        if(event.key == "x"){
            var s= new THREE.Sphere();
           // curr.geometry.normalize();
            curr.geometry.boundingSphere?.set(new THREE.Vector3(0,0,0), 2);
            curr.geometry.center();
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
