
import ImageWidget from './imageWidget';
// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';
import * as THREE from 'three';
import type * as utils from './lib/utils';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Application, createWindow} from './lib/window';
import RenderWidget from './lib/rendererWidget';
import * as dat from 'dat.gui';
import vShader from './uv.v.glsl';
import fShader from './uv.f.glsl';
import svShader from './spherical.v.glsl';
import sfShader from './spherical.f.glsl';
import s_fixvShader from './spherical_fixed.v.glsl';
import s_fixfShader from './spherical_fixed.f.glsl';
import evShader from './environment.v.glsl';
import efShader from './environment.f.glsl';
import nfShader from './normal_map.f.glsl';
import nvShader from './normal_map.v.glsl';
import { Geometry, ImageLoader } from 'three';


function cleanUpScene(sc: THREE.Scene){ // delete all meshes execept the scene
    sc.traverseVisible(function(child) {
        if (child.type == 'Mesh') {
           sc.remove(child);
        }
     });
}




function createQuad(){

    var geom = new THREE.BufferGeometry();
    const vertices = new Float32Array( [ // 2x2 quad made up of two triangles 
        -1.0, -1.0,  0.0, // tr1 = A(-1,-1), B(1,-1), C(1,1)
         1.0, -1.0,  0.0,
         1.0,  1.0,  0.0,// tr1 = A(1,1), B(-1,1), C(-1,-1)
        -1.0,  1.0,  0.0
    ] );
    const uvs = new Float32Array( [ // uv coordinates.
       0.0, 0.0, //specify uvs here
        1.0, 0.0,
       1.0, 1.0,
       0.0, 1.0  


    ] );
    geom.setIndex([0,1,2,0,2,3]); // order of vertices to make two triangles of the quad
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    return geom;
    
}









