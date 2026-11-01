import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

export function createMall(scene) {
    const materials = {};

    function material(name, color, roughness = 0.7, metalness = 0) {
        materials[name] = new THREE.MeshStandardMaterial({
            color,
            roughness,
            metalness
        });
        return materials[name];
    }

    const marble = material("marble", 0xaaa9a5, 0.24);
    const darkMarble = material("darkMarble", 0x55575a, 0.3);
    const wall = material("wall", 0xd2d0c9);
    const ceiling = material("ceiling", 0xbab9b4);
    const concrete = material("concrete", 0x858581);
    const metal = material("metal", 0x555b60, 0.3, 0.8);
    const darkMetal = material("darkMetal", 0x252a2e, 0.35, 0.7);
    const glass = new THREE.MeshPhysicalMaterial({
        color: 0xc9e0e5,
        roughness: 0.08,
        metalness: 0.1,
        transparent: true,
        opacity: 0.25,
        transmission: 0.25
    });
    const blackGlass = material("blackGlass", 0x15191d, 0.16, 0.4);
    const wood = material("wood", 0x725c49);
    const plantGreen = material("plantGreen", 0x345b40);
    const white = material("white", 0xf0eee8);
    const gold = material("gold", 0xb49a69, 0.3, 0.6);


// VIBRANT COLOR PALETTE

const neonPink = new THREE.MeshStandardMaterial({
    color: 0xff36a6,
    emissive: 0xff087f,
    emissiveIntensity: 2
});

const neonBlue = new THREE.MeshStandardMaterial({
    color: 0x26bfff,
    emissive: 0x008cff,
    emissiveIntensity: 2
});

const neonPurple = new THREE.MeshStandardMaterial({
    color: 0xa855ff,
    emissive: 0x7315ff,
    emissiveIntensity: 2
});

const neonGreen = new THREE.MeshStandardMaterial({
    color: 0x54ff9b,
    emissive: 0x00bb58,
    emissiveIntensity: 1.5
});

const neonOrange = new THREE.MeshStandardMaterial({
    color: 0xffa43a,
    emissive: 0xff6500,
    emissiveIntensity: 1.5
});

const neonYellow = new THREE.MeshStandardMaterial({
    color: 0xffed69,
    emissive: 0xffc400,
    emissiveIntensity: 1.5
});

const colorPalette = [
    0xff4f9a,
    0x35c9ff,
    0xb36bff,
    0x55e6a5,
    0xffa34f,
    0xffe16b
];

    function box(parent, x, y, z, w, h, d, mat, cast = true) {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            mat
        );

        mesh.position.set(x, y, z);
        mesh.castShadow = cast;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
    }

    function cylinderBetween(parent, start, end, radius, mat, sides = 10) {
        const a = new THREE.Vector3(...start);
        const b = new THREE.Vector3(...end);
        const direction = new THREE.Vector3().subVectors(b, a);
        const length = direction.length();

        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(radius, radius, length, sides),
            mat
        );

        mesh.position.copy(a).add(b).multiplyScalar(0.5);
        mesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
        );

        mesh.castShadow = true;
        parent.add(mesh);
        return mesh;
    }

    function light(x, y, z, color, intensity, distance, parent = scene) {
        const lamp = new THREE.PointLight(color, intensity, distance, 2);
        lamp.position.set(x, y, z);
        parent.add(lamp);
        return lamp;
    }

    function floorTile(x, z, w, d, mat) {
        box(scene, x, -0.09, z, w, 0.18, d, mat, false);
    }

    // --------------------------------------------------
    // MAIN MALL STRUCTURE
    // --------------------------------------------------

    // Main ground floor
    box(scene, 0, -0.25, 0, 46, 0.5, 90, marble, false);

    // Dark decorative floor borders
    box(scene, 0, -0.145, 0, 1.2, 0.025, 90, darkMarble, false);
    box(scene, -11.5, -0.145, 0, 0.15, 0.025, 90, darkMarble, false);
    box(scene, 11.5, -0.145, 0, 0.15, 0.025, 90, darkMarble, false);

    // Floor pattern
    for (let z = -42; z <= 42; z += 6) {
        box(scene, 0, 0.008, z, 22, 0.018, 0.035, darkMarble, false);
    }

    for (let x = -21; x <= 21; x += 6) {
        box(scene, x, 0.008, 0, 0.035, 0.018, 84, darkMarble, false);
    }

    // Outer walls
    box(scene, -23, 5, 0, 1, 10, 90, wall);
    box(scene, 23, 5, 0, 1, 10, 90, wall);
    box(scene, 0, 5, -45, 46, 10, 1, wall);
    box(scene, 0, 5, 45, 46, 10, 1, wall);

    // Back wall detail
    box(scene, 0, 8, -44.35, 18, 3, 0.12, white);
    box(scene, 0, 6.3, -44.2, 12, 0.12, 0.12, gold);

    // --------------------------------------------------
    // SECOND FLOOR AND ATRIUM
    // --------------------------------------------------

    // Upper floor wings, leaving the middle open
    box(scene, -17, 6.35, 0, 12, 0.7, 88, marble);
    box(scene, 17, 6.35, 0, 12, 0.7, 88, marble);

    // Upper floor front and rear connecting sections
    box(scene, 0, 6.35, 40, 22, 0.7, 8, marble);
    box(scene, 0, 6.35, -40, 22, 0.7, 8, marble);

    // Balcony trim
    box(scene, -11.05, 6.72, 0, 0.18, 0.18, 80, gold);
    box(scene, 11.05, 6.72, 0, 0.18, 0.18, 80, gold);

    // Glass balcony railings
    for (const side of [-1, 1]) {
        const x = side * 11.5;

        for (let z = -39; z <= 39; z += 4) {
            box(scene, x, 7.45, z, 0.08, 1.45, 3.9, glass, false);
            box(scene, x, 8.2, z, 0.16, 0.12, 4, metal);
        }

        for (let z = -40; z <= 40; z += 4) {
            box(scene, x, 7.4, z, 0.12, 1.55, 0.12, metal);
        }
    }

    // Upper-level ceiling edge
    box(scene, 0, 12.2, 0, 46, 0.5, 90, ceiling, false);

    // --------------------------------------------------
    // STORE CONSTRUCTION
    // --------------------------------------------------

    const storeNames = [
        "ATELIER",
        "NORTH",
        "MONO",
        "STUDIO",
        "FORM",
        "EVERYDAY",
        "OBJECTS",
        "THE EDIT"
    ];

    function createStore(side, z, name, upper = false, index = 0) {
        const group = new THREE.Group();
        scene.add(group);

        const floorY = upper ? 6.75 : 0.05;
        const centerX = side * 17.2;
        const frontX = side * 11.4;
        const backX = side * 22.35;
        const height = 4.5;

        // Store interior floor
        box(
            group,
            centerX,
            floorY,
            z,
            11.3,
            0.12,
            7.4,
            index % 2 === 0 ? darkMarble : wood,
            false
        );

        // Interior rear wall
        box(
            group,
            backX,
            floorY + height / 2,
            z,
            0.35,
            height,
            7.5,
            index % 2 === 0 ? wall : concrete
        );

        // Side walls
        box(group, centerX, floorY + height / 2, z - 3.7, 11.3, height, 0.2, wall);
        box(group, centerX, floorY + height / 2, z + 3.7, 11.3, height, 0.2, wall);

        // Storefront frame
        box(group, frontX, floorY + height - 0.1, z, 0.16, 0.2, 7.5, darkMetal);
        box(group, frontX, floorY + 1.1, z - 3.65, 0.16, 2.2, 0.14, metal);
        box(group, frontX, floorY + 1.1, z + 3.65, 0.16, 2.2, 0.14, metal);

        // Glass display windows
        box(group, frontX, floorY + 1.65, z - 1.5, 0.08, 3.1, 2.7, glass, false);
        box(group, frontX, floorY + 1.65, z + 1.5, 0.08, 3.1, 2.7, glass, false);

        // Door in the middle
        box(group, frontX - side * 0.04, floorY + 1.55, z, 0.1, 3.0, 1.1, blackGlass, false);
        box(group, frontX - side * 0.12, floorY + 1.5, z - 0.42, 0.08, 0.22, 0.05, gold);

        // Signboard
        box(group, frontX - side * 0.18, floorY + 4.05, z, 0.3, 0.65, 5.7, blackGlass);

        // Store sign letters
        // STORE SIGN LETTERS

const signColors = [
    "#ff65b5",
    "#43cfff",
    "#bd86ff",
    "#65e9a6",
    "#ffad58",
    "#ffe477"
];

const signColor = signColors[index % signColors.length];

const canvas = document.createElement("canvas");
canvas.width = 512;
canvas.height = 128;

const ctx = canvas.getContext("2d");

ctx.clearRect(0, 0, 512, 128);

ctx.shadowColor = signColor;
ctx.shadowBlur = 25;

ctx.fillStyle = signColor;
ctx.font = "bold 48px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText(name, 256, 65);

const texture = new THREE.CanvasTexture(canvas);

const signMat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    toneMapped: false
});

