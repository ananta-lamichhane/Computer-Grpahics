// These uniforms and attributes are provided by threejs.
// If you want to add your own, look at https://threejs.org/docs/#api/en/materials/ShaderMaterial #Custom attributes and uniforms
// defines the precision
precision highp float;



uniform vec3 u_diffuse_color;
uniform vec3 u_ambient_color;
uniform vec3 u_specular_color;
uniform float u_magnitude;
uniform vec3 u_lights_position;
uniform float u_diffuse_reflectance;
uniform float u_ambient_reflectance;
uniform float u_specular_reflectance;
varying vec3 v_adjusted_normal; //N
varying vec3 v;
varying vec4 final_color; // gets passed to fragmentshader

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




// Ex3 question 6a
//colors get calculated on vertices and get interpolated on the fragment shader.


// main function gets executed for every vertex
// essentially the same as phong with 
void main()
{
  vec4 vert_intermediate = modelViewMatrix * vec4(position, 1.0);
  v = vec3(vert_intermediate)/vert_intermediate.w;
  gl_Position=  projectionMatrix* modelViewMatrix * vec4( position, 1.0 );
  v_adjusted_normal = normalMatrix * normal;
  v_adjusted_normal = normalize(v_adjusted_normal);
//ambient component
  vec3 adjusted_ambient_color = u_ambient_reflectance * u_ambient_color;

  vec3 normalized_light = normalize(u_lights_position -v);

//diffuse component
  float modified_intensity_factor = dot(v_adjusted_normal, normalized_light);
  // I_diffuse = r * I_light * cos(theta) = r * I_light * (normal.light direction)
  vec3 adjusted_diffuse_color = (u_diffuse_reflectance * modified_intensity_factor) * u_diffuse_color;
  
  //  specular component
  
  vec3 eye = normalize(-v);
  vec3 R = normalize(reflect(-normalized_light, v_adjusted_normal));
  float dot_prod = max(0.0,dot(R,eye)); // if reflected light falls on camera
  vec3 spec_color_adjusted;
  if(dot_prod> 0.0){ // wrong side of surface.
    spec_color_adjusted  = u_specular_reflectance * u_specular_color * pow(dot_prod, u_magnitude);
  }else{
    spec_color_adjusted = vec3(0,0,0);
  }

  final_color = vec4((adjusted_ambient_color+adjusted_diffuse_color + spec_color_adjusted), 1);
}
