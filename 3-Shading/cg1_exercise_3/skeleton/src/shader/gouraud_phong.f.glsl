// defines the precision



// Ex3 question 6a



precision highp float;

uniform vec3 u_diffuse_color;
uniform vec3 u_ambient_color;
uniform vec3 u_specular_color;
uniform float u_magnitude;
uniform vec3 u_lights_position;
uniform float u_diffuse_reflectance;
uniform float u_ambient_reflectance;
uniform float u_specular_reflectance;
varying vec3 v_adjusted_normal; //N
varying vec3 v;


// we have access to the same uniforms as in the vertex shader
// = object.matrixWorld
uniform mat4 modelMatrix;

// = camera.matrixWorldInverse * object.matrixWorld
uniform mat4 modelViewMatrix;

// = camera.projectionMatrix
uniform mat4 projectionMatrix;

// = camera.matrixWorldInverse
uniform mat4 viewMatrix;

// = inverse transpose of modelViewMatrix
uniform mat3 normalMatrix;

// = camera position in world space
uniform vec3 cameraPosition;
varying vec4 final_color;


// main function gets executed for every pixel
void main()
{

  gl_FragColor = final_color; // all other operations done by vshader.
 }
