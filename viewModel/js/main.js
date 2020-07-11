import * as THREE from './lib/three.module.js';

import { DRACOLoader } from './lib/DRACOLoader.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { GLTFLoader } from './lib/GLTFLoader.js';
        
let scene = new THREE.Scene();
let renderer,camera,mobile,controls,light;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    renderer = new THREE.WebGLRenderer()
    camera = new THREE.PerspectiveCamera( 75, (window.innerWidth/1.77) / (window.innerHeight), 0.1, 60000 );
    mobile = true;
}else{
    mobile = false;
    renderer = new THREE.WebGLRenderer({alpha: true, antialias:true})
    
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / (window.innerHeight), 0.1, 60000 );
}

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, (window.innerHeight) );//(window.innerWidth/1.77)
document.body.appendChild(  renderer.domElement );
window.addEventListener( 'resize', onWindowResize, false );

scene.background = new THREE.Color(0x0FFFFF);
scene.add( camera);
camera.position.set(-26.98140478336032, 68.30039766163038, 83.8035935469530);
light = new THREE.PointLight( 0xFFFFFF,0.8 ); 
light.position.set(10,5,0);
scene.add( light );
render();
loadRes();


function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function render () {
        light.position.set( camera.position.x, camera.position.y, camera.position.z);
        renderer.render(  scene,  camera ); 
        //console.log("bruh")
        requestAnimationFrame( render );
}

function loadRes(){
    
    let loader = new GLTFLoader();
    let dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'js/lib/draco/' );
    dracoLoader.preload();
    // if(mobile)dracoLoader.setDecoderConfig( { type: 'js' } );
    loader.setPath( 'models/' );
    loader.setDRACOLoader( dracoLoader );
    console.log("preload");
    loader.load( 'FULLRH160.glb', function ( gltf ) {
        let mesh = new THREE.Mesh( gltf.scene.children[0].geometry, new THREE.MeshLambertMaterial({side:THREE.DoubleSide}));
        scene.add(mesh);
        mesh.rotation.x = Math.PI/2;
        mesh.scale.set(0.012,0.012,0.012);
        controls = new OrbitControls(  camera,  renderer.domElement );
        controls.target = new THREE.Vector3(0,  0,  0);
        console.log(mesh);
        alert(mesh);
        // controls.addEventListener( 'change', render );
        
        // dracoLoader.dispose();
        controls.update();
        
    });
}
