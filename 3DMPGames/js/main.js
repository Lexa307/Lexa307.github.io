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
        this.camera = new THREE.PerspectiveCamera( 54, window.innerWidth / (window.innerHeight), 0.1, 60000 );
        }
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, (window.innerHeight) );//(window.innerWidth/1.77)
        document.body.appendChild( this.renderer.domElement );
        this.moving = false;
        this.focus = new THREE.Vector3(0,0,-300);
        this.loadRes();
    }

    onWindowResize () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );

    }

    animate () {
        requestAnimationFrame( this.animate.bind(this) );
        this.renderer.render( this.scene, this.camera );
        this.raycaster.setFromCamera( this.mouse, this.camera );
        var intersects = this.raycaster.intersectObjects( this.scene.children );

        if (intersects.length == 0){
            // this.scene.getObjectByName ( "about" ).material.color = new THREE.Color( 0xffffff);
            // this.scene.getObjectByName ( "about1" ).material.color = new THREE.Color( 0xffffff);
            // this.scene.getObjectByName ( "games" ).material.color = new THREE.Color( 0xffffff);
            // this.scene.getObjectByName ( "games1" ).material.color = new THREE.Color( 0xffffff);
        }else{
            if(this.raycaster.ray.intersectsBox(this.scene.getObjectByName ( "about" ).geometry.boundingBox)){
                // this.scene.getObjectByName ( "about" ).material.color = new THREE.Color( 0xff0000);
                // this.scene.getObjectByName ( "about1" ).material.color = new THREE.Color( 0xff0000);
            } 
            if (intersects[ 0 ].object.name == "games"||"games1"){

                // this.scene.getObjectByName ( "games" ).material.color = new THREE.Color( 0xff0000);
                // this.scene.getObjectByName ( "games1" ).material.color = new THREE.Color( 0xff0000);
            }
        }
        this.camera.lookAt(this.focus); 
        
        
    }

    animationMove(direction){ 
        if(this.moving){return;}
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
        if (event.deltaY < 0) {
          // Zoom in
          this.animationMove('back');
        }
        else {
          // Zoom out
          this.animationMove('next');
        }
      }
      onMouseMove ( event ) {
        //if(TweenMax.isTweening(this.camera.position)){return;}
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        TweenMax.to(this.focus,0.5,{x:this.mouse.x*2,y:this.mouse.y*0.5,ease: Power2.easeOut})
        // this.camera.position.x= this.mouse.x*0.3;
        // this.camera.position.y= this.mouse.y*0.01;


      }
    insertText(text,font,scale,Ypos,Zpos,name){
        let s2Text1 = new THREE.Mesh(new THREE.TextBufferGeometry( text, 
                        {
                            font: font,
                            size: scale,
                            height: 0,
                            curveSegments: 12,
                            bevelEnabled: false,
                        } 
                        ), new THREE.MeshLambertMaterial());
                        s2Text1.geometry.computeBoundingBox(); 
                        s2Text1.geometry.translate( - 0.5 * ( s2Text1.geometry.boundingBox.max.x - s2Text1.geometry.boundingBox.min.x), 0, 0 );
                        //s2Text1.geometry.computeBoundingBox(); 
                        //s2Text1.position.x = - 0.5 * ( s2Text1.geometry.boundingBox.max.x - s2Text1.geometry.boundingBox.min.x );
                        s2Text1.position.y = Ypos;
                        s2Text1.position.z = Zpos;
                        s2Text1.updateMatrixWorld( true );
                        s2Text1.geometry.boundingBox.applyMatrix4( s2Text1.matrixWorld );
                        // s2Text1.geometry.boundingBox.min.sub(s2Text1.position);
                        // s2Text1.geometry.boundingBox.max.sub(s2Text1.position);
                        s2Text1.name = name;
                        //var helper = new THREE.Box3Helper( s2Text1.geometry.boundingBox, 0xffff00 );
                        
                        //this.scene.add( helper );
                        this.scene.add(s2Text1);
                
    }

    loadRes(){
        this.mouse = new THREE.Vector2(0,0);
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = 20.0;
        var light = new THREE.AmbientLight( 0xFFFFFF,1 ); 
        this.scene.add( light );
        var loader = new THREE.GLTFLoader().setPath( 'models/' );
            loader.load( 'fullscene.glb', bind( function ( gltf ) {
                this.scene.add( gltf.scene );
                this.fscene = gltf.scene;
                this.fscene.children[0].position.y = 4; //bomb Y position fix
                this.fscene.getObjectByName("console").position.x = -50;
                this.fscene.getObjectByName("money").position.y = 27;
                this.fscene.getObjectByName("nyancat").position.multiplyScalar(1.5);
                this.fscene.getObjectByName("sword").position.y = -10;

                this.fscene.children[2].position.z = 27
                this.fscene.children[2].children[0].material.roughness = 0.3;


                //this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
                //this.controls.target = new THREE.Vector3(0,  0,  0);
                //this.controls.update();
                loader.load( 'rocks.glb', bind( function ( gltf ){
                    this.scene.add( gltf.scene );
                    this.pscene = gltf.scene;
                    gltf.scene.rotation.y -=Math.PI/2;
                    gltf.scene.position.z = -90;
                    gltf.scene.position.y = -2.5;


                    for(let i = 0; i < this.pscene.children.length; i++ ){
                        console.log(i);
                        this.pscene.children[i].position.z *= 1.5;
                        this.pscene.children[i].position.x *= 1.4;
                    }
                    // gltf.scene.position.multiplyScalar(1.5);
                    this.sceneSeparatorPlane = new THREE.Mesh( //separates scenes with opacity
                        new THREE.PlaneGeometry( 200, 200, 1,1 ),
                        new THREE.MeshBasicMaterial( {color: 0x3F3683, side: THREE.DoubleSide, transparent:true, opacity:1} ) 
                    );
                    this.scene.add( this.sceneSeparatorPlane );
                    this.sceneSeparatorPlane2 = new THREE.Mesh( 
                        new THREE.PlaneGeometry( 200, 200, 1,1 ),
                        new THREE.MeshBasicMaterial( {color: 0x3F3683, side: THREE.DoubleSide, transparent:true, opacity:1} ) 
                    );
                    this.scene.add( this.sceneSeparatorPlane2 );
                    this.sceneSeparatorPlane2.position.z = -156;
                    this.sceneSeparatorPlane.position.z = -75;
                    this.camera.position.set( 0,  0,  65.5);
                    this.camera.lookAt(new THREE.Vector3(0,0,0));
                    this.light1 = new THREE.PointLight( 0xFFFFFF, 0.8, 11000 );
                    this.light1.position.set( 11.31182850514277,  9.871880217076887,  53.44 );
                    this.scene.add( this.light1 );
                    this.pscene.children[2].position.x = 3;
                    TweenMax.to(this.pscene.children[1].position,10,{y:this.pscene.children[1].position.y-0.4,yoyo:true,repeat:-1,delay:2,ease: Power2.easeInOut})
                    TweenMax.to(this.pscene.children[2].position,10,{y:this.pscene.children[2].position.y-0.5,yoyo:true,repeat:-1,delay:3,ease: Power2.easeInOut})
                    TweenMax.to(this.pscene.children[3].position,10,{y:this.pscene.children[3].position.y-0.5,yoyo:true,repeat:-1,delay:0.5,ease: Power2.easeInOut})

                    TweenMax.to(this.pscene.children[1].rotation,10,{y:this.pscene.children[1].rotation.y-0.1,yoyo:true,repeat:-1,delay:2,ease: Power2.easeInOut})
                    TweenMax.to(this.pscene.children[2].rotation,10,{y:this.pscene.children[2].rotation.y-0.18,yoyo:true,repeat:-1,delay:3,ease: Power2.easeInOut})
                    TweenMax.to(this.pscene.children[3].rotation,10,{y:this.pscene.children[3].rotation.y-0.13,yoyo:true,repeat:-1,delay:0.5,ease: Power2.easeInOut})

                    for(let i = 0; i < this.fscene.children.length; i++){
                        TweenMax.to(this.fscene.children[i].position,10,{y:this.fscene.children[i].position.y+Math.sign(THREE.Math.randFloat(-1,1)),yoyo:true,repeat:-1,delay:THREE.Math.randFloat(0.5,4),ease: Power2.easeInOut})
                        TweenMax.to(this.fscene.children[i].rotation,10,{y:this.fscene.children[i].rotation.y+THREE.Math.randFloat(-0.2,0.2),yoyo:true,repeat:-1,delay:THREE.Math.randFloat(0.5,4),ease: Power2.easeInOut})
                        TweenMax.getTweensOf(this.fscene.children[i].position)[0].progress(0).pause()
                        TweenMax.getTweensOf(this.fscene.children[i].rotation)[0].progress(0).pause()
                    }
                    this.moving = true;
                    this.tl = new TimelineMax()
                    // .addPause()
                    //.set(this,{moving:true})
                    //.set(this.light1.position,{x:11.31182850514277,y:9.871880217076887,z: 53.44})
                    .to(this.sceneSeparatorPlane.material,2,{opacity:0},1.5)
                    .to(this.camera.position,3,{z:-74,ease: Power2.easeInOut},0)
                    .set(this,{moving:false})
                    .addPause(4,()=>{
                        this.moving = false;
                        for(let i = 0; i < this.fscene.children.length; i++){
                            TweenMax.getTweensOf(this.fscene.children[i].position)[0].progress(0).pause()
                            TweenMax.getTweensOf(this.fscene.children[i].rotation)[0].progress(0).pause()
                        }
                    })
                    .add("mid", 4)
                    .set(this.fscene.children[1].position,{x:-25, y: 0})
                    .set(this.fscene.position,{z: -220})
                    .set(this,{moving:true})
                    .to(this.sceneSeparatorPlane2.material,4,{opacity:0,ease: Power2.easeInOut},"mid")
                    .to(this.camera.position,3,{z:-155,ease: Power2.easeInOut,
                        onStart:()=>{
                            for(let i = 0; i < this.fscene.children.length; i++){
                                TweenMax.getTweensOf(this.fscene.children[i].position)[0].progress(0).play()
                                TweenMax.getTweensOf(this.fscene.children[i].rotation)[0].progress(0).play()
                            }
                        }
                    },"mid")
                    .set(this,{moving:false})
                    .addPause()

                    document.addEventListener( 'mousewheel', bind(this.mouseHandle, this), false);
                    document.onwheel =  bind(this.mouseHandle, this);
                    document.addEventListener( 'mousemove', bind(this.onMouseMove,this), false );

                    let Floader = new THREE.FontLoader();
                    Floader.load( 'fonts/Montserrat Medium_Regular.json', bind(function ( font ) {
                        this.insertText("OUR GAMES",font,0.8,0,-90,"games");
                        this.insertText("---CLICK TO KNOW MORE---",font,0.2,-1,-90,"games1");

                        this.insertText("ABOUT US",font,0.8,0,-169,"about");
                        this.insertText("---CLICK TO KNOW MORE---",font,0.2,-1,-169,"about1");

                        this.animate();
                    },this));
                },this))
            },this));
    }
}
let a = new Slider();