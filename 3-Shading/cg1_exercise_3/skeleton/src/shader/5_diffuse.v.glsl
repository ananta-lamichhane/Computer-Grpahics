// These uniforms and attributes are provided by threejs.
// If you want to add your own, look at https://threejs.org/docs/#api/en/materials/ShaderMaterial #Custom attributes and uniforms
// defines the precision

// Ex3 question 5


precision highp float;

uniform vec3 u_diffuse_color;
uniform vec3 u_lights_position;
uniform float u_diffuse_reflectance;
varying vec3 v;
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
varying vec3 v_adjusted_normal;


// default vertex attributes provided by Geometry and BufferGeometry
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// main function gets executed for every vertex
void main()
{
  //gl_Position = vec4(0., 0., 0., 1.0);
  vec4 vert4 = modelViewMatrix * vec4(position, 1.0); 
  v= vec3(vert4)/vert4.w; //vertex positions in NDC

  gl_Position=  projectionMatrix* modelViewMatrix * vec4( position, 1.0 );
 //v_adjusted_normal = vec3(modelMatrix * vec4(normal,0.0));
 v_adjusted_normal = vec3(normalMatrix * normal);
  v_adjusted_normal = normalize(v_adjusted_normal);
}
