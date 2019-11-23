
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
		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 60000 );
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
	   
	  
	  // this.controls.target.set(this.focusPoint.x,this.focusPoint.y,this.focusPoint.z)
		
		//this.light2.position.set( this.camera.position.x,this.camera.position.y,this.camera.position.z);
		this.renderer.render( this.scene, this.camera );
		for(let i=0; i<this.GroupArray.children.length;i++){
		
				    	if(this.GroupArray.children[i].moving){
							this.GroupArray.children[i].rotation.y+=this.GroupArray.children[i].amplitude;
				    		if(this.GroupArray.children[i].rotation.y>Math.PI){
				    			this.GroupArray.children[i].rotation.y=0;
				    		}
						}
					}
				
				
					for(let i=0; i<this.GroupArray2.children.length;i++){
						if(this.GroupArray2.children[i].moving){
							this.GroupArray2.children[i].rotation.y+=this.GroupArray2.children[i].amplitude;
							if(this.GroupArray2.children[i].rotation.y>Math.PI){
				    			this.GroupArray2.children[i].rotation.y=0;
				    		}
						
						}
						
					}
					this.camera.lookAt(this.cube1.position);
				
				// if(!can){
				// 	camera.lookAt(focPoint);
				// }
	   this.stats.end();
  
	}

	
	  
  
  
  
	Init(){
  
	  
	  
	  this.camera.position.set( 0,  20, 20);
	  
	  //this.scene.add(this.plane);
	  this.mouse = new THREE.Vector2(0,0);
	  this.renderer.setSize( window.innerWidth, window.innerHeight );
	  this.raycaster = new THREE.Raycaster();
	  this.container;
	  
	  this.stats = new Stats();
	 // document.body.appendChild( this.stats.dom );
	  this.container = document.createElement( 'div' );
	  document.body.appendChild( this.container );//  размещение контейнера в body
	  this.container.appendChild( this.renderer.domElement );// помещение рендерера в контейнер
	  //this.controls = new THREE.OrbitControls(this.camera);
	  this.focPoint=new THREE.Vector3(0,70,0);
	  
	  
	  this.GroupArray = new THREE.Group();
	  this.GroupArray2 = new THREE.Group();
	  this.blackplanes = new THREE.Group();
	  this.GroupArray.name = "gr1"
	  this.GroupArray2.name = "gr2"
	  this.camera.position.set(0, 70, -250);
	  this.can=false;
	  this.can2=false;
	  this.can3 = true;
	  this.scrollingA = false;
	  this.stage = false;
	  this.moving = false;
  
	  //this.camera.lookAt(this.focPoint);
	  this.curveFloat = 0;
	 

	  this.geometry = new THREE.PlaneGeometry( 1.5, 14, 1 );
	  this.material = new THREE.MeshStandardMaterial( {color: 0xFCD08E  , side: THREE.DoubleSide, wireframe:false, metalness:1, emissive:0x231F20, transparent:true} );//ad8b19
	  this.material2 = new THREE.MeshStandardMaterial( {color: 0xFCD08E  , side: THREE.DoubleSide, wireframe:false, metalness:1, emissive:0x231F20, transparent:true} );//ad8b19
	  
	this.plane = new THREE.Mesh( this.geometry, this.material );
	  this.plane2 = new THREE.Mesh( this.geometry, this.material );
	  //this.camera.lookAt(this.plane.position);

	  this.scene.background=new THREE.Color(0x1D1A1B/*231F20*/);
	  this.light = new THREE.PointLight({color:new THREE.Color(0xE8D7AA) });
	  this.scene.add(this.light);
	  // let pointLightHelper = new THREE.PointLightHelper( light );
	  // scene.add( pointLightHelper );
  
	  this.light.position.set(-87,180,-20);//-40
  
	  this.curve = new THREE.QuadraticBezierCurve3(
		  new THREE.Vector3( -320.414,-70,-143),
		  new THREE.Vector3( -461,  -70,  -21 ),
		  new THREE.Vector3(  -241.5,  -31,  237 )
		)

  
		this.scene.add(this.GroupArray2);
	  
	this.createPattern(0,-150,300,700,true,0,0,this.GroupArray2,this.plane2);
	this.createPattern(0,-150,300,700,false,0,0,this.GroupArray2,this.plane2);
	 // this.createPattern(0,-150,450,1200,true,450,0,this.GroupArray2,this.plane2);
		  //front
	this.createPattern(900,-150,600,700,true,0,0,this.GroupArray2,this.plane2);
	this.createPattern(0,-150,300,700,false,0,600,this.GroupArray2,this.plane2);
		 
	// this.createPattern(0,70,-100,400,true,0,0,this.GroupArray2,this.plane2);
	// this.createPattern(-4,70,-100,400,false,0,0,this.GroupArray2,this.plane2);
	// // //back
	// this.createPattern(0,70,-100,400,true,-91,0,this.GroupArray2,this.plane2);

	// // //---------------------------second_building
	// this.createPattern(0,70,-100,400,true,200,0,this.GroupArray2,this.plane2);
	// this.createPattern(204,70,100,400,false,0,0,this.GroupArray2,this.plane2);
	// // //back
	// this.createPattern(0,70,-100,400,true,100,0,this.GroupArray2,this.plane2);


	
	
	
	  
	 // document.addEventListener("mousewheel", mouseHandle2, false);
	 
	  
	  // this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
	  // this.controls.target = new THREE.Vector3(0.3563309574910036, 26.199806330960396, 10.148635574650198);
	  
	//   this.cube1 = new THREE.Mesh(new THREE.BoxGeometry( 100, 360, 90 ), new THREE.MeshBasicMaterial( {color: 0x1D1A1B} ) );
	//   this.cube2 = this.cube1.clone();
	//   this.cube1.position.set(-50,200,-45)
	//   this.cube2.position.set(-50,200,150)
	//   this.scene.add( this.cube1 );
	//   this.scene.add( this.cube2 );
	  this.camera.position.set(152,300,-100);
	    this.cube1 = new THREE.Mesh(new THREE.BoxGeometry( 300, 900, 300 ), new THREE.MeshBasicMaterial( {color: 0x1D1A1B} ) );
	  this.cube2 = this.cube1.clone();
	  this.cube1.position.set(152,300,152)
	  this.cube2.position.set(-50,200,150)
	  this.scene.add( this.cube1 );
	 // this.controls.target = this.cube1.position;
	  //this.scene.add( this.cube2 );


	  
	  window.addEventListener("resize",bind(this.onWindowResize,this), false);
	  document.addEventListener('keydown', bind(function(event) {
		if(!this.moving&&event.key==' '){
			this.moving = true;
			let moveVector = (this.stage)?new THREE.Vector3(152,300,-100):new THREE.Vector3(-343,  67.6,  -459);
TweenMax.to(this.camera.position,2, {x: moveVector.x, y: moveVector.y, z: moveVector.z,
				onComplete:()=>{
					this.moving = false;
					this.stage = !this.stage;
				}});
		}},this));
		
	  this.stats = new Stats();
      document.body.appendChild( this.stats.dom );
	  this.container.addEventListener('mousemove',bind(this.onMouseMove,this),false);
	 
	 
	  
	  this.animate();

	  this.zero();
	  let f =setTimeout(this.first(),3000);
	  
	  
	  
	  
	}
	createPattern(startx,starty,scalex,scaley,ZXdir,z,x,group,pl){
		let Isign = (scalex<startx)?'>':'<';
		let Jsign = (scaley<starty)?'>':'<';
		let ICounterValue = (scalex<startx)?-14:14;
		let JCounterValue = (scaley<starty)?-14:14;
		let variativescript =
`		
		
		for (let i=startx;i${Isign}scalex;i+=${ICounterValue}){
			for(let j=starty;j${Jsign}scaley;j+=${JCounterValue}){
				let tmp = pl.clone();
				if(ZXdir){
					tmp.position.set(i+randomFromTo(-4,4),j,${z});
				}else{
					tmp.position.set(${x},j,i+randomFromTo(-4,4));
				}
				tmp.amplitude=0.01+Math.random()*(0.01-0.005);
				group.add(tmp);
			}
		}`;
		eval(variativescript);
	}
	
	onMouseMove(event){
		
	  this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	  this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	 let vector = new THREE.Vector3(this.mouse.x, this.mouse.y, this.light.position.z);
		vector.unproject( this.camera );
		let dir = vector.sub( this.camera.position );
		dir.normalize();
	let	distance = -this.camera.position.z / dir.z;
	let	pos = this.camera.position.clone().add( dir.multiplyScalar( distance ) );
		if(pos.x<400&&pos.x>-300){
			TweenMax.to(this.light.position,1,{ease: Power2.easeOut,x:pos.x,y:pos.y});
		}
		if(!this.can3&&!this.scrollingA){
			TweenMax.to(this.camera.position,1,{ease: Power2.easeOut,x:curve.getPointAt(this.curveFloat + this.mouse.x*0.05).x,z:curve.getPointAt(this.curveFloat+ this.mouse.x*0.05).z,y:curve.getPointAt(this.curveFloat+ this.mouse.x*0.05).y,onUpdate:()=>{this.camera.lookAt(this.focPoint);}});

		}
	
  	
	}
	zero(){

		this.camera.lookAt(this.focPoint);

		for(let i=0; i<this.GroupArray.children.length;i++){
		
	    	this.GroupArray.children[i].lookAt(this.camera.position);
	    	this.GroupArray.children[i].rotation.z=Math.PI;
	    	this.GroupArray.children[i].rotation.x=Math.PI;
	    	this.GroupArray.children[i].rotation.y-=Math.PI/2;
	    	this.GroupArray.children[i].mustrotate=this.GroupArray.children[i].rotation.y;
	    	this.GroupArray.children[i].visible=false;
	    	this.GroupArray.children[i].moving=false;
	    	this.GroupArray.children[i].name="plane";
	    	
		}
		for(let i=0; i<	this.GroupArray2.children.length;i++){

	    	this.GroupArray2.children[i].lookAt(this.camera.position);
	    	this.GroupArray2.children[i].rotation.z=Math.PI;
	    	this.GroupArray2.children[i].rotation.x=Math.PI;
	    	this.GroupArray2.children[i].rotation.y-=Math.PI/2;
	    	this.GroupArray2.children[i].mustrotate=this.GroupArray2.children[i].rotation.y;
	    	this.GroupArray2.children[i].moving=true;
	    	this.GroupArray2.children[i].name="plane";
	    	
		}
		
		this.material2.opacity=0;
		this.material.opacity=1;
	
		
	}
	first(){
		for(let i=0;i<this.GroupArray.children.length;i++){
			this.GroupArray.children[i].moving=true
		}
		for(let i=0;i<this.GroupArray2.length;i++){
			this.GroupArray2.children[i].moving=true
		}
	
		
	
		TweenMax.to(this.material2,1.5,{ease: Circ.easeOut,opacity:1});
		//TweenLite.to(document.getElementById("btn2"),1,{"opacity":1, onComplete:()=>{}});
		this.can2=true;
	
	}
	second(){
	
		TweenLite.to(document.getElementById("btn"),1,{"opacity":0, onComplete:()=>{document.getElementById("btn").style.display="none";}});
		TweenMax.to(this.material2,1.5,{ease: Circ.easeOut,opacity:1, 
			onComplete:()=>{
				for(let i=0;i<GroupArray2.length;i++){
					this.GroupArray2[i].visible=false;
					this.scene.remove(this.GroupArray2[i]);
					///myAnimation.pause();
				
				}
				this.camera.position.set(0,300,0);
				this.focPoint.y = 400;
		TweenMax.to(this.camera.position,6,{ease: Power3.easeOut,y:-70,x:-320.414,z:-143})

		TweenMax.to(this.focPoint,6,{ease: Power3.easeOut,y:70,onComplete:()=>{this.can3 = false;  },onUpdate:()=>{this.camera.lookAt(this.focPoint);}});
		
		this.can2=false;
				TweenMax.to(this.blackplane.position,3,{ease: Power2.easeOut,x:this.blackplane.position.x-20,z:this.blackplane.position.z-20});
				TweenMax.to(this.blackplane2.position,3,{ease: Power2.easeOut,x:this.blackplane2.position.x-20,z:this.blackplane2.position.z-20});
				TweenMax.to(this.blackplane3.position,3,{ease: Power2.easeOut,x:this.blackplane3.position.x-20,z:this.blackplane3.position.z-20});
				TweenMax.to(this.blackplane4.position,3,{ease: Power2.easeOut,x:this.blackplane4.position.x-20,z:this.blackplane4.position.z-20});
				TweenMax.to(this.material,0.2,{ease: Circ.easeOut,opacity:1 });
				
				
				for(let i=0;i<this.GroupArray.children.length;i++){
					this.GroupArray.children[i].visible=true;
					TweenMax.to(this.GroupArray.children[i].position,3,{ease: Power2.easeOut,x:this.GroupArray.children[i].position.x-20,z:this.GroupArray.children[i].position.z-20});	
				}
				//
			}});
		
	}

  }
  let a;


  //if ( THREE.WEBGL.isWebGLAvailable() ) {
	  //var canvas = document.createElement( 'canvas' );
		// Initiate function or other initializations here
	   a = new Slider(/*canvas*/);
	
	
	//} else {
	//
	//	var warning = THREE.WEBGL.getWebGLErrorMessage();
	//	document.getElementById( 'container' ).appendChild( warning );
	
