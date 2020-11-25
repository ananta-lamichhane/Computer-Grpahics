// put your imports here
import * as THREE from 'three';
//import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as utils from './lib/utils';
import * as helper from './helper';
//import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import RenderWidget from './lib/rendererWidget';
import {Application, createWindow} from './lib/window';
import * as tr from './transform_functions'

/*
*Helper Functions: these functions help in functionality
* all affine transformations are undertaken using matrix multiplication of underlying matrix
* Rotation axis of an object is exactly its middle point by default. This is changed by changing the rotation axis
* of the group as a whole. i.e. object3d resides in the group and is offset from the group centre so, when the group
* rotates, object rotates on its edge. see: hands, legs and feet..
* */



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



    var torso_geometry = new THREE.BoxGeometry(0.2,0.5,0.2); // moves independently too
    var torso_material = new THREE.MeshLambertMaterial({color:'red'});
    var torso = new THREE.Mesh(torso_geometry, torso_material);

    var head_geometry = new THREE.BoxGeometry(0.2,0.1,0.1);
    var head_material = new THREE.MeshLambertMaterial({color:'red'});
    var head = new THREE.Mesh(head_geometry, head_material);


    var leg1_geometry = new THREE.BoxGeometry(0.06,0.3,0.1);
    var leg1_material = new THREE.MeshLambertMaterial({color:'red'});
    var leg1 = new THREE.Mesh(leg1_geometry, leg1_material);

    var leg2_geometry = new THREE.BoxGeometry(0.06,0.3,0.1);
    var leg2_material = new THREE.MeshLambertMaterial({color:'red'});
    var leg2 = new THREE.Mesh(leg2_geometry,leg2_material);

    var hand1_geometry = new THREE.BoxGeometry(0.25,0.05,0.1);
    var hand1_material = new THREE.MeshLambertMaterial({color:'red'});
    var hand1 = new THREE.Mesh(hand1_geometry, hand1_material);

    var hand2_geometry = new THREE.BoxGeometry(0.25,0.05,0.1);
    var hand2_material = new THREE.MeshLambertMaterial({color:'red'});
    var hand2 = new THREE.Mesh(hand2_geometry,hand2_material);

    var foot1_geometry = new THREE.BoxGeometry(0.05,0.05,0.05);
    var foot1_material = new THREE.MeshLambertMaterial({color:'red'});
    var foot1 = new THREE.Mesh(foot1_geometry, foot1_material);

    var foot2_geometry = new THREE.BoxGeometry(0.05,0.05,0.05);
    var foot2_material = new THREE.MeshLambertMaterial({color:'red'});
    var foot2 = new THREE.Mesh(foot2_geometry, foot2_material);


    let torso_axis = new THREE.AxesHelper(1);
    let head_axis = new THREE.AxesHelper(1);
    let hand1_axis = new THREE.AxesHelper(1);
    let hand2_axis = new THREE.AxesHelper(1);
    let leg1_axis = new THREE.AxesHelper(1);
    let leg2_axis = new THREE.AxesHelper(1);
    let foot1_axis = new THREE.AxesHelper(0.33);
    let foot2_axis = new THREE.AxesHelper(0.33);
    let grp0_axis = new THREE.AxesHelper(2);

    var grp0 = new THREE.Group();
    var leg1_grp = new THREE.Group();
    var head_grp = new THREE.Group();
    var torso_grp = new THREE.Group();
    var leg2_grp = new THREE.Group();
    let hand1_grp = new THREE.Group();
    let hand2_grp = new THREE.Group();

    var foot1_grp = new THREE.Group();
    var foot2_grp = new THREE.Group();


    let axes_grp: THREE.AxesHelper[] = [];
    let group_grp : THREE.Group [] = [];


    group_grp.push(grp0);
    group_grp.push(head_grp);
    group_grp.push(torso_grp);
    group_grp.push(leg1_grp);
    group_grp.push(leg2_grp);
    group_grp.push(foot1_grp);
    group_grp.push(foot2_grp);
    group_grp.push(hand1_grp);
    group_grp.push(hand2_grp);

    axes_grp.push(grp0_axis);
    axes_grp.push(head_axis);
    axes_grp.push(torso_axis);
    axes_grp.push(leg1_axis);
    axes_grp.push(leg2_axis);
    axes_grp.push(hand1_axis);
    axes_grp.push(hand2_axis);
    axes_grp.push(foot1_axis);
    axes_grp.push(foot2_axis);

    /********set matrix auto update false *********************/

    torso.matrixAutoUpdate = false;
    head.matrixAutoUpdate = false;
    leg1.matrixAutoUpdate = false;
    leg2.matrixAutoUpdate = false;
    foot1.matrixAutoUpdate = false;
    foot2.matrixAutoUpdate = false;
    hand2.matrixAutoUpdate = false;
    hand1.matrixAutoUpdate =false;


    axes_grp.forEach(elem =>elem.matrixAutoUpdate =false);
    group_grp.forEach(elem =>elem.matrixAutoUpdate =false);

    /*------------------------------------------------------------------------------------------
    *Create scene graph hierarchy, enclose each object in a group so as to make rotation on
    * edge easier

    *--------------------------------------------------------------------------------- */


    torso_grp.add(torso);

    head_grp = tr.moveObject(0, 0.4,0, head_grp); // move the group first
    head_grp.add(head); // add object to the group

    leg2_grp = tr.moveObject(0.05, -0.30, 0,leg2_grp);
    leg2_grp.add(leg2);
    tr.moveObject(0, -0.15, 0,leg2);


    // move object from group centre (for offset in rotation centre)
    leg1 = tr.moveObject(0, -0.15, 0,leg1);
    leg1_grp = tr.moveObject(-0.05, -0.30, 0,leg1_grp);
    leg1_grp.add(leg1);


    // move object from group centre (for offset in rotation centre)
    hand1 = tr.moveObject(-0.15, 0, 0,hand1);
    hand1_grp = tr.moveObject(-0.10, 0, 0,hand1_grp);
    hand1_grp.add(hand1);

    hand2_grp = tr.moveObject(0.10, 0, 0,hand2_grp);
    hand2_grp.add(hand2);
    tr.moveObject(0.15, 0, 0,hand2);




    foot1_grp.add(foot1);
    foot2_grp.add(foot2);

    tr.moveObject(0, -0.25, 0.01, foot1_grp);
    tr.moveObject(0, -0.05, 0.0, foot1);
    tr.moveObject(0, -0.25, 0.02, foot2_grp);
    tr.moveObject(0, -0.05, 0.0, foot2);

    leg1_grp.add(foot1_grp);
    leg2_grp.add(foot2_grp);

    grp0.add(head_grp);
    grp0.add(leg1_grp);
    grp0.add(leg2_grp);
    grp0.add(hand1_grp);
    grp0.add(hand2_grp);
    grp0.add(torso_grp); // create a group hierarchy


