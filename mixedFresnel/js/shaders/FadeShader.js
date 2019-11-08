THREE.ColorifyShader = {

    uniforms: {

        "tDiffuse": { type: "t", value: null },
        "Fcolor":    { type: "c", value: new THREE.Color( 0x000000 ) },
        "opacity":  { type: "f", value: 1.0 }

    },

    vertexShader: 
    ` 
    varying vec2 vUv;
    void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }`,

    fragmentShader: `
    uniform float opacity;
    uniform vec3 Fcolor;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
        vec4 texel = texture2D( tDiffuse, vUv );
        vec3 finalColor = mix(Fcolor, texel.rgb, opacity);
        gl_FragColor = vec4( finalColor, 1. );
    }

    `
    

};