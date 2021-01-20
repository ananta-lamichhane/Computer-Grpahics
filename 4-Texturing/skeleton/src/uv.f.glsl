
// Ex3 question 1
// defines the precision
precision highp float;


uniform sampler2D u_texture;
uniform sampler2D u_tex2;
varying vec2 new_uv;

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
  gl_FragColor = vec4(texture2D(u_texture, new_uv) + texture2D(u_tex2, new_uv));
 }