const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(5.1, 1.25),
    signMat
);

sign.position.set(
    frontX - side * 0.36,
    floorY + 4.05,
    z
);

sign.rotation.y = side === 1 ? -Math.PI / 2 : Math.PI / 2;

group.add(sign);

        // Interior ceiling
        box(group, centerX, floorY + 4.4, z, 11, 0.15, 7.2, white);

        // Display tables
        for (let i = 0; i < 3; i++) {
            const tableZ = z - 2.2 + i * 2.2;

            box(group, centerX - side * 1.4, floorY + 0.65, tableZ, 2.2, 0.12, 1.2, wood);
            box(group, centerX - side * 1.4, floorY + 0.32, tableZ, 0.12, 0.65, 0.12, metal);
        }

        // Shelving against rear wall
        for (let i = 0; i < 3; i++) {
            box(
                group,
                backX - side * 0.45,
                floorY + 1.4 + i * 0.8,
                z - 2.3,
                0.5,
                0.08,
                4.2,
                wood
            );
        }

        // Warm shop lighting
        light(centerX, floorY + 3.9, z, 0xffe7c5, 1.7, 12, group);

        return group;
    }

    // Ground floor shops
    for (let i = 0; i < 8; i++) {
        const z = -32 + i * 9;
        createStore(-1, z, storeNames[i], false, i);
        createStore(1, z, storeNames[(i + 3) % storeNames.length], false, i + 1);
    }

    // Upper floor shops
    for (let i = 0; i < 8; i++) {
        const z = -32 + i * 9;
        createStore(-1, z, storeNames[(i + 2) % storeNames.length], true, i);
        createStore(1, z, storeNames[(i + 5) % storeNames.length], true, i + 2);
    }

    // --------------------------------------------------
    // ESCALATORS
    // --------------------------------------------------

    function createEscalator(x, z, direction = 1) {
        const group = new THREE.Group();
        scene.add(group);

        const bottomY = 0.15;
        const topY = 6.65;
        const length = 13;
        const steps = 28;

        // Main sloping body
        const body = box(
            group,
            x,
            (bottomY + topY) / 2,
            z,
            3.2,
            0.5,
            length,
            darkMetal
        );

        body.rotation.x = direction * -0.46;

        // Individual steps
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            const step = box(
                group,
                x,
                bottomY + t * (topY - bottomY),
                z + direction * (length / 2 - t * length),
                2.65,
                0.12,
                0.42,
                metal
            );

            step.rotation.x = direction * -0.46;
        }

        // Side panels and handrails
        for (const side of [-1, 1]) {
            const railX = x + side * 1.65;

            box(
                group,
                railX,
                (bottomY + topY) / 2 + 0.65,
                z,
                0.16,
                1.2,
                length,
                blackGlass
            ).rotation.x = direction * -0.46;

            cylinderBetween(
                group,
                [railX, bottomY + 1.25, z + direction * length / 2],
                [railX, topY + 1.25, z - direction * length / 2],
                0.11,
                darkMetal
            );

            cylinderBetween(
                group,
                [railX, bottomY + 1.31, z + direction * length / 2],
                [railX, topY + 1.31, z - direction * length / 2],
                0.045,
                metal
            );
        }

        return group;
    }

    createEscalator(-5.5, 0, 1);
    createEscalator(5.5, 0, -1);

    // --------------------------------------------------
    // PILLARS
    // --------------------------------------------------

    for (const x of [-10.2, 10.2]) {
        for (let z = -38; z <= 38; z += 12) {
            box(scene, x, 5.2, z, 0.85, 10.4, 0.85, concrete);
            box(scene, x, 0.25, z, 1.3, 0.5, 1.3, darkMarble);
            box(scene, x, 10.35, z, 1.2, 0.3, 1.2, white);
        }
    }

    // --------------------------------------------------
    // CEILING AND SKYLIGHTS
    // --------------------------------------------------

    // Main ceiling beams
    for (let z = -40; z <= 40; z += 10) {
        box(scene, 0, 11.75, z, 46, 0.35, 0.5, metal);
    }

    for (let x = -20; x <= 20; x += 5) {
        box(scene, x, 11.75, 0, 0.35, 0.35, 86, metal);
    }

    // Skylight sections
    for (let z = -30; z <= 30; z += 15) {
        box(scene, 0, 12.0, z, 17, 0.08, 11, glass, false);
        box(scene, 0, 12.12, z - 5.5, 17, 0.12, 0.15, metal);
        box(scene, 0, 12.12, z + 5.5, 17, 0.12, 0.15, metal);
    }

    // --------------------------------------------------
    // LIGHTING
    // --------------------------------------------------

    // Overall mall lighting
    const ambient = new THREE.HemisphereLight(0xe3e9ef, 0x77716a, 1.5);
    scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(0xffead1, 2.1);
    mainLight.position.set(-12, 18, 12);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.set(2048, 2048);
    mainLight.shadow.camera.left = -35;
    mainLight.shadow.camera.right = 35;
    mainLight.shadow.camera.top = 35;
    mainLight.shadow.camera.bottom = -35;
    scene.add(mainLight);

    // Ceiling light fixtures
    for (let z = -36; z <= 36; z += 12) {
        for (const x of [-7, 7]) {
            box(scene, x, 9.8, z, 2.2, 0.08, 0.35, white, false);
            light(x, 9.3, z, 0xffe7c5, 1.5, 15);
        }
    }

    // Upper-level corridor lights
    for (let z = -35; z <= 35; z += 14) {
        for (const side of [-1, 1]) {
            const x = side * 17;
            box(scene, x, 9.4, z, 1.8, 0.08, 0.3, white, false);
            light(x, 8.8, z, 0xffe6c6, 1.1, 10);
        }
    }

    // --------------------------------------------------
    // BENCHES
    // --------------------------------------------------

    function createBench(x, z, rotation = 0) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        scene.add(group);

        box(group, 0, 0.55, 0, 3, 0.18, 0.85, wood);
        box(group, 0, 1.1, -0.35, 3, 1.1, 0.16, wood);

        for (const xPos of [-1.2, 1.2]) {
            box(group, xPos, 0.25, 0, 0.12, 0.5, 0.12, metal);
        }
    }

    createBench(-7.5, 17, 0);
    createBench(7.5, 17, Math.PI);
    createBench(-7.5, -18, 0);
    createBench(7.5, -18, Math.PI);

    // --------------------------------------------------
    // PLANTERS
    // --------------------------------------------------

    function createPlanter(x, z) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        scene.add(group);

        box(group, 0, 0.35, 0, 2.5, 0.7, 2.5, concrete);
        box(group, 0, 0.72, 0, 2.25, 0.08, 2.25, darkMarble);

        // Main plant stem
        cylinderBetween(group, [0, 0.75, 0], [0, 2.4, 0], 0.09, wood);

        // Leaves
        for (let i = 0; i < 10; i++) {
            const angle = i * Math.PI * 2 / 10;
            const endX = Math.cos(angle) * 1.1;
            const endZ = Math.sin(angle) * 1.1;

            cylinderBetween(
                group,
                [0, 1.1 + (i % 3) * 0.25, 0],
                [endX, 2.0 + (i % 3) * 0.2, endZ],
                0.12,
                plantGreen,
                6
            );
        }

        const leaves = new THREE.Mesh(
            new THREE.SphereGeometry(0.85, 8, 6),
            plantGreen
        );

        leaves.position.y = 2.2;
        leaves.scale.set(1.2, 0.7, 1.2);
        group.add(leaves);
    }

    createPlanter(-7.5, 30);
    createPlanter(7.5, 30);
    createPlanter(-7.5, -30);
    createPlanter(7.5, -30);

    // --------------------------------------------------
    // EXTRA ARCHITECTURAL DETAILS
    // --------------------------------------------------

    // Decorative wall panels
    for (const side of [-1, 1]) {
        for (let z = -36; z <= 36; z += 12) {
            box(
                scene,
                side * 22.35,
                5,
                z,
                0.08,
                6,
                7,
                concrete,
                false
            );
        }
    }

    // Ground-floor entrance feature
    box(scene, 0, 4.8, 43.8, 12, 0.25, 0.2, darkMetal);
    box(scene, 0, 2.5, 43.8, 8, 4.5, 0.12, glass, false);

    // A few subtle floor inlays
    for (let z = -35; z <= 35; z += 14) {
        box(scene, 0, 0.02, z, 7, 0.025, 0.12, gold, false);
    }

    return {
        bounds: {
            minX: -21,
            maxX: 21,
            minZ: -43,
            maxZ: 43
        }
    };
}
