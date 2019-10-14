if ( WEBGL.isWebGLAvailable() === false ) {
	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
 let scene,camera,renderer,focPoint,vector,distance,dir,pos,myAnimation,effectFXAA,composer,can,can2,raycaster,timerId,renderScene,GroupArray,GroupArray2,geometry,material,plane,plane2,geometry2,material2,mouse,light,blackgeom,blackmat,blackplane,blackplane2,controls;

let blackplane5,blackplane4,blackplane3,curve,curveFloat,can3,scrollingA;

let mobile_detector=false;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	mobile_detector=true;
	}
	
function onMouseMove( event ) {
	if(!mobile_detector){
		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
		vector = new THREE.Vector3(mouse.x, mouse.y, light.position.z);
		vector.unproject( camera );
		dir = vector.sub( camera.position );
		dir.normalize();
		distance = -camera.position.z / dir.z;
		pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
		if(pos.x<150&&pos.x>-300){
			TweenMax.to(light.position,1,{ease: Power2.easeOut,x:pos.x,y:pos.y});
		}
		if(!can3&&!scrollingA){
			TweenMax.to(camera.position,1,{ease: Power2.easeOut,x:curve.getPointAt(curveFloat + mouse.x*0.05).x,z:curve.getPointAt(curveFloat+ mouse.x*0.05).z,y:curve.getPointAt(curveFloat+ mouse.x*0.05).y,onUpdate:()=>{camera.lookAt(focPoint);}});

		}
		
	
	}


}


function tozero(){
	camera.position.set(-1,70,-1);
}


let stage={
	zero:function(){

		camera.lookAt(focPoint);

		for(let i=0; i<GroupArray.length;i++){
		
	    	GroupArray[i].lookAt(camera.position);
	    	GroupArray[i].rotation.z=Math.PI;
	    	GroupArray[i].rotation.x=Math.PI;
	    	GroupArray[i].rotation.y-=Math.PI/2;
	    	GroupArray[i].mustrotate=GroupArray[i].rotation.y;
	    	GroupArray[i].visible=false;
	    	GroupArray[i].moving=false;
	    	GroupArray[i].name="plane";
	    	
		}
		for(let i=0; i<	GroupArray2.length;i++){

	    	GroupArray2[i].lookAt(camera.position);
	    	GroupArray2[i].rotation.z=Math.PI;
	    	GroupArray2[i].rotation.x=Math.PI;
	    	GroupArray2[i].rotation.y-=Math.PI/2;
	    	GroupArray2[i].mustrotate=GroupArray2[i].rotation.y;
	    	GroupArray2[i].moving=false;
	    	GroupArray2[i].name="plane";
	    	
		}
		
		material2.opacity=0;
		material.opacity=0;
	
		
	},
	first:function(){
		for(let i=0;i<GroupArray.length;i++){
				GroupArray[i].moving=true
		}
		for(let i=0;i<GroupArray2.length;i++){
				GroupArray2[i].moving=true
		}
	
		
	
		TweenMax.to(material2,1.5,{ease: Circ.easeOut,opacity:1});
		TweenLite.to(document.getElementById("btn"),1,{"opacity":1, onComplete:()=>{can2=true;}});
	
	},
	second:function(){
	
		TweenLite.to(document.getElementById("btn"),1,{"opacity":0, onComplete:()=>{document.getElementById("btn").style.display="none";}});
		TweenMax.to(material2,1.5,{ease: Circ.easeOut,opacity:1, 
			onComplete:()=>{
				for(let i=0;i<GroupArray2.length;i++){
					GroupArray2[i].visible=false;
					scene.remove(GroupArray2[i]);
					///myAnimation.pause();
				
				}
		camera.position.set(0,300,0);
		focPoint.y = 400;
		TweenMax.to(camera.position,6,{ease: Power3.easeOut,y:-70,x:-320.414,z:-143})

		TweenMax.to(focPoint,6,{ease: Power3.easeOut,y:70,onComplete:()=>{can3 = false; controls.enabled = true; controls.target = focPoint },onUpdate:()=>{camera.lookAt(focPoint);}});
		
		

				//tozero();
				// camera.position.x = -320.414;
				// camera.position.z = -143;
				// TweenLite.to(camera.position,5,{ease: Power3.easeInOut,x:-320.414,y:-70.694,z:-143, onComplete:()=>{
				// //	can=true;
				// 	console.log(camera.rotation);
				// 	// setTimeout(function(){TweenMax.to(focPoint,3.5,{ ease: Power2.easeIn,x:-500,z:0,y:-30,onComplete:()=>{alert("done");}
				// 		can=true;
				// 		setTimeout(function(){TweenMax.to(camera.position,2,{ ease: Expo.easeIn,x:-500,z:500,onComplete:()=>{}
						
				// 	})},2000);
				// } });//x-127z-103
				can2=false;
				TweenMax.to(blackplane.position,3,{ease: Power2.easeOut,x:blackplane.position.x-20,z:blackplane.position.z-20});
				TweenMax.to(blackplane2.position,3,{ease: Power2.easeOut,x:blackplane2.position.x-20,z:blackplane2.position.z-20});
				TweenMax.to(blackplane3.position,3,{ease: Power2.easeOut,x:blackplane3.position.x-20,z:blackplane3.position.z-20});
				TweenMax.to(blackplane4.position,3,{ease: Power2.easeOut,x:blackplane4.position.x-20,z:blackplane4.position.z-20});
				TweenMax.to(material,0.2,{ease: Circ.easeOut,opacity:1 });
				
				
				for(let i=0;i<GroupArray.length;i++){
					GroupArray[i].visible=true;
					TweenMax.to(GroupArray[i].position,3,{ease: Power2.easeOut,x:GroupArray[i].position.x-20,z:GroupArray[i].position.z-20});	
				}
				//
			}});
		
	}
};

