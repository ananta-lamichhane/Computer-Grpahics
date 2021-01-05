// defines the precision
precision highp float;
uniform vec4 u_ambient_color;
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
  //this colors all fragments (pixels) in the same color (RGBA)
  gl_FragColor = u_ambient_color; // RGB + Alpha
  //gl_Position = projectionMatrix * modelViewMatrix * vec4(cameraPosition, 1.0);
}
