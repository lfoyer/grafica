import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getTrain } from './train.js';
import { getTunnel } from './tunnel.js';
import { getTrackPath } from './track_path.js';


// Variables globales
var renderer, scene, camera, cube;

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
    const controls = new OrbitControls( camera, renderer.domElement );
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
    waterPlane.position.y = -0.1;
    waterPlane.receiveShadow = true;
    scene.add(waterPlane);

    // Camera settings
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);

    //Create a helper for the shadow camera (optional)
    const helper = new THREE.CameraHelper( lightpoint.shadow.camera );
    scene.add( helper );
}

function setupKeyControls() {

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

    const offsetVector = new THREE.Vector3(-1.7, 0, -1.7);
    var rescaledTrackPathCurve = transformPath(trackPathCurve.points, 0.05, offsetVector, Math.PI);
    
    function animateMeshAlongCurve() {
        var t = 0; // parameter to control position along the curve
    
        function update() {
            var point = rescaledTrackPathCurve.getPointAt(t); // get point on curve at parameter t
            train.position.copy(point); // set mesh position to point on curve
            train.position.y += 0.08;
            const tangent = rescaledTrackPathCurve.getTangentAt(t).normalize().negate();
            train.lookAt(point.clone().add(tangent)); // orient mesh along curve tangent
            t += 0.001; // adjust this value to control speed of movement along the curve
            if (t > 1) t = 0; // reset parameter to loop back along the curve
            
    
            requestAnimationFrame(update);
        }
        update();
    }
    animateMeshAlongCurve();
    render();

    //setupKeyControls();
}

main();
