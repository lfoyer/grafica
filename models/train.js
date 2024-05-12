import * as THREE from 'three';

export function getTrain() {
    // Materials
    const materialRed = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
    const materialGreen = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    const materialBlue = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
    const materialGray = new THREE.MeshPhongMaterial( { color: 0x808080 } );

    // Create Train group
    const train = new THREE.Group();

    // Cylinder1 - main body
    const cylinder1Geometry = new THREE.CylinderGeometry( 10, 10, 30 );
    var cylinder1 = new THREE.Mesh( cylinder1Geometry, materialRed );
    cylinder1.rotation.x = Math.PI / 2;
    train.add(cylinder1);

    // Cylinder2 - main body rim
    const cylinder2Geometry = new THREE.CylinderGeometry( 13, 13, 5 );
    var cylinder2 = new THREE.Mesh( cylinder2Geometry, materialBlue );
    cylinder2.rotation.x = Math.PI / 2;
    cylinder2.position.z = -17.5;
    train.add(cylinder2);

    // Cylinder3 - chimney
    const cylinder3Geometry = new THREE.CylinderGeometry( 1.5, 1.5, 10 );
    var cylinder3 = new THREE.Mesh( cylinder3Geometry, materialGreen );
    cylinder3.position.z = -17.5;
    cylinder3.position.y = 15;
    train.add(cylinder3);

    // Wheel1 - wheel
    const wheel1Geometry = new THREE.CylinderGeometry( 4, 4, 2 );
    var wheel1 = new THREE.Mesh( wheel1Geometry, materialBlue );
    wheel1.rotation.z = Math.PI / 2;
    wheel1.position.x = 9;
    wheel1.position.y = -15;
    wheel1.position.z = 0;
    train.add(wheel1);

    // Wheel1 - wheel
    const wheel2Geometry = new THREE.CylinderGeometry( 4, 4, 2 );
    var wheel2 = new THREE.Mesh( wheel2Geometry, materialBlue );
    wheel2.rotation.z = Math.PI / 2;
    wheel2.position.x = -9;
    wheel2.position.y = -15;
    wheel2.position.z = 0;
    train.add(wheel2);

    // Wheel3 - wheel
    const wheel3Geometry = new THREE.CylinderGeometry( 4, 4, 2 );
    var wheel3 = new THREE.Mesh( wheel3Geometry, materialBlue );
    wheel3.rotation.z = Math.PI / 2;
    wheel3.position.x = 9;
    wheel3.position.y = -15;
    wheel3.position.z = 10;
    train.add(wheel3);

    // Wheel4 - wheel
    const wheel4Geometry = new THREE.CylinderGeometry( 4, 4, 2 );
    var wheel4 = new THREE.Mesh( wheel4Geometry, materialBlue );
    wheel4.rotation.z = Math.PI / 2;
    wheel4.position.x = -9;
    wheel4.position.y = -15;
    wheel4.position.z = 10;
    train.add(wheel4);

    // Wheel5 - wheel
    const wheel5Geometry = new THREE.CylinderGeometry( 4, 4, 2 );
    var wheel5 = new THREE.Mesh( wheel5Geometry, materialBlue );
    wheel5.rotation.z = Math.PI / 2;
    wheel5.position.x = 9;
    wheel5.position.y = -15;
    wheel5.position.z = 20;
    train.add(wheel5);

    // Wheel6 - wheel
    const wheel6Geometry = new THREE.CylinderGeometry( 4, 4, 2 );
    var wheel6 = new THREE.Mesh( wheel6Geometry, materialBlue );
    wheel6.rotation.z = Math.PI / 2;
    wheel6.position.x = -9;
    wheel6.position.y = -15;
    wheel6.position.z = 20;
    train.add(wheel6);

    // Box1 - base chassis flat
    const box1Geometry = new THREE.BoxGeometry( 26, 1, 34.5 );
    var box1 = new THREE.Mesh( box1Geometry, materialGreen );
    box1.position.z = -2.5;
    box1.position.y = -10;
    train.add(box1)

    // Box2 - base chassis box
    const box2Geometry = new THREE.BoxGeometry( 15, 5, 30 );
    var box2 = new THREE.Mesh( box2Geometry, materialGray );
    box2.position.z = 0;
    box2.position.y = -13;
    train.add(box2)

    // Box3 - cabin
    const box3Geometry = new THREE.BoxGeometry( 15, 35, 15 );
    var box3 = new THREE.Mesh( box3Geometry, materialBlue );
    box3.position.z = 20;
    box3.position.y = 7.5;
    train.add(box3)

    // Box4 - cabin bottom
    const box4Geometry = new THREE.BoxGeometry( 18, 10, 15 );
    var box4 = new THREE.Mesh( box4Geometry, materialGreen );
    box4.position.z = 22.5;
    box4.position.y = -10;
    train.add(box4)

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
