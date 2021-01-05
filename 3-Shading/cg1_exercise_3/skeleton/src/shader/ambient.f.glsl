
// Ex3 question 1
// defines the precision
precision highp float;

uniform vec3 u_ambient_color;
uniform float u_ambient_reflectance;

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


// main function gets executed for every pixel
void main()
{
  // I_ambient = r * I_light
  vec3 adjusted_ambient_color = u_ambient_reflectance * u_ambient_color;
  gl_FragColor = vec4(adjusted_ambient_color, 1);
 // console.log(gl_FragColor);
  //gl_Position = projectionMatrix * modelViewMatrix * vec4(cameraPosition, 1.0);
}
