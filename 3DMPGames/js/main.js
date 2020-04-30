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
        //this.light1.position.copy(this.camera.position);

    }

    loadRes(){
        // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        // this.focusbox = new THREE.Mesh( geometry, material );
        // this.scene.add( this.focusbox );
        var light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
        this.scene.add( light );
        var loader = new THREE.GLTFLoader().setPath( 'models/' );
            loader.load( 'fullscene.glb', bind( function ( gltf ) {
                this.scene.add( gltf.scene );
               // gltf.scene.children[0].material = new THREE.MeshLambertMaterial({color:0x000000});
                console.log(gltf);

                this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
                this.controls.target = new THREE.Vector3(0,  0,  0);
                this.controls.update();
                
                this.camera.position.set( 0,  0,  85.5);
                this.camera.lookAt(new THREE.Vector3(0,0,0));
                this.light1 = new THREE.PointLight( 0xFFFFFF, 0.8, 11000 );
                this.light1.position.set( 11.31182850514277,  9.871880217076887,  53.44 );
                this.scene.add( this.light1 );
                TweenMax.to(this.camera.position,4,{z:-30,ease:Power2.easeInOut});//,ease:Power2.easeOut
                this.animate();
            },this));
    }
}
let a = new Slider();