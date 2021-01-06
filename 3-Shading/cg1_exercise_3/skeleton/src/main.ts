// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';
import * as THREE from 'three';
import * as utils from './lib/utils';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Application, createWindow} from './lib/window';
import RenderWidget from './lib/rendererWidget';
import * as dat from 'dat.gui';

// load shaders
import basicVertexShader from './shader/basic.v.glsl';
import basicFragmentShader from './shader/basic.f.glsl';
import ambientVertexShader from './shader/2_ambient.v.glsl';
import ambientFragmentShader from './shader/2_ambient.f.glsl';
import diffuseLightVertexShader from './shader/5_diffuse.v.glsl';
import diffusedLightFragmentShader from './shader/5_diffuse.f.glsl';
import toonVertexShader from './shader/4_toon.v.glsl'
import toonFragmentShader from './shader/4_toon.f.glsl'
import specularPhongFragmentShader from './shader/6b_phong_specular.f.glsl'
import specularPhongVertexShader from './shader/6b_phong_specular.v.glsl'
//import specularGourardFragmentShader from './shader/gourard_specular.f.glsl'
//import specularGourardVertexShader from './shader/gourard_specular.v.glsl'
import blinnPhongFragmentShader from './shader/7_blinn_phong.f.glsl'
import blinnPhongVertexShader from './shader/7_blinn_phong.v.glsl'
import normalFragmentShader from './shader/3_normal.f.glsl'
import normalVertexShader from './shader/3_normal.v.glsl'
import gouraudPhongFragmentShader from './shader/6a_gouraud_phong.f.glsl'
import gouraudPhongVertexShader from './shader/6a_gouraud_phong.v.glsl'
import { Color } from 'three';
var lights: THREE.PointLight;
var mat : THREE.RawShaderMaterial;
var light_sphere : THREE.Mesh;

var tr_matrix = new THREE.Matrix4();
tr_matrix.set(1,0,0,0,0,0.5,0,0,0,0,1,0,0,0,0,1);
var temp = new THREE.Matrix4();
temp.getInverse(tr_matrix);
temp = temp.transpose();






function main(){
    console.log("tr_matrix");
    console.log(temp);

    /---------------------------------------* INITIAL SETUP*-------------------------------------------------/

    var root = Application("ShaderFun"); // taken from ex0
    root.setLayout([
        ["renderer", "."],
        [".", "."]
    ]);
    root.setLayoutColumns(["3fr", "0fr"]);
    root.setLayoutRows(["100%", "0%"]);
    var rendererDiv = createWindow("renderer"); // renderer for left
    var renderer = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });
    root.appendChild(rendererDiv);
    var point_light = new THREE.Vector3(2,2,2);
    //lights = new THREE.PointLight( "yellow", 1, 100 );
    var light_material = new THREE.MeshBasicMaterial({color:"yellow"});
    var light_geometry = new THREE.SphereGeometry(0.2);
    light_sphere = new THREE.Mesh(light_geometry, light_material);
    //lights.position.set(2,2,2);
    light_sphere.position.set(point_light.x, point_light.y, point_light.z);
    var scene = new THREE.Scene();
   scene.background = new THREE.Color( 'black');
    var camera = new THREE.PerspectiveCamera();
    camera = helper.setupCamera(camera, scene);
     var settings = new helper.Settings();
    settings.addCallback(processGUIInputs);
    var gui = helper.createGUI(settings);
    gui.open();
    //scene.add(lights);
    scene.add(light_sphere);


    var ctrl = new OrbitControls(camera, rendererDiv);
    var controls = helper.setupControls(ctrl);