function createPattern(start_x,start_y,scale_x,scale_y){
	for (let i=start_x;i<scale_x;i+=7){
		for(let j=start_y;j<scale_y;j+=14){
			let tmp = plane2.clone();
			tmp.position.set(i+randomFromTo(-1,2),j,0);
			tmp.amplitude=0.01+Math.random()*(0.01-0.005);
			scene.add(tmp);
    		GroupArray2.push(tmp);
		}
	}
}


function randomFromTo(from,to){
	return Math.floor(from+Math.random()*(to+1-from));
}

function Init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 10, 1000 );

	renderer = new THREE.WebGLRenderer({antialias:true});

	focPoint=new THREE.Vector3(0,70,0);
	renderScene;
	
	GroupArray=[];
	GroupArray2=[];
	controls = new THREE.OrbitControls( camera );
	controls.enabled = false;
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	camera.position.set(0, 70, -150);
	renderer.setSize( window.innerWidth, window.innerHeight );//установка размеров канваса
	renderer.setPixelRatio( window.devicePixelRatio );
	can=false;
	can2=false;
	can3 = true;
	scrollingA = false;

	camera.lookAt(focPoint);
	curveFloat = 0;
	document.body.appendChild( renderer.domElement );//помещение отрендеренного канваса в DOM
	//document.addEventListener( 'mousewheel', mouseHandle, false);
	geometry = new THREE.PlaneGeometry( 1.5, 14, 1 );
	material = new THREE.MeshStandardMaterial( {color: 0xFCD08E  , side: THREE.DoubleSide, wireframe:false, metalness:1, emissive:0x231F20, transparent:true} );//ad8b19
	plane = new THREE.Mesh( geometry, material );

	geometry2 = new THREE.PlaneGeometry( 1.5, 14, 1 );
	material2 = new THREE.MeshStandardMaterial( {color: 0xFCD08E  , side: THREE.DoubleSide, wireframe:false, metalness:1, emissive:0x231F20, transparent:true} );//:0x180c0c
	plane2 = new THREE.Mesh( geometry2, material2 );
	scene.background=new THREE.Color(0x1D1A1B/*231F20*/);
	light = new THREE.PointLight({color:new THREE.Color(0xE8D7AA) });
	scene.add(light);
	// let pointLightHelper = new THREE.PointLightHelper( light );
	// scene.add( pointLightHelper );

	light.position.set(-87,180,-20);//-40

	curve = new THREE.QuadraticBezierCurve3(
		new THREE.Vector3( -320.414,-70,-143),
		new THREE.Vector3( -461,  -70,  -21 ),
		new THREE.Vector3(  -241.5,  -31,  237 )
	  )
	  var points = curve.getPoints( 50 );
		var linegeometry = new THREE.BufferGeometry().setFromPoints( points );

