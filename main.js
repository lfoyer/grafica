import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Water } from 'three/addons/objects/Water2.js';
import { getTrain } from '/models/train.js';
import { getTunnel } from '/models/tunnel.js';
import { getTrackPath } from '/models/track_path.js';
import { getBridge } from '/models/bridge.js';
import { getBridgeCover } from '/models/bridge_cover.js';
import { getTrees } from '/models/trees.js';

// Variables globales
var renderer, scene, camera, controls, cameraName = "orbital", freeMove=false, distance, direction, currentCameraIndex = 0, day = true;
const cameraNames = ["orbital", "front", "back", "tunnel", "bridge", "free"];
const lightpoint = new THREE.PointLight( 0xffffff, 20, 100);
const trainLight = new THREE.PointLight(0xffffed, 0);
var speed = 0.001;
var skyBoxDay, skyBoxNight;
var spotLight;

function init() {
    // Scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 1000 );
    scene.background = new THREE.Color( 0xaaaaff );

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild( renderer.domElement );

    // Controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    // Skybox
    let materialArrayDay = [];
    let materialArrayNight = [];

    let texture_ft_day = new THREE.TextureLoader().load( 'textures/barren_ft.jpg');
    let texture_bk_day = new THREE.TextureLoader().load( 'textures/barren_bk.jpg');
    let texture_up_day = new THREE.TextureLoader().load( 'textures/barren_up.jpg');
    let texture_dn_day = new THREE.TextureLoader().load( 'textures/barren_dn.jpg');
    let texture_rt_day = new THREE.TextureLoader().load( 'textures/barren_rt.jpg');
    let texture_lf_day = new THREE.TextureLoader().load( 'textures/barren_lf.jpg');
    
    materialArrayDay.push(new THREE.MeshBasicMaterial( { map: texture_ft_day }));
    materialArrayDay.push(new THREE.MeshBasicMaterial( { map: texture_bk_day }));
    materialArrayDay.push(new THREE.MeshBasicMaterial( { map: texture_up_day }));
    materialArrayDay.push(new THREE.MeshBasicMaterial( { map: texture_dn_day }));
    materialArrayDay.push(new THREE.MeshBasicMaterial( { map: texture_rt_day }));
    materialArrayDay.push(new THREE.MeshBasicMaterial( { map: texture_lf_day }));

    let texture_night = new THREE.TextureLoader().load( 'textures/night_sky.png');

    materialArrayNight.push(new THREE.MeshBasicMaterial( { map: texture_night, color: 0x444444 }));
    materialArrayNight.push(new THREE.MeshBasicMaterial( { map: texture_night, color: 0x444444 }));
    materialArrayNight.push(new THREE.MeshBasicMaterial( { map: texture_night, color: 0x444444 }));
    materialArrayNight.push(new THREE.MeshBasicMaterial( { map: texture_night, color: 0x444444 }));
    materialArrayNight.push(new THREE.MeshBasicMaterial( { map: texture_night, color: 0x444444 }));
    materialArrayNight.push(new THREE.MeshBasicMaterial( { map: texture_night, color: 0x444444 }));
    
    for (let i = 0; i < 6; i++) {
        materialArrayDay[i].side = THREE.BackSide;
        materialArrayNight[i].side = THREE.BackSide;
    }
    
    let skyboxGeo = new THREE.BoxGeometry( 1000, 1000, 1000);
    
    skyBoxDay = new THREE.Mesh( skyboxGeo, materialArrayDay );
    skyBoxNight = new THREE.Mesh( skyboxGeo, materialArrayNight );
    scene.add( skyBoxDay );
    scene.add( skyBoxNight );
    skyBoxDay.visible = true;
    skyBoxNight.visible = false;

    // Directional Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(0, 3, 5); // Set the position of the light
    directionalLight.target.position.set(0, 5, 10); // Set the position of the light's target
    directionalLight.castShadow = true; // Enable shadow casting

    // Set up shadow properties for the light
    directionalLight.shadow.mapSize.set(512 * 4, 512 * 4); // Set the shadow map size
    directionalLight.shadow.camera.near = 0.5; // Set the near clipping plane
    directionalLight.shadow.camera.far = 500; // Set the far clipping plane
    directionalLight.shadow.normalBias = 0.1; // Set the normal bias
    directionalLight.shadow.bias = -0.0005; // Set the shadow bias
    directionalLight.castShadow = true; // Enable shadow casting

    // Spotlight
    spotLight = new THREE.SpotLight( 0xffff88 );
    spotLight.position.set( 1, 1, 1 );
    spotLight.intensity = 0;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 0;
    spotLight.angle = Math.PI / 8; // This sets the spotlight cone angle to 22.5 degrees (default is Math.PI / 4)
    spotLight.distance = 20; // This sets how far the spotlight reaches    spotLight.lookAt(0, 0, 0);
    spotLight.penumbra = 0.5; // Example: softer edges
    scene.add( spotLight );
    scene.add( spotLight.target );
    spotLight.visible = true;

    //scene.add(directionalLight); // Add the light to the scene

    // Ambient Light
    //const ambientLight = new THREE.AmbientLight(0xffffff, 5); // Create ambient light with a soft white color
    //ambientLight.position.set(0, 2, 0); // Set the position of the light
    //scene.add(ambientLight); // Add the light to the scene

    // Point light
    //lightpoint = new THREE.PointLight( 0xffffff, 20, 100);
    lightpoint.shadow.mapSize.set(512*3, 512*3); // Set the shadow map size
    lightpoint.shadow.bias = -0.0005; // Set the shadow bias
    lightpoint.position.set( 0, 1, 0 );
    lightpoint.castShadow = true;
    lightpoint.color = new THREE.Color(0xffffff);
    scene.add( lightpoint );

    // Plane surface
    const grassTexture = new THREE.TextureLoader().load('textures/Grass_005_BaseColor.jpg');
    const uvTexture = new THREE.TextureLoader().load('textures/uv.png');

    // Set texture wrapping mode
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set( 10, 10 );

    const displacementMap = new THREE.TextureLoader().load('./displacement.jpg')

    const material = new THREE.MeshPhongMaterial( {
        color: 0x55aa55,
        side: THREE.DoubleSide,
        displacementMap: displacementMap,
        displacementScale: 1,
        wireframe: false,
        ambient: 0x333333, // Ambient reflectance
        specular: 0x111111, // Specular reflectance
        shininess: 10, // Shininess (specular highlight size)
        map: grassTexture
    } );

    const geometry = new THREE.PlaneGeometry( 10, 10, 100, 100);
    const plane = new THREE.Mesh( geometry, material );
    plane.rotation.x = Math.PI / 2;
    plane.position.y = 0.85;
    plane.receiveShadow = true;
    plane.castShadow = true;
    scene.add( plane );

    // Water plane
    
    const waterMaterial = new THREE.MeshPhongMaterial( {
        color: 0x5555ff,
        side: THREE.DoubleSide,
        ambient: 0x333333, // Ambient reflectance
        specular: 0x666666, // Specular reflectance
        shininess: 50, // Shininess (specular highlight size),
        transparent: true,
        opacity: 0.5
    } );
    const waterGeometry = new THREE.PlaneGeometry( 10, 10, 100, 100);
    const waterPlane = new THREE.Mesh( waterGeometry, waterMaterial );
    waterPlane.rotation.x = Math.PI / 2;
    waterPlane.position.y = -0.13;
    waterPlane.receiveShadow = true;
    
    /*
    const waterGeometry = new THREE.PlaneGeometry( 10, 10);
    let water = new Water( waterGeometry, {
		color: 0xaaaaff,
		scale: 0.1,
		flowDirection: new THREE.Vector2( 1, 1 ),
		textureWidth: 1024,
		textureHeight: 1024,
        clipBias: 0.01
	} );

    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.12;
    */
    scene.add(waterPlane);

    

    // Camera settings
    camera.position.x = 2.5;
    camera.position.y = 2.5;
    camera.position.z = 2.5;
    camera.lookAt(0, 0, 0);

    //Create a helper for the shadow camera (optional)
    const helper = new THREE.CameraHelper( trainLight.shadow.camera );
    //scene.add( helper );
}

