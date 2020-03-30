THREE.DispersionMaterial = {
    
  uniforms:{
    envMap :  {value:null},
    refractionRatio:  {value:1.0},
    dispersion :  {value:1.0},
    dispersionBlendMultiplier :  {value:4},
    uWiggleScale :  {value:0.004},
    uWiggleDisplacement :  {value:18.},
    uWiggleSpeed :  {value:0.003},
    progress :  {value:1.},
    time :  {value:9.95},
    reflectivity :  {value:0}, 
    start:{value:0.5},
    end:{value:1.0},
    opacity:{value:1.0}
  },
  defines:{DISPERSION_SAMPLES :  40},
    
    
    
    fragmentShader : `
    uniform float dispersion;
    uniform float refractionRatio;
    uniform samplerCube envMap;
    varying vec3 worldPositions;
    varying vec3 cameraToVertexs;
    varying vec3 worldNormals;
    uniform float time;
    uniform float start;
    uniform float end;
    uniform float opacity;
    //varying vec2 vUv;
    uniform float dispersionBlendMultiplier;
    
    
    vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
        return a + b*cos( 6.28318*(c*t+d) );
    }
    vec3 spectrum(float n) {
        return pal( n, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67) );
    }
    void main() {
        
        vec4 envColor = vec4(0);
            
            //vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );
            //vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
            
            for (int i = 0; i < DISPERSION_SAMPLES; i++) {
            
              float wavelength = float(i) / float(DISPERSION_SAMPLES);
            
              float riMax = refractionRatio * (1. + dispersion);
              float ri = mix(refractionRatio, riMax, wavelength);
              vec3 reflectVec = refract( cameraToVertexs, worldNormals, ri );
            
              vec4 envColorSample = textureCube( envMap, vec3( -1. * reflectVec.x*mix(start,end,clamp(0.,1.,sin(time*10.))), reflectVec.yz ) );
              vec3 queryReflectVec = vec3( -1. * reflectVec.x, reflectVec.yz );
              vec4 envMapColor = textureCube( envMap, queryReflectVec, 0.5 );
              
              envColorSample = envMapTexelToLinear( envColorSample );
              envColorSample.rgb *= spectrum(wavelength);
              envColorSample.rgb /= float(DISPERSION_SAMPLES) / dispersionBlendMultiplier;
              envColor.rgb += envColorSample.rgb ;
            }
            
            
             
        gl_FragColor = vec4(envColor.xyz, opacity );
        
    }`,
    vertex_Shader : `#define PHYSICAL
    varying vec3 vViewPosition;
    #ifndef FLAT_SHADED
      varying vec3 vNormal;
    #endif
    #include <common>
    #include <uv_pars_vertex>
    #include <uv2_pars_vertex>
    #include <displacementmap_pars_vertex>
    #include <envmap_pars_vertex>
    #include <color_pars_vertex>
    #include <fog_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <shadowmap_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>
                
    uniform float time;
    varying vec2 vUv;
    varying vec2 vUv1;
    varying vec4 vPosition;
    varying float tProgress;
    uniform sampler2D texture1;
    uniform sampler2D texture2;
    uniform vec2 pixels;
    uniform vec2 uvRate1;
    uniform float progress;
    attribute float offset;
    attribute vec3 displacement;
    //uniform float refractionRatio;
    varying vec3 worldPositions;
    varying vec3 cameraToVertexs;
    varying vec3 worldNormals;
    
       uniform float amplitude;
  precision highp float;
  precision highp int;
  varying vec3 vRefract;
  //varying vec2 vUv;
  uniform float uWiggleScale;
  uniform float uWiggleDisplacement;
  uniform float uWiggleSpeed;
  uniform float uRefractionRatio;
  vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
  }
  vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
  }
  vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
  }
  // Classic Perlin noise
  float cnoise(vec3 P) {
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
  }
    
    mat4 rotationMatrix(vec3 axis, float angle) {
      axis = normalize(axis);
      float s = sin(angle);
      float c = cos(angle);
       float oc = 1.0 - c;
      return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                                0.0,                                0.0,                                1.0);
      }
  vec3 rotatet(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
      return vec3((m * vec4(v, 1.0)).x,(m * vec4(v, 1.0)).y,(m * vec4(v, 1.0)).z);
  }
    vec3 bezier4(vec3 a, vec3 b, vec3 c, vec3 d, float t) {    
        return mix(mix(mix(a, b, t), mix(b, c, t), t), mix(mix(b, c, t), mix(c, d, t), t), t);
    }
    void main() {
      #include <uv_vertex>
      #include <uv2_vertex>
      #include <color_vertex>
      #include <beginnormal_vertex>
      #include <morphnormal_vertex>
      #include <skinbase_vertex>
      #include <skinnormal_vertex>
    #include <begin_vertex>
    #include <morphtarget_vertex>
    #include <skinning_vertex>
    #include <displacementmap_vertex>
    #include <project_vertex>
    #include <logdepthbuf_vertex>
    #include <clipping_planes_vertex>
    vViewPosition = - mvPosition.xyz;
    #include <worldpos_vertex>
    #include <shadowmap_vertex>
    #include <fog_vertex>  
      
      
      float noise = cnoise(normalize(position) * uWiggleScale + ( 9.4 * uWiggleSpeed ) );//normalize(position)
            vec3 pos = position - vec3(800.0,0.0,0.0) + normal * noise * vec3(uWiggleDisplacement);
             worldPositions = (modelMatrix * vec4(pos, 1.0)).xyz;
             cameraToVertexs = normalize(worldPositions - cameraPosition);
             worldNormals = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
            //vRefract = refract(cameraToVertex, worldNormal, refractionRatio);
            vUv = uv;
           
          
            vec3 newPosition =  normal * amplitude* displacement;
            //vFresnelNormal = normalize(normalMatrix * normal);
            //vec4 modelPos = modelViewMatrix * vec4(pos+newPosition, 1.0);
            //vFresnelPosition = modelPos.xyz;
            
                   vec3 newpos = position + vec3(-800.,0.,0.);
                   tProgress = clamp(-1.,1., (progress - offset*0.001)/0.2 );
                   newpos = mix(position, newpos, tProgress);
                   newpos = bezier4(position, vec3(-400.,0.,1.) , vec3(-800.,0.,1.) ,newpos, tProgress);  
                   
                   
                   gl_Position = projectionMatrix * modelViewMatrix * vec4( position+newpos*noise, 1.0 );//*nois
                   
    
    }
    
  `,
  
  
    
    
    
  
    
  }
  
 