// defines the precision





// Ex3 question 4




precision highp float;

uniform vec4 u_ambient_color;
uniform vec3 u_lights_position;

// we have access to the same uniforms as in the vertex shader
// = object.matrixWorld
uniform mat4 modelMatrix;
varying vec3 v_adjusted_normal;
varying vec3 v;

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
  vec3 normalized_light = normalize(u_lights_position -v);
   //vec4 color1 = gl_FrontMaterial.diffuse;
    vec4 new_color = vec4(1.0,0.0,0.0,1.0);
    // Intensity directly proportional to cos(theta) so, I is directly related to theta
    float intensity = clamp(max(0.0,dot(normalized_light,v_adjusted_normal)), 0.0,1.0);
    if(intensity > 0.90){
      new_color = 0.75 * new_color;
    }else if(intensity > 0.60){
      new_color = 0.5 * new_color;
    }else if(intensity > 0.30){
      new_color = 0.25 * new_color;
    }else{
      new_color = vec4(0,0,0,1);
    }

    gl_FragColor = new_color;
}
