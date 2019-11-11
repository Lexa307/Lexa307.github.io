
/**
 * @author Lexa307 / https://github.com/Lexa307
 *
 * Based on Perlin noice
 */

THREE.FresnelShader = {

	uniforms: {

		"mRefractionRatio": { type: "f", value: 1.02 },
		"mFresnelBias": { type: "f", value: 0.1 },
		"mFresnelPower": { type: "f", value: 2.0 },
		"mFresnelScale": { type: "f", value: 1.0 },
		"time": { type: 'f', value: 0 },
        "progress": { type: 'f', value: 1 },
        "uWiggleScale": { type: 'f', value: 0.001 },
        "uWiggleDisplacement": { type: 'f', value: 0.01 },
        "uWiggleSpeed": { type: 'f', value: 0.03 },
		"tCube": { type: "t", value: null },
		"refractionRatio":{ type: 'f', value: 0.8 }, 
		"dispersion": { type: 'f', value: 0.8 }, 
		"dispersionBlendMultiplier":{ type: 'f', value: 20.0 },
		"cameraPosition":{value:null},
		

	},
	defines: {
		DISPERSION_SAMPLES:100
	},

	vertexShader: [

		"uniform float mRefractionRatio;",
		"uniform float mFresnelBias;",
		"uniform float mFresnelScale;",
		"uniform float mFresnelPower;",
		"uniform float uWiggleScale;",
		"uniform float uWiggleDisplacement;",
		"uniform float uWiggleSpeed;",
		"uniform float uRefractionRatio;",
		"uniform float progress;",
		"uniform float time;",
		"uniform float dispersion;",
		"attribute float offset;",
		"vec3 mod289(vec3 x) {",
			"return x - floor(x * (1.0 / 289.0)) * 289.0;",
			"}",
			"vec4 mod289(vec4 x) {",
			"return x - floor(x * (1.0 / 289.0)) * 289.0;",
			"}",
			"vec4 permute(vec4 x) {",
			"return mod289(((x*34.0)+1.0)*x);",
			"}",
			"vec4 taylorInvSqrt(vec4 r) {",
			"return 1.79284291400159 - 0.85373472095314 * r;",
			"}",
			"vec3 fade(vec3 t) {",
			"return t*t*t*(t*(t*6.0-15.0)+10.0);",
			"}",
			"// Classic Perlin noise",
			"float cnoise(vec3 P) {",
			"vec3 Pi0 = floor(P); // Integer part for indexing",
			"vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1",
			"Pi0 = mod289(Pi0);",
			"Pi1 = mod289(Pi1);",
			"vec3 Pf0 = fract(P); // Fractional part for interpolation",
			"vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0",
			"vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);",
			"vec4 iy = vec4(Pi0.yy, Pi1.yy);",
			"vec4 iz0 = Pi0.zzzz;",
			"vec4 iz1 = Pi1.zzzz;",
			"vec4 ixy = permute(permute(ix) + iy);",
			"vec4 ixy0 = permute(ixy + iz0);",
			"vec4 ixy1 = permute(ixy + iz1);",
			"vec4 gx0 = ixy0 * (1.0 / 7.0);",
			"vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;",
			"gx0 = fract(gx0);",
			"vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);",
			"vec4 sz0 = step(gz0, vec4(0.0));",
			"gx0 -= sz0 * (step(0.0, gx0) - 0.5);",
			"gy0 -= sz0 * (step(0.0, gy0) - 0.5);",
			"vec4 gx1 = ixy1 * (1.0 / 7.0);",
			"vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;",
			"gx1 = fract(gx1);",
			"vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);",
			"vec4 sz1 = step(gz1, vec4(0.0));",
			"gx1 -= sz1 * (step(0.0, gx1) - 0.5);",
			"gy1 -= sz1 * (step(0.0, gy1) - 0.5);",
			"vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);",
			"vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);",
			"vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);",
			"vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);",
			"vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);",
			"vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);",
			"vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);",
			"vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);",
			"vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));",
			"g000 *= norm0.x;",
			"g010 *= norm0.y;",
			"g100 *= norm0.z;",
			"g110 *= norm0.w;",
			"vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));",
			"g001 *= norm1.x;",
			"g011 *= norm1.y;",
			"g101 *= norm1.z;",
			"g111 *= norm1.w;",
			"float n000 = dot(g000, Pf0);",
			"float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));",
			"float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));",
			"float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));",
			"float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));",
			"float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));",
			"float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));",
			"float n111 = dot(g111, Pf1);",
			"vec3 fade_xyz = fade(Pf0);",
			"vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);",
			"vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);",
			"float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);",
			"return 2.2 * n_xyz;",
			"}",
			"vec3 bezier4(vec3 a, vec3 b, vec3 c, vec3 d, float t) {",    
				"return mix(mix(mix(a, b, t), mix(b, c, t), t), mix(mix(b, c, t), mix(c, d, t), t), t);",
			"}",
		
		"uniform float dispersionBlendMultiplier;",
		
		"varying vec3 vReflect;",
		"varying vec3 vRefract[3];",
		"varying float vReflectionFactor;",
		"varying vec3 cameraToVertexs;",
		"varying vec3 worldNormal;",
		

		"void main() {",
			
			"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
			"vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",

			"worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );",

			"vec3 I = worldPosition.xyz - cameraPosition;",



			"vReflect = reflect( I, worldNormal );",
			"vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );",
			"vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );",
			"vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );",
			"vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );",
			"float noise = cnoise(normalize(position) * uWiggleScale + ( time * uWiggleSpeed ) );//normalize(position)",
         " vec3 pos = position - vec3(800.0,0.0,0.0) + normal * noise * vec3(uWiggleDisplacement);",
		 
		 "cameraToVertexs = normalize(vec3(worldPosition) - vec3(cameraPosition));",
		 "worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);",
         

          
          
                 "vec3 newpos = position + vec3(-800.,0.,0.);",
                 "float tProgress = clamp(-1.,1., (progress - offset*0.001)/0.2 );",
                 "newpos = mix(position, newpos, tProgress);",
                " newpos = bezier4(position, vec3(-400.,0.,1.) , vec3(-800.,0.,1.) ,newpos, tProgress);  ",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position+newpos*noise, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [
		"uniform float dispersion;",
		"uniform float dispersionBlendMultiplier;",
		"uniform samplerCube tCube;",
		
		"uniform float refractionRatio ;",
		"varying vec3 vReflect;",
		"varying vec3 vRefract[3];",
		"varying float vReflectionFactor;",
		"varying vec3 cameraToVertexs;",
		"varying vec3 worldNormal;",
		"vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {",
			"return a + b*cos( 6.28318*(c*t+d) );",
		"}",
		"vec3 spectrum(float n) {",
			"return pal( n, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67) );",
		"}",
		"void main() {",
		"vec4 envColor = vec4(0);",
            
            
            
		"for (int i = 0; i < DISPERSION_SAMPLES; i++) {",
		
		  "float wavelength = float(i) / float(DISPERSION_SAMPLES);",
		
		  "float riMax = refractionRatio * (0.8 + dispersion);",
		  "float ri = mix(refractionRatio, riMax, wavelength);",
		  "vec3 reflectVec = refract( cameraToVertexs, worldNormal, ri );",
		
		  "vec4 envColorSample = textureCube( tCube, vec3( -1. * reflectVec.x, reflectVec.yz ) );",
		  
		  "envColorSample = envMapTexelToLinear( envColorSample );",
		  "envColorSample.rgb *= spectrum(wavelength);",
		  "envColorSample.rgb /= float(DISPERSION_SAMPLES) / dispersionBlendMultiplier;",
		 " envColor.rgb += envColorSample.rgb ;",
		"}",
		
		
		"//outgoingLight += envColor.xyz;",

			"vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );",
			"vec4 refractedColor = vec4( 1.0 );",

			"refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;",
			"refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;",
			"refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;",

			"gl_FragColor = mix( refractedColor, envColor, clamp( vReflectionFactor, 0.0, 1.0 ) );",

		"}"

	].join("\n")

};
