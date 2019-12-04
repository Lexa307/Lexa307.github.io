
function bind(func, context) {
  return function() {
    return func.apply(context, arguments);
  };
}





class Slider{
  constructor(selector){
    this.rotor = null;
    this.map = null;
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
    //{antialias:true}
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
    this.spriteMap = null;
    this.texture = null;
    this.loadTextures();

   
    
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
     //this.statsthis.stats.begin();
    // this.controls.update();
     if(this.rotor){
       this.rotor.rotation.y+=this.velocity;
       this.updateClouds();
     }
    // this.controls.target.set(this.focusPoint.x,this.focusPoint.y,this.focusPoint.z)
      //this.camera.lookAt(this.focusPoint);
      this.renderer.render( this.scene, this.camera );
     // this.stats.end();

  }
  loadModel(){
    let red = new THREE.MeshLambertMaterial({color:0xb22e2e, });
    let white1 = new THREE.MeshLambertMaterial({color: 0xFFFFFF, map: this.map,side:THREE.DoubleSide});
    let white2 = new THREE.MeshLambertMaterial({color: 0xFFFFFF,side:THREE.DoubleSide});
    //let black = new THREE.MeshLambertMaterial({color: 0x000000});
    let gray = new THREE.MeshLambertMaterial({color:0x7a7a7a,side:THREE.DoubleSide});
    this.loader.load(
			// resource URL
			'models/wend2.glb',
      // called when the resource is loaded
     
			bind(function ( gltf ) {
        for(let i = 0; i<gltf.scene.children.length; i++){
          
          //console.log(gltf.scene.children[i].name)
        
            this.rotor = gltf.scene.children[4];
          
        }
        gltf.scene.children[0].material = white1;
        gltf.scene.children[1].material = red;
        gltf.scene.children[2].material = white2;
        gltf.scene.children[3].material = white2;
        gltf.scene.children[4].material = white2;
        gltf.scene.children[5].material = white2;
        gltf.scene.children[6].material = gray;
        gltf.scene.position.y+=5;
        this.scene.add(gltf.scene)
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
  initCurve(){
    this.curves.push(      new THREE.QuadraticBezierCurve3(
      new THREE.Vector3( 15, 85, 40 ),
      new THREE.Vector3( 17,  85, 40 ),
      new THREE.Vector3( 20,  85,  35 )
    ));
    this.curves.push(      new THREE.QuadraticBezierCurve3(
      new THREE.Vector3( -89.6,  67, 35.0 ),
      new THREE.Vector3( -89.6,  67, 39.6 ),
      new THREE.Vector3( -89.6, 67, 42.9 )
    ));
    



    //new THREE.Vector3( -53.3,  76, 40 ),
    // var points = this.curves[2].getPoints( 50 );
    // var geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    // var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    
    
    // var curveObject = new THREE.Line( geometry, material );
    // this.scene.add(curveObject);
  }
  InitAnimation(){
    this.focusPoint.y = 400;
    this.camera.position.y = 299.5;
    TweenMax.to(this.camera.position,2,{y:85,onUpdate:()=>{this.camera.lookAt(this.focusPoint)}});
    TweenMax.to(this.focusPoint,2,{y:92,onUpdate:()=>{this.camera.lookAt(this.focusPoint)},onComplete:()=>{
      this.moving = false;
    }});
  }

  Init(){
    this.velocityValue = 3;
    this.velocity = 0.004;
    this.gui = new dat.GUI();
    this.gui.add(this,'velocityValue',3,25,1).onChange(bind(function(value) {
      this.velocity = THREE.Math.lerp(0.004,0.04,THREE.Math.smootherstep ( value, 3, 25 ));
      
    },this));
    this.focusPoint = new THREE.Vector3(-23, 92,  20);
    this.camera.position.set( 17,  91.5, 40);
    this.curves = [];
    this.clouds = [];
    this.index = 0;
    if(this.mobile){
      this.curveSegments = 6;
      this.ZF = 20;
    }else{
      this.curveSegments = 18;
      this.ZF = 40;
    }
    
    this.movingStage = 0;
    this.scrollPos = 0;
    this.mouse = new THREE.Vector2(0,0);
    this.renderer.setSize( window.innerWidth, window.innerHeight );
   
    this.container;
    this.tmpWay = null;
    this.curveOptions = []
    for(let i = 0; i<this.curveSegments;i++){
      this.curveOptions.push(parseFloat(i/this.curveSegments).toFixed(3))
      
    }

    this.container = document.createElement( 'div' );
    document.body.appendChild( this.container );//  размещение контейнера в body
    this.container.appendChild( this.renderer.domElement );// помещение рендерера в контейнер

    // this.stats = new Stats();
    // document.body.appendChild( this.stats.dom );
    // this.controls = new THREE.OrbitControls( this.camera );
    // this.controls.enabled = false;
    // this.controls.update();
    // this.controls.target.set(this.focusPoint.x,this.focusPoint.y,this.focusPoint.z)
    let ambientLight = new THREE.AmbientLight(0x404040,2); 
    ambientLight.visible=true;
    this.scene.add(ambientLight);
    this.moving = true;

    this.oldTime = 0;
    this.newTime = 0;
    this.isTouchPad;
    this.eventCount = 0;
    this.eventCountStart;
    
    
    this.light = new THREE.PointLight(0x404040, 2,1000);
    this.light.position.set( 20,  116,  116);
    this.scene.add(this.light);

    this.light2 = new THREE.PointLight(0x404040, 1,1000);
    this.light2.position.set( -91, 39.9, 34.9);
    this.scene.add(this.light2);

    this.updateCamera = ()=>{
      TweenMax.to(this.camera.position,8,{
        x:this.tmpWay.getPointAt(this.curveOptions[this.movingStage]).x,
        y:this.tmpWay.getPointAt(this.curveOptions[this.movingStage]).y,
        z:this.tmpWay.getPointAt(this.curveOptions[this.movingStage]).z,
        ease: Power4.easeOut,
        onUpdate:()=>{
          this.camera.lookAt(this.focusPoint);
        },
        onComplete:()=>{
          this.moving = false;
        }
      })
    }
    this.go = bind( (d) =>{
      this.moving = true;
      //console.log(d)
      if(d==1){
        if(this.movingStage==this.curveOptions.length-1){//end of foward moving
          
          TweenMax.to(this.camera.position,4,{x:this.curves[1].getPointAt(0.5).x,  y:this.curves[1].getPointAt(0.5).y, z:this.curves[1].getPointAt(0.5).z,ease: Power4.easeOut,
            onUpdate:()=>{
              this.camera.lookAt(this.focusPoint);
            },onComplete:()=>{
              this.index = 1;
              this.moving = false;
              this.movingStage = undefined;
            }
          });
          TweenMax.to(this.focusPoint,2,{z:this.ZF});

        }else{
          this.movingStage+=1
          //console.log(this.movingStage)
          //let focusOffset = parseFloat((this.focusPoint.z+(20/this.curveSegments)).toPrecision(2));
          //TweenMax.to(this.focusPoint,0.5,{z:focusOffset});
          this.updateCamera();
        }
       
      }
      if(d==0){
        if(this.movingStage == 1){//end of back moving
         
          TweenMax.to(this.camera.position,4,{x:this.curves[0].getPointAt(0.5).x,  y:this.curves[0].getPointAt(0.5).y, z:this.curves[0].getPointAt(0.5).z,ease: Power4.easeOut,
            onUpdate:()=>{
              this.camera.lookAt(this.focusPoint);
            },onComplete:()=>{
              this.index = 0;
              this.moving = false;
              this.movingStage = undefined;
            }
          });
          
        }else{
          this.movingStage-=1
          //console.log(this.movingStage)
          //let focusOffset = parseFloat((this.focusPoint.z-(20/this.curveSegments)).toPrecision(2));
          //TweenMax.to(this.focusPoint,0.5,{z:focusOffset});
          this.updateCamera()
          if(this.movingStage==this.curveOptions.length-2){
            TweenMax.to(this.focusPoint,2,{z:20})
          }
        }
        
      }


    },this)
    window.addEventListener("resize",bind(this.onWindowResize,this), false);

    this.initCurve();
    this.container.addEventListener( 'mousemove', bind(this.onMouseMove,this), false );
    this.container.addEventListener( 'mousewheel', bind(this.mouseHandle, this), false);
    this.container.addEventListener("DOMMouseScroll", bind(this.mouseHandle, this),false);
    this.container.addEventListener('scroll',bind(this.onScroll,this),false);
    if(this.mobile){
      this.container.addEventListener('touchstart', bind(function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.initialPoint=event.changedTouches[0];
        },this), false);
        this.container.addEventListener('touchend', bind(function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.finalPoint=event.changedTouches[0];
        let xAbs = Math.abs(this.initialPoint.pageX - this.finalPoint.pageX);
        let yAbs = Math.abs(this.initialPoint.pageY - this.finalPoint.pageY);
        if (xAbs > 20 || yAbs > 20) {
        if (xAbs > yAbs) {
        if (this.finalPoint.pageX < this.initialPoint.pageX){
        /*СВАЙП ВЛЕВО*/
        this.indexControl(0);
        
        }
        else{
        /*СВАЙП ВПРАВО*/
        this.indexControl(1);
        }
        }
        else {
        if (this.finalPoint.pageY < this.initialPoint.pageY){
          this.indexControl(1);
        /*СВАЙП ВВЕРХ*/}
        else{
          this.indexControl(0);
        /*СВАЙП ВНИЗ*/}
        }
        }
        },this), false);
    }
    this.initClouds();
    this.animate();
    this.InitAnimation();
    
    
    
  }

  loadTextures(){
    this.map = new THREE.TextureLoader().load('https://lexa307.github.io/wind/textures/logo2.jpg',bind(function ( texture ) {
      this.texture = new THREE.TextureLoader().load("https://lexa307.github.io/wind/textures/n3_2.jpg",bind(function ( texture ) {
       
        //texture.mapping = THREE.UVMapping;
       
        this.scene.background = new THREE.CubemapGenerator( this.renderer ).fromEquirectangular( texture, this.options );
        this.spriteMap = new THREE.TextureLoader().load('https://lexa307.github.io/wind/textures/clouds.png',bind(function(texture){
          //this.texture.encoding = THREE.LinearEncoding
          //this.texture.mapping = THREE.UVMapping;
          

      
         this.loadModel();
        },this));
      },this));
    },this));

  }
  initClouds(){
    //let spriteMaterial = new THREE.SpriteMaterial( { map: this.spriteMap } );
    let planeGeometry = new THREE.PlaneBufferGeometry( 50, 10, 1,1 );
    let planeMaterial = new THREE.MeshLambertMaterial({transparent:true,map:this.spriteMap,emissive:0xffffff,depthWrite:false,alphaTest: 0.01});
    let offset = 0.1;
    for(let i= -3000; i<600; i+=300){
     // let sprite = new THREE.Sprite( spriteMaterial );
      offset+=22;
      let plane = new THREE.Mesh(planeGeometry,planeMaterial.clone());
      this.scene.add( plane );
      plane.position.set(-303-offset, Math.random() * (400 - 150) + 150,  i);
      //plane.rotation.y +=Math.PI/2;
      plane.lookAt(this.camera.position);
      plane.rotation.x=plane.rotation.z=0;
      plane.scale.x = 15;
      plane.scale.y = 15;
      this.clouds.push(plane);
    }
    
  }

  updateClouds(){
    let offset = 0.1;
    for(let i = 0;i<this.clouds.length;i++){
      if(this.clouds[i].position.z>900){
        offset+=1;
        this.clouds[i].material.opacity = 0;
        this.clouds[i].position.set(-303+offset, Math.random() * (400 - 150) + 150,  -2100);
        TweenMax.to(this.clouds[i].material,3,{opacity:1});

      }
      
      this.clouds[i].lookAt(this.camera.position);
      //this.clouds[i].rotation.y =lastYAngle;
      this.clouds[i].rotation.x =   this.clouds[i].rotation.z = 0
      this.clouds[i].position.z+=this.velocity;
      this.clouds[i].position.x-=this.velocity*0.1;
    }
  }
  onMouseMove(){
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    //this.raycaster.setFromCamera( this.mouse, this.camera );

    if(!this.moving&&!this.movingStage){
      //console.log(this.camera.position);
      TweenMax.to(this.camera.position,1,{ease: Power2.easeOut,x:this.curves[this.index].getPointAt(0.5 + this.mouse.x).x,z:this.curves[this.index].getPointAt( 0.5 +this.mouse.x).z,y:this.curves[this.index].getPointAt(0.5 + this.mouse.x*0.1).y,onUpdate:()=>{this.camera.lookAt(this.focusPoint);}});
    }
    if(!this.moving&&this.movingStage){
      //console.log(this.curveOptions[this.movingStage]);
      TweenMax.to(this.camera.position,1,{ease: Power2.easeOut,
        x:this.tmpWay.getPointAt(parseFloat(this.curveOptions[this.movingStage])+this.mouse.x*0.008).x,
        y:this.tmpWay.getPointAt(parseFloat(this.curveOptions[this.movingStage])+this.mouse.x*0.008).y,
        z:this.tmpWay.getPointAt(parseFloat(this.curveOptions[this.movingStage])+this.mouse.x*0.008).z,

        onUpdate:()=>{this.camera.lookAt(this.focusPoint);
           //console.log(this.tmpWay.getPointAt(parseFloat(this.curveOptions[this.movingStage])+this.mouse.x*0.005).x);
           
          }});
    }
  }
  indexControl(direction){ //1 foward,  0 backward
    if(direction === 1 ){//&& this.index < 1
      this.toStep1();
    }
    if(direction === 0 ){//&& this.index > 0
      this.toStep0();
    }
  }
  toStep1(){

    if(this.movingStage){
      this.go(1);
    }
    if(!this.movingStage&&this.index==0){
      this.movingStage = 0;
      
      let middleControlPoint = new THREE.Vector3();
      middleControlPoint.addVectors(this.curves[0].getPointAt(0.5),this.curves[1].getPointAt(0.5));
      middleControlPoint.divideScalar(2);
      //console.log(middleControlPoint);
      this.tmpWay = new THREE.QuadraticBezierCurve3(
        this.camera.position.clone(),
        middleControlPoint,
        this.curves[1].getPointAt(0.5)
      )
      this.go(1);

    }



    // var points = this.tmpWay.getPoints( 50 );
    // var geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    // var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    
    // // Create the final object to add to the scene
    // var curveObject = new THREE.Line( geometry, material );
    // this.scene.add(curveObject);

    // TweenMax.to(this.focusPoint,2,{z:40});
    // TweenMax.to(this.camera.position,2,{x:-89.6,  y:67, z:39.6,
    //   onUpdate:()=>{
      
    //   this.camera.lookAt(this.focusPoint);
    // },onComplete:()=>{
    //   this.index++;
    //   this.moving = false;
    // }});
  }
  toStep0(){
    
    if(this.movingStage){
      
      this.go(0);
      
    }
    if(!this.movingStage&&this.index==1){
      
      this.movingStage = this.curveOptions.length-1
      // let middleControlPoint = new THREE.Vector3();
      // middleControlPoint.addVectors(this.curves[0].getPointAt(0.5),this.curves[1].getPointAt(0.5));
      // middleControlPoint.divideScalar(2);
      TweenMax.killAll();
      TweenMax.to(this.focusPoint,2,{z:20})
     // console.log(middleControlPoint);
      // this.tmpWay = new THREE.QuadraticBezierCurve3(
      //   this.camera.position.clone(),
      //   middleControlPoint,
      //   this.curves[0].getPointAt(0.5)
      // )
      this.go(0);
      ;

    }
    // this.moving = true;
    // TweenMax.to(this.focusPoint,2,{z:20});
    // TweenMax.to(this.camera.position,2,{x:17,  y:85, z:40,
    
    //   onUpdate:()=>{
      
    //   this.camera.lookAt(this.focusPoint);
    // },onComplete:()=>{
    //   this.index--;
    //   this.moving = false;
    // }});
  }
  onScroll(event){
   // if(!moving){
      // detects new state and compares it with the new one
      if ((document.body.getBoundingClientRect()).top > this.scrollPos){
  	
		    this.indexControl(1);
      }
	
	    else{
		    this.indexControl(0);
        
	    }
	
	// saves the new position for iteration.
	  this.scrollPos = (document.body.getBoundingClientRect()).top;
   // }
  
  }
  mouseHandle(event){
    //if(!this.moving){
    //   if(event.deltaY==100){
 		
    //     this.indexControl(1);
    //   }else{
    //     this.indexControl(0);
    //   }
    // }
    let isTouchPadDefined = this.isTouchPad || typeof this.isTouchPad !== "undefined";
   // console.log(isTouchPadDefined);
    if (!isTouchPadDefined) {
        if (this.eventCount === 0) {
          this.eventCountStart = new Date().getTime();
        }

        this.eventCount++;

        if (new Date().getTime() - this.eventCountStart > 100) {
                if (this.eventCount > 10) {
                  this.isTouchPad = true;
                } else {
                  this.isTouchPad = false;
                }
            isTouchPadDefined = true;
        }
    }

    if (isTouchPadDefined) {
    	
        // here you can do what you want
        // i just wanted the direction, for swiping, so i have to prevent
        // the multiple event calls to trigger multiple unwanted actions (trackpad)
        if (!event) event = event;
        let direction = (event.detail<0 || event.wheelDelta>0) ? 1 : -1;

        if (this.isTouchPad) {
          this.newTime = new Date().getTime();

            if (!this.moving && this.newTime-this.oldTime > 550 ) {
               
                if (direction < 0) {
                    // swipe down
					          this.indexControl(1);
                } else {
                    // swipe up
					          this.indexControl(0);
                }
                setTimeout(function() {this.oldTime = new Date().getTime();}, 500);
            }
        } else {
            if (direction < 0) {
            	this.indexControl(1);
            	
                // swipe down
            } else {
                // swipe up
				        this.indexControl(0);
            }
        }
      }
    //}
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

