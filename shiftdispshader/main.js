var width = window.innerWidth;
var height = window.innerHeight;

var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.z = 5;

var controls = new THREE.TrackballControls(camera);

renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var boxes = new THREE.Group();
scene.add(boxes);

var randomPointOnSphere = function(radius) {
    var u = Math.random();
    var v = Math.random();
    var phi = 2 * Math.PI * u;
    var theta = Math.acos(2 * v - 1);
    var x = radius * Math.sin(theta) * Math.cos(phi);
    var y = radius * Math.sin(theta) * Math.sin(phi);
    var z = radius * Math.cos(theta);
    return new THREE.Vector3(x, y, z);
};

var gain = function(x, P) {
    if (x > 0.5) {
        return 1.0 - 0.5 * Math.pow(2.0 - 2.0 * x, P);
    } else {
        return 0.5 * Math.pow(2.0 * x, P);
    }
};

var addRandomBox = function() {
    var size = Math.random() * 2 + 0.2;
    var geometry = new THREE.BoxGeometry(size, size, size);
    var material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent:true,
        opacity:1.0
    });
    var box = new THREE.Mesh( geometry, material );
    var radius = gain(Math.random(), 1/2) * 8 + 8;
    box.position.copy(randomPointOnSphere(radius));
    //box.visible = false
    boxes.add(box);
};

for (var i = 0; i <200; i++) {
    addRandomBox();
}

var cubeCamera = new THREE.CubeCamera( 1, 100000, 1024 );
scene.add( cubeCamera );

function DispersionMaterial(parameters) {
    THREE.ShaderMaterial.call(this);

    this.envMap = null;
    this.refractionRatio = 0.98;
    this.lights = true;
    this.isMeshBasicMaterial = true; // Force refreshUniformsCommon to be run
    this.dispersionSamples = 10;
    this.dispersion = 0.85;
    this.dispersionBlendMultiplier = 20;

    var envmap_dispersion_pars_fragment = document.getElementById('envmap_dispersion_pars_fragment').textContent;
    var envmap_dispersion_fragment = document.getElementById('envmap_dispersion_fragment').textContent;
    var fragmentShader = THREE.ShaderLib.phong.fragmentShader;
    fragmentShader = fragmentShader.replace('#include <envmap_pars_fragment>', '#include <envmap_pars_fragment>\n' + envmap_dispersion_pars_fragment);
    fragmentShader = fragmentShader.replace('#include <envmap_fragment>', envmap_dispersion_fragment);
    
    this.uniforms = THREE.UniformsUtils.clone( THREE.ShaderLib.phong.uniforms );
    this.vertexShader = THREE.ShaderLib.phong.vertexShader;
    this.fragmentShader = fragmentShader;

    this.setValues( parameters );

    this.uniforms.dispersion = {value: this.dispersion};
    this.uniforms.dispersionBlendMultiplier = {value: this.dispersionBlendMultiplier};

    this.defines.DISPERSION_SAMPLES = this.dispersionSamples;
}

DispersionMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
DispersionMaterial.prototype.constructor = DispersionMaterial;

var material = new DispersionMaterial({ 
    envMap: cubeCamera.renderTarget.texture,
    refractionRatio: 0.8,
    dispersionSamples: 30,
    dispersion: 0.3
});
material.envMap.mapping = THREE.CubeRefractionMapping;


var geometry = new THREE.SphereGeometry(1, 100, 100);
var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );


function render() {
    //mesh.visible = false;
    // boxes.visible = true;
    cubeCamera.position.copy(mesh.position);
    cubeCamera.update(renderer, scene);
    mesh.visible = true;
    // boxes.visible = false;
    renderer.render(scene, camera);
}

function animate() {
    render();
    controls.update();
    requestAnimationFrame(animate);
}

function onWindowResize() {
    var DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
    DPR *= 2;
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width * DPR, height * DPR);
}


window.addEventListener('resize', onWindowResize, false);
onWindowResize();
animate();
