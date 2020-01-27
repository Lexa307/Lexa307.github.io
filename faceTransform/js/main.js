
function bind(func, context) {
  return function() {
    return func.apply(context, arguments);
  };
}





class Slider{
  constructor(selector){

    this.scene = new THREE.Scene();
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.renderer = selector ? (()=>{ return new THREE.WebGLRenderer( { canvas: selector, context: selector.getContext( 'webgl2', { alpha: false,antialias:false } ) } );})()  : new THREE.WebGLRenderer()
      this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 60000 );
      this.mobile = true;
    }else{
      this.mobile = false;
      this.renderer = selector ? (()=>{ return new THREE.WebGLRenderer( { canvas: selector, context: selector.getContext( 'webgl2', { alpha: false,antialias:true } ) } );})()  : new THREE.WebGLRenderer({antialias:true})
      this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 60000 );
    }

    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    
    this.scene.background = new THREE.Color(0x161616);
    this.loader = new THREE.GLTFLoader();
    this.loader.setCrossOrigin('anonymous');
    THREE.DRACOLoader.setDecoderPath( 'js/draco/' );
    THREE.DRACOLoader.setDecoderConfig( { type: 'js' } );
    this.loader.setDRACOLoader( new THREE.DRACOLoader() );
    
    this.objGroup = null;
   
    this.loadModel();

   
    
  }

  onWindowResize () {
	  console.log(window.devicePixelRatio);
    // this.container.width = window.innerWidth;
    // this.container.height = window.innerHeight;
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
  
  


  animate () {
    
	  requestAnimationFrame( this.animate.bind(this) );
     this.stats.begin();
     this.controls.update();
    
    // this.controls.target.set(this.focusPoint.x,this.focusPoint.y,this.focusPoint.z)
      //this.camera.lookAt(this.focusPoint);
      this.light2.position.set( this.camera.position.x,this.camera.position.y,this.camera.position.z);
      this.renderer.render( this.scene, this.camera );
     this.stats.end();

  }
  loadModel(){
    
    let gray = 
    new THREE.MeshPhongMaterial( {
      color: 0x3b5dcc,
      flatShading: true,
      wireframe:false,
      morphTargets: true,
      side:THREE.DoubleSide,

    } );
    this.loader.load(
			// resource URL
			'models/rock_ebalo1.glb',
      // called when the resource is loaded
     
			bind(function ( gltf ) {
         gltf.scene.children[0].material = gray;
        this.objGroup = gltf.scene.children[0];
        this.scene.add(this.objGroup);
        this.objGroup.position.set(0,0,0);
        
        this.Init();
        


        
			},this),
			// called while loading is progressing
			function ( xhr ) {

				//console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

			},
			// called when loading has errors
			function ( error ) {
		
				console.log( 'An error happened' );
			}
			);
  }
  
    



  Init(){

    
    
    this.camera.position.set( 17,  91.5, 40);
    
    this.mouse = new THREE.Vector2(0,0);
    this.renderer.setSize( window.innerWidth, window.innerHeight );
   
    this.container;
    

    this.container = document.createElement( 'div' );
    document.body.appendChild( this.container );//  размещение контейнера в body
    this.container.appendChild( this.renderer.domElement );// помещение рендерера в контейнер

   
    let ambientLight = new THREE.AmbientLight(0x404040,2); 
    ambientLight.visible=true;
    //this.scene.add(ambientLight);
    
    
    this.light = new THREE.PointLight(0x404040, 2,1000);
    this.light.position.set( 20,  116,  116);
    this.scene.add(this.light);

    this.light2 = new THREE.PointLight(0xC4C4C4, 1,1000);
    this.light2.position.set( -91, 39.9, 34.9);
    this.scene.add(this.light2);
    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    this.camera.position.set(0.042224083669474506,  0.42722456190557856,  3.403536734803163);
   // this.controls.target = new THREE.Vector3(0.3563309574910036, 26.199806330960396, 10.148635574650198);
    this.stats = new Stats();
    document.body.appendChild( this.stats.dom );
    
    window.addEventListener("resize",bind(this.onWindowResize,this), false);
	this.params = {
    influence1: 0,
    color: "#"+  this.objGroup.material.color.getHexString ()
	};

	this.gui = new dat.GUI();

	this.gui.add( this.params, 'influence1', 0, 1, 0.01 ).onChange( bind(function ( value ) {

		this.objGroup.morphTargetInfluences[ 0 ] = value;

  },this) );
  
  this.gui.add( this.objGroup.material, 'wireframe', true, false );
  
  this.gui.addColor( this.params, 'color').onChange(bind(function(value) {
    this.objGroup.material.color = new THREE.Color (value);
   
   },this));
    
    this.animate();
    
    
    
    
  }


  

  
  
  


    
 
  
  
  
  

  
  
}
let a;
if ( THREE.WEBGL.isWebGLAvailable() ) {
  //var canvas = document.createElement( 'canvas' );
	// Initiate function or other initializations here
	 a = new Slider(/*canvas*/);

} else {

	var warning = THREE.WEBGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}