/******************Add axes for each group to the scene directly, move them where the groups are**********/
    axes_grp.forEach(elem => scene.add(elem));
    for(let i = 0; i< group_grp.length; i++){
        let distance_from_centre = tr.distFromCentre(group_grp[i]);
       tr.moveObject(distance_from_centre[0], distance_from_centre[1], distance_from_centre[2],axes_grp[i]);
        axes_grp[i].visible = false;
    }

    /***********************Create scene ******************************/

    scene.add(grp0);

    /*----------------------------------------keyboard Input --------------------------------------------*/
    var curr = grp0; // start working on the largest group, curr will be overwritten after it goes into listener loop
   var curraxis = axes_grp[group_grp.indexOf(curr)];


    window.addEventListener("keydown", event => { //can't be included in callBack().wont't function right away.

        curraxis = axes_grp[group_grp.indexOf(curr)];
        if (event.key == "ArrowUp") {
            tr.rotateUsingMatrix(0, 0, 0.1, curr); // rotate object
            tr.rotateUsingMatrix(0, 0, 0.1, curraxis); // rotate its axis
        }
        if (event.key == "ArrowDown") {
            tr.rotateUsingMatrix(0, 0, -0.1, curr);
            tr.rotateUsingMatrix(0,0,-0.1, curraxis);
        }
        if (event.key == "ArrowLeft") {
           tr.rotateUsingMatrix(0, 0.1, 0, curr);
            tr.rotateUsingMatrix(0,0.1,0, curraxis);
        }
        if (event.key == "ArrowRight") {

           tr.rotateUsingMatrix(0, -0.1, 0, curr);
            tr.rotateUsingMatrix(0,-0.1,0, curraxis);
        }
        if (event.key == "s") {
            curraxis.visible = false;
            curr = tr.highlightChild(curr);
            curraxis = axes_grp[group_grp.indexOf(curr)];
            curraxis.visible = true;
        }

        if(event.key == "d"){
            curraxis.visible = false;
            curr = tr.selectNextSibling(curr);
            curraxis = axes_grp[group_grp.indexOf(curr)];
            curraxis.visible = true;
        }
        if(event.key == "a"){
            curraxis.visible = false;
            curr = tr.selectPrevSibling(curr);
            curraxis = axes_grp[group_grp.indexOf(curr)];
            curraxis.visible = true;
        }
        if(event.key == "w"){
            curraxis.visible = false;
            curr = tr.highlightParent(curr);
            curraxis = axes_grp[group_grp.indexOf(curr)];
            curraxis.visible = true;
        }
        if(event.key == "c"){
            curraxis = axes_grp[group_grp.indexOf(curr)];
            curraxis.visible = !curraxis.visible;
        }
        if(event.key == "r"){ // TODO : must be done traversing the matrix
            group_grp.forEach(elem => tr.resetAl(elem)); // reset position
            axes_grp.forEach(elem => tr.resetAl(elem));
            group_grp.forEach(elem =>tr.highlightGroup(elem, 'red') ); // reset color
            curr = grp0; // go back to the root
            curraxis = grp0_axis; // go back to the root axis.
        }
    });

    /*-------------------------- Lights, camera , Render.... ------------------------------------------------*/

    var camera = new THREE.PerspectiveCamera();
    helper.setupLight(scene);
    helper.setupCamera(camera, scene);
    var wid = new RenderWidget(rendererDiv, renderer, camera, scene);//,controls);

    wid.animate();


}

// call main entrypoint
main();
