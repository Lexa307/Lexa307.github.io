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
    this.scene.background= new THREE.Color(0x000000);
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    
    this.container;
    this.time = 18.95;
    this.Count = 5;
    this.spheres = [];
    this.settings = {
      reflectivity:0.5,
      metalness:0.5,
      progress: 1,
      animtime: 5,
      roughness:0.5,
      uWiggleScale:  0.454 ,
      uWiggleDisplacement: 10.995,
      uWiggleSpeed:  0.064 ,
      refractionRatio: 0.8,
      dispersionSamples: 30,
      dispersionBlendMultiplier:20,
      dispersion: 0.8,
      mRefractionRatio: 1.0,
      mFresnelBias: 0.1,
      mFresnelPower: 2.0,
      mFresnelScale: 1.0,
      bgcolor: "#"+ this.scene.background.getHexString ()
    }
    this.sceneParams =
    {
      0:{
        x:-2000,
        y:1000,
        z:10000,
        uniformsOut:{},

      },
      1:{
        x:-1200,
        y:400,
        z:500,
        uniformsOut:{},


      },
      2:{
        x:-600,
        y:-400,
        z:2000,
        uniformsOut:{},


      },
      3:{
        x:0,
        y:0,
        z:0,
        uniformsOut:{},


      },
      4:{
        x:1000,
        y:-800,
        z:1600,
        uniformsOut:{},


      },
      5:{
        x:2000,
        y:1200,
        z:2400,
        uniformsOut:{},


      },
      6:{
        x:2400,
        y:1600,
        z:3000,
        uniformsOut:{},


      },

    }; 
    this.arrB = [];
    
     
    
   
    this.ImgLoader = document.getElementById( 'imgLoader' );
    this.ImgLoader.addEventListener('change',bind(this.changeImaage,this), false);
    let statment = 0;
    this.container = document.createElement( 'div' );
    document.body.appendChild( this.container );//  размещение контейнера в body
    this.container.appendChild( this.renderer.domElement );// помещение рендерера в контейнер
    this.stats = new Stats();
    document.body.appendChild( this.stats.dom );


    

    

    this.raycaster= new THREE.Raycaster();
    //this.raycaster.far=1700;
    this.mouse = new THREE.Vector2();
    this.texture1 = new THREE.TextureLoader().load('textures/test7.png');
    this.texture1.offset=new THREE.Vector2(0,1);
    //this.texture1.repeat = THREE.MirroredRepeatWrapping;
    window.addEventListener( 'mousemove', bind(this.onMouseMove,this), false );

	this.fShader = THREE.FresnelShader;
	
    this.controls = new THREE.OrbitControls( this.camera );
    this.camera.position.z = 1642;
    this.camera.position.set( 4125,  -500,  0);
    this.controls.update();
    this.bigtestgeometry=new THREE.IcosahedronGeometry(500, 4);
    //this.bigtestgeometry.scale(  -1, 1, 1 );
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

  
  
 
     let ambientLight = new THREE.AmbientLight(0x999999); //0x999999
    // ambientLight.visible=true;
     //this.scene.add(ambientLight);
    for(let i =0;i<7;i++){

      let meshBMaterial = new THREE.ShaderMaterial( 
        {
          defines: {
            DISPERSION_SAMPLES:50
          },
            uniforms: 			{
              "mRefractionRatio": { type: "f", value: 1.02 },
              "mFresnelBias": 	{ type: "f", value: 0.1 },
              "mFresnelPower": 	{ type: "f", value: 2.0 },
              "mFresnelScale": 	{ type: "f", value: 1.0 },
              "time": { type: 'f', value: 9.95 },
              "progress": { type: 'f', value: 1.0 },
              "uWiggleScale": { type: 'f', value: 0.001 },
              "uWiggleDisplacement": { type: 'f', value: 0.01 },
              "uWiggleSpeed": { type: 'f', value: 0.03 },
              "refractionRatio":{ type: 'f', value: 0.8 }, 
		          "dispersion": { type: 'f', value: 0.8 }, 
              "dispersionBlendMultiplier":{ type: 'f', value: 20.0 },
              "cameraPosition":{value:this.camera.position},
              "tCube": 			{ type: "t", value:new THREE.CubeTextureLoader()
              .load( [
                      'https://sun9-34.userapi.com/c851328/v851328883/1ab13b/qx3NH6sgxQs.jpg',
                      'https://sun9-34.userapi.com/c851328/v851328883/1ab13b/qx3NH6sgxQs.jpg',
                      'https://sun9-34.userapi.com/c851328/v851328883/1ab13b/qx3NH6sgxQs.jpg',
                      'https://sun9-34.userapi.com/c851328/v851328883/1ab13b/qx3NH6sgxQs.jpg',
                      'https://sun9-34.userapi.com/c851328/v851328883/1ab13b/qx3NH6sgxQs.jpg',
                      'https://sun9-34.userapi.com/c851328/v851328883/1ab13b/qx3NH6sgxQs.jpg'
              ] ), } //  textureCube }
            },
          vertexShader:   this.fShader.vertexShader,
          fragmentShader: this.fShader.fragmentShader
        }   );
      let meshB = new THREE.Mesh(this.bigtestgeometry,	meshBMaterial);

      meshB.position.set(this.sceneParams[i].x,this.sceneParams[i].y,this.sceneParams[i].z);
     
      this.arrB.push(meshB);

      this.scene.add(meshB);

    }
    this.gui = new dat.GUI();
    this.gui.addColor( this.settings, 'bgcolor').onChange(bind(function(value) {
      this.scene.background = new THREE.Color (value);
     // console.log(this);
     },this));

    for(let i = 0; i<7; i++){
      this.arrB[i].material.uniforms.uWiggleScale.value = this.settings.uWiggleScale;
      this.arrB[i].material.uniforms.uWiggleDisplacement.value = this.settings.uWiggleDisplacement;
      this.arrB[i].material.uniforms.uWiggleSpeed.value = this.settings.uWiggleSpeed;

      this.arrB[i].material.uniforms.mRefractionRatio.value = this.settings.mRefractionRatio;
      this.arrB[i].material.uniforms.mFresnelBias.value = this.settings.mFresnelBias;
      this.arrB[i].material.uniforms.mFresnelPower.value = this.settings.mFresnelPower;
      this.arrB[i].material.uniforms.mFresnelScale.value = this.settings.mFresnelScale;
      this.arrB[i].material.uniforms.refractionRatio.value = this.settings.refractionRatio;
      this.arrB[i].material.uniforms.dispersion.value = this.settings.dispersion;
      this.arrB[i].material.uniforms.dispersionBlendMultiplier.value = this.settings.dispersionBlendMultiplier;
      let f = this.gui.addFolder('params: '+i);
      f.add(this.settings, 'refractionRatio', 0, 1, 0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.refractionRatio.value = value;
      },this));
      
       f.add(this.settings, 'dispersionBlendMultiplier', 0, 50, 1).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.dispersionBlendMultiplier.value = value;
      },this));
       f.add(this.settings, 'dispersion', 0, 1, 0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.dispersion.value = value;
      },this));
       f.add(this.settings, 'progress', -5, 5, 0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.progress.value = value;
      },this));
       f.add(this.settings, 'uWiggleScale', 0.001, 1, 0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.uWiggleScale.value = value;
      },this));
      //  f.add(this.settings, 'uWiggleDisplacement', 0.001, 30, 0.001).onChange(bind(function(value) {
      //   this.arrB[i].material.uniforms.uWiggleDisplacement.value = value;
      // },this));
       f.add(this.settings, 'uWiggleSpeed', 0.001, 1, 0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.uWiggleSpeed.value = value;
      },this));
      let f0 = f.addFolder('position ' + i);
      f0.add(this.sceneParams[i],'x',-10000,10000,1).onChange(bind(function(value) {
        this.arrB[i].position.x = value;
        },this));
      f0.add(this.sceneParams[i],'y',-10000,10000,1).onChange(bind(function(value) {
          this.arrB[i].position.y = value;
          },this));
      f0.add(this.sceneParams[i],'z',-10000,10000,1).onChange(bind(function(value) {
        this.arrB[i].position.z = value;
        },this));
      let f1 = f.addFolder('bubble ' + i);


      f1.add(this.settings,'mRefractionRatio',0,1,0.001).onChange(bind(function(value) {
      this.arrB[i].material.uniforms.mRefractionRatio.value = value;
      },this));
      f1.add(this.settings,'mFresnelBias',0,1,0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.mFresnelBias.value = value;
      },this));
      f1.add(this.settings,'mFresnelPower',0,5,0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.mFresnelPower.value = value;
      },this));
      f1.add(this.settings,'mFresnelScale',0,1,0.001).onChange(bind(function(value) {
        this.arrB[i].material.uniforms.mFresnelScale.value = value;
 
      },this));

    }

    this.light = new THREE.PointLight(0xff0000, 0.8,500);
    this.light.position.set(this.camera.position.x,this.camera.position.y,this.camera.position.z);
    this.scene.add(this.light);
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
  
  changeImaage(){
    let image = document.createElement('img');
    image.src = window.URL.createObjectURL(this.ImgLoader.files[0]);
    let cbtx = new THREE.CubeTextureLoader().load([image.src,image.src,image.src,image.src,image.src,image.src]);
   
   
    let N = prompt("enter index of sphere (0 - 6)");
     if(parseInt(N,10)<7&&parseInt(N,10)>=0){
      this.arrB[N].material.uniforms.tCube.value = cbtx;
     }

    
    
  }


  animate () {
    
	  requestAnimationFrame( this.animate.bind(this) );
     this.stats.begin();
     this.time += 0.001;
     for(let i=0;i<7;i++){

      this.arrB[i].material.uniforms.time.value = this.time;
      this.arrB[i].rotation.x+=0.001;
      
     }
      
  	  this.controls.update();
      this.renderer.render( this.scene, this.camera );
      this.stats.end();

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