//	}
 
//------------------------------------------------------old project	













 







// function animate() {
// 	requestAnimationFrame( animate );
// 	renderer.render(scene, camera);

// 		for(let i=0; i<GroupArray.length;i++){
		
// 	    	if(GroupArray[i].moving){
// 				GroupArray[i].rotation.y+=GroupArray[i].amplitude;
// 	    		if(GroupArray[i].rotation.y>Math.PI){
// 	    			GroupArray[i].rotation.y=0;
// 	    		}
// 			}
// 		}
	
	
// 		for(let i=0; i<GroupArray2.length;i++){
// 			if(GroupArray2[i].moving){
// 				GroupArray2[i].rotation.y+=GroupArray2[i].amplitude;
// 				if(GroupArray2[i].rotation.y>Math.PI){
// 	    			GroupArray2[i].rotation.y=0;
// 	    		}
	    	
// 			}
	    	
// 		}
	
// 	// if(!can){
// 	// 	camera.lookAt(focPoint);
// 	// }
	

// 	raycaster.setFromCamera( mouse, camera );
// 	let intersects = raycaster.intersectObjects( scene.children );
// 	if(intersects.length>0){
// 		let obj = intersects[0].object
// 		if(obj.name=="plane"){
// 			obj.moving=false;
// 			TweenMax.to(obj.rotation,2,{ease: Power2.easeOut, y:obj.rotation.y+Math.PI,onComplete:()=>{obj.moving=true;}});
// 		}
			
			
// 	}
	
