// These uniforms and attributes are provided by threejs.
// If you want to add your own, look at https://threejs.org/docs/#api/en/materials/ShaderMaterial #Custom attributes and uniforms
// defines the precision

// Ex3 question 1
const float PI = 3.1415926;

precision highp float;


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


// default vertex attributes provided by Geometry and BufferGeometry
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec2 new_uv;

// main function gets executed for every vertex
void main()
{
  vec3 new_pos = vec3( position.x,  -1.0 * position.z, -1.0 * position.y); // fix coordinate axis

  // x^2 + y^2
  float dist = sqrt(new_pos.y * new_pos.y + new_pos.x * new_pos.x); // use formula from the presentatin
  new_uv[0] = (PI + atan(new_pos.y, new_pos.x))/ (PI * 2.0);
  //new_uv[1] = (asin(position.y)/PI) + 0.5;
  new_uv[1] = (atan(dist , new_pos.z))/ PI;
  gl_Position=  projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
