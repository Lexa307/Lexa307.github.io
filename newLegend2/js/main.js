
function bind(func, context) {
	return function() {
	  return func.apply(context, arguments);
	};
  }
  function randomFromTo(from,to){
	return Math.floor(from+Math.random()*(to+1-from));
}
  
  
  
  
  
  class Slider{
	
	constructor(selector){
		
		this.scene = new THREE.Scene();
	  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
		this.renderer = selector ? (()=>{ return new THREE.WebGLRenderer( { canvas: selector, context: selector.getContext( 'webgl', { alpha: false,antialias:false } ) } );})()  : new THREE.WebGLRenderer()
		this.camera = new THREE.PerspectiveCamera( 60, (window.innerWidth+100) / (window.innerHeight-320), 0.1, 60000 );
		this.mobile = true;
	  }else{
		this.mobile = false;
		this.renderer = selector ? (()=>{ return new THREE.WebGLRenderer( { canvas: selector, context: selector.getContext( 'webgl', { alpha: false,antialias:true } ) } );})()  : new THREE.WebGLRenderer({antialias:true})
		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 60000 );
	  }
  
	  this.renderer.setPixelRatio( window.devicePixelRatio );
	  this.renderer.setSize( window.innerWidth, window.innerHeight );
	  
	  this.scene.background = new THREE.Color(0x161616);
	  this.Init();
	 
	  
  
	 
	  
	}
  
	onWindowResize () {
		
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
	
		this.renderer.render( this.scene, this.camera );
		this.updatePlanes(this.GroupArray);
		this.updatePlanes(this.GroupArray2);
		this.updatePlanes(this.GroupArray3);
		this.camera.lookAt(this.focPoint);
				
	   this.stats.end();
  
	}

	
	  
  
  
  
	Init(){
  
	  this.lockLightControl = {
		  lightOnMouse:false
	  }
	  
	  
	  this.mouse = new THREE.Vector2(0,0);
	  this.renderer.setSize( window.innerWidth, window.innerHeight );
	  //this.raycaster = new THREE.Raycaster();
	  this.container;
	  
	  this.stats = new Stats();
	 // document.body.appendChild( this.stats.dom );
	  this.container = document.createElement( 'div' );
	  document.body.appendChild( this.container );//  размещение контейнера в body
	  this.container.appendChild( this.renderer.domElement );// помещение рендерера в контейнер
	  //this.controls = new THREE.OrbitControls(this.camera);
	  this.focPoint=new THREE.Vector3(748,300,152);
	  this.gui = new dat.GUI();
	  this.gui.add(this.lockLightControl,"lightOnMouse");
	  
	  this.GroupArray = new THREE.Group();
	  this.GroupArray2 = new THREE.Group();
	  this.GroupArray3 = new THREE.Group();
	  
	  
	  this.GroupArray.name = "gr1"
	  this.GroupArray2.name = "gr2"
	  
	  this.stage = false;
	  this.moving = false;
  
	  //this.camera.lookAt(this.focPoint);
	  this.curveFloat = 0;
	 

	  this.geometry = new THREE.PlaneGeometry( 1.5, 14, 1 );
	  this.material = new THREE.MeshStandardMaterial( {color: 0xFCD08E  , side: THREE.DoubleSide, wireframe:false, metalness:1, emissive:0x231F20, transparent:true} );//ad8b19
	  this.material2 = new THREE.MeshStandardMaterial( {color: 0xFCD08E  , side: THREE.DoubleSide, wireframe:false, metalness:1, emissive:0x231F20, transparent:true} );//ad8b19
	  this.material3 = new THREE.MeshStandardMaterial( {color: 0xFCD08E  , side: THREE.DoubleSide, wireframe:false, metalness:1, emissive:0x231F20, transparent:true,opacity:0} );//ad8b19

	this.plane = new THREE.Mesh( this.geometry, this.material );
	this.plane2 = new THREE.Mesh( this.geometry, this.material2 );
	this.plane3 = new THREE.Mesh( this.geometry, this.material3 );
	  //this.camera.lookAt(this.plane.position);

	  this.scene.background=new THREE.Color(0x1D1A1B/*231F20*/);
	  this.light = new THREE.PointLight({color:new THREE.Color(0xE8D7AA) });
	  this.scene.add(this.light);
	  let pointLightHelper = new THREE.PointLightHelper( this.light, 1 );
	  this.scene.add( pointLightHelper );

	  // let pointLightHelper = new THREE.PointLightHelper( light );
	  // scene.add( pointLightHelper );
  
	  this.light.position.set(987,180,-20);//-40
  
	//   this.curve = new THREE.QuadraticBezierCurve3(
	// 	  new THREE.Vector3( -320.414,-70,-143),
	// 	  new THREE.Vector3( -461,  -70,  -21 ),
	// 	  new THREE.Vector3(  -241.5,  -31,  237 )
	// 	)

		//this.createPattern(0,-150,300,700,true,0,0,this.GroupArray,this.plane);
		this.scene.add(this.GroupArray2);
		this.scene.add(this.GroupArray3);
		this.scene.add(this.GroupArray);
		this.GroupArray3.visible = false;
	//this.createPattern(0,-150,300,700,true,0,0,this.GroupArray3,this.plane2);
	this.createPattern(0,-150,300,700,true,0,0,this.GroupArray2,this.plane2);
	this.createPattern(0,-150,300,700,false,0,300,this.GroupArray2,this.plane2);
	
	 // this.createPattern(0,-150,450,1200,true,450,0,this.GroupArray2,this.plane2);
		  //front

	this.createPattern(900,-150,600,700,true,0,0,this.GroupArray3,this.plane2);
	this.createPattern(900,-150,600,700,true,0,0,this.GroupArray,this.plane);
	this.createPattern(0,-150,300,700,false,0,900,this.GroupArray2,this.plane2);
	//this.createPattern(900,-150,600,700,true,0,0,this.GroupArray2,this.plane2);
	//this.createPattern(0,-150,300,700,false,0,600,this.GroupArray2,this.plane2);

		 
	
	  this.camera.position.set(748,300,-100);
	    this.cube1 = new THREE.Mesh(new THREE.BoxGeometry( 300, 900, 300 ), new THREE.MeshBasicMaterial( {color: 0x1D1A1B} ) );
	  this.cube2 = this.cube1.clone();
	  this.cube1.position.set(748,300,152)//152
	  this.cube2.position.set(-50,200,150)
	  this.scene.add( this.cube1 );
	  //this.controls.target = this.cube1.position;
	  //this.scene.add( this.cube2 );


	  
	  window.addEventListener("resize",bind(this.onWindowResize,this), false);
	  document.addEventListener('keydown', bind(function(event) {
		if(!this.moving&&event.key==' '){
			this.changeDistance();
		}},this));

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
			
			
			}
			else{
			/*СВАЙП ВПРАВО*/
			
			}
			}
			else {
			if (this.finalPoint.pageY < this.initialPoint.pageY){
			  
				if(!this.moving) {
					this.changeDistance();
				}
			  
			  
			/*СВАЙП ВВЕРХ*/}
			else {
			  //this.indexControl('back');
			/*СВАЙП ВНИЗ*/}
			}
			}else {
			  event.target.click();
			  event.preventDefault();
			}
			},this), false);
		
	  this.stats = new Stats();
      document.body.appendChild( this.stats.dom );
	  this.container.addEventListener('mousemove',bind(this.onMouseMove,this),false);
	 
	 
	  
	  this.animate();

	  
	  
	  
	  
	}
	createPattern(startx,starty,scalex,scaley,ZXdir,z,x,group,pl){
		let Isign = (scalex < startx)?'>':'<';
		let Jsign = (scaley < starty)?'>':'<';
		let ICounterValue = (scalex < startx)?-14:14;
		let shiftMin = -5;
		let shiftMax = 4;
		if(group.name == "gr1"){
			ICounterValue = (scalex<startx)?-7:7;
			shiftMin = -1;
			shiftMax = 2;
		}
		
		let JCounterValue = (scaley < starty)?-14:14;
		let variativescript =
`		
		
		for (let i=startx;i${Isign}scalex;i+=${ICounterValue}){
			for(let j=starty;j${Jsign}scaley;j+=${JCounterValue}){
				let tmp = pl.clone();
				if(ZXdir){
					tmp.position.set(i+randomFromTo(shiftMin,shiftMax),j,${z});
				}else{
					tmp.position.set(${x},j,i+randomFromTo(shiftMin,shiftMax));
				}

				tmp.amplitude=0.01+Math.random()*(0.01-0.005);
				tmp.moving = true;
				group.add(tmp);
			}
		}`;
		eval(variativescript);
	}
	changeDistance() {
		this.moving = true;
			let moveVector = (this.stage)?new THREE.Vector3(748, 300, -100):new THREE.Vector3(1243, 67.6, -459);
			this.GroupArray.visible = true;
			this.GroupArray3.visible = true;
			(!this.stage)?(()=>{TweenMax.to(this.focPoint,2,{y: 350});})():(()=>{TweenMax.to(this.focPoint,2,{y: 300});})();
			TweenMax.to(this.material3,2,{opacity:(!this.stage)?0:1});
			TweenMax.to(this.light.position,2,{x: 910, y: 680, z: -20,ease: Power2.easeOut,//flare
				onComplete:()=>{this.doFlare()}});
			TweenMax.to(this.material,2,{opacity:(!this.stage)?0:1,
			
	onComplete:()=>{
		if(!this.stage) {
			this.GroupArray.visible = false;
			this.GroupArray3.visible = true;

			
		}else{
			this.GroupArray.visible = true;
			this.GroupArray3.visible = false;
		}
}});



TweenMax.to(this.camera.position,2, {x: moveVector.x, y: moveVector.y, z: moveVector.z,
				onComplete:()=>{
					this.moving = false;
					this.stage = !this.stage;
				},
				onUpdate:()=>{
					this.camera.lookAt(this.focPoint);
				}});
	}

	updatePlanes(group){
		for(let i=0; i<group.children.length;i++){
		
			if(group.children[i].moving){
				group.children[i].rotation.y+=group.children[i].amplitude;
				if(group.children[i].rotation.y>Math.PI){
					group.children[i].rotation.y=0;
				}
			}
		}
	
	}
	doFlare() {
		TweenMax.to(this.light.position,2,{x: 910, y: -10, z: -20,ease: Power2.easeOut,
			onComplete:()=>{
			TweenMax.to(this.light.position,2,{x: 910, y: 680, z: -20,ease: Power2.easeOut});
			}
		})
	}
	
	onMouseMove(event) {
		
	  this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	  this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	 let vector = new THREE.Vector3(this.mouse.x, this.mouse.y, this.light.position.z);
		vector.unproject( this.camera );
		let dir = vector.sub( this.camera.position );
		dir.normalize();
	let	distance = -this.camera.position.z / dir.z;
	let	pos = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
		if(pos.x < 900 && pos.x > 600 && !this.stage && !this.moving||this.lockLightControl.lightOnMouse){
			TweenMax.to(this.light.position,1,{ease: Power2.easeOut,x:pos.x,y:pos.y});
		}
		// if(!this.can3&&!this.scrollingA){
		// 	TweenMax.to(this.camera.position,1,{ease: Power2.easeOut,x:curve.getPointAt(this.curveFloat + this.mouse.x*0.05).x,z:curve.getPointAt(this.curveFloat+ this.mouse.x*0.05).z,y:curve.getPointAt(this.curveFloat+ this.mouse.x*0.05).y,onUpdate:()=>{this.camera.lookAt(this.focPoint);}});

		// }
	
  	
	}



  }
  

  let a;
  if ( THREE.WEBGL.isWebGLAvailable() ) {
	  //var canvas = document.createElement( 'canvas' );
		// Initiate function or other initializations here
		a = new Slider(/*canvas*/);
	   
	
	
	} else {
	let warning = THREE.WEBGL.getWebGLErrorMessage();
	document.body.appendChild( warning );
	}
 
