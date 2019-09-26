if ( WEBGL.isWebGLAvailable() === false ) {
	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
 let scene,camera,renderer,focPoint,vector,distance,dir,pos,myAnimation,effectFXAA,composer,can,can2,raycaster,timerId,renderScene,GroupArray,GroupArray2,geometry,material,plane,plane2,geometry2,material2,mouse,light,blackgeom,blackmat,blackplane,blackplane2



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
		myAnimation=TweenMax.to(camera.position,2,{ease: Power3.easeInOut,z:-180})
		
		
			TweenMax.to(material2,1.5,{ease: Circ.easeOut,opacity:1, 
			onComplete:()=>{
				for(let i=0;i<GroupArray2.length;i++){
					GroupArray2[i].visible=false;
					scene.remove(GroupArray2[i]);
					myAnimation.pause();
				
				}
				tozero();
				TweenLite.to(camera.position,5,{ease: Power3.easeInOut,x:-320.414,y:-70.694,z:-143, onComplete:()=>{
				//	can=true;
					console.log(camera.rotation);
					// setTimeout(function(){TweenMax.to(focPoint,3.5,{ ease: Power2.easeIn,x:-500,z:0,y:-30,onComplete:()=>{alert("done");}
						can=true;
						setTimeout(function(){TweenMax.to(camera.position,2,{ ease: Expo.easeIn,x:-500,z:500,onComplete:()=>{alert("done");}
						
					})},2000);
				} });//x-127z-103
				can2=false;
				TweenMax.to(blackplane.position,3,{ease: Power2.easeOut,x:blackplane.position.x-20,z:blackplane.position.z-20});
				TweenMax.to(blackplane2.position,3,{ease: Power2.easeOut,x:blackplane2.position.x-20,z:blackplane2.position.z-20});
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

	renderer = new THREE.WebGLRenderer();

	focPoint=new THREE.Vector3(0,70,0);
	renderScene;
	
	GroupArray=[];
	GroupArray2=[];

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	camera.position.set(0, 70, -150);
	renderer.setSize( window.innerWidth, window.innerHeight );//установка размеров канваса
	renderer.setPixelRatio( window.devicePixelRatio );
	can=false;
	can2=false;

	camera.lookAt(focPoint);

	document.body.appendChild( renderer.domElement );//помещение отрендеренного канваса в DOM

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

	blackgeom = new THREE.PlaneGeometry( 70, 500, 1 );
	blackmat = new THREE.MeshBasicMaterial( {color: 0x1D1A1B,side: THREE.DoubleSide} );//1D1A1B  231F20
	blackplane = new THREE.Mesh(  blackgeom, blackmat );
	blackplane.position.set(35,45,6);//38
	blackplane2=blackplane.clone();
	blackplane2.rotation.y-=Math.PI/2;
	blackplane2.position.set(56,45,30)//;
	scene.add(blackplane2);
	scene.add(blackplane);

	composer = new THREE.EffectComposer( renderer );
	composer.setSize( window.innerWidth, window.innerHeight );
	renderScene = new THREE.RenderPass( scene, camera );
	composer.addPass( renderScene );
	effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
	effectFXAA.renderToScreen = true;
	composer.addPass( effectFXAA );
	createPattern(-150,-150,300,300);
	window.addEventListener( 'mousemove', onMouseMove, false );
	for (let i=0;i<70;i+=7){
		for(let j=-70;j<200;j+=14){
			let tmp = plane.clone();
			tmp.position.set(i+randomFromTo(-1,2),j,0);
			tmp.amplitude=0.01+Math.random()*(0.01-0.005);
			scene.add(tmp);
    		GroupArray.push(tmp);
    	 
		}
	}
	for (let i=6;i<70;i+=7){
		for(let j=-70;j<200;j+=14){
			let tmp = plane.clone();
			tmp.position.set(0,j,i+randomFromTo(-1,2));
			tmp.amplitude=0.01+Math.random()*(0.01-0.005);
			 scene.add(tmp);
    		 GroupArray.push(tmp);
    	
		}
	}
//---------------------------second_building
	for (let i=180;i<250;i+=7){
		for(let j=-70;j<200;j+=14){
			let tmp = plane.clone();
			tmp.position.set(i+randomFromTo(-1,2),j,0);
			tmp.amplitude=0.01+Math.random()*(0.01-0.005);
			 scene.add(tmp);
    		GroupArray.push(tmp);
    	 
		}
	}
	for (let i=6;i<50;i+=7){
		for(let j=-70;j<200;j+=14){
			let tmp = plane.clone();
			tmp.position.set(180,j,i+randomFromTo(-1,2));
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
	composer.render();

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
	
	if(!can){
		camera.lookAt(focPoint);
	}
	

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