// }


// function tab(){
// 	if(can2){
// 		for(let i=0;i<GroupArray2.length;i++){
// 				GroupArray2[i].moving=false;
// 				GroupArray2[i].start_rot=GroupArray2[i].rotation.y
// 				GroupArray2[i].lookAt(camera.position);
// 	    		GroupArray2[i].rotation.z=Math.PI;
// 	    		GroupArray2[i].rotation.x=Math.PI;
// 	    		GroupArray2[i].rotation.y-=Math.PI/2;
// 	    		GroupArray2[i].mustrotate=GroupArray2[i].rotation.y;
// 	    		GroupArray2[i].rotation.y=GroupArray2[i].start_rot;
// 				GroupArray2[i].rotanim=TweenMax.to(GroupArray2[i].rotation,3,{ease: Power3.easeOut, y:GroupArray2[i].mustrotate,onComplete:()=>{GroupArray2[i].moving=true;}});
// 			}
// 			//qt=0;
// 			stage.second();
// 	}
		
	
	
// }

// function onWindowResize() {
// 				camera.aspect = window.innerWidth / window.innerHeight;
// 				camera.updateProjectionMatrix();
// 				renderer.setSize( window.innerWidth, window.innerHeight );
				
// 			}
// function mouseHandle(event){
	
// 	  if(event.deltaY==100){
	   
