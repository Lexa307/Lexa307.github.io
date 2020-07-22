function bind(func, context) {
	return function() {
	  return func.apply(context, arguments);
	};
}
  
class Slider{

    constructor(selector){
        
        this.scene = new THREE.Scene();
        //new THREE.Color(0x40182a)//new THREE.Color(0x3F3683);
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        this.renderer = selector ? (()=>{ return new THREE.WebGLRenderer( { canvas: selector, context: selector.getContext( 'webgl', { alpha: false,antialias:false } ) } );})()  : new THREE.WebGLRenderer()
        this.camera = new THREE.PerspectiveCamera( 54, (window.innerWidth/1.77) / (window.innerHeight/1.77), 0.1, 60000 );
        this.mobile = true;
        }else{
        this.mobile = false;
        this.renderer = selector ? (()=>{ return new THREE.WebGLRenderer( { canvas: selector, context: selector.getContext( 'webgl', { alpha: true,antialias:true } ) } );})()  : new THREE.WebGLRenderer({alpha: true,antialias:true})
        this.camera = new THREE.PerspectiveCamera( 54, window.innerWidth / (window.innerHeight), 0.1, 60000 );
        }
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, (window.innerHeight) );//(window.innerWidth/1.77)
        document.body.appendChild( this.renderer.domElement );
        this.moving = false;
        this.index = 0;
        this.scene.background = new THREE.Color(0xdeecfa);
        this.mouse = new THREE.Vector2();
        this.focus = new THREE.Vector3(0, 0, -300);
        this.scene.add(this.camera);
        this.camera.position.set(10 ,0 ,0);
        this.loadRes();
    }

    onWindowResize () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );

    }

    animate () {
        requestAnimationFrame( this.animate.bind(this) );
        // this.camera.lookAt(this.focus); 
        // this.light.position.set(this.camera.position.x,this.camera.position.y,this.camera.position.z);
        this.renderer.render( this.scene, this.camera ); 
    }

    convertMaterials(object) {
        for(let i of object.children ){
            if(i.children.length>0){this.convertMaterials(i)}
            else{
                let tmpColor = i.material.color;
                i.material = new THREE.MeshToonMaterial({side:THREE.DoubleSide,color:tmpColor});
            }
        }
    }

    loadRes(){
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = 30.0;
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.scene.add( directionalLight );
        directionalLight.position.set(0.1,-16,11);
        // this.light.position.set(10,5,0);-10.917352316723136, y: 17.143082849738263, z: -2.720300965499309
        var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        directionalLight2.position.set(-10.917352316723136,  17.143082849738263,  -2.720300965499309);
        this.scene.add(directionalLight2);
        this.ambientLight = new THREE.AmbientLight( 0xFFFFFF,0.8 );
         this.scene.add(this.ambientLight);
        // this.scene.add( this.light );
        var loader = new THREE.GLTFLoader().setPath( 'models/' );
        loader.load( 'boat2.glb', bind( function ( gltf ) {
            this.scene.add( gltf.scene );
            this.convertMaterials(gltf.scene.children[0]);
            //  this.convertMaterials(gltf.scene.children[0].getObjectByName('дно_внеш'));
            //  this.convertMaterials(gltf.scene.children[0].getObjectByName('дно_внутр'));
            // gltf.scene.children[0].getObjectByName('дно').material = 
            this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
            this.controls.target = new THREE.Vector3(0,  0,  0);
            this.controls.update();
            this.animate()
        },this));
    }
}
let a = new Slider();