/*global THREE*/
/*global dat*/
function bind(func, context) {
  return function() {
    return func.apply(context, arguments);
  };
}
class Slider{
  constructor(selector){
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 60000 );
    this.scene.background= new THREE.Color(0xA4B9BF);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.container;
    this.time = 0;
    this.Count = 5;
    this.spheres = [];
    this.settings = {
      refractionRatio: 0.92,
      aberration: 0.1,
      mirrorRefraction:  1 ,
      bgcolor: "#"+ this.scene.background.getHexString ()
    }
    this.gui = new dat.GUI();
     this.gui.add(this.settings, 'refractionRatio', 0, 1, 0.001);
     this.gui.add(this.settings, 'aberration', 0, 1, 0.001);
     this.gui.add(this.settings, 'mirrorRefraction', 0, 1, 0.001);
    // this.gui.add(this.settings, 'uWiggleDisplacement', 0.001, 30, 0.001);
    // this.gui.add(this.settings, 'uWiggleSpeed', 0.001, 1, 0.001);
    // this.gui.add(this.settings, 'transparency', 0.001, 1, 0.001);
    this.gui.addColor( this.settings, 'bgcolor').onChange(bind(function(value) {
				  this.scene.background = new THREE.Color (value);
				 // console.log(this);
				 },this));
    
    this.ImgLoader = document.getElementById( 'imgLoader' );
    this.ImgLoader.addEventListener('change',bind(this.changeImaage,this), false);
    let statment = 0;
    this.container = document.createElement( 'div' );
    document.body.appendChild( this.container );//  размещение контейнера в body
    this.container.appendChild( this.renderer.domElement );// помещение рендерера в контейнер
    
    this.raycaster= new THREE.Raycaster();
    //this.raycaster.far=1700;
    this.mouse = new THREE.Vector2();
    this.texture1 = new THREE.TextureLoader().load('textures/test7.png');
    this.texture1.offset=new THREE.Vector2(0,1);
    //this.texture1.repeat = THREE.MirroredRepeatWrapping;
    window.addEventListener( 'mousemove', bind(this.onMouseMove,this), false );
    // this.animbtn = document.createElement( 'a' );
    // this.animbtn.innerHTML = 'Animate';
    // this.animbtn.className = 'holdbutton';
    // this.animindex=0;
    // document.body.appendChild( this.animbtn );
    //this.animbtn.addEventListener( 'click', bind(this.animclick,this), false );
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable'
      },
      side: THREE.DoubleSide,
      uniforms: {
        refractionRatio: { type: 'f', value: 0 },
        aberration: { type: 'f', value: 1  },
        mirrorRefraction: { type: 'f', value:1 },
        reflectionSampler: { value: new THREE.CubeTextureLoader()
          //.setPath( 'textures/cubeMaps/' )
          .load( [
            'textures/cubeMaps/Frame.jpg',
            'textures/cubeMaps/Frame.jpg',
            'textures/cubeMaps/Frame.jpg',
            'textures/cubeMaps/Frame.jpg',
            'textures/cubeMaps/Frame.jpg',
            'textures/cubeMaps/Frame.jpg'
          ] ) },
      },
      // wireframe: true,
       transparent: true,
      vertexShader: document.getElementById( 'vertex' ).textContent,
      fragmentShader: document.getElementById( 'fragment' ).textContent
    });

    this.controls = new THREE.OrbitControls( this.camera );
    this.camera.position.z = 1642;
    this.camera.position.set( 4125,  -500,  0);
    this.controls.update();
    this.bigtestgeometry=new THREE.IcosahedronGeometry(500, 4);
    //bigtestgeometry.scale(  -1, 1, 1 );
    let tessellateModifier = new THREE.TessellateModifier( 60 );
    tessellateModifier.modify( this.bigtestgeometry );
    this.bigtestgeometry = new THREE.BufferGeometry().fromGeometry( this.bigtestgeometry );
    let numFaces = this.bigtestgeometry.attributes.position.count / 3;
    //bigtestgeometry.attributes.position.setDynamic( true );
    let displacement = new Float32Array( numFaces * 9);
    let anim = new Float32Array( numFaces * 9);
    for ( let f = 0; f < numFaces; f ++ ) {
	    let index = 9 * f;
	    let d = 10 * ( 0.5 - Math.random() );
	    for ( let i = 0; i < 3; i ++ ) {
		    displacement[ index + ( 3 * i )     ] = d;
	    	displacement[ index + ( 3 * i ) + 1 ] = d;
		    displacement[ index + ( 3 * i ) + 2 ] = d;

	    }
    }
    
    let offsets = [];
    for (let i = 0; i < (this.bigtestgeometry.attributes.position.count*3); i+=9) {
      let rand = Math.random();
       offsets.push(this.bigtestgeometry.attributes.position.array[i],this.bigtestgeometry.attributes.position.array[i],this.bigtestgeometry.attributes.position.array[i]);
    }
    
    this.bigtestgeometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );
    this.bigtestgeometry.addAttribute( 'position', new THREE.BufferAttribute( this.bigtestgeometry.attributes.position.array, 3 ).setDynamic( true ) );
    this.bigtestgeometry.addAttribute( 'offset', new THREE.BufferAttribute( new Float32Array(offsets), 1 ) );
    
    this.bigsphere=new THREE.Mesh(this.bigtestgeometry,this.material);
    this.scene.add(this.bigsphere);

    let ambientLight = new THREE.AmbientLight(0xFFFFFF); //0x999999
    ambientLight.visible=true;
    this.scene.add(ambientLight);

    let light = new THREE.DirectionalLight(0xffffff,0.5);
    light.position.set(-1,0,1);
    this.scene.add(light);
    //TweenMax.to(this.material.uniforms.progress,5,{value:5,repeat:-1,yoyo:true});

