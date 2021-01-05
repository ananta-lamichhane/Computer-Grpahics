// defines the precision


// Ex3 question 3


precision highp float;

uniform vec4 u_ambient_color;
uniform vec3 u_lights_position;

// we have access to the same uniforms as in the vertex shader
// = object.matrixWorld
uniform mat4 modelMatrix;
varying vec3 v_adjusted_normal;

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
   //vec4 color1 = gl_FrontMaterial.diffuse;
    vec4 new_color;
    // Intensity directly proportional to cos(theta) so, I is directly related to theta
    float intensity = dot(normalize(u_lights_position),v_adjusted_normal);
    if(intensity > 0.9){
      new_color = vec4(0.6,0.6,1, 1);
    }else if(intensity > 0.6){
      new_color = vec4(0.3, 0.3, 0.7, 1);
    }else if(intensity > 0.3){
      new_color = vec4(0.1,0.1,0.5,1);
    }else{
      new_color = vec4(0,0,0.2,1);
    }

    gl_FragColor = new_color;
}
