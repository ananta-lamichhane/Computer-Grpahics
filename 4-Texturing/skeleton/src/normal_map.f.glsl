// defines the precision

//Exercise 4 question 8 Normal Map

precision highp float;
precision highp sampler2D;

uniform sampler2D u_texture;
uniform sampler2D u_tex3; // load normal map
uniform sampler2D u_tex2;

// hard coded values, same as in exercise presentation sheets.

 vec3 u_specular_color = vec3(1.0, 1.0, 1.0);
 float u_magnitude = 50.0;
 vec3 u_lights_position = vec3(2.0, 2.0, 3.0);
 float u_diffuse_reflectance = 1.0;
 float u_ambient_reflectance = 0.2;
 float u_specular_reflectance = 0.15;
varying vec3 v_adjusted_normal; //N
varying vec3 v;
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

  vec4 tex = texture2D(u_texture, new_uv); //canvas texture
  vec4 tex2 = texture2D(u_tex2, new_uv);
  //extract normal map rgb from the given sampler2d file
  vec3 normal_map = texture2D(u_tex3, new_uv).rgb;
  normal_map = normalize(normal_map * 2.0 -1.0);
  // ambient light only with texture
  vec3 adjusted_ambient_color = u_ambient_reflectance * tex.rgb; // extract rgb from texture.

  vec3 normalized_light = normalize(u_lights_position -v);

//diffuse component
  float modified_intensity_factor = dot(normalized_light,normal_map);
  //diffused component along with the normal map.
  vec3 adjusted_diffuse_color = (u_diffuse_reflectance * modified_intensity_factor) * tex.rgb;
  gl_FragColor  =  normalize(vec4((adjusted_ambient_color+adjusted_diffuse_color), 1))+tex2;

}
