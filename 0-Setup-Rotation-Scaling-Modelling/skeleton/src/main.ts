/**
 * This is a minimal boilerplate example for the CG1 course.
 * Later skeletons will provide no code in main.ts so use this for reference.
 *
 * written by Ugo Finnendahl
 **/

// external dependencies
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

// local from us provided global utilities
import * as utils from './lib/utils';
import RenderWidget from './lib/rendererWidget';
import {Application, createWindow} from './lib/window';

// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';
import {Object3D} from 'three';


/*******************************************************************************
 * Defines Settings and GUI
 ******************************************************************************/

// enum(s)
enum Models {
    quad = "Quad",
    box = "Box",
    sphere = "Sphere",
    torus = "Torus"
}

// (default) Settings.
class Settings extends utils.Callbackable {
    // different setting types are possible (e.g. string, enum, number, boolean, function)
    name: string = "SelectShape"; // change the title of the app in the GUI text
    model: Models = Models.box;
    scale: number = 1;
    truth: boolean = false;
    fun: (arg0: any) => void = function (e) {
        alert("You clicked me!")
    }
    fun2: (arg0: any) => String = function (e) {
        return e.key;
    }


}

// create GUI given a Settings object
function createGUI(settings: Settings): dat.GUI {
    // we are using dat.GUI (https://github.com/dataarts/dat.gui)
    var gui: dat.GUI = new dat.GUI();

    // build GUI
    // the five types have different appearances
    gui.add(settings, 'name').name('App name');
    gui.add(settings, 'model', utils.enumOptions(Models)).name('3D Model');
    gui.add(settings, 'scale', 0, 10, 1).name('size');
    gui.add(settings, 'truth').name("2B or !2B?");
    gui.add(settings, 'fun').name("Click Me");

    return gui;
}


/*******************************************************************************
 * The main application. Your logic should later be separated into a different file.
 * A custom class(es) should be used later as well, since a global namespace is "ugly"
 *******************************************************************************/

var mesh: THREE.Mesh;
var global_name = "placeholder";

// defines callback that should get called
// whenever the settings get changed (eg. via GUI).
function callback(changed: utils.KeyValuePair<Settings>) {
    // only model change works for now:

    if (changed.key == "name") { // assings the name in the input box as the title of the document (tab heading)
        document.title = changed.value;
    }
    if (changed.key == "model") { // create a geometry according to the input.
        switch (changed.value) {
            case Models.box:
                mesh.geometry = new THREE.BoxGeometry(1, 1, 1);
                break;
            case Models.sphere:
                mesh.geometry = new THREE.SphereGeometry(0.66, 30, 30);
                break;
            case Models.torus:
                mesh.geometry = new THREE.TorusGeometry(1, 0.2, 8, 10);
                break;
            case Models.quad:
                mesh.geometry = new THREE.PlaneBufferGeometry(1, 1);
                break;
        }
    }
    if (changed.key == "scale") { // apply the change in scale to the created body
        mesh.scale.set(changed.value, changed.value, changed.value);
    }

    if (changed.key == "truth") { // if the box is clicked changed color to red and unclicked red
        if (changed.value == false) {
            mesh.material = new THREE.MeshLambertMaterial({
                color: "blue",
            });

        } else {
            mesh.material = new THREE.MeshLambertMaterial({
                color: "red",
            });
        }
    }

}


/*******************************************************************************
 * Main entrypoint. Previouly declared functions get managed/called here.
 * Start here with programming.
 ******************************************************************************/
var wid: RenderWidget;

function main() {

    var settings = new Settings();
    // setup/layout root Application.
    // Its the body HTMLElement with some additional functions.
    var root = Application(settings.name); // use the same name for document title as the name in settings.
    // define the (complex) layout, that will be filled later:
    root.setLayout([
        ["renderer", "."],
        [".", "."]
    ]);
    // 1fr means 1 fraction, so 2fr 1fr means
    // the first column has 2/3 width and the second 1/3 width of the application
    root.setLayoutColumns(["3fr", "0fr"]); //fill out the whole of the screen (100% of width  and height)
    // you can use percentages as well, but (100/3)% is difficult to realize without fr.
    root.setLayoutRows(["100%", "0%"]); // fill up the whole available window with root (control gui sits on top)
    // ---------------------------------------------------------------------------
    // create Settings

    // create GUI using settings
    var gui = createGUI(settings);
    gui.open();
    // adds the callback that gets called on settings change
    settings.addCallback(callback);
    root.title = global_name; // another idea for document title was implemented, redundant, to be fixed.
    document.title = global_name;

    /*event listener to  sense arrow keys, cna be extended for other key inputs.

     */
    window.addEventListener("keydown", event => { //can't be included in callBack().wont't function right away.
        if (event.key == "ArrowLeft") {
            //mesh.rotateX(-0.1);
            mesh.rotateY(-0.1); // it's more intuitive to rotate along y axis on arrow left and right (as discussed on ISIS)
        }
        if (event.key == "ArrowRight") {
            //mesh.rotateX(0.1);
            mesh.rotateY(0.1);
        }
    })


    // ---------------------------------------------------------------------------
    // create window with given id
    // the root layout will ensure that the window is placed right
    var rendererDiv = createWindow("renderer");
    // add it to the root application
    root.appendChild(rendererDiv);

    // create renderer
    var renderer = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });

    // create scene
    var scene = new THREE.Scene();
    // user ./helper.ts for building the scene
    mesh = helper.setupGeometry(scene);
    helper.setupLight(scene);

    // create camera
    var camera = new THREE.PerspectiveCamera();
    // user ./helper.ts for setting up the camera
    helper.setupCamera(camera, scene);

    // create controls
    var controls = new OrbitControls(camera, rendererDiv);
    // user ./helper.ts for setting up the controls
    helper.setupControls(controls);

    // fill the Window (renderDiv). In RenderWidget happens all the magic.
    // It handles resizes, adds the fps widget and most important defines the main animate loop.
    // You dont need to touch this, but if feel free to overwrite RenderWidget.animate
    var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
    // start the draw loop (this call is async)
    wid.animate();
}

// call main entrypoint
main();
