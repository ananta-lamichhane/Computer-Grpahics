
// Ex3 question 1
// defines the precision
precision highp float;
const float PI = 3.1415926;


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

varying vec3 new_position;



// main function gets executed for every pixel
void main()
{
// the problem of seam is fixed by calculating uv here.
 vec2 new_new_uv; // spherical mapping of uv
  vec3 new_pos = vec3( new_position.x,  -1.0 * new_position.z, -1.0 * new_position.y); // fix coordinate axis
  // x^2 + y^2
  float dist = sqrt(new_pos.y * new_pos.y + new_pos.x * new_pos.x); // use formula from the presentatin
  new_new_uv[0] = (PI + atan(new_pos.y, new_pos.x))/ (PI * 2.0);
  //new_uv[1] = (asin(position.y)/PI) + 0.5;
  new_new_uv[1] = (atan(dist , new_pos.z))/ PI;
   gl_FragColor = vec4(texture2D(u_texture, new_new_uv)+ texture2D(u_tex2, new_new_uv));

  
 }
