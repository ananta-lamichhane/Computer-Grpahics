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




/*
*Helper Functions: these functions help in functionality
* all affine transformations are undertaken using matrix multiplication of underlying matrix
* Rotation axis of an object is exactly its middle point by default. This is changed by changing the rotation axis
* of the group as a whole. i.e. object3d resides in the group and is offset from the group centre so, when the group
* rotates, object rotates on its edge. see: hands, legs and feet..
* */

function rotateUsingMatrix(a, b, g, obj){ // rotation along z, y and x respectively, all at once.
    console.log("rotating object now");
    const trMatrix = new THREE.Matrix4();
    trMatrix.set(Math.cos(a) * Math.cos(b), (Math.cos(a) * Math.sin(b) * Math.sin(g)) - (Math.sin(a) * Math.cos(g)), (Math.cos(a) * Math.sin(b) * Math.cos(g))- (Math.sin(a) * Math.sin(g)), 0,
                    Math.sin(a) * Math.cos(b), (Math.sin(a) * Math.sin(b) * Math.sin(g))+(Math.cos(a) * Math.cos(g)), (Math.sin(a) * Math.sin(b) * Math.cos(g))-(Math.cos(a) * Math.sin(g)), 0,
                    (-1) * Math.sin(b) , (Math.cos(b) * Math.sin(g)), Math.cos(b) * Math.cos(g), 0,
                        0, 0, 0, 1);

    obj.matrix.multiply(trMatrix); // multiply the transformation matrix of the object with the matrix we got from parameter.
    return obj;
}

function moveObject(x,y,z, obj){ // move an object3d, mesh or a group by matrix multiplication
    const trMatrix = new THREE.Matrix4();
    trMatrix.set(1,0,0,x,
                    0,1,0,y,
                    0, 0, 1, z,
                    0,0,0,1);
    obj.matrix.multiply(trMatrix);
    return obj;
}

function highlightGroup(grp, color){ // recursively highlight all elements inside a group.
    grp.traverse(elem => elem.material?.color.set(color));
    return grp;
}

function highlightChild(curr){ // highlight child of currently highlighted object (group).
    //curr.material.color.set('red');
    var child;
    for(var i=0; i<curr.children.length; i++) {
       if(curr.children[i] instanceof  THREE.Group){
           highlightGroup(curr, "red"); // remove highlight on current object
           highlightGroup(curr.children[i], "blue"); // highlight child and its children.
           return curr.children[i]; // highlighted child is now current object
       }

    }
    return curr; // if this returns there was no instance of group in the array, stay where you are.


}

function selectNextSibling(curr){ // find next sibling which is Mesh, cycle through if not found
    const siblings = curr.parent.children;
    var i = siblings.indexOf(curr);
    if(siblings.length <= 1){
        return curr;
    }else {
        for (var j = i; j < siblings.length; j++) {
            if (siblings[(j + 1)%siblings.length] instanceof THREE.Group) { // cycle through
                highlightGroup(siblings[(j+1)%siblings.length], "blue");
                highlightGroup(curr, "red");
                return siblings[(j + 1)%siblings.length];
            }
        }
        return curr;
    }
}


function selectPrevSibling(curr){//find previous sibling which is Mesh, cycle through if not found
    const siblings = curr.parent.children;
    console.log("siblings:");
    console.log(siblings);
    const bislings = siblings;

    console.log("siblings reversed:");
    console.log(bislings);
    var i = bislings.indexOf(curr);
    if(bislings.length <= 1){ // if only current element is in the array or array is empty do nothing
        return curr;
    }else {
        for (var j = i; j >-1; j--) {
            j = j==0?siblings.length:j; // if j=0 set it to sib.length, else let it be.
            if (bislings[(j -1)] instanceof THREE.Group) {
                highlightGroup(bislings[(j-1)], "blue");
                highlightGroup(curr, "red");
                return bislings[(j-1)];
            }
        }
        return curr;
    }

}

function highlightParent(curr){ // go to parent, highlight if of type mesh (nested mesh geometry)
    if(curr.parent instanceof THREE.Group){
        highlightGroup(curr.parent, "blue"); // go to parent and highlight it.
        return curr.parent;
    }else{
        return curr;
    }
}


function showHideAxes(obj){ // toggle visibility of local coordinate axes.
    for(var i=0; i<obj.children.length; i++){
        if(obj.children[i] instanceof THREE.AxesHelper){
            obj.children[i].material.visible = obj.children[i].material.visible == false;
        }
    }
}



