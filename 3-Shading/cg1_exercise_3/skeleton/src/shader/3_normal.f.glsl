// defines the precision


// Ex3 question 3


precision highp float;

uniform vec4 u_ambient_color;
uniform vec3 u_lights_position;
uniform mat4 u_inv_transpose;

// we have access to the same uniforms as in the vertex shader
// = object.matrixWorld
uniform mat4 modelMatrix;
varying vec3 v_adjusted_normal;

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
//varying vec4 experimental_color;


// main function gets executed for every pixel
void main()
{
   //vec4 color1 = gl_FrontMaterial.diffuse;
    // Intensity directly proportional to cos(theta) so, I is directly related to theta
   gl_FragColor = vec4( v_adjusted_normal, 1.0);
   //gl_FragColor = experimental_color;
    //gl_FragColor = vec4(normalize(u_inv_transpose * v_adjusted_normal), 1.0); // normals directly mapped to RGB space.
}