var linematerial = new THREE.LineBasicMaterial( { color : 0xff0000 } );

// Create the final object to add to the scene
var curveObject = new THREE.Line( linegeometry, linematerial );
//scene.add(curveObject);
	blackgeom = new THREE.PlaneGeometry( 70, 500, 1 );
	blackmat = new THREE.MeshBasicMaterial( {color: 0x1D1A1B,side: THREE.DoubleSide} );//1D1A1B  231F20
	blackplane = new THREE.Mesh(  blackgeom, blackmat );
	blackplane.position.set(35,45,6);//38
	blackplane2=blackplane.clone();
	blackplane2.rotation.y-=Math.PI/2;
	blackplane2.position.set(56,45,30)//;
	blackplane3 = new THREE.Mesh(  blackgeom, blackmat );
	blackplane3.position.set(30,45,65);
	blackplane4 = new THREE.Mesh(  blackgeom, blackmat );
	blackplane4.rotation.y-=Math.PI/2;
	blackplane4.scale.x = 0.8;
	blackplane4.position.set(3,45,34)
	blackplane3.scale.x=0.8;
	scene.add(blackplane2);
	scene.add(blackplane);
	scene.add(blackplane3);
	scene.add(blackplane4);


		
	blackplane5 = blackplane.clone();
	blackplane5.scale.x = 0.9;
	blackplane5.position.set(195,45,-16);
	scene.add(blackplane5);
	createPattern(-150,-150,300,300);
	//window.addEventListener( 'mousemove', onMouseMove, false );
	//document.addEventListener("mousewheel", mouseHandle2, false);
	//document.addEventListener("DOMMouseScroll", mouseHandle2, false);
	//front
	for (let i=0;i<70;i+=7){
		for(let j=-100;j<200;j+=14){
			let tmp = plane.clone();
			tmp.position.set(i+randomFromTo(-1,2),j,0);
			tmp.amplitude=0.01+Math.random()*(0.01-0.005);
			scene.add(tmp);
    		GroupArray.push(tmp);
    	 
		}
	}
	for (let i=6;i<70;i+=7){
		for(let j=-100;j<200;j+=14){
			let tmp = plane.clone();
			tmp.position.set(0,j,i+randomFromTo(-1,2));
			tmp.amplitude=0.01+Math.random()*(0.01-0.005);
			 scene.add(tmp);
    		 GroupArray.push(tmp);
    	
		}
	}
	//back
	for (let i=0;i<70;i+=7){
		for(let j=-100;j<200;j+=14){
			let tmp = plane.clone();
			tmp.position.set(i+randomFromTo(-1,2),j,70);
			tmp.amplitude=0.01+Math.random()*(0.01-0.005);
			scene.add(tmp);
    		GroupArray.push(tmp);
    	 
		}
	}
