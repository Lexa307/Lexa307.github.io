function bind(func, context) {
	return function() {
	  return func.apply(context, arguments);
	};
}
  
class Slider{

    constructor(selector){
        
        this.scene = new THREE.Scene();
        //new THREE.Color(0x40182a)//new THREE.Color(0x3F3683);
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        this.renderer = selector ? (()=>{ return new THREE.WebGLRenderer( { canvas: selector, context: selector.getContext( 'webgl', { alpha: false,antialias:false } ) } );})()  : new THREE.WebGLRenderer()
        this.camera = new THREE.PerspectiveCamera( 54, (window.innerWidth) / (window.innerWidth/1.77), 0.1, 60000 );
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
        this.index = 0;
        this.mouse = new THREE.Vector2();
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
        
        this.raycaster.setFromCamera( this.mouse, this.camera );
        this.scene.getObjectByName ( "about" ).material.color.set( 0xffffff);
        this.scene.getObjectByName ( "games" ).material.color.set( 0xffffff);
        //var intersects = this.raycaster.intersectObjects( this.scene.children );
        var inverseMatrix = new THREE.Matrix4(), ray = new THREE.Ray();
        inverseMatrix.getInverse(this.scene.getObjectByName( "about" ).matrixWorld);
        ray.copy(this.raycaster.ray).applyMatrix4(inverseMatrix);

        if(ray.intersectsBox(this.scene.getObjectByName ( "about" ).geometry.boundingBox) === true && !this.moving){
            this.scene.getObjectByName ( "about" ).material.color.set( 0x4f4e4e)
        }
        inverseMatrix.getInverse(this.scene.getObjectByName( "games" ).matrixWorld);
        ray.copy(this.raycaster.ray).applyMatrix4(inverseMatrix);
        if(ray.intersectsBox(this.scene.getObjectByName ( "games" ).geometry.boundingBox) === true && !this.moving){
            this.scene.getObjectByName ( "games" ).material.color.set( 0x4f4e4e)
        }
        this.camera.lookAt(this.focus); 
        this.renderer.render( this.scene, this.camera );
        
    }

