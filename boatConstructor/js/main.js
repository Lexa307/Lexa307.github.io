window.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    var createScene = function() {
        // Create a basic BJS Scene object.
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.87,0.86,0.85);
        // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 6, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, false);
        
        // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
        var dirLight = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, 1, 0), scene);
        // Create a built-in "sphere" shape. 
        // var sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {segments:16, diameter:2}, scene);

        // Move the sphere upward 1/2 of its height.
        // sphere.position.y = 1;

        // Create a built-in "ground" shape.
        // var ground = BABYLON.MeshBuilder.CreateGround('ground1', {height:6, width:6, subdivisions: 2}, scene);
        BABYLON.SceneLoader.ImportMesh("new_boat.glb","./models/", "scene.glb", scene, function (meshes, particleSystems, skeletons) {
            console.log(scene)
            // do something with the scene
        });
        // Return the created scene.
        return scene;
    }

    var scene = createScene();

    engine.runRenderLoop(function() {
        scene.render();
    });

    window.addEventListener('resize', function() {
        engine.resize();
    });
});

