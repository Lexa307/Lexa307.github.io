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
        this.camera = new THREE.PerspectiveCamera( 75, (window.innerWidth/1.77) / (window.innerHeight), 0.1, 60000 );
        this.mobile = true;
        }else{
        this.mobile = false;
        this.renderer = selector ? (()=>{ return new THREE.WebGLRenderer( { canvas: selector, context: selector.getContext( 'webgl', { alpha: true,antialias:true } ) } );})()  : new THREE.WebGLRenderer({alpha: true,antialias:true})
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / (window.innerHeight), 0.1, 60000 );
        }
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, (window.innerHeight) );//(window.innerWidth/1.77)
        document.body.appendChild( this.renderer.domElement );
        this.moving = false;
        this.index = 0;
        this.scene.background = new THREE.Color(0xFFFFFF);
        this.mouse = new THREE.Vector2();
        this.focus = new THREE.Vector3(0, 0, -300);
        this.scene.add(this.camera);
        this.camera.position.set(-26.98140478336032, 68.30039766163038, 83.8035935469530);
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
        this.light.position.set(this.camera.position.x,this.camera.position.y,this.camera.position.z);
        this.renderer.render( this.scene, this.camera ); 
    }

    loadRes(){
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = 30.0;
        this.light = new THREE.PointLight( 0xFFFFFF,0.8 ); 
        this.light.position.set(10,5,0);
        this.ambientLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.7 );
        //this.scene.add(this.ambientLight);
        this.scene.add( this.light );
        var loader = new THREE.GLTFLoader();
        var dracoLoader = new THREE.DRACOLoader();
		dracoLoader.setDecoderPath( 'js/lib/draco/' );
		//dracoLoader.setDecoderConfig( { type: 'js' } );
        loader.setPath( 'models/' );
        loader.setDRACOLoader( dracoLoader );
        loader.load( 'FULLRH1602.glb', bind( function ( gltf ) {
            this.scene.add( gltf.scene );
            console.log(gltf.scene);
            gltf.scene.children[0].material = new THREE.MeshLambertMaterial({side:THREE.DoubleSide});
            gltf.scene.children[0].rotation.x = Math.PI/2;
            this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
            this.controls.target = new THREE.Vector3(0,  0,  0);
            this.controls.update();
            this.animate()
        },this));
    }
}
let a = new Slider();