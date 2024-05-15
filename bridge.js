import * as THREE from 'three';

export function getBridge() {
    // Customize the shape as needed to resemble a full arch
    const width = 20; // Width of the arch
    const height = 25; // Height of the arch
    const thickness = 35; // Thickness of the arch

    // Position the arches along the bridge
    const numberOfArches = 10; // Number of arches in a row
    const spacingBetweenArches = 25; // Spacing between each arch
    const startPosition = -((numberOfArches - 1) * spacingBetweenArches) / 2; // Start position

    // Create a box geometry
    const planeShape = new THREE.Shape();
    const planeWidth = spacingBetweenArches*numberOfArches;
    const planeHeight = 30;
    planeShape.moveTo(-planeWidth / 2, -planeHeight / 2+planeHeight/2); // Start from bottom-left corner
    planeShape.lineTo(-planeWidth / 2, planeHeight / 2+planeHeight/2); // Draw left side
    planeShape.lineTo(planeWidth / 2, planeHeight / 2+planeHeight/2); // Draw top side
    planeShape.lineTo(planeWidth / 2, -planeHeight / 2+planeHeight/2); // Draw right side
    planeShape.lineTo(-planeWidth / 2, -planeHeight / 2+planeHeight/2); // Close the shape

    for (let i = 0; i < numberOfArches; i++) {
        const currentStartPosition = startPosition + i * spacingBetweenArches;
    
        // Create the arch shape for the current position
        const currentArchShape = new THREE.Shape();
        currentArchShape.moveTo(currentStartPosition - width / 2, -height / 2+height/2);
        currentArchShape.lineTo(currentStartPosition - width / 2, height - height / 2 + height/2);
        currentArchShape.absarc(currentStartPosition, height - height / 2, width / 2, Math.PI, 0, true);
        currentArchShape.lineTo(currentStartPosition + width / 2, -height / 2+height/2);
    
        // Add the arch shape directly to the planeShape's holes array
        planeShape.holes.push(currentArchShape);
    }

    // Define the extrude settings
    const extrudeSettings = {
        depth: thickness, // Thickness of the box
        bevelEnabled: false
    };

    // Create geometry by extruding the shape
    const geometry = new THREE.ExtrudeGeometry(planeShape, extrudeSettings);
    const material = new THREE.MeshPhongMaterial({
        color: 0xd1831d,
        side: THREE.DoubleSide,
        specular: 0xffffff, // Specular reflectance
        shininess: 10, // Shininess (specular highlight size)
 });
    const boxMesh = new THREE.Mesh(geometry, material);

    return boxMesh;
}

