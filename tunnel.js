import * as THREE from 'three';

export function getTunnel() {
    // Create a material
    const tunnelMaterial = new THREE.MeshPhongMaterial({
        color: 0x808080,
        side: THREE.DoubleSide,
        ambient: 0x333333, // Ambient reflectance
        specular: 0xffffff, // Specular reflectance
        shininess: 50, // Shininess (specular highlight size)
 });

    // Tunnel shape
    const tunnelShape = new THREE.Shape();
    tunnelShape.moveTo(-1, 0);
    tunnelShape.lineTo(-1, 1.5);
    tunnelShape.lineTo(0, 2);
    tunnelShape.lineTo(1, 1.5);
    tunnelShape.lineTo(1, 0);

    // Hole shape
    const hole = new THREE.Path();
    hole.moveTo(-0.9, 0);
    hole.lineTo(-0.9, 1.4);
    hole.lineTo(0, 1.9);
    hole.lineTo(0.9, 1.4);
    hole.lineTo(0.9, 0);

    // Subtract the hole from the tunnel shape
    tunnelShape.holes.push(hole);

    // Define the extrude settings
    const extrudeSettings = {
        steps: 20, // Number of steps in the extrusion (depth)
        depth: 7, // Depth of the extrusion (height)
        bevelEnabled: false, // Disable beveling
    };

    // Extrude the shape to create a geometry
    const tunnelGeometry = new THREE.ExtrudeGeometry(tunnelShape, extrudeSettings);
    
    // Create a mesh using the extruded geometry and material
    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
    
    return tunnel;
}
