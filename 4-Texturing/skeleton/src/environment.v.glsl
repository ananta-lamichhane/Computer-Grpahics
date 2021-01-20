// These uniforms and attributes are provided by threejs.
// If you want to add your own, look at https://threejs.org/docs/#api/en/materials/ShaderMaterial #Custom attributes and uniforms
// defines the precision

// Ex3 question 1


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
varying vec3 new_position;

varying vec3 v_adjusted_normal; //N
varying vec3 v_w; //world coordinates

// main function gets executed for every vertex
void main()
{
  new_uv = uv; // pass uv and position as is to the fragment shader.
  new_position = position;
  gl_Position=  projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  v_w = vec3(modelMatrix * vec4(position, 0.0));
  v_adjusted_normal = vec3(modelMatrix * vec4(normal,0.0));
  v_adjusted_normal = normalize(v_adjusted_normal);

}
