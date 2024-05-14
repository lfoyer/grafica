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
    trackShape.moveTo(0, -1.5);
    trackShape.lineTo(-0.5, -1);
    trackShape.lineTo(-0.5, 1);
    trackShape.lineTo(0, 1.5);
    trackShape.lineTo(0, -1.5);

    const railShape1 = new THREE.Shape();
    railShape1.moveTo(-1, 1.25);
    railShape1.lineTo(-1.15, 1.25);
    railShape1.lineTo(-1.15, 1.4);
    railShape1.lineTo(-1, 1.4);

    const railShape2 = new THREE.Shape();
    railShape2.moveTo(-1, 4-1.25);
    railShape2.lineTo(-1.15, 4-1.25);
    railShape2.lineTo(-1.15, 4-1.4);
    railShape2.lineTo(-1, 4-1.4);
    
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

    // Road
    const geometry = new THREE.ExtrudeGeometry(trackShape, extrudeSettings);
    const materialGray = new THREE.MeshPhongMaterial( {
        color: 0xffdb9f,
        ambient: 0x333333, // Ambient reflectance
        specular: 0x555555, // Specular reflectance
        shininess: 10, // Shininess (specular highlight size)
    } );
    const trackPathMesh = new THREE.Mesh(geometry, materialGray);
    
    // Rails
    const railGeometry1 = new THREE.ExtrudeGeometry(railShape1, extrudeSettings);
    const materialWhite = new THREE.MeshPhongMaterial( { color: 0xffffff } );
    const railMesh1 = new THREE.Mesh(railGeometry1, materialWhite);

    const railGeometry2 = new THREE.ExtrudeGeometry(railShape2, extrudeSettings);
    const railMesh2 = new THREE.Mesh(railGeometry2, materialWhite);

    // Group the track path and the rails
    const trackPathGroup = new THREE.Group();
    trackPathGroup.add(trackPathMesh);
    //trackPathGroup.add(railMesh1);
    //trackPathGroup.add(railMesh2);

    return [trackPathGroup, trackPathCurve];
}
