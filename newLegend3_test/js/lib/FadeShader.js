THREE.FadeShader = {
    uniforms:{
        "tDiffuse": { value: null },
        "tDiffuse2":{ value: null },
        "Ypos":{value: 0},
        "color": { value: new THREE.Color( 0xFFFFFF )},
    },
    vertexShader:`
    varying vec2 vUv;
    uniform float Ypos;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,
    fragmentShader:`
    uniform vec3 color;
    uniform sampler2D tDiffuse;
    uniform sampler2D tDiffuse2;
    varying vec2 vUv;
    uniform float Ypos;
    void main() {
        vec4 texel = texture2D( tDiffuse, vUv );
        vec4 texel2 = texture2D( tDiffuse2, vUv );

        if(texel2.a<0.3){
            discard;
        }
        if(vUv.y>Ypos){
            float mixValue = (distance(vUv,vec2(vUv.x,Ypos)));
            vec3 final = mix(texel.rgb,texel.rgb,mixValue);
            gl_FragColor = vec4(final, Ypos );
        }else{
            float mixValue = (distance(vUv,vec2(vUv.x,Ypos)));
            vec3 final = mix(texel.rgb,texel2.rgb,mixValue);
            gl_FragColor = vec4(final,Ypos );
        }
        //vec3 final = mix(texel2.rgb,texel.rgb,Ypos);
        
    }
    `
}