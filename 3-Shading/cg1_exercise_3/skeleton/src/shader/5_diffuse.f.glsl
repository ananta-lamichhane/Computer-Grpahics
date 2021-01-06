// defines the precision


// Ex3 question 5


precision highp float;

uniform vec3 u_diffuse_color;
uniform vec3 u_lights_position;
uniform float u_diffuse_reflectance;
varying vec3 v_adjusted_normal;
varying vec3 v;

varying vec3 light_dir;

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
  // calculate light intensity
  vec3 normalized_light = normalize(u_lights_position -v);
  float modified_intensity = max(0.0,dot(v_adjusted_normal, normalized_light));
  vec3 adjusted_ambient_color = u_diffuse_reflectance * modified_intensity * u_diffuse_color;
  gl_FragColor = vec4(adjusted_ambient_color, 1);
}
