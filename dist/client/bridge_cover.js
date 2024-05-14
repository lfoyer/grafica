import * as THREE from 'three';

export function getBridgeCover(numCube) {
    // Define the square shape points
    var squarePoints = [
        new THREE.Vector2(-1, -1),  // Bottom-left corner
        new THREE.Vector2(1, -1),   // Bottom-right corner
        new THREE.Vector2(1, 1),    // Top-right corner
        new THREE.Vector2(-1, 1)    // Top-left corner
    ];

    // Create a square shape
    var squareShape = new THREE.Shape(squarePoints);

    // Define hole shapes
    var hole1Points = [
        new THREE.Vector2(-0.8, -0.9), // Bottom-left corner of hole 1
        new THREE.Vector2(0.9, -0.9),  // Bottom-right corner of hole 1
        new THREE.Vector2(0.9, 0.8)      // Top-center point of hole 1
    ];

    var hole2Points = [
        new THREE.Vector2(-0.9, -0.8),  // Top-left corner of hole 2
        new THREE.Vector2(-0.9, 0.9),   // Top-right corner of hole 2
        new THREE.Vector2(0.8, 0.9)     // Bottom-center point of hole 2
    ];

    // Create hole shapes
    var hole1Shape = new THREE.Shape(hole1Points);
    var hole2Shape = new THREE.Shape(hole2Points);

    // Add holes to the square shape
    squareShape.holes.push(hole1Shape);
    squareShape.holes.push(hole2Shape);

    // Define extrude settings
    var extrudeSettings = {
        depth: 0.1, // Extrude depth
        bevelEnabled: false
    };

    // Create mesh
    var geometry = new THREE.ExtrudeGeometry(squareShape, extrudeSettings);
    var material = new THREE.MeshPhongMaterial({
        color: 0xd3d3d3,
        ambient: 0x333333, // Ambient reflectance
        specular: 0xffffff, // Specular reflectance
        shininess: 50, // Shininess (specular highlight size)

    });
    var mesh = new THREE.Mesh(geometry, material);

    // Mesh group
    var singleCube = new THREE.Group();
    var multiCube = new THREE.Group();

    var mesh1 = mesh.clone();
    mesh1.position.set(0, 0, 1);
    singleCube.add(mesh1);

    var mesh2 = mesh.clone();
    mesh2.position.set(0, 0, -1);
    singleCube.add(mesh2);

    var mesh3 = mesh.clone();
    mesh3.position.set(0, 1, 0);
    mesh3.rotation.set(Math.PI/2, 0, 0);
    singleCube.add(mesh3);

    for(var i = 0; i < numCube; i++) {
        var newSingleCube = singleCube.clone();
        newSingleCube.position.set(i*2-(numCube-1), 0, 0);
        multiCube.add(newSingleCube);
    }

    return multiCube;
}