//---------------------------second_building
	for (let i=180;i<250;i+=7){
		for(let j=-100;j<200;j+=14){
			let tmp = plane.clone();
			tmp.position.set(i+randomFromTo(-1,2),j,0);
			tmp.amplitude=0.01+Math.random()*(0.01-0.005);
			 scene.add(tmp);
    		GroupArray.push(tmp);
    	 
		}
	}
	for (let i=6;i<70;i+=7){
		for(let j=-100;j<200;j+=14){
			let tmp = plane.clone();
			tmp.position.set(180,j,i+randomFromTo(-1,2));
			tmp.amplitude=0.01+Math.random()*(0.01-0.005);
			scene.add(tmp);
    		GroupArray.push(tmp);
    	 
		}
	}
	//back
	for (let i=180;i<250;i+=7){
		for(let j=-100;j<200;j+=14){
			let tmp = plane.clone();
			tmp.position.set(i+randomFromTo(-1,2),j,70);
			tmp.amplitude=0.01+Math.random()*(0.01-0.005);
			 scene.add(tmp);
    		GroupArray.push(tmp);
    	 
		}
	}
	stage.zero();
	let f =setTimeout(function(){stage.first();},3000);
	window.addEventListener( 'resize', onWindowResize, false );
	animate();
}

Init();





 







function animate() {
	requestAnimationFrame( animate );
	renderer.render(scene, camera);

		for(let i=0; i<GroupArray.length;i++){
		
	    	if(GroupArray[i].moving){
				GroupArray[i].rotation.y+=GroupArray[i].amplitude;
	    		if(GroupArray[i].rotation.y>Math.PI){
	    			GroupArray[i].rotation.y=0;
	    		}
			}
		}
	
	
		for(let i=0; i<GroupArray2.length;i++){
			if(GroupArray2[i].moving){
				GroupArray2[i].rotation.y+=GroupArray2[i].amplitude;
				if(GroupArray2[i].rotation.y>Math.PI){
	    			GroupArray2[i].rotation.y=0;
	    		}
	    	
			}
	    	
		}
	
	// if(!can){
	// 	camera.lookAt(focPoint);
	// }
	

	raycaster.setFromCamera( mouse, camera );
	let intersects = raycaster.intersectObjects( scene.children );
	if(intersects.length>0){
		let obj = intersects[0].object
		if(obj.name=="plane"){
			obj.moving=false;
			TweenMax.to(obj.rotation,2,{ease: Power2.easeOut, y:obj.rotation.y+Math.PI,onComplete:()=>{obj.moving=true;}});
		}
			
			
	}
	
}


function tab(){
	if(can2){
		for(let i=0;i<GroupArray2.length;i++){
				GroupArray2[i].moving=false;
				GroupArray2[i].start_rot=GroupArray2[i].rotation.y
				GroupArray2[i].lookAt(camera.position);
	    		GroupArray2[i].rotation.z=Math.PI;
	    		GroupArray2[i].rotation.x=Math.PI;
	    		GroupArray2[i].rotation.y-=Math.PI/2;
	    		GroupArray2[i].mustrotate=GroupArray2[i].rotation.y;
	    		GroupArray2[i].rotation.y=GroupArray2[i].start_rot;
				GroupArray2[i].rotanim=TweenMax.to(GroupArray2[i].rotation,3,{ease: Power3.easeOut, y:GroupArray2[i].mustrotate,onComplete:()=>{GroupArray2[i].moving=true;}});
			}
			//qt=0;
			stage.second();
	}
		
	
	
}

function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
				
			}
