
/**
 * @author Mario Carrillo //https://marioecg.com/
 * @author Lexa307 //https://github.com/Lexa307
 * 
 */

THREE.OceanShader = {

	uniforms: {
		//"map": { value: null },
		"color": { value: new THREE.Color(0xFFFFFF) },
		"time": { type: 'f', value: 0 },
        "opacity": { type: 'f', value: 1 },
        "frequency1": { type: 'f', value: 0.03 },
        "amplitude1": { type: 'f', value: 10.0 },
        "frequency2": { type: 'f', value: 0.025 },
        "amplitude2": { type: 'f', value: 0.0 },
	},

    vertexShader:`// Variable qualifiers that come with the shader

    varying vec2 vUv;
    // We passed this one
    uniform float time;
    uniform float frequency1;
    uniform float amplitude1;
    uniform float frequency2;
    uniform float amplitude2;
    
    void main() {
      vUv = uv;
    
      vec3 p = vec3(position.x, position.y, position.z);
    
    //   float frequency1 = 0.035;
    //   float amplitude1 = 20.0;
    //   float frequency2 = 0.025;
    //   float amplitude2 = 70.0;
    
      // Oscillate vertices up/down
      p.y += (sin(p.x * frequency1 + time) * 0.5 + 0.5) * amplitude1;
    
      // Oscillate vertices inside/outside
      p.z += (sin(p.x * frequency2 + time) * 0.5 + 0.5) * amplitude2;
    
      gl_Position = projectionMatrix * modelViewMatrix *  vec4(p, 1.0);
    }`,
    fragmentShader:`#ifdef GL_OES_standard_derivatives
    #extension GL_OES_standard_derivatives : enable
    #endif
    
    precision highp float;
    uniform float opacity;
    uniform vec3 color;
    //uniform sampler2D map;
    varying vec2 vUv;
    uniform float time;
    
    // float median(float r, float g, float b) {
    //   return max(min(r, g), min(max(r, g), b));
    // }
    
    void main() {
    //   vec3 sample = texture2D(map, vUv).rgb;
    //   float sigDist = median(sample.r, sample.g, sample.b) - 0.5;
    //   float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);
      gl_FragColor = vec4(color,  opacity);
     
    }`
}