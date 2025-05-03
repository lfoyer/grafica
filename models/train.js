import * as THREE from 'three';

export function getTrain() {
    // Texture
    const uvTexture = new THREE.TextureLoader().load('./textures/Metal_scratched_006_COLOR.jpg');
    const rustedTexture = new THREE.TextureLoader().load('./textures/Metal_Rusted_007_COLOR.png');

    // Set texture wrapping mode
    uvTexture.wrapS = THREE.RepeatWrapping;
    uvTexture.wrapT = THREE.RepeatWrapping;
    uvTexture.repeat.set( 1, 1 );

    // Materials
    const materialRed = new THREE.MeshPhongMaterial( {
        map: uvTexture,
        color: 0xff0000
    } );
    const materialGreen = new THREE.MeshPhongMaterial( {
        map: uvTexture,
        color: 0x00ff00
    } );
    const materialYellow = new THREE.MeshBasicMaterial( {
        map: rustedTexture,
        color: 0xffff44
    } );
    const materialBlue = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
    const materialGray = new THREE.MeshPhongMaterial( { color: 0x808080 } );
    
    const materialBlack = new THREE.MeshPhongMaterial( {
        map: uvTexture,
        color: 0x555555
    } );

    const materialMetal = new THREE.MeshPhongMaterial( {
        map: uvTexture,
        color: 0xcccccc,
        ambient: 0x333333, // Ambient reflectance
        specular: 0xffffff, // Specular reflectance
        shininess: 50, // Shininess (specular highlight size)
    } );

    // Wheel texture
    const wheelTexture = new THREE.TextureLoader().load('./textures/wheel2.png');

    const materialWheel = new THREE.MeshPhongMaterial( {
        map: wheelTexture,
        //color: 0x808080,
        ambient: 0x333333, // Ambient reflectance
        specular: 0xffffff, // Specular reflectance
        shininess: 50, // Shininess (specular highlight size)

    } );

    // Create Train group
    const train = new THREE.Group();

    // Cylinder1 - main body
    const cylinder1Geometry = new THREE.CylinderGeometry( 10, 10, 30 );
    var cylinder1 = new THREE.Mesh( cylinder1Geometry, materialBlack );
    cylinder1.rotation.x = Math.PI / 2;
    train.add(cylinder1);

    // Cylinder2 - main body rim
    const cylinder2Geometry = new THREE.CylinderGeometry( 13, 13, 5 );
    var cylinder2 = new THREE.Mesh( cylinder2Geometry, materialRed );
    cylinder2.rotation.x = Math.PI / 2;
    cylinder2.position.z = -17.5;
    train.add(cylinder2);

    // Cylinder3 - chimney
    const cylinder3Geometry = new THREE.CylinderGeometry( 1.5, 1.5, 10 );
    var cylinder3 = new THREE.Mesh( cylinder3Geometry, materialMetal );
    cylinder3.position.z = -17.5;
    cylinder3.position.y = 15;
    train.add(cylinder3);

    // Wheel1 - wheel
    const wheel1Geometry = new THREE.CylinderGeometry( 4, 4, 2 );
    var wheel1 = new THREE.Mesh( wheel1Geometry, materialWheel );
    wheel1.rotation.z = Math.PI / 2;
    wheel1.position.x = 9;
    wheel1.position.y = -15;
    wheel1.position.z = 0;
    train.add(wheel1);

    // Wheel2 - wheel
    const wheel2Geometry = new THREE.CylinderGeometry( 4, 4, 2 );
    var wheel2 = new THREE.Mesh( wheel2Geometry, materialWheel );
    wheel2.rotation.z = Math.PI / 2;
    wheel2.position.x = -9;
    wheel2.position.y = -15;
    wheel2.position.z = 0;
    train.add(wheel2);

    // Wheel3 - wheel
    const wheel3Geometry = new THREE.CylinderGeometry( 4, 4, 2 );
    var wheel3 = new THREE.Mesh( wheel3Geometry, materialWheel );
    wheel3.rotation.z = Math.PI / 2;
    wheel3.position.x = 9;
    wheel3.position.y = -15;
    wheel3.position.z = 10;
    train.add(wheel3);

    // Wheel4 - wheel
    const wheel4Geometry = new THREE.CylinderGeometry( 4, 4, 2 );
    var wheel4 = new THREE.Mesh( wheel4Geometry, materialWheel );
    wheel4.rotation.z = Math.PI / 2;
    wheel4.position.x = -9;
    wheel4.position.y = -15;
    wheel4.position.z = 10;
    train.add(wheel4);

    // Wheel5 - wheel
    const wheel5Geometry = new THREE.CylinderGeometry( 4, 4, 2 );
    var wheel5 = new THREE.Mesh( wheel5Geometry, materialWheel );
    wheel5.rotation.z = Math.PI / 2;
    wheel5.position.x = 9;
    wheel5.position.y = -15;
    wheel5.position.z = 20;
    train.add(wheel5);

    // Wheel6 - wheel
    const wheel6Geometry = new THREE.CylinderGeometry( 4, 4, 2 );
    var wheel6 = new THREE.Mesh( wheel6Geometry, materialWheel );
    wheel6.rotation.z = Math.PI / 2;
    wheel6.position.x = -9;
    wheel6.position.y = -15;
    wheel6.position.z = 20;
    train.add(wheel6);

    // Bottom cylinder 1
    const bottomCylinder1Geometry = new THREE.CylinderGeometry( 3, 3, 8 );
    var bottomCylinder1 = new THREE.Mesh( bottomCylinder1Geometry, materialMetal );
    bottomCylinder1.rotation.x = Math.PI / 2;
    bottomCylinder1.position.x = -10;
    bottomCylinder1.position.y = -15;
    bottomCylinder1.position.z = -12;
    train.add(bottomCylinder1);

    // Bottom cylinder 1
    const bottomCylinder2Geometry = new THREE.CylinderGeometry( 3, 3, 8 );
    var bottomCylinder2 = new THREE.Mesh( bottomCylinder1Geometry, materialMetal );
    bottomCylinder2.rotation.x = Math.PI / 2;
    bottomCylinder2.position.x = 10;
    bottomCylinder2.position.y = -15;
    bottomCylinder2.position.z = -12;
    train.add(bottomCylinder2);

    // Bottom box 1
    const bottomBox1Geometry = new THREE.BoxGeometry( 1, 1, 30 );
    var bottomBox1 = new THREE.Mesh( bottomBox1Geometry, materialMetal );
    bottomBox1.position.x = 10.5;
    bottomBox1.position.y = -15;
    bottomBox1.position.z = 4;
    train.add(bottomBox1)

    // Bottom box 2
    const bottomBox2Geometry = new THREE.BoxGeometry( 1, 1, 30 );
    var bottomBox2 = new THREE.Mesh( bottomBox1Geometry, materialMetal );
    bottomBox2.position.x = -10.5;
    bottomBox2.position.y = -15;
    bottomBox2.position.z = 4;
    train.add(bottomBox2)

    // Light cylinder
    const lightCylinderGeometry = new THREE.CylinderGeometry( 4, 4, 2 );
    var lightCylinder = new THREE.Mesh( lightCylinderGeometry, materialYellow );
    lightCylinder.rotation.x = Math.PI / 2;
    lightCylinder.position.x = 0;
    lightCylinder.position.y = -2;
    lightCylinder.position.z = -19.5;
    train.add(lightCylinder);

    // Light cylinder 2
    var extrudeSettings = {
        amount : 15,
        steps : 10,
        bevelEnabled: true,
        curveSegments: 12
    };
    
    var arcShape = new THREE.Shape();
    arcShape.absarc(0, 0, 5, 0, Math.PI * 2, 0, false);
    
    var holePath = new THREE.Path();
    holePath.absarc(0, 0, 4, 0, Math.PI * 2, true);
    arcShape.holes.push(holePath);
    
    var geometry = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);
    var lightCylinder2 = new THREE.Mesh(geometry, materialMetal);
    lightCylinder2.position.x = 0;
    lightCylinder2.position.y = -2;
    lightCylinder2.position.z = -21;
    train.add(lightCylinder2);

    // Box1 - base chassis flat
    const box1Geometry = new THREE.BoxGeometry( 26, 1, 34.5 );
    var box1 = new THREE.Mesh( box1Geometry, materialRed );
    box1.position.z = -2.5;
    box1.position.y = -10;
    train.add(box1)

    // Box2 - base chassis box
    const box2Geometry = new THREE.BoxGeometry( 15, 5, 30 );
    var box2 = new THREE.Mesh( box2Geometry, materialBlack );
    box2.position.z = 0;
    box2.position.y = -13;
    train.add(box2)

    // Box3 - cabin
    const box3Geometry = new THREE.BoxGeometry( 15, 18, 15 );
    var box3 = new THREE.Mesh( box3Geometry, materialBlack );
    box3.position.z = 20;
    box3.position.y = 4;
    train.add(box3)

    // Box4 - cabin bottom
    const box4Geometry = new THREE.BoxGeometry( 18, 10, 15 );
    var box4 = new THREE.Mesh( box4Geometry, materialRed );
    box4.position.z = 22.5;
    box4.position.y = -10;
    train.add(box4)

    var coords = [[6.5, 13.5], [-6.5, 13.5], [-6.5, 26.5], [6.5, 26.5]];
    
    // Cabin sides
    for(let i = 0; i <= 3; i++) {
        const box5Geometry = new THREE.BoxGeometry( 2, 12.5, 2 );
        var box5 = new THREE.Mesh( box5Geometry, materialBlack);
        box5.position.set(coords[i][0], 19, coords[i][1]);
        train.add(box5)
    }

    // Roof - cabin roof
    const roofGeometry = new THREE.BoxGeometry( 1.5, 1.5, 20 );
    var rotation = -0.3;
    for (let i = 0; i <= 12; i++) {
        // Pivot
        var pivot = new THREE.Object3D();
        pivot.position.set(0, 0, 20);
        train.add(pivot);
        var roof = new THREE.Mesh( roofGeometry, materialRed );
        roof.position.y += 26;
        pivot.add(roof);
        pivot.rotation.z = rotation + i * 0.05
    }
    return train;
}
