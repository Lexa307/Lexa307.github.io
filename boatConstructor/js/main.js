window.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    var createScene = function() {
        // Create a basic BJS Scene object.
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(1,1,1);
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 6, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = 3;
        camera.upperRadiusLimit = 6;
        // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
        var dirLight = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, 1, 0), scene);
        BABYLON.SceneLoader.ImportMesh("new_boat.glb","./models/", "scene.glb", scene, function (meshes, particleSystems, skeletons) {
            console.log(scene)
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