// 		indexControl('next');
// 	  }else{
// 		indexControl('back');
// 	  }
	
	
//   }
//   function indexControl(direction){

// 	  if(direction === 'next' && curveFloat<1){
// 		  curveFloat+=0.2;
		  
// 	  }
// 	  if(direction === 'back' && curveFloat>0){
// 		curveFloat-=0.2;
		
// 	}
// 	scrollingA = true;
// 	//camera.position.set(curve.getPointAt(curveFloat).x,curve.getPointAt(curveFloat).y,curve.getPointAt(curveFloat).z);
// 	TweenMax.to(camera.position,2,{x:curve.getPointAt(curveFloat).x,y:curve.getPointAt(curveFloat).y,z:curve.getPointAt(curveFloat).z,ease: Power4.easeOut,onComplete:()=>{scrollingA = false;},onUpdate:()=>{camera.lookAt(focPoint);}})
	
//   }
//   function rot(){
// 	for(let i=0;i<GroupArray.length;i++){
// 		GroupArray[i].moving=false;
// 		GroupArray[i].start_rot=GroupArray[i].rotation.y
// 		GroupArray[i].lookAt(camera.position);
// 		GroupArray[i].rotation.z=Math.PI;
// 		GroupArray[i].rotation.x=Math.PI;
// 		GroupArray[i].rotation.y-=Math.PI/2;
// 		GroupArray[i].mustrotate=GroupArray[i].rotation.y;
// 		GroupArray[i].rotation.y=GroupArray[i].start_rot;
// 		GroupArray[i].rotanim=TweenMax.to(GroupArray[i].rotation,3,{ease: Power3.easeOut, y:GroupArray[i].mustrotate,onComplete:()=>{}});
// 	}


