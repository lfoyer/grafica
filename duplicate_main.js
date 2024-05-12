import * as THREE from 'three';

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

    // Materials
    const materialGreen = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );

    // Light
    const light = new THREE.AmbientLight( 0xF0F0F0 ); // soft white light
    scene.add( light );

    // White directional light at half intensity shining from the top.
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );

    // Point light
    const lightpoint = new THREE.PointLight( 0xffffff, 200, 1000);
    lightpoint.position.set( 10, 5, -8 );
    scene.add( lightpoint );

    // Cube
    const cubeGeometry = new THREE.BoxGeometry( 10, 4, 10 );
    var cube = new THREE.Mesh( cubeGeometry, materialGreen );
    cube.name = "cube";
    scene.add(cube);

    // Camera settings
    camera.position.x = 20;
    camera.position.y = 10;
    camera.position.x = 30;
    camera.lookAt(0, 0, 0);
}

function setupKeyControls() {
    var cube = scene.getObjectByName('cube');
    document.onkeydown = function (evento) {
        switch (evento.keyCode) {
            case 37:
                cube.rotation.x += 0.1;
                break;
            case 38:
                cube.rotation.z -= 0.1;
                break;
            case 39:
                cube.rotation.x -= 0.1;
                break;
            case 40:
                cube.rotation.z += 0.1;
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
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}

init();
setupKeyControls();
render();
