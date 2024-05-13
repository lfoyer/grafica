import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getTrain } from '/models/train.js';
import { getTunnel } from '/models/tunnel.js';
import { getTrackPath } from '/models/track_path.js';
import { getBridge } from '/models/bridge.js';
import { getTrees } from '/models/trees.js';

// Variables globales
var renderer, scene, camera, controls, cameraName = "orbital", freeMove=false, distance, direction;

function init() {
    // Scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    scene.background = new THREE.Color( 0xaaaaff );

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    // Light
    //const light = new THREE.AmbientLight( 0xF0F0F0 ); // soft white light
    //scene.add( light );

    // White directional light at half intensity shining from the top.
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );

    // Point light
    const lightpoint = new THREE.PointLight( 0xffffff, 20, 100);
    lightpoint.position.set( 0, 1, 0 );
    lightpoint.castShadow = true;
    scene.add( lightpoint );

    //Set up shadow properties for the light
    lightpoint.shadow.mapSize.width = 512; // default
    lightpoint.shadow.mapSize.height = 512; // default
    lightpoint.shadow.camera.near = 0.5; // default
    lightpoint.shadow.camera.far = 500; // default

    // Plane surface
    const displacementMap = new THREE.TextureLoader().load('./displacement.jpg')
    const material = new THREE.MeshPhongMaterial( {
        color: 0x00ff00,
        side: THREE.DoubleSide,
        displacementMap: displacementMap,
        displacementScale: 1,
        wireframe: false,
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
        side: THREE.DoubleSide
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
    const helper = new THREE.CameraHelper( lightpoint.shadow.camera );
    scene.add( helper );
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
    tunnel.position.y = -0.02;
    tunnel.position.x = 1.8;
    tunnel.scale.set(0.1, 0.1, 0.1);
    scene.add(tunnel);

    // Tracks
    var [trackPathMesh, trackPathCurve] = getTrackPath();
    trackPathMesh.rotation.y = Math.PI;
    trackPathMesh.position.x = 1.7;
    trackPathMesh.position.z = 1.7;
    trackPathMesh.scale.set(0.05, 0.05, 0.05);
    scene.add(trackPathMesh);

    // Bridge
    var bridge = getBridge();
    bridge.position.x = 1.1;
    bridge.position.z = -0.7;
    bridge.position.y = -0.15;
    bridge.scale.set(0.005, 0.005, 0.005);
    scene.add(bridge);

    // Trees
    var trees = getTrees(3);
    trees.scale.set(0.02, 0.02, 0.02);
    trees.position.set(2, 0, 2);
    scene.add(trees);

    trees = getTrees(5);
    trees.scale.set(0.02, 0.02, 0.02);
    trees.position.set(-2, 0, -2);
    scene.add(trees);

    trees = getTrees(2);
    trees.scale.set(0.02, 0.02, 0.02);
    trees.position.set(2, 0, -2);
    scene.add(trees);

    trees = getTrees(4);
    trees.scale.set(0.02, 0.02, 0.02);
    trees.position.set(-2, 0, 2);
    scene.add(trees);

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
                camera.position.copy(point);
                camera.position.y += 0.11;
                camera.lookAt(point.clone().add(tangent.negate()));
            }
            else if (cameraName == "back") {
                camera.position.copy(point);
                camera.position.y += 0.11;
                camera.lookAt(point.clone().add(tangent));
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