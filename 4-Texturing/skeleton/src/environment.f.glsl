
precision highp float;
const float PI = 3.1415926;


uniform sampler2D u_texture;
uniform sampler2D u_tex3;
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
// passed from vertexshader
varying vec3 new_position;
varying vec3 v_w; //world coordinates
varying vec3 v_adjusted_normal; //N


// main function gets executed for every pixel
void main()
{
// calculate uv here. not working quite as intended. 
normalize(v_adjusted_normal);
vec3 eye_vec =-1.0 * normalize(v_w - cameraPosition);
vec3 ref = reflect(eye_vec, v_adjusted_normal); // reflect eye ray on adjusted normal
 vec2 new_new_uv; // spherical mapping of uv
  //vec3 new_pos = vec3(-1.0 * ref.z,  1.0 * ref.y, 1.0 * ref.x); // fix coordinate axis
  // x^2 + y^2
  ref = ref.xzy; // fix axes
  ref.z =ref.z * -1.0;
  ref.x = ref.x * -1.0;
  float dist = sqrt( ref.y * ref.y + ref.x * ref.x); // use formula from the presentatin
  new_new_uv[0] =  (PI+ atan(ref.y, ref.x))/ (PI * 2.0);
  new_new_uv[1] =  (atan(dist , ref.z))/ PI;
  gl_FragColor = texture2D(u_texture, new_new_uv) + texture2D(u_tex2, new_new_uv);

  
 }
