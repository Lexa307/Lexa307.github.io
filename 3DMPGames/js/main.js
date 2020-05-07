function bind(func, context) {
	return function() {
	  return func.apply(context, arguments);
	};
  }
  
class Slider{

    constructor(selector){
        
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x3F3683);
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        this.renderer = selector ? (()=>{ return new THREE.WebGLRenderer( { canvas: selector, context: selector.getContext( 'webgl', { alpha: false,antialias:false } ) } );})()  : new THREE.WebGLRenderer()
        this.camera = new THREE.PerspectiveCamera( 75, (window.innerWidth) / (window.innerWidth/1.77), 0.1, 60000 );
        this.mobile = true;
        }else{
        this.mobile = false;
        this.renderer = selector ? (()=>{ return new THREE.WebGLRenderer( { canvas: selector, context: selector.getContext( 'webgl', { alpha: true,antialias:true } ) } );})()  : new THREE.WebGLRenderer({alpha: true,antialias:true})
        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / (window.innerWidth/1.77), 0.1, 60000 );
        }
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, (window.innerWidth/1.77) );//(window.innerWidth/1.77)
        document.body.appendChild( this.renderer.domElement );
        this.loadRes();
    }

    onWindowResize () {
        // this.renderer.setPixelRatio( window.devicePixelRatio );
        // this.renderer.setSize( window.innerWidth, (window.innerWidth) );
        // this.camera.aspect = window.innerWidth / (window.innerWidth);
        // this.camera.updateProjectionMatrix();
    }

    animate () {
        requestAnimationFrame( this.animate.bind(this) );
        this.renderer.render( this.scene, this.camera );
    }
    animationMove(direction){ 
        if(TweenMax.isTweening(this.camera.position)){return;}
        if(direction == 'next'){
            if (this.tl.reversed()) {
                this.tl.reversed( false );
            }
            this.tl.play();
        }
        if(direction == 'back'){
            this.tl.reverse();
        }
    }

    mouseHandle(event){
        //event.preventDefault();

        if (event.deltaY < 0) {
          // Zoom in
          this.animationMove('back');

        }
        else {
          // Zoom out
          this.animationMove('next');
        }
      
        
      }

    loadRes(){
        var light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
        this.scene.add( light );
        var loader = new THREE.GLTFLoader().setPath( 'models/' );
            loader.load( 'fullscene.glb', bind( function ( gltf ) {
                this.scene.add( gltf.scene );
                //this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
                //this.controls.target = new THREE.Vector3(0,  0,  0);
                //this.controls.update();
                loader.load( 'rocks.glb', bind( function ( gltf ){
                    this.scene.add( gltf.scene );
                    gltf.scene.rotation.y -=Math.PI/2;
                    gltf.scene.position.z = -90;
                    gltf.scene.position.y = -3;
                    this.sceneSeparatorPlane = new THREE.Mesh( 
                        new THREE.PlaneGeometry( 200, 200, 1,1 ),
                        new THREE.MeshBasicMaterial( {color: 0x3F3683, side: THREE.DoubleSide, transparent:true, opacity:1} ) 
                    );
                    this.scene.add( this.sceneSeparatorPlane );
                    this.sceneSeparatorPlane.position.z = -65;
                    this.camera.position.set( 0,  0,  85.5);
                    this.camera.lookAt(new THREE.Vector3(0,0,0));
                    this.light1 = new THREE.PointLight( 0xFFFFFF, 0.8, 11000 );
                    this.light1.position.set( 11.31182850514277,  9.871880217076887,  53.44 );
                    this.scene.add( this.light1 );
                    this.tl = new TimelineMax()
                    .addPause()
                    .to(this.sceneSeparatorPlane.material,1,{opacity:0},0)
                    .to(this.camera.position,4,{z:-70,},0)
                    .addPause()
                    document.addEventListener( 'mousewheel', bind(this.mouseHandle, this), false);
                    document.onwheel =  bind(this.mouseHandle, this);
                    this.animate();
                },this))
                
            },this));
    }
}
let a = new Slider();