function main(){



// everything in global namespace, too late to clean this mess up.
var lights: THREE.PointLight;
var mat : THREE.RawShaderMaterial;
var img: HTMLImageElement;
var texture_loader:THREE.TextureLoader | THREE.CanvasTexture;
var img_source : string = "./textures/earth.jpg"; // populate initially
var scene : THREE.Scene;
var geom: THREE.Geometry | THREE.BufferGeometry;
var material: THREE.RawShaderMaterial;
var wid2 : ImageWidget;
var vS = vShader; // placeholders
var fS = fShader;




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
wid2 = new ImageWidget(r2div); // new widget type to load image on the left side

root.appendChild(rendererDiv);
root.appendChild(r2div);
scene = new THREE.Scene();
scene.background = new THREE.Color( 'black');

var camera = new THREE.PerspectiveCamera();
camera = helper.setupCamera(camera, scene);

var ctrl = new OrbitControls(camera, rendererDiv);
var controls = helper.setupControls(ctrl);

var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
wid2.enableDrawing();
wid2.setImage("./textures/earth.jpg");
var ct2 = new THREE.CanvasTexture(wid2.DrawingCanvas); // texture from canvaselemen
var ct = new THREE.CanvasTexture(wid2.Img);
var ct3 = new THREE.CanvasTexture(new ImageLoader().load('./textures/uniform_normals.jpg'));

/*---------------------IDENTIFY DRAWING EVENT---------------*/
wid2.DrawingCanvas.addEventListener('updated', event => {   
    console.log('started!');
    ct2.needsUpdate = true;

  });

var uniforms = {
    u_texture: {type: 'sampler2D', value: ct}, //image
    u_tex2: {type: 'sampler2D', value:ct2 }, // drawing canvas
    u_tex3: {type: 'sampler2D', value:ct3} // normals
}

material = new THREE.RawShaderMaterial({ // initially simple uv shader
    uniforms:uniforms,
    vertexShader : vS,
    fragmentShader : fS
});



geom = helper.createSphere();
var mesh = new THREE.Mesh(geom, material);
cleanUpScene(scene); // delete everything that was there before.
scene.add(mesh);


var settings = new helper.Settings();

/*---------------------------PEN FUNCTIONALITY---------------------*/
settings.pen = function ()  {// define what the invoked function does when clicked
    wid2.clearDrawing();
}


settings.addCallback(handleGUI);
var gui = helper.createGUI(settings);
gui.open();
wid.animate();



// need to find a better way to handle callback than using global namespace.
function handleGUI(changed: utils.KeyValuePair<helper.Settings>){

    //textures
        if (changed.key == "texture") { // load correct texture file
            if(changed.value == "Colors"){
                img_source = "./textures/colors.jpg";
            }
            if(changed.value == "Checker"){
                img_source = "./textures/checker.jpg";
            }
            if(changed.value == "Earth"){
                img_source = "./textures/earth.jpg";
            }
            if(changed.value == "Disturb"){
                img_source = "./textures/disturb.jpg";
            }
            if(changed.value == "Terracotta"){
                img_source = "./textures/terracotta.jpg";
            }
            if(changed.value == "Plastic"){
                img_source = "./textures/plastic.jpg";
            }
            if(changed.value == "Wood"){
                img_source = "./textures/wood_ceiling.jpg";
            }
            if(changed.value == "Lava"){
            }
            if(changed.value == "Rock"){
                img_source = "./textures/rock.jpg";
            }
            if(changed.value == "Enviroment"){
                img_source = "./textures/indoor.jpg";
            }
            
            wid2.setImage(img_source);
            ct = new THREE.CanvasTexture(wid2.Img);
            uniforms.u_texture = {type: 'sampler2D', value: ct};//new THREE.CanvasTexture(wid2.Img)};
        }
        if (changed.key == "geometry") { // create a geometry according to the input.
            if(changed.value == "Box"){
                geom = helper.createBox();
            }
            if(changed.value == "Sphere"){
                geom = helper.createSphere();
            }
            if(changed.value == "Bunny"){ // TODO: pass uv coordinates of bunny to shaders
                geom = helper.createBunny();
            }
            if(changed.value == "Knot"){
                geom = helper.createKnot();
            }
            if(changed.value == "Quad"){

                geom = createQuad(); // see the function above
            }
    
        }

        //shaders
        if (changed.key == "shader") { // apply the change in scale to the created body
            if(changed.value == "Spherical"){
                material.vertexShader = svShader;
                material.fragmentShader = sfShader;
            }
            if(changed.value == "UV attribute"){
                material.vertexShader = vShader;
                material.fragmentShader = fShader;
            }
            if(changed.value == "Spherical (fixed)"){
                material.vertexShader = s_fixvShader;
                material.fragmentShader = s_fixfShader;
            }
            if(changed.value == "Environment Mapping"){
                console.log("use this shader");
                material.vertexShader= evShader;
                material.fragmentShader= efShader;
            }
            if(changed.value == "Normal Map"){
                console.log("use this shader");
                material.vertexShader= nvShader;
                material.fragmentShader= nfShader;
            }
        
        }

        //normal map textures
        if (changed.key == "normalmap") { // load appropriate jpg with normals data
            console.log("normal shader")
            if(changed.value == "Uniform"){
                ct3 = new THREE.CanvasTexture(new ImageLoader().load('./textures/uniform_normals.jpg'));   
            }
            if(changed.value == "Terracotta"){
                ct3 = new THREE.CanvasTexture(new ImageLoader().load('./textures/terracotta_normals.jpg'));
            }
            if(changed.value == "Plastic"){
             ct3 = new THREE.CanvasTexture(new ImageLoader().load('./textures/plastic_normals.jpg'));
            }
            if(changed.value == "Wood"){
                ct3 = new THREE.CanvasTexture(new ImageLoader().load('./textures/wood_ceiling_normals.jpg'));
            }
            if(changed.value == "Lava"){
                ct3 = new THREE.CanvasTexture(new ImageLoader().load('./textures/lava_normals.jpg'));
            }
            if(changed.value == "Rock"){
                ct3 = new THREE.CanvasTexture(new ImageLoader().load('./textures/rock_normals.jpg'));
                
            }
            uniforms.u_tex3 = {type: 'sampler2D', value: ct3};

            }

        //environment toggle.. buggy env button needs to be toggle off an on again to work properly.
        if (changed.key == "enviroment") { // apply the change in scale to the created body
            if(changed.value == true){
                var ct4 = new THREE.CanvasTexture(wid2.Img);
                ct.mapping = THREE.EquirectangularReflectionMapping; 
                scene.background = ct;
            }else{
                scene.background = new THREE.Color('black');
            }
    
        }
        material.needsUpdate = true; // update material properties
        material.uniformsNeedUpdate = true; // uniforms must be updated too
        var mesh = new THREE.Mesh(geom, material);
        cleanUpScene(scene); // remove everything
        scene.add(mesh); // add newly made object
        
    }

}
// call main entrypoint
main();
