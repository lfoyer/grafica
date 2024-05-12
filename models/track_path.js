import * as THREE from 'three';

export function getTrackPath() {
    // Define the railroad track path (a smooth curve)
    const trackPoints = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(25, 0, 0),
        new THREE.Vector3(35, 0, 5),
        new THREE.Vector3(80, 0, 5),
        new THREE.Vector3(80, 0, 50),
        new THREE.Vector3(35, 0, 50),
        new THREE.Vector3(25, 0, 45),
        new THREE.Vector3(0, 0, 45)      
        
    ];
    const trackPathCurve = new THREE.CatmullRomCurve3(trackPoints, true, 'catmullrom', 0.2);

    // Define the cross-section shape of the track
    const trackShape = new THREE.Shape();
    trackShape.moveTo(0, 0);
    trackShape.lineTo(-0.5, 0.5);
    trackShape.lineTo(-0.5, 1.5);
    trackShape.lineTo(0, 2);
    trackShape.lineTo(0, 0);
    
    // Define the extrude settings
    const extrudeSettings = {
        steps: 300, // Number of steps in the extrusion
        depth: 10, // Depth of the extrusion (height)
        bevelEnabled: true, // Disable beveling
        bevelSegments: 10, // Number of bevel segments
        bevelSize: 0.5, // Size of the bevel
        bevelThickness: 0.1, // Thickness of the bevel
        extrudePath: trackPathCurve // Extrude along the track path
    };

    // Extrude the shape to create a geometry
    const geometry = new THREE.ExtrudeGeometry(trackShape, extrudeSettings);

    // Create a material
    const materialGray = new THREE.MeshPhongMaterial( { color: 0xffdb9f } );

    // Create a mesh using the extruded geometry and material
    const trackPathMesh = new THREE.Mesh(geometry, materialGray);
    
    return [trackPathMesh, trackPathCurve];
}
