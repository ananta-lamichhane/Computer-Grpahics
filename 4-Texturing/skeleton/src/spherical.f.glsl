
// Ex3 question 1
// defines the precision
precision highp float;


uniform sampler2D u_texture;
varying vec2 new_uv;
uniform sampler2D u_tex2;

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
  vec4 image_tex = texture2D(u_tex2, new_uv);
  vec4 image_pen = texture2D(u_texture, new_uv);
  gl_FragColor = vec4(image_pen + image_tex);
  //gl_FragColor = mix(image_tex, image_pen,step(0.2, new_uv.y) );
  
 }