//   }
//   let scrolling = false;
// let oldTime = 0;
// let newTime = 0;
// let isTouchPad;
// let eventCount = 0;
// let eventCountStart;

// function  mouseHandle2 (evt) {
	
//     let isTouchPadDefined = isTouchPad || typeof isTouchPad !== "undefined";
//    // console.log(isTouchPadDefined);
//     if (!isTouchPadDefined) {
//         if (eventCount === 0) {
//             eventCountStart = new Date().getTime();
//         }

//         eventCount++;

//         if (new Date().getTime() - eventCountStart > 100) {
//                 if (eventCount > 10) {
//                     isTouchPad = true;
//                 } else {
//                     isTouchPad = false;
//                 }
//             isTouchPadDefined = true;
//         }
//     }

//     if (isTouchPadDefined) {
    	
//         // here you can do what you want
//         // i just wanted the direction, for swiping, so i have to prevent
//         // the multiple event calls to trigger multiple unwanted actions (trackpad)
//         if (!evt) evt = event;
//         let direction = (evt.detail<0 || evt.wheelDelta>0) ? 1 : -1;

//         if (isTouchPad) {
//             newTime = new Date().getTime();

//             if (!scrolling && newTime-oldTime > 550 ) {
//                 scrolling = true;
//                 if (direction < 0) {
//                     // swipe down
// 					indexControl('next');
//                 } else {
//                     // swipe up
// 					indexControl('back');
//                 }
//                 setTimeout(function() {oldTime = new Date().getTime();scrolling = false}, 500);
//             }
//         } else {
//             if (direction < 0) {
//             	indexControl('next');
            	
//                 // swipe down
//             } else {
//                 // swipe up
// 				indexControl('back');
//             }
//         }
//     }
	
// }

// let scrollPos = 0;
// // adding scroll event
// document.addEventListener('scroll', function(){

//   // detects new state and compares it with the new one
//   if ((document.body.getBoundingClientRect()).top > scrollPos){
  	
// 		indexControl('next');
//   }
	
// 	else{
// 		indexControl('back');
		
// 	}
	
// 	// saves the new position for iteration.
// 	scrollPos = (document.body.getBoundingClientRect()).top;
		
// });

// document.addEventListener('touchstart', function(event) {
// 	event.preventDefault();
// 	event.stopPropagation();
// 	initialPoint=event.changedTouches[0];
// 	}, false);
// 	document.addEventListener('touchend', function(event) {
// 	event.preventDefault();
// 	event.stopPropagation();
// 	finalPoint=event.changedTouches[0];
// 	let xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
// 	let yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
// 	if (xAbs > 20 || yAbs > 20) {
// 	if (xAbs > yAbs) {
// 	if (finalPoint.pageX < initialPoint.pageX){
// 	/*СВАЙП ВЛЕВО*/
// 	indexControl('next');
// 	}
// 	else{
// 	/*СВАЙП ВПРАВО*/
// 	indexControl('back');
// 	}
// 	}
// 	else {
// 	if (finalPoint.pageY < initialPoint.pageY){
// 	/*СВАЙП ВВЕРХ*/}
// 	else{
// 	/*СВАЙП ВНИЗ*/}
// 	}
// 	}
// 	}, false);
