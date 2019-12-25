THREE.BGFadeShader = {
    uniforms:{
        "tDiffuse2": { value: null },
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
    uniform sampler2D tDiffuse2;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    uniform float Ypos;
    void main() {
        vec4 texel = texture2D( tDiffuse2, vUv );
        if(texel.a==0.){
            discard;
        }
        if(vUv.y>Ypos){
            float mixValue = (distance(vUv,vec2(vUv.x,Ypos)));
            vec3 final = mix(color,texel.rgb,mixValue);

            gl_FragColor = vec4(final, 1. );
        }else{

            float mixValue = (distance(vUv,vec2(vUv.x,Ypos)));
            vec3 final = mix(color,color,mixValue);
         
            gl_FragColor = vec4(final,0. );
        }
        //vec3 final = mix(texel2.rgb,texel.rgb,Ypos);
        
    }
    `
}