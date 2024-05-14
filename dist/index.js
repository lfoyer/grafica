import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getTrain } from '/models/train.js';
import { getTunnel } from '/models/tunnel.js';
import { getTrackPath } from '/models/track_path.js';
import { getBridge } from '/models/bridge.js';
import { getBridgeCover } from '/models/bridge_cover.js';
import { getTrees } from '/models/trees.js';

// Variables globales
var renderer, scene, camera, controls, cameraName = "orbital", freeMove=false, distance, direction;

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

    //scene.add(directionalLight); // Add the light to the scene

    // Ambient Light
    //const ambientLight = new THREE.AmbientLight(0xffffff, 5); // Create ambient light with a soft white color
    //ambientLight.position.set(0, 2, 0); // Set the position of the light
    //scene.add(ambientLight); // Add the light to the scene

    // Point light
    const lightpoint = new THREE.PointLight( 0xffffff, 20, 100);
    lightpoint.shadow.mapSize.set(512*3, 512*3); // Set the shadow map size
    lightpoint.shadow.bias = -0.0005; // Set the shadow bias
    lightpoint.position.set( 0, 1, 0 );
    lightpoint.castShadow = true;
    scene.add( lightpoint );

    // Plane surface
    const displacementMap = new THREE.TextureLoader().load('./displacement.jpg')
    const material = new THREE.MeshPhongMaterial( {
        color: 0x00ff00,
        side: THREE.DoubleSide,
        displacementMap: displacementMap,
        displacementScale: 1,
        wireframe: false,
        ambient: 0x333333, // Ambient reflectance
        specular: 0x111111, // Specular reflectance
        shininess: 10, // Shininess (specular highlight size)

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
        color: 0x0000ff,
        side: THREE.DoubleSide,
        ambient: 0x333333, // Ambient reflectance
        specular: 0x666666, // Specular reflectance
        shininess: 50, // Shininess (specular highlight size)
    } );
    const waterGeometry = new THREE.PlaneGeometry( 10, 10, 100, 100);
    const waterPlane = new THREE.Mesh( waterGeometry, waterMaterial );
    waterPlane.rotation.x = Math.PI / 2;
    waterPlane.position.y = -0.14;
    waterPlane.receiveShadow = true;
    scene.add(waterPlane);

    // Camera settings
    camera.position.x = 2.5;
    camera.position.y = 2.5;
    camera.position.z = 2.5;
    camera.lookAt(0, 0, 0);

    //Create a helper for the shadow camera (optional)
    const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
    //scene.add( helper );
}

function setupKeyControls() {

    const cameraNames = ["orbital", "front", "back", "tunnel", "bridge", "free"]
    var currentCameraIndex = 0;
    
    document.onkeydown = function (event) {
        switch (event.keyCode) {
            case 67:
                currentCameraIndex++;
                if (currentCameraIndex >= cameraNames.length) {
                    currentCameraIndex = 0;
                }
                cameraName = cameraNames[currentCameraIndex];
                setCamera(cameraName);
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
    scene.add(train);
    
    // Add tunnel to scene
    var tunnel = getTunnel();
    tunnel.position.y = -0.05;
    tunnel.position.x = 1.76;
    tunnel.scale.set(0.15, 0.15, 0.15);
    scene.add(tunnel);

    // Tracks
    var [trackPathMesh, trackPathCurve] = getTrackPath();
    trackPathMesh.rotation.y = Math.PI;
    trackPathMesh.position.x = 1.7;
    trackPathMesh.position.z = 1.7;
    trackPathMesh.scale.set(0.051, 0.051, 0.051);
    scene.add(trackPathMesh);

    // Bridge
    var bridge = getBridge();
    bridge.position.x = 1.1;
    bridge.position.z = -0.72;
    bridge.position.y = -0.15;
    bridge.scale.set(0.005, 0.005, 0.005);
    scene.add(bridge);

    // Bridge cover
    var bridgeCover = getBridgeCover(6);
    bridgeCover.position.x = 1.1;
    bridgeCover.position.z = -0.64;
    bridgeCover.position.y = 0.1;
    bridgeCover.scale.set(0.08, 0.1, 0.08);
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

    scene.add(treeGroup);

    scene.traverse(function(object) {
        if (object instanceof THREE.Mesh) {
            object.castShadow = true; // Enable shadow casting
            object.receiveShadow = true; // Enable shadow receiving
        }
    });

    const offsetVector = new THREE.Vector3(-1.7, 0, -1.7);
    var rescaledTrackPathCurve = transformPath(trackPathCurve.points, 0.051, offsetVector, Math.PI);
    
    function animateMeshAlongCurve() {
        var t = 0; // parameter to control position along the curve
    
        function update() {
            var point = rescaledTrackPathCurve.getPointAt(t); // get point on curve at parameter t
            train.position.copy(point); // set mesh position to point on curve
            train.position.y += 0.08;
            const tangent = rescaledTrackPathCurve.getTangentAt(t).normalize().negate();
            train.lookAt(point.clone().add(tangent)); // orient mesh along curve tangent

            // Train camera
            if (cameraName == "front") {
                // Place camera on train
                camera.position.copy(point);
                camera.position.y += 0.13;
                camera.lookAt(point.clone().add(tangent.negate()));
                
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
                camera.lookAt(point.clone().add(tangent));

                // Adjust camera position
                direction = new THREE.Vector3();
                camera.getWorldDirection( direction );
                distance = -0.06;
                camera.position.add( direction.multiplyScalar(-distance) ); 
            }

            t += 0.001; // adjust this value to control speed of movement along the curve
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