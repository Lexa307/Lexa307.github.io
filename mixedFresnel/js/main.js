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
    this.mobile = false;
    this.adaptMode = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      this.mobile = true;
      this.camera = new THREE.PerspectiveCamera( 95, window.innerWidth / window.innerHeight, 0.1, 10000 );//75
      this.insideCamera = new THREE.PerspectiveCamera( 95, window.innerWidth / window.innerHeight, 0.1, 10000 );//75
    }else{
      this.camera = new THREE.PerspectiveCamera( 95, window.innerWidth / window.innerHeight, 0.1, 60000 );//75
      this.insideCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );//75
    }
    
    
    this.scene.background= new THREE.Color(0x020202);
    this.renderer = this.selector ? (()=>{ return new THREE.WebGLRenderer( { canvas: selector, context: selector.getContext( 'webgl', { alpha: false,antialias:false } ) } );})()  : new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'})
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    
    this.fShader = THREE.FresnelShader;
    this.font = null;
    //this.fontLoaded = false;
    this.about = null;
    this.works = null;
    this.contact = null;
    this.tCubes = [];
    

    
    this.sceneParams =
    {
      0:{
        name:"vkontakte",
        uniformsOut:{cubeMap:"https://lexa307.github.io/mixedFresnel/textures/cubemaps/7667.jpg"},

      },
      1:{
        name:"Air Energy",
        uniformsOut:{cubeMap:"https://lexa307.github.io/mixedFresnel/textures/cubemaps/Frame 9.7.jpg"},


      },
      2:{
        name:"Legenda",
        uniformsOut:{cubeMap:"https://lexa307.github.io/mixedFresnel/textures/cubemaps/Frame 9.8.jpg"},


      },
      3:{
        name:"TWP",
        uniformsOut:{cubeMap:"https://lexa307.github.io/mixedFresnel/textures/cubemaps/Frame 9.9.jpg"},


      },
      4:{
        name:"Energoteck",
        uniformsOut:{cubeMap:"https://lexa307.github.io/mixedFresnel/textures/cubemaps/Frame 9.10.jpg"},


      },
      5:{
        name:"Che Group",
        uniformsOut:{cubeMap:"https://lexa307.github.io/mixedFresnel/textures/cubemaps/Frame 9.11.jpg"},


      },
      6:{
        name:"Neurohive",
        uniformsOut:{cubeMap:"https://lexa307.github.io/mixedFresnel/textures/cubemaps/Frame 9.12.jpg"},


      },

    }; 
  this.LoadResource();


  
    
  }
  onWindowResize () {
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.adapt();
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
     if(!this.insideSphere.visible){
      this.time += this.fovard;
      if(!this.menuTime.about){
        this.about.material.uniforms.time.value+=0.025;
      }
      
      if(!this.menuTime.works){
        this.works.material.uniforms.time.value+=0.025;
      }
      
      if(!this.menuTime.contact){
        this.contact.material.uniforms.time.value+=0.025;
      }
      
      if(this.time>24.5||this.time<17){this.fovard*=-1}
      this.camera.lookAt(this.focus);
      this.renderer.render( this.scene, this.camera );
     }else{
      this.insideCamera.lookAt(this.target);
      this.insideSphere.material.uniforms.time.value = this.time;
      this.renderer.render( this.scene, this.insideCamera );
     }
     
     
     for(let i=0;i<7;i++){

      this.arrB[i].material.uniforms.time.value = this.time;
      //this.arrB[i].rotation.x+=0.001;
      
     }

     //if(this.fontLoaded){
       // this.about.material.uniforms.time.value = this.time;
        this.TGroup.lookAt(this.camera.position);
        //
        if(!this.oceanText.animating){
          this.oceanText.material.uniforms.time.value += Math.abs(this.fovard*10);
        }
        
        this.Cgroup.lookAt(this.camera.position);
     //}
      
      //this.controls.update();
      //this.composerScene.render();
      
      this.stats.end();

  }
   generateGeometry(futureIndex){
     let newGeometry = new THREE.TextBufferGeometry( this.sceneParams[futureIndex].name, {
      font: this.font,
        size: 40,
        height: 0,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
    } );
    newGeometry.word = this.sceneParams[futureIndex].name;
    let tmpMAterial = this.oceanText.material;
    this.Cgroup.remove(this.oceanText);
    this.oceanText = new THREE.Mesh(newGeometry,tmpMAterial);
    this.Cgroup.add(this.oceanText);
    this.oceanText.position.x=((newGeometry.word.length*30)/2)*-1;
    this.oceanText.position.y = 0;

  }



  Init(){
    this.focus = new THREE.Vector3(0,0,0);
    this.container;
    this.time = 17;
    this.index = 3;
    this.spheres = [];
    this.moving = false;
    this.last = null ;
    this.oldTime = 0;
    this.newTime = 0;
    this.isTouchPad;
    this.eventCount = 0;
    this.eventCountStart;
    this.TGroup = new THREE.Group();
    this.fovard = 0.001;
    this.insideSphere = null;
    this.target = new THREE.Vector3(350,20,0);

    
    //this.OrbitFlag = true;
    this.settings = {
      reflectivity:0.5,
      metalness:0.5,
      progress: 1,
      animtime: 5,
      roughness:0.5,
      uWiggleScale:  0.241 ,
      uWiggleDisplacement: 10.995,
      uWiggleSpeed:  0.125 ,
      refractionRatio: 0.93,
      dispersionSamples: 30,
      dispersionBlendMultiplier:3,
      dispersion: 0.8,
      mRefractionRatio: 1.0,
      mFresnelBias: 1,
      mFresnelPower: 2.0,
      mFresnelScale: 1.0,
      bgcolor: "#"+ this.scene.background.getHexString ()
    }
    this.controlsParams = {
      OrbitControls: false,
      Target:this.scene.position
    }
    
    this.arrB = [];
    this.arrCurves = [];
    this.arrOrbits = [];

    this.fontSettings = {
    size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: false,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
    }
     
    
    let file_container = document.createElement('div');
    file_container.className = 'file_upload';
    file_container.style.position = 'absolute';
    file_container.style.top = 0;
    file_container.style.left = 0;
    this.ImgLoader = document.createElement('input');
    this.ImgLoader.type = 'file';
    file_container.appendChild(this.ImgLoader);
    
    
    this.ImgLoader.addEventListener('change',bind(this.changeImaage,this), false);
    let statment = 0;
    this.container = document.createElement( 'div' );
    document.body.appendChild( this.container );//  размещение контейнера в body
    this.renderer.domElement.id = 'webgl';
    this.container.appendChild( this.renderer.domElement );// помещение рендерера в контейнер
    this.stats = new Stats();
    document.body.appendChild( this.stats.dom );

    this.rtParameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: true
    };
    this.caseParams = {
      frequency1:0.035,
      amplitude1:20.0,
      frequency2:0.025,
      amplitude2:70.0
    }
    // this.composerScene = new THREE.EffectComposer( this.renderer, new THREE.WebGLRenderTarget( window.innerWidth*2 , window.innerHeight*2 , this.rtParameters ) );
    // this.effectColorify = new THREE.ShaderPass(THREE.ColorifyShader);
  
    // this.renderPass = new THREE.RenderPass( this.scene, this.camera );
    // this.composerScene.addPass(this.renderPass);
    // this.composerScene.addPass(this.effectColorify);
    this.d=document.createElement('div');

    this.d.style.width='100%';

    this.d.style.height="100%";
    this.d.style.margin="0 0 0 0";
    this.d.style.padding="0 0 0 0";
    this.d.style.top="0";
    this.d.style.left="0";
    this.d.style.position="absolute";
    this.d.style.opacity="0.0";

    this.d.style.background='#000000';



    

    this.raycaster= new THREE.Raycaster();
    //this.raycaster.far=1700;
    this.mouse = new THREE.Vector2();
    this.d.addEventListener( 'mousemove', bind(this.onMouseMove,this), false );
    this.d.addEventListener( 'mousewheel', bind(this.mouseHandle, this), false);
	
	
    this.controls = new THREE.OrbitControls( this.camera );
    
    
    this.camera.lookAt(this.scene.position);
    this.controls.update();
    this.textPositions = [];
    this.inMenu =false;
    this.bigtestgeometry=new THREE.IcosahedronGeometry(500, 4);

    for(let i =0;i<7;i++){

      let meshBMaterial = new THREE.ShaderMaterial( 
        {
          defines: {
            DISPERSION_SAMPLES:20
          },
            uniforms: 			{
              "mRefractionRatio": { type: "f", value: 1.02 },
              "mFresnelBias": 	{ type: "f", value: 1.0 },
              "mFresnelPower": 	{ type: "f", value: 2.0 },
              "mFresnelScale": 	{ type: "f", value: 1.0 },
              "time": { type: 'f', value: 9.95 },
              "progress": { type: 'f', value: 1.0 },
              "uWiggleScale": { type: 'f', value: 0.241 },
              "uWiggleDisplacement": { type: 'f', value: 0.01 },
              "uWiggleSpeed": { type: 'f', value: 0.125 },
              "refractionRatio":{ type: 'f', value: 0.93 }, 
		          "dispersion": { type: 'f', value: 0.8 }, 
              "dispersionBlendMultiplier":{ type: 'f', value: 3.0 },
              "cameraPosition":{value:this.camera.position},
              "tCube": 			{ type: "t", value:this.sceneParams[i].uniformsOut.tCube, }, //  textureCube }
              
            },
          vertexShader:   this.fShader.vertexShader,
          fragmentShader: this.fShader.fragmentShader
        }   );
      let meshB = new THREE.Mesh(this.bigtestgeometry,	meshBMaterial);
      
      //meshBMaterial.maxScaleHover = meshBMaterial.uniforms.uWiggleScale.value+0.075;
      let x = Math.cos(2 * Math.PI * i / 7) * 6000 + 0;
      let y = Math.sin(2 * Math.PI * i / 7) * 6000 + 0;

      let OCurveStartVectot = new THREE.Vector3((Math.cos(2 * Math.PI * (i-0.1) / 7) * 7100 +0),meshB.position.y+300,(Math.sin(2 * Math.PI * (i-0.1) / 7) * 7100 +0));
      let OCurveControlVevtor = new THREE.Vector3((Math.cos(2 * Math.PI * i / 7) * 7100 + 0),meshB.position.y+300,(Math.sin(2 * Math.PI * i / 7) * 7100 + 0));
      let OCurveEndVector = new THREE.Vector3((Math.cos(2 * Math.PI * (i+0.1) / 7) * 7100 +0),meshB.position.y+300,(Math.sin(2 * Math.PI * (i+0.1) / 7) * 7100 +0));
      
      this.textPositions.push(new THREE.Vector3(Math.cos(2 * Math.PI * i / 7) * 8000,meshB.position.y+300, Math.sin(2 * Math.PI * i / 7) * 8000))
      //let material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

      let LCurveControlVector = new THREE.Vector3((Math.cos(2 * Math.PI * (i+0.5) / 7) * 10000 + 0),meshB.position.y+300,(Math.sin(2 * Math.PI * (i+0.5) / 7) * 10000 + 0));
      this.arrOrbits.push(new THREE.QuadraticBezierCurve3(
        OCurveStartVectot,
        OCurveControlVevtor,
        OCurveEndVector
      ));
      
      // let points = this.arrOrbits[i].getPoints(50);
      // let geometry = new THREE.BufferGeometry().setFromPoints( points );
      // let curveObject = new THREE.Line( geometry, material );
      // this.scene.add(curveObject);
      this.arrCurves.push(LCurveControlVector);
      meshB.name = i+'';
      meshB.position.set(x,300,y);
      meshB.lookAt(this.scene.position);
     
      this.arrB.push(meshB);

      this.scene.add(meshB);
      

    }
    this.material = new THREE.ShaderMaterial( {
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable'
      },
      defines: THREE.DispersionMaterial.defines,
      uniforms: THREE.DispersionMaterial.uniforms,
      side: THREE.DoubleSide,
      vertexShader: THREE.DispersionMaterial.vertex_Shader,
    
      fragmentShader: THREE.DispersionMaterial.fragmentShader
    
    } );
    this.insideSphere = new THREE.Mesh(this.bigtestgeometry,this.material);
    this.insideSphere.visible = false;
    this.insideSphere.name = 'inside';
    this.scene.add(this.insideSphere);
    
    this.recompileShader(this.arrB[this.index],50);
    this.recompileShader(this.arrB[this.index+1],20);
    this.recompileShader(this.arrB[this.index-1],20);
    
   document.addEventListener('keydown', bind(function(event) {
      if(!this.moving&&event.key==' '){
        this.moving = true;
        if(!this.inMenu){
          
          let newPos = new THREE.Vector3(this.camera.position.x,this.camera.position.y,this.camera.position.z);
          newPos.x*=1.1;
          newPos.z*=1.1;
          this.TGroup.position.set(newPos.x,500,newPos.z);
          let tmpControlBezier = this.index+1>this.arrOrbits.length-1?this.arrB[0].position:this.arrB[this.index+1].position;
          let tmpfloat = {value:0};
          let focusBezier =  new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(),
            tmpControlBezier,
            this.TGroup.position
          );
          this.TGroup.visible = true;  
          this.about.material.uniforms.color.value = new THREE.Color(0xFFFFFF);
          this.works.material.uniforms.color.value = new THREE.Color(0xCBCBCB);
          this.contact.material.uniforms.color.value = new THREE.Color(0xCBCBCB);
 
          
          TweenMax.to(tmpfloat,2,{value:1,ease: Power2.easeOut,
            onUpdate:()=>{
              this.focus.set(focusBezier.getPointAt(tmpfloat.value).x,focusBezier.getPointAt(tmpfloat.value).y,focusBezier.getPointAt(tmpfloat.value).z)

              
            },
            onComplete:()=>{
              this.inMenu = true;
              this.moving = false;
              for(let i = 0; i<this.arrB.length;i++){
                this.arrB[i].visible = false;
              }
              
            }});
        }else{

          let tmpControlBezier = this.index+1>this.arrOrbits.length-1?this.arrB[0].position:this.arrB[this.index+1].position;
          let tmpfloat = {value:0};
          let focusBezier =  new THREE.QuadraticBezierCurve3(
            this.TGroup.position,
            tmpControlBezier,
            new THREE.Vector3(),
          );
            
          for(let i = 0; i<this.arrB.length;i++){
            this.arrB[i].visible = true;
          }
 
          
          TweenMax.to(tmpfloat,2,{value:1,ease: Power2.easeInOut,
            onUpdate:()=>{
              this.focus.set(focusBezier.getPointAt(tmpfloat.value).x,focusBezier.getPointAt(tmpfloat.value).y,focusBezier.getPointAt(tmpfloat.value).z)
              
            },
            onComplete:()=>{
              this.TGroup.visible = false;
              this.inMenu = false;
              this.moving = false;
              //this.oceanText.position.set(this.camera.position.x*0.98,300,this.camera.position.z*0.98)
            }});

        }
        
        
      }
  },this));
    this.controls.enabled = false;
    document.body.appendChild( this.d);
    this.gui = new dat.GUI();
    this.gui.add(this.controlsParams,'OrbitControls').onChange(bind(function(value) {
      if(value){
        this.moving = true;
        this.controls.enabled = true;
      }else{
        this.controls.enabled = false;
        this.moving = false;
       // this.camera.position.set( 4125,  -500,  0);
       // this.camera.lookAt(this.scene.position);
        
      }
    
      
     },this));
     this.gui.add(this.controlsParams,'Target',['scene','0','1','2','3','4','5','6']).onChange(bind(function(value) {
      if(value=='scene'){
        this.controls.target.set(this.scene.position.x,this.scene.position.y,this.scene.position.z);
      }else{
        this.controls.target.set(this.sceneParams[value].x,this.sceneParams[value].y,this.sceneParams[value].z);
      }
        
     },this));

    this.gui.addColor( this.settings, 'bgcolor').onChange(bind(function(value) {
      this.scene.background = new THREE.Color (value);
     // console.log(this);
     },this));
    let f1 = this.gui.addFolder('case text');
    
    f1.add(this.caseParams,'frequency1',0,1,0.001).onChange(bind(function(value) {
      this.oceanText.material.uniforms.frequency1.value = value;
    },this));
    f1.add(this.caseParams,'amplitude1',0,100,1).onChange(bind(function(value) {
      this.oceanText.material.uniforms.amplitude1.value = value;
    },this));
    f1.add(this.caseParams,'frequency2',0,1,0.001).onChange(bind(function(value) {
      this.oceanText.material.uniforms.frequency2.value = value;
    },this));
    f1.add(this.caseParams,'amplitude2',0,100,1).onChange(bind(function(value) {
      this.oceanText.material.uniforms.amplitude2.value = value;
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
      let f = this.gui.addFolder('params: '+(i+1));
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
      let f0 = f.addFolder('position ' + (i+1));
      f0.add(this.arrB[i].position,'x',-30000,30000,1).onChange(bind(function(value) {
        this.arrB[i].position.x = value;
        },this));
      f0.add(this.arrB[i].position,'y',-30000,30000,1).onChange(bind(function(value) {
          this.arrB[i].position.y = value;
          },this));
      f0.add(this.arrB[i].position,'z',-30000,30000,1).onChange(bind(function(value) {
        this.arrB[i].position.z = value;
        },this));
      let f1 = f.addFolder('bubble ' + (i+1));


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
    this.camera.position.set( this.arrOrbits[this.index].getPointAt(0.5).x,this.arrOrbits[this.index].getPointAt(0.5).y,this.arrOrbits[this.index].getPointAt(0.5).z);
    this.camera.lookAt(this.scene.position);
    this.TGroup.add(this.about);
    this.about.position.x=-1200;
    this.about.position.y = 150;
    this.TGroup.add(this.works);
    this.works.position.x=-1200;
    this.works.position.y = -100;
    this.TGroup.add(this.contact);
    this.contact.position.x=-1200;
    this.contact.position.y = -350;
    let aboutPlane = new THREE.Mesh(new THREE.PlaneGeometry( 650, 120 ),new THREE.MeshBasicMaterial({color:0x020202}))
    aboutPlane.name = 'about';
    aboutPlane.position.x = -870;
    aboutPlane.position.y = 200;
    this.about.p = aboutPlane;
    this.TGroup.add(aboutPlane);

    let worksPlane = new THREE.Mesh(new THREE.PlaneGeometry( 760, 120 ),new THREE.MeshBasicMaterial({color:0x020202}))
    worksPlane.name = 'works';
    worksPlane.position.x = -800;
    worksPlane.position.y = -55;
    this.works.p = worksPlane;
    this.TGroup.add(worksPlane);

    let contactPlane = new THREE.Mesh(new THREE.PlaneGeometry( 790, 120 ),new THREE.MeshBasicMaterial({color:0x020202}))
    contactPlane.name = 'contact';
    contactPlane.position.x = -800;
    contactPlane.position.y = -300
    this.contact.p = contactPlane;
    this.TGroup.add(contactPlane);


    this.scene.add(this.TGroup);

    this.Cgroup = new THREE.Group();

    this.Cgroup.add(this.oceanText);
    this.oceanText.position.x=-100;
    this.oceanText.position.y = 0;
    this.scene.add(this.Cgroup);
    this.distanceScale = 0.96;
    this.Cgroup.position.set(this.camera.position.x* this.distanceScale,300,this.camera.position.z* this.distanceScale)

    this.generateGeometry(this.index);

    let newPos = new THREE.Vector3(this.camera.position.x,this.camera.position.y,this.camera.position.z);
    newPos.x*=1.01;
    newPos.z*=1.01;
    this.TGroup.position.set(newPos.x,500,newPos.z);
    this.TGroup.visible = false;
    //this.container.addEventListener("DOMMouseScroll", bind(this.mouseHandle, this),false);
    //this.container.addEventListener('scroll',bind(this.onScroll,this),false);


    this.d.addEventListener('touchstart', bind(function(event) {
      event.preventDefault();
      event.stopPropagation();
      this.initialPoint=event.changedTouches[0];
      },this), false);
      this.d.addEventListener('touchend', bind(function(event) {
      event.preventDefault();
      event.stopPropagation();
      this.finalPoint=event.changedTouches[0];
      let xAbs = Math.abs(this.initialPoint.pageX - this.finalPoint.pageX);
      let yAbs = Math.abs(this.initialPoint.pageY - this.finalPoint.pageY);
      if (xAbs > 20 || yAbs > 20) {
      if (xAbs > yAbs) {
      if (this.finalPoint.pageX < this.initialPoint.pageX){
      /*СВАЙП ВЛЕВО*/
      this.indexControl('back');
      
      }
      else{
      /*СВАЙП ВПРАВО*/
      this.indexControl('next');
      }
      }
      else {
      if (this.finalPoint.pageY < this.initialPoint.pageY){
        //this.indexControl('next');
      /*СВАЙП ВВЕРХ*/}
      else{
        //this.indexControl('back');
      /*СВАЙП ВНИЗ*/}
      }
      }else{
        event.target.click();
        event.preventDefault();
      }
      },this), false);
      document.body.appendChild(file_container);
window.addEventListener("resize",bind(this.onWindowResize,this), false);
window.addEventListener('click', bind(this.onClick,this), false);
for(let i = 0; i< this.arrB.length; i++){
  this.arrB[i].material.uniforms.dispersionBlendMultiplier.value = 1;
}
this.arrB[3].material.uniforms.dispersionBlendMultiplier.value = 4;//face sphere
this.arrB[2].material.uniforms.dispersionBlendMultiplier.value = 1.5;
this.arrB[4].material.uniforms.dispersionBlendMultiplier.value = 1.5;
this.adapt();
this.animate();

  }
  adapt(){

    if(window.innerWidth<=1024){
      this.adaptMode = true;
      this.about.p.position.x = 0;
      this.works.p.position.x = 0;
      this.contact.p.position.x = 0;
      this.about.position.x = -350;
      this.works.position.x = -370;
      this.contact.position.x = -380;
   

    }else{
      this.adaptMode = false;
      this.about.p.position.x = -870;
      this.works.p.position.x = -800;
      this.contact.p.position.x = -800;
      this.about.position.x=-1200;
      this.works.position.x=-1200;
      this.contact.position.x = -1200;

    }
  }

  LoadResource(){
    let resCounter = 0;
    
    for(let i in this.sceneParams){
      
      let url =  this.sceneParams[i].uniformsOut.cubeMap;
      this.sceneParams[i].uniformsOut.tCube = new THREE.CubeTextureLoader().load(
        [url,url,url,url,url,url],
         ()=>{
          
          resCounter++;
        }
      )
    }
    let loader = new THREE.FontLoader();

    
    let oceanMaterial = new THREE.ShaderMaterial({
      uniforms:THREE.OceanShader.uniforms,
      vertexShader: THREE.OceanShader.vertexShader,
      fragmentShader:THREE.OceanShader.fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
    });
    
    loader.load( 'fonts/Wooland.json', bind(function ( font ) {
      this.font = font;
      let oceanGeometry = new THREE.TextBufferGeometry( 'Neurohive', {
        font: font,
        size: 30,
        height: 1,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      } );
        let geometry = new THREE.TextBufferGeometry( 'About', {
          font: font,
          size: 150,
          height: 1,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 10,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5
        } );

        let geometry1 = new THREE.TextBufferGeometry( 'Works', {
          font: font,
          size: 150,
          height: 1,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 10,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5
        } );

        let geometry2 = new THREE.TextBufferGeometry( 'Contact', {
          font: font,
          size: 150,
          height: 1,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 10,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5
        } );
      
        
        this.about = new THREE.Mesh(geometry,oceanMaterial.clone());
        this.about.name = 'about';
        this.works = new THREE.Mesh(geometry1,oceanMaterial.clone());
        this.works.name = 'works';
        this.contact = new THREE.Mesh(geometry2,oceanMaterial.clone());
        this.contact.name = 'contact';

        this.oceanText = new THREE.Mesh(oceanGeometry,oceanMaterial);
        this.oceanText.animating = false;
        this.menuTime = {'about':0,'works':0,'contact':0};

        //textMesh.position.set( 6498.349068563988,  1177.689926040678,  2585.312866564084);
        
        //this.fontLoaded = true;
        resCounter++;
      
      },this ));

let s;
s = setInterval(()=>{
  if(resCounter==8){
    clearInterval(s);
    this.Init();
    
  }else{
    console.log(resCounter)
  }
},100)
    
  
  }

  onClick(event){
    if(!this.inMenu){
      this.raycaster.setFromCamera( this.mouse, this.camera );
    let intersects = this.raycaster.intersectObjects(this.scene.children );
    if(intersects.length>0){
      let objName = parseInt(intersects[ 0 ].object.name,10);
      if(objName>this.index){
        if(this.index == 0  && objName == this.arrB.length-1 ){
          this.indexControl('back');
        }else{
          this.indexControl('next');
        }
          
        
      }
      if(objName<this.index){
        if(this.index == this.arrB.length-1 && objName == 0 ){
          this.indexControl('next');
        }else{
          this.indexControl('back');
        }
        
      }
      if(objName==this.index){
        this.moving = true;
        TweenMax.killAll(false, true, false);
        TweenMax.to(this.d.style,1.5,{opacity:1,
          onComplete:()=>{
            
        }});
        TweenMax.to(this.camera.position,1.5,{x:this.arrB[this.index].position.x*1.1,y:this.arrB[this.index].position.y,z:this.arrB[this.index].position.z*1.1,
          onComplete:()=>{
            this.enter();
          }
        })
      }
    }
    }else{
      this.raycaster.setFromCamera( this.mouse, this.camera );
      let intersects = this.raycaster.intersectObjects(this.TGroup.children );
      if(intersects.length>0){
        if(intersects[0].object.name == 'about'){
          console.log('clicked about');
        }
        if(intersects[0].object.name == 'works'){
          console.log('clicked works');
        }
        if(intersects[0].object.name == 'contact'){
          console.log('cliked contact');
        }
      }
    }
    
  }
    sceneVisibleControl(statement){
      for(let i = 0; i<this.scene.children.length;i++){
        this.scene.children[i].visible = statement;
      }
    }
    enter (){
      
      this.moving = true;
      
      this.insideSphere.material.uniforms.envMap.value = this.arrB[this.index].material.uniforms.tCube.value;
      this.sceneVisibleControl(false);
      this.camera.position.z = 0;
      this.insideSphere.visible = true;
      this.time = 9.95;
      TweenMax.to(this.d.style,1.5,{opacity:0,
        onComplete:()=>{
          this.camera.fov = 75
      }
    });
    let btn = document.createElement('img');
    btn.id="btn";
    btn.src ="textures/back_gray.svg";
    btn.addEventListener('click',bind(()=>{ 
      this.moving = true;
      TweenMax.to(this,1.5,{time:9.95});
     
     
      TweenMax.to(this.insideCamera.position,1.5,{x:-396.2,
        onComplete:()=>{
         
  
      } })
      TweenMax.to(this.d.style,1.5,{opacity:1,
      onComplete:()=>{
        this.back();
      }
  });
},this));
    let btn_container = document.createElement('div');
    btn_container.className = 'btn_start';
    document.body.appendChild(btn_container);
    //console.log(btn_container);
    btn_container.appendChild(btn);
    TweenMax.to(btn.style,1.5,{opacity:1});
      TweenMax.to(this,5,{time:10.32})
      this.insideCamera.position.set(-396.2, 20, 0);
      TweenMax.to(this.insideCamera.position,3,{x:4,onComplete:()=>{
        this.moving = false;     
      } })
    }
    back(){
      this.time = 17;
      let btn_container = document.getElementsByClassName('btn_start')[0];
      btn_container.remove();
      this.camera.fov = 95;
      this.moving = true;
      this.sceneVisibleControl(true);
      this.TGroup.visible = false;
      this.insideSphere.visible = false;
      this.camera.position.set(this.arrB[this.index].position.x*1.1,this.arrB[this.index].position.y,this.arrB[this.index].position.z*1.1);
      TweenMax.to(this.camera.position,1.5,{ease: Power2.easeOut,x:this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x*0.1).x,z:this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x*0.1).z,y:this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x*0.1).y,onUpdate:()=>{this.camera.lookAt(this.scene.position);},
      onComplete:()=>{
        this.moving = false;
      }});
      TweenMax.to(this.d.style,1.5,{opacity:0,
        onComplete:()=>{
          
        }
   
     
      //this.camera.position.set(-396.2, 20,  0)
     
    })
  }
  
    onMouseMove ( event ) {
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      this.raycaster.setFromCamera( this.mouse, this.camera );

      if(!this.moving&&!this.inMenu&&!this.insideSphere.visible){
        TweenMax.to(this.camera.position,1,{ease: Power2.easeOut,x:this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x*0.03).x,z:this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x*0.03).z,y:this.arrOrbits[this.index].getPointAt(0.5 + this.mouse.x*0.03).y,onUpdate:()=>{this.camera.lookAt(this.scene.position);}});
      }

      if(!this.moving&&this.insideSphere.visible){
        this.insideCamera.position.z += ( this.mouse.x*4 - this.insideCamera.position.z  ) * 1.1;
        this.insideCamera.position.y += ( - this.mouse.y+20 - this.insideCamera.position.y ) * 1.1;
        this.insideCamera.lookAt( this.target );
      }
      
  
	// calculate objects intersecting the picking ray
  var intersects = this.raycaster.intersectObjects(this.scene.children );
 
  if(intersects.length == 0){
    
    if(this.last!=null){
      TweenMax.to(this.last.material.uniforms.dispersion,2,{value:0.8,ease: Power2.easeOut});
      TweenMax.to(this.last.material.uniforms.refractionRatio,2,{value:0.93,ease: Power2.easeOut});
      const tmpConst = 0.215-0.075;
     // TweenMax.to(this.last.material.uniforms.uWiggleScale,2,{value:tmpConst,ease: Power2.easeInOut,onComplete:()=>{}});

      this.last = null;
      
    }
  }
  if(intersects.length>0){
    
    if(this.last!=null&&this.last.material.uuid!=intersects[ 0 ].object.material.uuid&&intersects[ 0 ].object.name!='inside'){
      console.log('y2')
      TweenMax.to(this.last.material.uniforms.dispersion,2,{value:0.8,ease: Power2.easeInOut});
            TweenMax.to(this.last.material.uniforms.refractionRatio,2,{value:0.93,ease: Power2.easeOut});
      const tmpConstP = 0.215-0.075;
     // TweenMax.to(this.last.material.uniforms.uWiggleScale,2,{value:tmpConstP,ease: Power2.easeInOut,onComplete:()=>{ }})
      this.last = intersects[ 0 ].object;
      TweenMax.to(intersects[ 0 ].object.material.uniforms.dispersion,2,{value:1,ease: Power2.easeInOut});
      TweenMax.to(intersects[ 0 ].object.material.uniforms.refractionRatio,2,{value:1,ease: Power2.easeOut});
      const tmpConstM = 0.215;
      //TweenMax.to(intersects[ 0 ].object.material.uniforms.uWiggleScale,2,{value:tmpConstM,ease: Power2.easeInOut})
    }
    if(this.last==null&&intersects[ 0 ].object.name!='inside'){
     
      this.last = intersects[ 0 ].object;
      console.log(this.last.material.defines)
       TweenMax.to(this.last.material.uniforms.dispersion,2,{value:1,ease: Power2.easeInOut});
       TweenMax.to(this.last.material.uniforms.refractionRatio,2,{value:1,ease: Power2.easeOut});
     // TweenMax.to(this.last.material.uniforms.uWiggleScale,2,{value:0.215,ease: Power2.easeInOut})
     
    }

    if(parseInt(intersects[ 0 ].object.name,10)  == this.index){
      this.oceanText.animating = true;
      TweenMax.to(this.oceanText.material.uniforms.time,1,{value:this.oceanText.material.uniforms.time.value+Math.PI,onComplete:()=>{this.oceanText.animating = false;}})
    }
    

    
  }
  intersects = this.raycaster.intersectObjects(this.TGroup.children );
  if(intersects.length>0&&intersects[ 0 ].object.name=='about'){
    this.menuTime.about = 1;
    this.fill(new THREE.Color(0xFFFFFF),1,this.about);
    TweenMax.to(this.about.material.uniforms.time,1,{value:this.about.material.uniforms.time.value+Math.PI,onComplete:()=>{this.menuTime.about = 0;}})
  }
  if(intersects.length>0&&intersects[ 0 ].object.name=='works'){
    this.menuTime.works = 1;
    this.fill(new THREE.Color(0xFFFFFF),1,this.works);
    TweenMax.to(this.works.material.uniforms.time,1,{value:this.works.material.uniforms.time.value+Math.PI,onComplete:()=>{this.menuTime.works = 0;}})
  }
  if(intersects.length>0&&intersects[ 0 ].object.name=='contact'){
    this.menuTime.contact = 1;
    this.fill(new THREE.Color(0xFFFFFF),1,this.contact);
    TweenMax.to(this.contact.material.uniforms.time,1,{value:this.contact.material.uniforms.time.value+Math.PI,onComplete:()=>{this.menuTime.contact = 0;}})
  }
  

	    
    }

    onScroll(event){
      // if(!moving){
         // detects new state and compares it with the new one
         if ((document.body.getBoundingClientRect()).top > this.scrollPos){
       console.log("scroll_next")
           this.indexControl('next');
         }
     
         else{
           this.indexControl('back');
           console.log("scroll_back")
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
                       console.log("touchpad_next")
                       this.indexControl('next');
                   } else {
                       // swipe up
                       console.log("touchpad_back")
                       this.indexControl('back');
                   }
                   setTimeout(function() {this.oldTime = new Date().getTime();}, 500);
               }
           } else {
               if (direction < 0) {
                console.log("Ntouchpad_next")
                 this.indexControl('next');
                 
                   // swipe down
               } else {
                   // swipe up
                   console.log("Ntouchpad_back")
                   this.indexControl('back');
               }
           }
         }
       //}
     }

    indexControl(direction){
      if(!this.inMenu&&!this.moving&&!this.insideSphere.visible){

        let floatIndex = {value:0};
      let materialChanged = false;
      if(direction == 'next' && this.index<this.arrOrbits.length-1){
        this.moving = true;
        let curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3( this.camera.position.x,  this.camera.position.y,  this.camera.position.z),
          this.arrCurves[this.index],
          new THREE.Vector3( this.arrOrbits[this.index+1].getPointAt(0.5).x,  this.arrOrbits[this.index+1].getPointAt(0.5).y,  this.arrOrbits[this.index+1].getPointAt(0.5).z )
        );
          TweenMax.to(this.oceanText.material.uniforms.opacity,0.5,{value:0,onComplete:()=>{this.generateGeometry(this.index+1);}});
       // TweenMax.to(this.focus,2,{ease: Power2.easeInOut,x:this.arrB[this.index+1].position.x,y:this.arrB[this.index+1].position.y,z:this.arrB[this.index+1].position.z,onUpdate:()=>{}})
       this.arrB[this.index+1].visible = true;
        TweenMax.to(floatIndex,2,{ease: Power2.easeInOut,value:1,onComplete:()=>{
          this.index++;
          this.moving = false;
          this.Cgroup.position.set(this.camera.position.x* this.distanceScale,300,this.camera.position.z* this.distanceScale);
          TweenMax.to(this.oceanText.material.uniforms.opacity,0.5,{value:1});
          if(this.adaptMode){
            for(let i = 0; i<this.arrB.length; i++){
              if(i!=this.index){
                this.arrB[i].visible = false;
              }
            }
          }
          },
          
        onUpdate:()=>{
          this.camera.lookAt(this.scene.position);
          
          this.camera.position.set(curve.getPointAt(floatIndex.value).x,curve.getPointAt(floatIndex.value).y,curve.getPointAt(floatIndex.value).z);this.camera.lookAt(this.scene.position);
        }})
          if(!materialChanged){
            for(let i = 0; i< this.arrB.length; i++){
              if(i!=this.index+1&&i!=this.index+2&&i!=this.index){
                this.recompileShader(this.arrB[i],20);
                TweenMax.to(this.arrB[i].material.uniforms.dispersionBlendMultiplier,1,{value:1});// background spheres

              } 

            }
            if(this.index==this.arrB.length-2){
              this.recompileShader(this.arrB[this.index+1],50);
              this.recompileShader(this.arrB[0],30);
              this.recompileShader(this.arrB[this.index],30);
              TweenMax.to(this.arrB[this.index+1].material.uniforms.dispersionBlendMultiplier,1,{value:4});//face sphere
              TweenMax.to(this.arrB[0].material.uniforms.dispersionBlendMultiplier,1,{value:1.5});
              TweenMax.to(this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,1,{value:1.5});
            }else{
              this.recompileShader(this.arrB[this.index+1],50);
              this.recompileShader(this.arrB[this.index+2],30);
              this.recompileShader(this.arrB[this.index],30);
              TweenMax.to(this.arrB[this.index+1].material.uniforms.dispersionBlendMultiplier,1,{value:4});//face sphere
              TweenMax.to(this.arrB[this.index+2].material.uniforms.dispersionBlendMultiplier,1,{value:1.5});
              TweenMax.to(this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,1,{value:1.5});
            }
            
            materialChanged = true;
          }
        }
      if(direction == 'back' && this.index>0){
        this.moving = true;
        let curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3( this.camera.position.x,  this.camera.position.y,  this.camera.position.z),
          this.arrCurves[this.index-1],
          new THREE.Vector3( this.arrOrbits[this.index-1].getPointAt(0.5).x,  this.arrOrbits[this.index-1].getPointAt(0.5).y,  this.arrOrbits[this.index-1].getPointAt(0.5).z )
        );
        TweenMax.to(this.oceanText.material.uniforms.opacity,0.5,{value:0,onComplete:()=>{this.generateGeometry(this.index-1);}});
       // TweenMax.to(this.focus,2,{ease: Power2.easeInOut,x:this.arrB[this.index-1].position.x,y:this.arrB[this.index-1].position.y,z:this.arrB[this.index-1].position.z,onUpdate:()=>{}})
       this.arrB[this.index-1].visible = true;
        TweenMax.to(floatIndex,2,{ease: Power2.easeInOut,value:1,onComplete:()=>{
          this.index--;
          this.moving = false;
          this.Cgroup.position.set(this.camera.position.x* this.distanceScale,300,this.camera.position.z* this.distanceScale);
          TweenMax.to(this.oceanText.material.uniforms.opacity,0.5,{value:1});
          if(this.adaptMode){
            for(let i = 0; i<this.arrB.length; i++){
              if(i!=this.index){
                this.arrB[i].visible = false;
              }
            }
          }
         },
        onUpdate:()=>{
          this.camera.lookAt(this.scene.position);
          this.camera.position.set(curve.getPointAt(floatIndex.value).x,curve.getPointAt(floatIndex.value).y,curve.getPointAt(floatIndex.value).z);this.camera.lookAt(this.scene.position);}})
          if(!materialChanged){
            for(let i = 0; i< this.arrB.length; i++){
              if(i!=this.index-1&&i!=this.index-2&&i!=this.index){
                this.recompileShader(this.arrB[i],20);
                TweenMax.to(this.arrB[i].material.uniforms.dispersionBlendMultiplier,1,{value:1});
              } 

            }
            if(this.index==1){
              this.recompileShader(this.arrB[this.index-1],50);
              this.recompileShader(this.arrB[this.arrB.length-1],30);
              this.recompileShader(this.arrB[this.index],30);
              TweenMax.to(this.arrB[this.index-1].material.uniforms.dispersionBlendMultiplier,1,{value:4});
              TweenMax.to(this.arrB[this.arrB.length-1].material.uniforms.dispersionBlendMultiplier,1,{value:1.5});
              TweenMax.to(this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,1,{value:1.5});
            }else{
              this.recompileShader(this.arrB[this.index-1],50);
              this.recompileShader(this.arrB[this.index-2],30);
              this.recompileShader(this.arrB[this.index],30);
              TweenMax.to(this.arrB[this.index-1].material.uniforms.dispersionBlendMultiplier,1,{value:4});
              TweenMax.to(this.arrB[this.index-2].material.uniforms.dispersionBlendMultiplier,1,{value:1.5});
              TweenMax.to(this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,1,{value:1.5});
            }
            
            materialChanged = true;
          }
          
          // let material = new THREE.LineBasicMaterial( { color : 0x0000ff } );
        // let points = curve.getPoints(50);
        // let geometry = new THREE.BufferGeometry().setFromPoints( points );
        // let curveObject = new THREE.Line( geometry, material );
        // this.scene.add(curveObject);
      }

      if(direction == 'next' && this.index==this.arrOrbits.length-1){
        this.moving = true;
        let curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3( this.camera.position.x,  this.camera.position.y,  this.camera.position.z),
          this.arrCurves[this.index],
          new THREE.Vector3( this.arrOrbits[0].getPointAt(0.5).x,  this.arrOrbits[0].getPointAt(0.5).y,  this.arrOrbits[0].getPointAt(0.5).z )
        );
        TweenMax.to(this.oceanText.material.uniforms.opacity,0.5,{value:0,onComplete:()=>{this.generateGeometry(0);}});
       // TweenMax.to(this.focus,2,{ease: Power2.easeInOut,x:this.arrB[this.index+1].position.x,y:this.arrB[this.index+1].position.y,z:this.arrB[this.index+1].position.z,onUpdate:()=>{}})
       this.arrB[0].visible = true;
        TweenMax.to(floatIndex,2,{ease: Power2.easeInOut,value:1,onComplete:()=>{
          this.index=0;
          this.moving = false;
          this.Cgroup.position.set(this.camera.position.x* this.distanceScale,300,this.camera.position.z* this.distanceScale);
          TweenMax.to(this.oceanText.material.uniforms.opacity,0.5,{value:1});
          if(this.adaptMode){
            for(let i = 0; i<this.arrB.length; i++){
              if(i!=this.index){
                this.arrB[i].visible = false;
              }
            }
          }
          },
        onUpdate:()=>{
          this.camera.lookAt(this.scene.position);
          this.camera.position.set(curve.getPointAt(floatIndex.value).x,curve.getPointAt(floatIndex.value).y,curve.getPointAt(floatIndex.value).z);this.camera.lookAt(this.scene.position);}})
          if(!materialChanged){
            for(let i = 0; i< this.arrB.length; i++){
              if(i!=0&&i!=this.index&&i!=1){
                this.recompileShader(this.arrB[i],20);
                TweenMax.to(this.arrB[i].material.uniforms.dispersionBlendMultiplier,1,{value:1});
              } 

            }
            this.recompileShader(this.arrB[0],50);
            this.recompileShader(this.arrB[this.index],30);
            this.recompileShader(this.arrB[1],30);
            TweenMax.to(this.arrB[0].material.uniforms.dispersionBlendMultiplier,1,{value:4});
            TweenMax.to(this.arrB[this.index].material.uniforms.dispersionBlendMultiplier,1,{value:1.5});
            TweenMax.to(this.arrB[1].material.uniforms.dispersionBlendMultiplier,1,{value:1.5});
            materialChanged = true;
          }
        }
      if(direction == 'back' && this.index==0){
        this.moving = true;
        let curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3( this.camera.position.x,  this.camera.position.y,  this.camera.position.z),
          this.arrCurves[this.arrOrbits.length-1],
          new THREE.Vector3( this.arrOrbits[this.arrOrbits.length-1].getPointAt(0.5).x,  this.arrOrbits[this.arrOrbits.length-1].getPointAt(0.5).y,  this.arrOrbits[this.arrOrbits.length-1].getPointAt(0.5).z )
        );
        TweenMax.to(this.oceanText.material.uniforms.opacity,0.5,{value:0,onComplete:()=>{this.generateGeometry(this.arrOrbits.length-1);}});
       // TweenMax.to(this.focus,2,{ease: Power2.easeInOut,x:this.arrB[this.index-1].position.x,y:this.arrB[this.index-1].position.y,z:this.arrB[this.index-1].position.z,onUpdate:()=>{}})
       this.arrB[this.arrOrbits.length-1].visible = true;
        TweenMax.to(floatIndex,2,{ease: Power2.easeInOut,value:1,onComplete:()=>{
          this.index=this.arrOrbits.length-1;
          this.moving = false;
          this.Cgroup.position.set(this.camera.position.x* this.distanceScale,300,this.camera.position.z* this.distanceScale);
          TweenMax.to(this.oceanText.material.uniforms.opacity,0.5,{value:1});
          if(this.adaptMode){
            for(let i = 0; i<this.arrB.length; i++){
              if(i!=this.index){
                this.arrB[i].visible = false;
              }
            }
          }
          
        },onUpdate:()=>{this.camera.lookAt(this.scene.position);this.camera.position.set(curve.getPointAt(floatIndex.value).x,curve.getPointAt(floatIndex.value).y,curve.getPointAt(floatIndex.value).z);this.camera.lookAt(this.scene.position);}})
          if(!materialChanged){
            for(let i = 0; i< this.arrB.length; i++){
              if(i!=this.arrB.length-1){
                this.recompileShader(this.arrB[i],20);
                TweenMax.to(this.arrB[i].material.uniforms.dispersionBlendMultiplier,1,{value:1});
              } 

            }
            this.recompileShader(this.arrB[this.arrB.length-1],50);
            this.recompileShader(this.arrB[0],30);
            this.recompileShader(this.arrB[this.arrB.length-2],30);
            TweenMax.to(this.arrB[this.arrB.length-1].material.uniforms.dispersionBlendMultiplier,1,{value:4});
            TweenMax.to(this.arrB[0].material.uniforms.dispersionBlendMultiplier,1,{value:1.5});
            TweenMax.to(this.arrB[this.arrB.length-2].material.uniforms.dispersionBlendMultiplier,1,{value:1.5});
            materialChanged = true;
          }
        }
      }
      

    }
    recompileShader(Sobject,priority){//priority: back = 20, front = 50
      
        let tempUniforms = Sobject.material.uniforms;

        
        let tmpMaterial = new THREE.ShaderMaterial( 
          {
            defines: {
              DISPERSION_SAMPLES:priority
            },
              uniforms: tempUniforms,
            vertexShader:   this.fShader.vertexShader,
            fragmentShader: this.fShader.fragmentShader
          }   );
          Sobject.material = tmpMaterial;
          
    }
    fill(color,time,textobj){
    
      let menutexts = ['about','works','contact'];
      for(let i = 0;i<menutexts.length;i++){
        if(textobj.name!=menutexts[i]){
         // TweenMax.to(this[menutexts[i]].material.uniforms.color.value,time,{r:255,g:255,b:255});
         this[menutexts[i]].material.uniforms.color.value = new THREE.Color(0xCBCBCB);
        }
      }
      TweenMax.to(textobj.material.uniforms.color.value,time,{r:color.r,g:color.g,b:color.b});
      
    }

    
  
  
}
let a
if ( THREE.WEBGL.isWebGLAvailable() ) {
  //var canvas = document.createElement( 'canvas' );
	// Initiate function or other initializations here
	 a = new Slider(/*canvas*/);

} else {

	var warning = THREE.WEBGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}