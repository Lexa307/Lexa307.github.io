
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
    this.options = {
      resolution: 2048,
      offset:new THREE.Vector2(0.5,0),
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter
    };
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
    let red = new THREE.MeshLambertMaterial({color:0xb22e2e, });
    //let white1 = new THREE.MeshLambertMaterial({color: 0xFFFFFF, map: this.map,side:THREE.DoubleSide});
    let white2 = new THREE.MeshLambertMaterial({color: 0xFFFFF2,side:THREE.DoubleSide});
    //let black = new THREE.MeshLambertMaterial({color: 0x000000});
    let gray = new THREE.MeshLambertMaterial({color:0x7a7a7a,side:THREE.DoubleSide});
    this.loader.load(
			// resource URL
			'models/LN.glb',
      // called when the resource is loaded
     
			bind(function ( gltf ) {
        // gltf.scene.children[0].material = white2;
        // gltf.scene.children[1].material = white2;
        // for(let i = 0; i<gltf.scene.children[2].children.length; i++){
        //   gltf.scene.children[2].children[i].material = white2;
        // }
        this.scene.add(gltf.scene)
        this.objGroup = gltf.scene;
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
    this.controls.target = new THREE.Vector3(0.3563309574910036, 26.199806330960396, 10.148635574650198);
    this.stats = new Stats();
    document.body.appendChild( this.stats.dom );
    let Yoffset = 7.1;
    for(let i = 0; i<7; i++){
      let gr = this.objGroup.clone();
      gr.position.y = Yoffset;

      this.scene.add(gr);
      Yoffset+=7.1;
    }
    window.addEventListener("resize",bind(this.onWindowResize,this), false);

   
   
    
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