    animationMove(direction){ 
        if(this.moving){return;}
        if(direction == 'next'){
            if (this.tl.reversed()) {
                this.tl.reversed( false );
            }
            this.tl.play();
        }
        if(direction == 'back'&&this.index > 1){
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
            // s2Text1.geometry.boundingBox.applyMatrix4( s2Text1.matrixWorld );
            // s2Text1.geometry.boundingBox.min.sub(s2Text1.position);
            // s2Text1.geometry.boundingBox.max.sub(s2Text1.position);
            s2Text1.name = name;
            //var helper = new THREE.Box3Helper( s2Text1.geometry.boundingBox, 0xffff00 );
            
            //this.scene.add( helper );
            this.scene.add(s2Text1);
                
    }

    loadRes(){
        
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = 30.0;
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
                this.fscene.getObjectByName("sword").position.y = -16;
                this.fscene.getObjectByName("pistol").position.x = -30;
                this.fscene.getObjectByName("pistol").position.y = 12;
                this.fscene.getObjectByName("pistol").position.z = 20;
                this.fscene.children[2].position.z = 27
                this.fscene.children[2].children[0].material.roughness = 0.3;
                this.fscene.initpos = []
                for(let i = 0; i < this.fscene.children.length; i++){
                    this.fscene.initpos.push(this.fscene.children[i].position.clone());
                }

                //this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
                //this.controls.target = new THREE.Vector3(0,  0,  0);
                //this.controls.update();
                loader.load( 'rocks.glb', bind( function ( gltf ){
                    this.scene.add( gltf.scene );
                    this.pscene = gltf.scene;
                    gltf.scene.rotation.y -=Math.PI/2;
                    gltf.scene.position.z = -90;
                    gltf.scene.position.y = -1.5;//-2.5;


                    for(let i = 0; i < this.pscene.children.length; i++ ){
                        console.log(i);
                        this.pscene.children[i].position.z *= 1.5;
                        this.pscene.children[i].position.x *= 1.4;
                    }
                    // gltf.scene.position.multiplyScalar(1.5);
                    this.sceneSeparatorPlane = new THREE.Mesh( //separates scenes with opacity
                        new THREE.PlaneGeometry( 500, 500, 1,1 ),
                        new THREE.MeshBasicMaterial( {color: 0x3F3683, side: THREE.DoubleSide, transparent:true, opacity:1} ) 
                    );
                    this.scene.add( this.sceneSeparatorPlane );
                    this.sceneSeparatorPlane2 = new THREE.Mesh( 
                        new THREE.PlaneGeometry( 500, 500, 1,1 ),
                        new THREE.MeshBasicMaterial( {color: 0x00bfff, side: THREE.DoubleSide, transparent:true, opacity:1} ) 
                    );
                    this.scene.add( this.sceneSeparatorPlane2 );
                    this.sceneSeparatorPlane2.position.z = -156;
                    this.sceneSeparatorPlane.position.z = -75;
                    this.camera.position.set( 0,  0,  65.5);
                    this.camera.lookAt(new THREE.Vector3(0,0,0));
                    this.light1 = new THREE.PointLight( 0xFFFFFF, 0.8, 11000 );
                    this.light1.position.set( 11.31182850514277,  9.871880217076887,  53.44 );
                    this.light2 = new THREE.PointLight( 0xFFFFFF, 1, 100 );
                    this.light2.position.set( 0,  0,  -74 );
                    this.scene.add( this.light1 );
                    this.scene.add( this.light2 );
                    this.pscene.children[2].position.x = 3;
                    this.pscene.children[2].position.y = 3.5;
                    
                    this.pscene.children[3].position.z = 17;
                    this.pscene.children[3].position.y = -3;
                    for(let i = 1; i< this.pscene.children.length; i++){
                        TweenMax.to(this.pscene.children[i].position,10,{y:this.pscene.children[i].position.y-THREE.Math.randFloat(0.3,1),yoyo:true,repeat:-1,delay:2*i*THREE.Math.randFloat(0,1),ease: Power2.easeInOut})
                        TweenMax.to(this.pscene.children[1].rotation,10,{y:this.pscene.children[1].rotation.y-THREE.Math.randFloat(-0.5,0.5),yoyo:true,repeat:-1,delay:2,ease: Power2.easeInOut})
                    }
                    // TweenMax.to(this.pscene.children[1].position,10,{y:this.pscene.children[1].position.y-0.4,yoyo:true,repeat:-1,delay:2,ease: Power2.easeInOut})
                    // TweenMax.to(this.pscene.children[2].position,10,{y:this.pscene.children[2].position.y-0.5,yoyo:true,repeat:-1,delay:3,ease: Power2.easeInOut})
                    // TweenMax.to(this.pscene.children[3].position,10,{y:this.pscene.children[3].position.y-0.5,yoyo:true,repeat:-1,delay:0.5,ease: Power2.easeInOut})
                    // TweenMax.to(this.pscene.children[4].position,10,{y:this.pscene.children[4].position.y-0.4,yoyo:true,repeat:-1,delay:2,ease: Power2.easeInOut})
                    // TweenMax.to(this.pscene.children[5].position,10,{y:this.pscene.children[5].position.y-0.5,yoyo:true,repeat:-1,delay:3,ease: Power2.easeInOut})

                    // TweenMax.to(this.pscene.children[1].rotation,10,{y:this.pscene.children[1].rotation.y-0.1,yoyo:true,repeat:-1,delay:2,ease: Power2.easeInOut})
                    // TweenMax.to(this.pscene.children[2].rotation,10,{y:this.pscene.children[2].rotation.y-0.18,yoyo:true,repeat:-1,delay:3,ease: Power2.easeInOut})
                    // TweenMax.to(this.pscene.children[3].rotation,10,{y:this.pscene.children[3].rotation.y-0.13,yoyo:true,repeat:-1,delay:0.5,ease: Power2.easeInOut})
                    // TweenMax.to(this.pscene.children[4].rotation,10,{y:this.pscene.children[4].rotation.y-0.1,yoyo:true,repeat:-1,delay:2,ease: Power2.easeInOut})
                    // TweenMax.to(this.pscene.children[5].rotation,10,{y:this.pscene.children[5].rotation.y-0.18,yoyo:true,repeat:-1,delay:3,ease: Power2.easeInOut})
                    for(let i = 0; i < this.fscene.children.length; i++){
                        TweenMax.to(this.fscene.children[i].position,10,{y:this.fscene.children[i].position.y+Math.sign(THREE.Math.randFloat(-1,1)),yoyo:true,repeat:-1,delay:THREE.Math.randFloat(0.5,4),ease: Power2.easeInOut})
                        TweenMax.to(this.fscene.children[i].rotation,10,{y:this.fscene.children[i].rotation.y+THREE.Math.randFloat(-0.2,0.2),yoyo:true,repeat:-1,delay:THREE.Math.randFloat(0.5,4),ease: Power2.easeInOut})
                        TweenMax.getTweensOf(this.fscene.children[i].position)[0].progress(0).pause()
                        TweenMax.getTweensOf(this.fscene.children[i].rotation)[0].progress(0).pause()
                    }
                    for(let i = 0; i < Math.floor((this.fscene.children.length-1)/2); i++){
                        let buf = this.fscene.children[i].position.clone();
                        this.fscene.children[i].position.set(
                            this.fscene.children[this.fscene.children.length-1-i].position.x,
                            this.fscene.children[this.fscene.children.length-1-i].position.y,
                            this.fscene.children[this.fscene.children.length-1-i].position.z
                        )
                        this.fscene.children[this.fscene.children.length-1-i].position.set(buf.x,buf.y,buf.z);
                    }
                    this.moving = true;
                   

                    document.addEventListener( 'mousewheel', bind(this.mouseHandle, this), false);
                    document.onwheel =  bind(this.mouseHandle, this);
                    document.addEventListener( 'mousemove', bind(this.onMouseMove,this), false );

                    let Floader = new THREE.FontLoader();
                    Floader.load( 'fonts/Montserrat Medium_Regular.json', bind(function ( font ) {
                        this.insertText("OUR GAMES",font,0.8,0,-90,"games");
                        // this.insertText("---CLICK TO KNOW MORE---",font,0.2,-1,-90,"games1");

                        this.insertText("ABOUT US",font,0.8,0,-169,"about");
                        // this.insertText("---CLICK TO KNOW MORE---",font,0.2,-1,-169,"about1");
                        this.clouds = new THREE.Group();
                        this.scene.background = new THREE.TextureLoader().load('img/bg.jpg',bind((texture)=>{
                            new THREE.TextureLoader().load('img/smoke.png',bind((smokeTexture)=>{
                                this.smokeMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF, map: smokeTexture, transparent: true});
                                let smokeGeo = new THREE.PlaneGeometry(10,10);
                                for(let i = 0; i < 6; i++ ){
                                    this.clouds.add(new THREE.Mesh(smokeGeo,this.smokeMaterial));
                                    this.clouds.children[this.clouds.children.length-1].scale.set(1.2,1.2,1.2);
                                    this.clouds.children[this.clouds.children.length-1].rotation.z = Math.PI+i;
                                    this.clouds.children[this.clouds.children.length-1].position.set((i*2)-4,-4.4,-(i/100))
                                    TweenMax.to( this.clouds.children[this.clouds.children.length-1].rotation,100,{z:Math.PI*2,repeat:-1,yoyo:true}).timeScale( 0.1 )
                                }
                                this.smokeMaterial.depthTest = false;
                                this.smokeMaterial.depthWrite = false;
                                // this.scene.add(this.clouds);
                                this.clouds.position.z = 63;
                                this.camera.attach(this.clouds);
                                this.scene.add(this.camera);
                            
                                this.animate();
                                this.tl = new TimelineMax()
                                // .addPause()
                                //.set(this,{moving:true})
                                .set(this.smokeMaterial,{opacity:0})
                                .to(this.sceneSeparatorPlane.material,2,{opacity:0},1.5)
                                .to(this.smokeMaterial,2,{opacity:1},1.5)
                                .to(this.camera.position,3,{z:-74,ease: Power2.easeInOut},0)
                                .set(this,{moving:false})
                                .set(this,{index:1})
                                .addPause(4,()=>{
                                    this.moving = false;
                                    for(let i = 0; i < this.fscene.children.length; i++){
                                        TweenMax.getTweensOf(this.fscene.children[i].position)[0].progress(0).pause()
                                        TweenMax.getTweensOf(this.fscene.children[i].rotation)[0].progress(0).pause()
                                        this.fscene.children[i].position.set(this.fscene.initpos[i].x,this.fscene.initpos[i].y,this.fscene.initpos[i].z);
                                    }

                                })
                                .add("mid", 4)
                                .set(this.fscene.children[1].position,{x:-45, y: 0})
                                .set(this.fscene.position,{z: -220})
                                .set(this,{moving:true})
                                .to(this.clouds.scale,1,{x:0.7,y:0.7,z:0.7},"mid+=1")
                                .to(this.smokeMaterial,1,{opacity:0},"mid")
                                .to(this.smokeMaterial,1,{opacity:0.4},"mid+=2")
                                .to(this.smokeMaterial.color,3,{r:91/255, g:75/255, b:112/255},"mid")
                                .to(this.sceneSeparatorPlane2.material,4,{opacity:0,ease: Power2.easeInOut},"mid")
                                .to(this.camera.position,3,{z:-155,ease: Power2.easeInOut,
                                    onStart:()=>{
                                        for(let i = 0; i < this.fscene.children.length; i++){
                                            TweenMax.getTweensOf(this.fscene.children[i].position)[0].progress(0).play()
                                            TweenMax.getTweensOf(this.fscene.children[i].rotation)[0].progress(0).play()
                                        }
                                    }
                                },"mid")
                                .set(this,{index:2})
                                .set(this,{moving:false})
                                .addPause()
                            },this))
                        },this));

                        
                    },this));
                },this))
            },this));
    }
}
let a = new Slider();