function setCamera(cameraName) {
    if (cameraName == "orbital") {
        camera.position.x = 2.5;
        camera.position.y = 2.5;
        camera.position.z = 2.5;
        camera.lookAt(0, 0, 0);
        freeMove = false;
    }
    else if (cameraName == "tunnel") {
        camera.position.x = 1.85;
        camera.position.y = 0.11;
        camera.position.z = 1.3;
        camera.lookAt(1.8, 0, 0);
        freeMove = false;
    }
    else if (cameraName == "bridge") {
        camera.position.x = 1.6;
        camera.position.y = 0.21;
        camera.position.z = -1.4;
        camera.lookAt(0.7, 0, 0);
        freeMove = false;
    }
    else if (cameraName == "free") {
        camera.position.x = 0;
        camera.position.y = 0.11;
        camera.position.z = 0;
        camera.lookAt(0, 0.11, 1);
        freeMove = true;
    }
}

function setupKeyControls() {    
    document.onkeydown = function (event) {
        switch (event.keyCode) {
            case 83:
                speed += 0.001;
                if (speed > 0.005) {
                    speed = 0.001;
                }
                break;
            case 67:
                currentCameraIndex++;
                if (currentCameraIndex >= cameraNames.length) {
                    currentCameraIndex = 0;
                }
                cameraName = cameraNames[currentCameraIndex];
                setCamera(cameraName);
                break;
            case 68:
                if(day == true){
                    // Change to night
                    skyBoxNight.visible = true;
                    skyBoxDay.visible = false;
                    //scene.background = new THREE.Color( 0x000000 );
                    spotLight.intensity = 20;
                    lightpoint.intensity = 3;
                    lightpoint.color = new THREE.Color(0xaaaaff);
                    trainLight.intensity = 0.1;
                    day = false;
                }
                else if(day == false){
                    // Change to day
                    skyBoxNight.visible = false;
                    skyBoxDay.visible = true;
                    //scene.background = new THREE.Color( 0xaaaaff );
                    spotLight.intensity = 0;
                    lightpoint.intensity = 20;
                    lightpoint.color = new THREE.Color(0xffffff);
                    trainLight.intensity = 0;
                    day = true;
                }
                break;
            case 49:
                cameraName = "orbital";
                currentCameraIndex = 0;
                setCamera(cameraName);
                break;
            case 50:
                cameraName = "front";
                currentCameraIndex = 1;
                setCamera(cameraName);
                break;
            case 51:
                cameraName = "back";
                currentCameraIndex = 2;
                break;
            case 52:
                cameraName = "tunnel";
                currentCameraIndex = 3;
                setCamera(cameraName);
                break;
            case 53:
                cameraName = "bridge";
                currentCameraIndex = 4;
                setCamera(cameraName);
                break;
            case 54:
                cameraName = "free";
                currentCameraIndex = 5;
                setCamera(cameraName);
                break;
            case 37: // left
                camera.rotation.y -= 0.03;
                break;
            case 38: // up
                if (freeMove == true) {
                    direction = new THREE.Vector3();
                    camera.getWorldDirection( direction );
                    distance = 0.01
                    camera.position.add( direction.multiplyScalar(distance) );    
                }
                break;
            case 39: // right
                camera.rotation.y += 0.03;
                break;
            case 40: // down
                if (freeMove == true) {
                    direction = new THREE.Vector3();
                    camera.getWorldDirection( direction );
                    distance = 0.01
                    camera.position.add( direction.multiplyScalar(-distance) );    
                }
                break;
            }
    };
}

