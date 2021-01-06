// These uniforms and attributes are provided by threejs.
// If you want to add your own, look at https://threejs.org/docs/#api/en/materials/ShaderMaterial #Custom attributes and uniforms
// defines the precision


// Ex3 question 3



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
uniform vec3 u_lights_position;
uniform mat4 u_inv_transpose;


// default vertex attributes provided by Geometry and BufferGeometry
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
varying vec3 v_adjusted_normal;
//varying vec4 experimental_color; debug using colors.

// main function gets executed for every vertex
void main()
{
  vec4 pos = projectionMatrix* modelViewMatrix * vec4( position, 1.0 );

  v_adjusted_normal = normalMatrix * normal;
  v_adjusted_normal = normalize(v_adjusted_normal); 
  gl_Position= pos ; // projectionMatrix* modelViewMatrix * vec4( position, 1.0 );
}
