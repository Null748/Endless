import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9da3a8);
scene.fog = new THREE.Fog(0x9da3a8, 15, 100);

// CAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 1.7, 8);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// LIGHTING
scene.add(new THREE.AmbientLight(0xffffff, 1.2));

const sunlight = new THREE.DirectionalLight(0xffffff, 2);
sunlight.position.set(10, 20, 10);
scene.add(sunlight);

// FLOOR
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
        color: 0x777777,
        roughness: 0.8
    })
);

floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// TEST CUBE
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0xcccccc })
);

cube.position.set(0, 1, 0);
cube.castShadow = true;
scene.add(cube);

// PLAYER CONTROLS
const keys = {};

let yaw = 0;
let pitch = 0;
let locked = false;

const playerSpeed = 5;

const overlay = document.createElement('div');
overlay.id = 'start-overlay';
overlay.innerHTML = `
    <div class="start-content">
        <h1>ENDLESS</h1>
        <p>CLICK TO EXPLORE</p>
        <span>WASD TO MOVE · MOUSE TO LOOK · ESC TO PAUSE</span>
    </div>
`;

document.body.appendChild(overlay);

overlay.addEventListener('click', () => {
    renderer.domElement.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
    locked = document.pointerLockElement === renderer.domElement;
    overlay.style.display = locked ? 'none' : 'flex';
});

document.addEventListener('mousemove', (event) => {
    if (!locked) return;

    const sensitivity = 0.002;

    yaw -= event.movementX * sensitivity;
    pitch -= event.movementY * sensitivity;

    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
});

document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

// MOVEMENT
const clock = new THREE.Clock();

function updatePlayer(delta) {
    if (!locked) return;

    const direction = new THREE.Vector3();

    const forward = new THREE.Vector3(
        -Math.sin(yaw),
        0,
        -Math.cos(yaw)
    );

    const right = new THREE.Vector3(
        Math.cos(yaw),
        0,
        -Math.sin(yaw)
    );

    if (keys['KeyW']) direction.add(forward);
    if (keys['KeyS']) direction.sub(forward);
    if (keys['KeyD']) direction.add(right);
    if (keys['KeyA']) direction.sub(right);

    if (direction.lengthSq() > 0) {
        direction.normalize();

        const speed = keys['ShiftLeft'] ? 8 : playerSpeed;

        camera.position.addScaledVector(
            direction,
            speed * delta
        );
    }
}

// ANIMATION
function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    updatePlayer(delta);

    renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