window.addEventListener("resize",this.onWindowResize(), false);


this.animate();
    
    
  }
  onWindowResize () {
	  this.camera.updateProjectionMatrix();
    this.container.width = window.innerWidth;
    this.container.height = window.innerHeight;
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

  }
  animclick(){
    this.animbtn.innerHTML='Animating';
    if(this.animindex){
      
      TweenMax.to(this.camera.position,this.settings.animtime*0.5,{x:4120});
      //TweenMax.to(this.bigsphere.rotation,this.settings.animtime,{x:100});
      TweenMax.to(this.material.uniforms.transparency,this.settings.animtime,{value:1});
      TweenMax.to(this.material.uniforms.progress,this.settings.animtime,{value:1,onComplete:()=>{this.animindex--; this.animbtn.innerHTML='back'}});
    }else{
      TweenMax.to(this.camera.position,this.settings.animtime*0.5,{x:13000});
     // TweenMax.to(this.bigsphere.rotation,this.settings.animtime,{x:-100});
      TweenMax.to(this.material.uniforms.transparency,this.settings.animtime,{value:0});
      TweenMax.to(this.material.uniforms.progress,this.settings.animtime,{value:-1,onComplete:()=>{this.animindex++;this.animbtn.innerHTML='foward'}});
    }
    
  }
  changeImaage(){
    let image = document.createElement('img');
    image.src = window.URL.createObjectURL(this.ImgLoader.files[0]);
    // let ca=document.createElement("canvas");
    // let ctx=ca.getContext("2d");
    // ca.setAttribute("width",image.naturalWidth);
    // ca.setAttribute("height",image.naturalHeight);
    // ctx.drawImage(image,0,0);
    let cbtx = new THREE.CubeTextureLoader().load([image.src,image.src,image.src,image.src,image.src,image.src]);
   
   
    console.log(cbtx);
    this.material.uniforms.reflectionSampler.value = cbtx;
    
  }

  animate () {
    
	  requestAnimationFrame( this.animate.bind(this) );
      this.time += 0.001;
	    // this.bigsphere.rotation.x+=0.001;
       this.material.uniforms.refractionRatio.value = this.settings.refractionRatio;
       this.material.uniforms.aberration.value = this.settings.aberration;
       this.material.uniforms.mirrorRefraction.value = this.settings.mirrorRefraction;
      // this.material.uniforms.uWiggleSpeed.value = this.settings.uWiggleSpeed;
     // this.material.uniforms.progress.value = this.settings.progress;
     // this.material.uniforms.transparency.value = this.settings.transparency;
  	  this.controls.update();
  	  this.renderer.render( this.scene, this.camera );

  }
    onMouseMove ( evvent ) {
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	    this.raycaster.setFromCamera( this.mouse, this.camera );

	// calculate objects intersecting the picking ray
	var intersects = this.raycaster.intersectObjects( this.scene.children );

	for ( var i = 0; i < intersects.length; i++ ) {

		//intersects[ i ].object.material.color.set( 0xff0000 );

	}
	    
    }
  
  
}

let a = new Slider();



//TweenMax.to(material.uniforms.progress,20,{value:5,repeat:-1});




	






