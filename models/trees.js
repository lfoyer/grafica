import * as THREE from 'three';

export function getTrees(amount) {
    function getRandomPositionInDisc(center, radius) {
        // Generate a random angle
        var theta = Math.random() * Math.PI * 2;

        // Generate a random radius within the given disc
        var randomRadius = Math.sqrt(Math.random()) * radius;

        // Calculate the coordinates
        var x = center.x + randomRadius * Math.cos(theta);
        var z = center.z + randomRadius * Math.sin(theta);
        var y = center.y;

        return new THREE.Vector3(x, y, z);
    }

    // Textures
    const leafTexture = new THREE.TextureLoader().load('../textures/Hedge_001_BaseColor.jpg');
    const barkTexture = new THREE.TextureLoader().load('../textures/Bark_007_BaseColor.jpg');

    // Set texture wrapping mode
    leafTexture.wrapS = THREE.RepeatWrapping;
    leafTexture.wrapT = THREE.RepeatWrapping;
    leafTexture.repeat.set( 1, 1 );
    barkTexture.wrapS = THREE.RepeatWrapping;
    barkTexture.wrapT = THREE.RepeatWrapping;
    barkTexture.repeat.set( 1, 5 );

    function getTree() {
        // Materials
        const materialGreen = new THREE.MeshPhongMaterial( {
            map: leafTexture,
            color: 0x00aa00,
            ambient: 0x333333, // Ambient reflectance
            specular: 0x555555, // Specular reflectance
            shininess: 5, // Shininess (specular highlight size)
        } );
        const materialBrown = new THREE.MeshPhongMaterial( {
            map: barkTexture,
            color: 0x8b4513
        } );

        // Group
        var tree = new THREE.Group();

        // Cylinder1 - main body
        const cylinder1Geometry = new THREE.CylinderGeometry( 1, 1, 30 );
        var cylinder1 = new THREE.Mesh( cylinder1Geometry, materialBrown );
        cylinder1.position.y = 15;
        cylinder1.rotation.set(Math.random()/10, Math.random()/10, Math.random()/10);
        tree.add(cylinder1);

        var center, radius, randomPosition;

        // Sphere1
        center = new THREE.Vector3(0, 23, 0); // Center point
        radius = 5; // Radius of the disc
        randomPosition = getRandomPositionInDisc(center, radius);
        const sphere1Geometry = new THREE.SphereGeometry( 8 );
        var sphere1 = new THREE.Mesh( sphere1Geometry, materialGreen );
        sphere1.position.set(randomPosition.x, randomPosition.y, randomPosition.z)
        tree.add(sphere1);

        // Sphere2
        center = new THREE.Vector3(0, 25, 0); // Center point
        radius = 5; // Radius of the disc
        randomPosition = getRandomPositionInDisc(center, radius);
        const sphere2Geometry = new THREE.SphereGeometry( 8 );
        var sphere2 = new THREE.Mesh( sphere2Geometry, materialGreen );
        sphere2.position.set(randomPosition.x, randomPosition.y, randomPosition.z)
        tree.add(sphere2);

        // Sphere3
        center = new THREE.Vector3(0, 20, 0); // Center point
        radius = 5; // Radius of the disc
        randomPosition = getRandomPositionInDisc(center, radius);
        const sphere3Geometry = new THREE.SphereGeometry( 8 );
        var sphere3 = new THREE.Mesh( sphere3Geometry, materialGreen );
        sphere3.position.set(randomPosition.x, randomPosition.y, randomPosition.z)
        tree.add(sphere3);
        
        return tree
    }

    // Group
    var trees = new THREE.Group();

    for (var i = 0; i < amount; i++) {
        var tree = getTree();
        var random = Math.random()*(1-0.5)+0.5;
        tree.scale.set(random, random, random);
        tree.position.x = (Math.random()-0.5) * 40;
        tree.position.z = (Math.random()-0.5) * 40;
        trees.add(tree);
    }
    return trees;
}