function render() {
    renderer.render( scene, camera );
    requestAnimationFrame(render);
}

// Animate function
function animate() {

}

function transformPath(trackPoints, scaleFactor, offsetVector, rotationAngle) {
    // Rescaled and offset trackPoints
    const transformedTrackPoints = trackPoints.map(point => {
        // Apply scaling
        const scaledPoint = new THREE.Vector3(point.x * scaleFactor, point.y * scaleFactor, point.z * scaleFactor);
        
        // Apply offset
        const offsetPoint = scaledPoint.add(offsetVector);

        // Apply rotation
        const rotationAxis = new THREE.Vector3(0, 1, 0);
        const rotatedPoint = offsetPoint.applyAxisAngle(rotationAxis, rotationAngle);

        return rotatedPoint;
    });

    // Create a Catmull-Rom spline curve with the transformed points
    const transformedTrackPath = new THREE.CatmullRomCurve3(transformedTrackPoints, true, 'catmullrom', 0.2);

    return transformedTrackPath;
}

function main() {
    // Initialize world
    init();

    // Add train to scene
    var train = getTrain();
    const scaleFactor = 0.003;
    train.rotation.y = Math.PI/2;
    train.scale.set(scaleFactor, scaleFactor, scaleFactor);
    train.receiveShadow = true;
    scene.add(train);
    
    // Add tunnel to scene
    var tunnel = getTunnel();
    tunnel.position.y = -0.05;
    tunnel.position.x = 1.76;
    tunnel.scale.set(0.15, 0.15, 0.15);
    tunnel.receiveShadow = true;
    scene.add(tunnel);

    // Tracks
    var [trackPathMesh, trackPathCurve] = getTrackPath();
    trackPathMesh.rotation.y = Math.PI;
    trackPathMesh.position.x = 1.7;
    trackPathMesh.position.z = 1.7;
    trackPathMesh.scale.set(0.051, 0.051, 0.051);
    trackPathMesh.receiveShadow = true;
    scene.add(trackPathMesh);

    // Bridge
    var bridge = getBridge();
    bridge.position.x = 1.1;
    bridge.position.z = -0.72;
    bridge.position.y = -0.15;
    bridge.scale.set(0.005, 0.005, 0.005);
    bridge.receiveShadow = true;
    scene.add(bridge);

    // Bridge cover
    var bridgeCover = getBridgeCover(6);
    bridgeCover.position.x = 1.1;
    bridgeCover.position.z = -0.64;
    bridgeCover.position.y = 0.1;
    bridgeCover.scale.set(0.08, 0.1, 0.08);
    bridgeCover.receiveShadow = true;
    scene.add(bridgeCover);

    // Trees
    var treeGroup = new THREE.Group();

    var trees = getTrees(3);
    trees.scale.set(0.02, 0.02, 0.02);
    trees.position.set(2, 0, 2);
    treeGroup.add(trees);

    trees = getTrees(5);
    trees.scale.set(0.02, 0.02, 0.02);
    trees.position.set(-2, 0, -2);
    treeGroup.add(trees);

    trees = getTrees(2);
    trees.scale.set(0.02, 0.02, 0.02);
    trees.position.set(2.5, 0, -2);
    treeGroup.add(trees);

    trees = getTrees(4);
    trees.scale.set(0.02, 0.02, 0.02);
    trees.position.set(-2, 0, 2);
    treeGroup.add(trees);

    trees = getTrees(8);
    trees.scale.set(0.02, 0.02, 0.02);
    trees.position.set(-1, 0, 3);
    treeGroup.add(trees);

    trees = getTrees(4);
    trees.scale.set(0.02, 0.02, 0.02);
    trees.position.set(-3, 0, 1);
    treeGroup.add(trees);

    trees = getTrees(12);
    trees.scale.set(0.02, 0.02, 0.02);
    trees.position.set(-0.8, 0, -3);
    treeGroup.add(trees);

    scene.add(treeGroup);

    // Train light
    scene.add(trainLight);
    trainLight.castShadow = true;

    //const targetObject = new THREE.Object3D();
    //scene.add(targetObject);

    scene.traverse(function(object) {
        if (object instanceof THREE.Mesh) {
            object.castShadow = true; // Enable shadow casting
            object.receiveShadow = true; // Enable shadow receiving
        }
    });

    const overlayButton = document.getElementById('overlayButton');
    overlayButton.addEventListener('click', function () {
        // For demonstration, let's change the cube's color when the button is clicked
        currentCameraIndex++;
        if (currentCameraIndex >= cameraNames.length) {
            currentCameraIndex = 0;
        }
        cameraName = cameraNames[currentCameraIndex];
        setCamera(cameraName);
    });

    const offsetVector = new THREE.Vector3(-1.7, 0, -1.7);
    var rescaledTrackPathCurve = transformPath(trackPathCurve.points, 0.051, offsetVector, Math.PI);
    
    function animateMeshAlongCurve() {
        var t = 0; // parameter to control position along the curve
    
        function update() {
            // Update train wheels
            train.children[3].rotation.x -= 0.1;
            train.children[4].rotation.x -= 0.1;
            train.children[5].rotation.x -= 0.1;
            train.children[6].rotation.x -= 0.1;
            train.children[7].rotation.x -= 0.1;
            train.children[8].rotation.x -= 0.1;

            // Calculate new position in a circle
            const radius = 0.8; // Radius of the circle
            const y = radius * Math.sin(t*190);
            console.log(y);

            train.children[11].position.y = y-15;
            train.children[12].position.y = y-15;

            var point = rescaledTrackPathCurve.getPointAt(t); // get point on curve at parameter t
            train.position.copy(point); // set mesh position to point on curve
            train.position.y += 0.09;
            const tangent = rescaledTrackPathCurve.getTangentAt(t).normalize().negate();
            train.lookAt(point.clone().add(tangent)); // orient mesh along curve tangent

            // Train light
            const point2 = rescaledTrackPathCurve.getPointAt((t) % 1);
            //const point3 = rescaledTrackPathCurve.getPointAt(t + 0.02);
            spotLight.position.copy(point2);
            spotLight.position.y += 0.10;
            spotLight.target.position.copy(point2).add(tangent.negate());

            // Train camera
            if (cameraName == "front") {
                // Place camera on train
                camera.position.copy(point);
                camera.position.y += 0.14;
                camera.lookAt(point.clone().add(tangent));
                
                // Adjust camera position
                direction = new THREE.Vector3();
                camera.getWorldDirection( direction );
                distance = 0.07;
                camera.position.add( direction.multiplyScalar(-distance) );  
            }
            else if (cameraName == "back") {
                // Place camera on train
                camera.position.copy(point);
                camera.position.y += 0.14;
                camera.position.x -= 0.1;
                camera.position.z -= 0.2;
                //camera.lookAt(point.clone().add(tangent));
                camera.lookAt(train.position);

                // Adjust camera position
                direction = new THREE.Vector3();
                camera.getWorldDirection( direction );
                distance = -0.06;
                camera.position.add( direction.multiplyScalar(-distance) ); 
            }

            t += speed; // adjust this value to control speed of movement along the curve
            if (t > 1) t = 0; // reset parameter to loop back along the curve
            
    
            requestAnimationFrame(update);
        }
        update();
    }
    animateMeshAlongCurve();
    render();
    setupKeyControls();
}

main();