/* Process Input from GUI*/
var shadertype:String = "Basic";
var ambientReflectance: number = 0.5;
var AmbientColor = new THREE.Vector3(104/256, 13/256, 13/256);
var diffuseReflectance: number = 1;
var diffuseColor = new THREE.Vector3(204/256, 25/256, 25/256);
var specularReflectance: number = 1;
var specularColor= new THREE.Vector3(256/256, 256/256, 256/256);
var magn: number = 128;
var vshader = basicVertexShader;
var fshader = basicFragmentShader;
    function processGUIInputs(changed: utils.KeyValuePair<helper.Settings>){
        if(changed.key == "lightX"){
            //lights.position.x = changed.value;
            point_light.x = changed.value;
            light_sphere.position.x = changed.value;
        }
        if(changed.key == "lightY"){
           // lights.position.y = changed.value;
           point_light.y = changed.value;
            light_sphere.position.y = changed.value;
        }
        if(changed.key == "lightZ"){
            //lights.position.z = changed.value;
            point_light.z = changed.value;
            light_sphere.position.z = changed.value;

        }
    
        //shader selection
        if(changed.key == "shader"){
            if(changed.value == "Basic"){
               vshader = basicVertexShader;
               fshader = basicFragmentShader;
               console.log("shader = "+ changed.value);
            }
            if(changed.value == "Ambient"){
                vshader = ambientVertexShader;
                fshader = ambientFragmentShader;
                console.log("shader = "+ changed.value);
             }
             if(changed.value == "Lambert"){
                vshader = diffuseLightVertexShader;
                fshader = diffusedLightFragmentShader;
                console.log("shader = "+ changed.value);
             }
             if(changed.value == "Toon"){
                vshader = toonVertexShader;
                fshader = toonFragmentShader;
                console.log("shader = "+ changed.value);
             }
             if(changed.value == "Phong"){
                vshader = specularPhongVertexShader;
                fshader = specularPhongFragmentShader;
                console.log("shader = "+ changed.value);
             }
             if(changed.value == "Blinn-Phong"){
                vshader = blinnPhongVertexShader;
                fshader = blinnPhongFragmentShader;
                console.log("shader = "+ changed.value);
             }
             if(changed.value == "Normal"){
                vshader = normalVertexShader;
                fshader = normalFragmentShader;
                console.log("shader = "+ changed.value);
             }
             if(changed.value == "Gouraud"){
                vshader = gouraudPhongVertexShader;
                fshader = gouraudPhongFragmentShader;
                console.log("shader = "+ changed.value);
             }

        }

        // other parameters
        if(changed.key == "ambient_reflectance"){

            ambientReflectance = changed.value;
    
        }
        if(changed.key == "ambient_color"){
            AmbientColor.set(changed.value[0]/256, changed.value[1]/256, changed.value[2]/256);
        }
        if(changed.key == "diffuse_reflectance"){

            diffuseReflectance = changed.value;
    
        }
        if(changed.key == "diffuse_color"){

            diffuseColor.set(changed.value[0]/256, changed.value[1]/256, changed.value[2]/256);
       
        }
        if(changed.key == "specular_reflectance"){

            specularReflectance = changed.value;
    
        }
        if(changed.key == "specular_color"){

            specularColor.set(changed.value[0]/256, changed.value[1]/256, changed.value[2]/256);
    
        }
        if(changed.key == "magnitude"){

            magn = changed.value;
    
        }
       /* console.log("___________________________________________________________");
        console.log("value to be passed: ");
        console.log("ambientcolor : ");
        console.log(AmbientColor)
        console.log("ambientreflectance : "+ambientReflectance);
        console.log("diffusereflectance  : "+diffuseReflectance);
        console.log("diffusecolor : ");
        console.log(diffuseColor);
        console.log("specular reflectance : "+specularReflectance);
        console.log("specular color : ");
        console.log(specularColor);
        console.log("magnitude : "+magn);
        console.log("___________________________________________________________");
        */

        // pass given parameters as uniforms create a material with selected shaders.
        var inputMaterial = new THREE.RawShaderMaterial( {
            uniforms:{
              u_inv_transpose: {value: temp},
              u_lights_position: {value: point_light},
              u_ambient_color : {value: AmbientColor},
              u_ambient_reflectance:{value: ambientReflectance},
              u_diffuse_reflectance: {value: diffuseReflectance},
              u_diffuse_color: {value: diffuseColor},
              u_specular_reflectance: {value: specularReflectance},
              u_specular_color: {value: specularColor},
              u_magnitude: {value:magn}
            },
             vertexShader: vshader,
             fragmentShader: fshader
            });

            while(scene.children.length > 0){ //cleanup the scene..there must be a better way.
                scene.remove(scene.children[0]); 
            }
            scene.add(light_sphere);
        


            // call (modified setupgeometry to add created material to the scene.)
        helper.setupGeometry(scene, inputMaterial);
    
    }   
    var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
    wid.animate();
}

// call main entrypoint
main();