function distFromCentre(grp){
    var curr = grp;
    var x=0, y=0, z=0;

    while(curr.parent instanceof THREE.Group){
        x+= curr.matrix.toArray()[12];
        y+= curr.matrix.toArray()[13];
        z += curr.matrix.toArray()[14];
        curr = curr.parent;
    }

    return [x,y,z];
}

function findAxes(grp, axes_grp){
    for(let i=0; i< axes_grp.length; i++){
        if(grp.matrix.toArray()[12] == axes_grp[i].matrix.toArray()[12] &&
            grp.matrix.toArray()[13] == axes_grp[i].matrix.toArray()[13] &&
            grp.matrix.toArray()[14] == axes_grp[i].matrix.toArray()[14]
        ){
            return axes_grp[i];
        }
    }
    console.log("no axes found");
}

function placeAxes(grp, axes){ // since axes are directly added to scene in the centre of screen, move them to
    // the position where the group is
    let dist = distFromCentre(grp);
    moveObject(dist[0], dist[1], dist[2], axes);

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

    var geometry = new THREE.BoxGeometry(0.2,0.5,0.2);
    var material = new THREE.MeshLambertMaterial({color:'green'});
    var torso = new THREE.Mesh(geometry, material);

    var geometry2 = new THREE.BoxGeometry(0.2,0.1,0.1);
    var material2 = new THREE.MeshLambertMaterial({color:'green'});
    var head = new THREE.Mesh(geometry2, material2);

    var geometry2_1 = new THREE.BoxGeometry(0.4,0.1,0.1);
    var material2_1 = new THREE.MeshLambertMaterial({color:'green'});
    var cube2_1 = new THREE.Mesh(geometry2_1, material2_1);

    var geometry2_2 = new THREE.BoxGeometry(0.4,0.1,0.1);
    var material2_2 = new THREE.MeshLambertMaterial({color:'green'});
    var cube2_2 = new THREE.Mesh(geometry2_2, material2_2);

    var grp0 = new THREE.Group();

    var leg1_grp = new THREE.Group();
    var head_grp = new THREE.Group();
    var torso_grp = new THREE.Group();
    var leg2_grp = new THREE.Group();

    var foot1_grp = new THREE.Group();
    var foot2_grp = new THREE.Group();



    var geometry3 = new THREE.BoxGeometry(0.06,0.3,0.1);
    var material3 = new THREE.MeshLambertMaterial({color:'green'});
    var leg1 = new THREE.Mesh(geometry3, material3);

    var geometry3_1 = new THREE.BoxGeometry(0.06,0.3,0.1);
    var material3_1 = new THREE.MeshLambertMaterial({color:'green'});
    var leg2 = new THREE.Mesh(geometry3_1, material3_1);

    var geometry4 = new THREE.BoxGeometry(0.05,0.05,0.1);
    var material4 = new THREE.MeshLambertMaterial({color:'white'});
    var foot1 = new THREE.Mesh(geometry4, material4);

    var geometry4_1 = new THREE.BoxGeometry(0.05,0.05,0.1);
    var material4_1 = new THREE.MeshLambertMaterial({color:'white'});
    var foot2 = new THREE.Mesh(geometry4_1, material4_1);


    let torso_axis = new THREE.AxesHelper(1);
    let head_axis = new THREE.AxesHelper(1);
    let hand1_axis = new THREE.AxesHelper(1);
    let hand2_axis = new THREE.AxesHelper(1);
    let leg1_axis = new THREE.AxesHelper(1);
    let leg2_axis = new THREE.AxesHelper(1);
    let foot1_axis = new THREE.AxesHelper(1);
    let foot2_axis = new THREE.AxesHelper(1);
    let grp0_axis = new THREE.AxesHelper(1);



    let axes_grp: THREE.AxesHelper[] = [];
    let group_grp : THREE.Group [] = [];


    group_grp.push(grp0);
    group_grp.push(head_grp);
    group_grp.push(torso_grp);
    group_grp.push(leg1_grp);
    group_grp.push(leg2_grp);
    group_grp.push(foot1_grp);
    group_grp.push(foot2_grp);
  //  group_grp.push(hand1_grp);
   // group_grp.push(hand2_grp);
    axes_grp.push(grp0_axis);
    axes_grp.push(head_axis);
    axes_grp.push(torso_axis);
    axes_grp.push(foot1_axis);
    axes_grp.push(foot2_axis);
    axes_grp.push(leg1_axis);
    axes_grp.push(leg2_axis);


    /********set matrix auto update false *********************/

    torso.matrixAutoUpdate = false;
    head.matrixAutoUpdate = false;
    leg1.matrixAutoUpdate = false;
    leg2.matrixAutoUpdate = false;
    foot1.matrixAutoUpdate = false;
    foot2.matrixAutoUpdate = false;


    axes_grp.forEach(elem =>elem.matrixAutoUpdate =false);
    group_grp.forEach(elem =>elem.matrixAutoUpdate =false);

    /*------------------------------------------------------------------------------------------
    *Create scene graph hierarchy, enclose each object in a group so as to make rotation on
    * edge easier

    *--------------------------------------------------------------------------------- */


    torso_grp.add(torso);



   // head = moveObject(0, 0.4,0, cube2);
    head_grp = moveObject(0, 0.4,0, head_grp); // move the group first
    head_grp.add(head); // add object to the group
    //moveObject(0, 0.2, 0, cube2);


    leg2 = moveObject(0, -0.26, 0,leg2);
    leg2_grp = moveObject(0.05, -0.20, 0,leg2_grp);
    leg2_grp.add(leg2);

    // move object from group centre (for offset in rotation centre)
    leg1 = moveObject(0, -0.26, 0,leg1);
    leg1_grp = moveObject(-0.05, -0.20, 0,leg1_grp);
    leg1_grp.add(leg1);

     foot1_grp.add(foot1);
     foot2_grp.add(foot2);

    moveObject(0, -0.35, 0.01, foot1_grp);
    moveObject(0, -0.05, 0.0, foot1);
    moveObject(0, -0.35, 0.01, foot2_grp);
    moveObject(0, -0.05, 0.0, foot2);

     leg1_grp.add(foot1_grp);
    leg2_grp.add(foot2_grp);



    grp0.add(head_grp);
    grp0.add(leg1_grp);
    grp0.add(leg2_grp);
    grp0.add(torso_grp); // create a group hierarchy


/******************Add axes for each group to the scene directly, move them where the groups are**********/
    axes_grp.forEach(elem => scene.add(elem));
    for(let i = 0; i< axes_grp.length; i++){
        console.log("what the hell");
        let distance_from_centre = distFromCentre(group_grp[i]);
        moveObject(distance_from_centre[0], distance_from_centre[1], distance_from_centre[2],axes_grp[i]);
        //axes_grp[i].visible = false;
    }






    var orig = grp0.clone(true);

    /***********************Create scene ******************************/

    scene.add(grp0);

    /*----------------------------------------keyboard Input --------------------------------------------*/
    var curr = grp0; // start working on the largest group, curr will be overwritten after it goes into listener loop
    var curraxis = findAxes(grp0, axes_grp);

    window.addEventListener("keydown", event => { //can't be included in callBack().wont't function right away.
        console.log("pressed key : "+ event.key);
        console.log(curr);
        curraxis = findAxes(curr, axes_grp);
        if (event.key == "ArrowUp") {
            rotateUsingMatrix(0, 0, 0.1, curr);
            rotateUsingMatrix(0,0,0.1, curraxis);
        }
        if (event.key == "ArrowDown") {
            rotateUsingMatrix(0, 0, -0.1, curr);
            rotateUsingMatrix(0,0,-0.1, curraxis);

        }
        if (event.key == "ArrowLeft") {
           rotateUsingMatrix(0, 0.1, 0, curr);
            rotateUsingMatrix(0,0.1,0, curraxis);
        }
        if (event.key == "ArrowRight") {
           rotateUsingMatrix(0, -0.1, 0, curr);
            rotateUsingMatrix(0,-0.1,0, curraxis);
        }
        if (event.key == "s") {
            curraxis.visible = false;
            curr = highlightChild(curr);
            curraxis = findAxes(curr, axes_grp);
            curraxis.visible = true;
        }

        if(event.key == "d"){
            curraxis.visible = false;
            curr = selectNextSibling(curr);
            curraxis = findAxes(curr, axes_grp);
            curraxis.visible = true;
        }
        if(event.key == "a"){
            curraxis.visible = false;
            curr = selectPrevSibling(curr);
            curraxis = findAxes(curr, axes_grp);
            curraxis.visible = true;
        }
        if(event.key == "w"){
            curraxis.visible = false;
            curr = highlightParent(curr);
            curraxis = findAxes(curr, axes_grp);
            curraxis.visible = true;
        }
        if(event.key == "c"){
            findAxes(curr, axes_grp).visible = findAxes(curr, axes_grp).visible == false;
        }
        if(event.key == "r"){ // TODO : must be done traversing the matrix
            scene.remove(grp0);
            scene.add(orig);
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