function mouseHandle(event){
	
	  if(event.deltaY==100){
	   
		indexControl('next');
	  }else{
		indexControl('back');
	  }
	
	
  }
  function indexControl(direction){

	  if(direction === 'next' && curveFloat<1){
		  curveFloat+=0.2;
		  
	  }
	  if(direction === 'back' && curveFloat>0){
		curveFloat-=0.2;
		
	}
	scrollingA = true;
	//camera.position.set(curve.getPointAt(curveFloat).x,curve.getPointAt(curveFloat).y,curve.getPointAt(curveFloat).z);
	TweenMax.to(camera.position,2,{x:curve.getPointAt(curveFloat).x,y:curve.getPointAt(curveFloat).y,z:curve.getPointAt(curveFloat).z,ease: Power4.easeOut,onComplete:()=>{scrollingA = false;},onUpdate:()=>{camera.lookAt(focPoint);}})
	
  }
  function rot(){
	for(let i=0;i<GroupArray.length;i++){
		GroupArray[i].moving=false;
		GroupArray[i].start_rot=GroupArray[i].rotation.y
		GroupArray[i].lookAt(camera.position);
		GroupArray[i].rotation.z=Math.PI;
		GroupArray[i].rotation.x=Math.PI;
		GroupArray[i].rotation.y-=Math.PI/2;
		GroupArray[i].mustrotate=GroupArray[i].rotation.y;
		GroupArray[i].rotation.y=GroupArray[i].start_rot;
		GroupArray[i].rotanim=TweenMax.to(GroupArray[i].rotation,3,{ease: Power3.easeOut, y:GroupArray[i].mustrotate,onComplete:()=>{}});
	}


  }
  let scrolling = false;
let oldTime = 0;
let newTime = 0;
let isTouchPad;
let eventCount = 0;
let eventCountStart;

function  mouseHandle2 (evt) {
	
    let isTouchPadDefined = isTouchPad || typeof isTouchPad !== "undefined";
   // console.log(isTouchPadDefined);
    if (!isTouchPadDefined) {
        if (eventCount === 0) {
            eventCountStart = new Date().getTime();
        }

        eventCount++;

        if (new Date().getTime() - eventCountStart > 100) {
                if (eventCount > 10) {
                    isTouchPad = true;
                } else {
                    isTouchPad = false;
                }
            isTouchPadDefined = true;
        }
    }

    if (isTouchPadDefined) {
    	
        // here you can do what you want
        // i just wanted the direction, for swiping, so i have to prevent
        // the multiple event calls to trigger multiple unwanted actions (trackpad)
        if (!evt) evt = event;
        let direction = (evt.detail<0 || evt.wheelDelta>0) ? 1 : -1;

        if (isTouchPad) {
            newTime = new Date().getTime();

            if (!scrolling && newTime-oldTime > 550 ) {
                scrolling = true;
                if (direction < 0) {
                    // swipe down
					indexControl('next');
                } else {
                    // swipe up
					indexControl('back');
                }
                setTimeout(function() {oldTime = new Date().getTime();scrolling = false}, 500);
            }
        } else {
            if (direction < 0) {
            	indexControl('next');
            	
                // swipe down
            } else {
                // swipe up
				indexControl('back');
            }
        }
    }
	
}

let scrollPos = 0;
// adding scroll event
document.addEventListener('scroll', function(){

  // detects new state and compares it with the new one
  if ((document.body.getBoundingClientRect()).top > scrollPos){
  	
		indexControl('next');
  }
	
	else{
		indexControl('back');
		
	}
	
	// saves the new position for iteration.
	scrollPos = (document.body.getBoundingClientRect()).top;
		
});

document.addEventListener('touchstart', function(event) {
	event.preventDefault();
	event.stopPropagation();
	initialPoint=event.changedTouches[0];
	}, false);
	document.addEventListener('touchend', function(event) {
	event.preventDefault();
	event.stopPropagation();
	finalPoint=event.changedTouches[0];
	let xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
	let yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
	if (xAbs > 20 || yAbs > 20) {
	if (xAbs > yAbs) {
	if (finalPoint.pageX < initialPoint.pageX){
	/*СВАЙП ВЛЕВО*/
	indexControl('next');
	}
	else{
	/*СВАЙП ВПРАВО*/
	indexControl('back');
	}
	}
	else {
	if (finalPoint.pageY < initialPoint.pageY){
	/*СВАЙП ВВЕРХ*/}
	else{
	/*СВАЙП ВНИЗ*/}
	}
	}
	}, false);
