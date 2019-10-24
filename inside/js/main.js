/*global THREE*/
/*global dat*/
function bind(func, context) {
  return function() {
    return func.apply(context, arguments);
  };
}



class Slider{
  constructor(selector){

    this.selector = selector;
    this.textue = null;
    this.textueURL = "https://lexa307.github.io/inside/textures/cubemaps/Frame 9.8.jpg"
    this.loadTextures();
  
  }
  onWindowResize () {

    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
  changeImaage(){
    let image = document.createElement('img');
    image.src = window.URL.createObjectURL(this.ImgLoader.files[0]);
    let cbtx = new THREE.CubeTextureLoader().load([image.src,image.src,image.src,image.src,image.src,image.src]);
   
   
    
    this.bigsphere.material.uniforms.envMap.value = cbtx;
    this.enter();
    
  }
  loadTextures() {
    this.textue = new THREE.CubeTextureLoader()
    .load( [
      this.textueURL,
      this.textueURL,
      this.textueURL,
      this.textueURL,
      this.textueURL,
      this.textueURL
    ],()=>{
      this.init();
    } )
}  
init(){
  this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 60000 );
    this.scene.background= new THREE.Color(0xA4B9BF);
    this.renderer = this.selector ? (()=>{ return new THREE.WebGLRenderer( { canvas: selector, context: selector.getContext( 'webgl2', { alpha: false,antialias:true } ) } );})()  : new THREE.WebGLRenderer({antialias:true})
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    //this.controls = new THREE.OrbitControls( this.camera );
    this.target = new THREE.Vector3(350,20,0);
    this.container;
    this.time = 9.95;
    this.Count = 5;
    this.spheres = [];
    this.moving = true;
    
    this.container = document.createElement( 'div' );
    document.body.appendChild( this.container );//  размещение контейнера в body
    this.container.appendChild( this.renderer.domElement );// помещение рендерера в контейнер
    
    
    

    this.raycaster= new THREE.Raycaster();
    //this.raycaster.far=1700;
    this.mouse = new THREE.Vector2();


    window.addEventListener( 'mousemove', bind(this.onMouseMove,this), false );

   this.material = new THREE.ShaderMaterial( {
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives : enable'
    },
    defines: THREE.DispersionMaterial.defines,
    uniforms: THREE.DispersionMaterial.uniforms,
    side: THREE.DoubleSide,
    vertexShader: THREE.DispersionMaterial.vertex_Shader,
  
    fragmentShader: THREE.DispersionMaterial.fragmentShader
  
  } );
   
  this.material.uniforms.envMap.value = this.textue;
  
  //this.material.envMap.mapping = THREE.CubeReflectionMapping;
  

	

	

   
    //this.camera.position.set( -4,  0.1,  -0.3)
    this.camera.lookAt(this.scene.position)
    this.bigtestgeometry=new THREE.IcosahedronGeometry(500, 4);
   
    this.bigsphere=new THREE.Mesh(this.bigtestgeometry,this.material);
    this.scene.add(this.bigsphere);
    
    
     let ambientLight = new THREE.AmbientLight(0x999999); //0x999999
    // ambientLight.visible=true;
     this.scene.add(ambientLight);
     

    this.light = new THREE.PointLight(0xFFFFFF, 1,5000);
    this.light.position.set(this.camera.position.x,this.camera.position.y,this.camera.position.z);
    this.scene.add(this.light);
 

  window.addEventListener("resize",bind(this.onWindowResize,this), false);

  this.ImgLoader = document.getElementById( 'imgLoader' );
  this.ImgLoader.addEventListener('change',bind(this.changeImaage,this), false);

this.animate();
this.enter();
}

  

  animate () {
    
	  requestAnimationFrame( this.animate.bind(this) );
 

       
    this.time+=0.001
    //this.camera.rotation.y +=0.01;
    //this.controls.update();
      
       this.bigsphere.material.uniforms.time.value = this.time;
       this.camera.lookAt( this.target ); 
       
      
     

      this.renderer.render( this.scene, this.camera );
     

  }
  enter (){
    this.moving = true;
    this.camera.position.set(-396.2, 20,  0)
    TweenMax.to(this.camera.position,3,{x:4,onComplete:()=>{
      this.moving = false;     
    } })
  }
    onMouseMove ( evvent ) {
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      this.raycaster.setFromCamera( this.mouse, this.camera );
      if(!this.moving){
        this.camera.position.z += ( this.mouse.x*4 - this.camera.position.z  ) * 1.1;
        this.camera.position.y += ( - this.mouse.y+20 - this.camera.position.y ) * 1.1;
        this.camera.lookAt( this.target );
      }
      
      
	// calculate objects intersecting the picking ray
	var intersects = this.raycaster.intersectObjects( this.scene.children );

	for ( var i = 0; i < intersects.length; i++ ) {

		//intersects[ i ].object.material.color.set( 0xff0000 );

	}
	    
    }
  
  
}

if ( THREE.WEBGL.isWebGLAvailable() ) {
  //var canvas = document.createElement( 'canvas' );
	// Initiate function or other initializations here
	let a = new Slider(/*canvas*/);

} else {

	var warning = THREE.WEBGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}