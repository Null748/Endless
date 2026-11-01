import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
import { createMall } from "./world.js";

// ------------------------------------------
// SCENE
// ------------------------------------------

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9da6ad);
scene.fog = new THREE.Fog(0x9da6ad, 35, 105);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    180
);

camera.position.set(0, 1.7, 35);

// ------------------------------------------
// RENDERER
// ------------------------------------------

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

renderer.outputColorSpace = THREE.SRGBColorSpace;

document.body.appendChild(renderer.domElement);

// ------------------------------------------
// BUILD THE MALL
// ------------------------------------------

createMall(scene);

// ------------------------------------------
// PLAYER CONTROLS
// ------------------------------------------

const keys = {};

let yaw = 0;
let pitch = 0;
let locked = false;
let paused = false;

const playerHeight = 1.7;
const walkSpeed = 5;
const sprintSpeed = 8;

function updateCameraRotation() {
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
}

function requestLock() {
    if (document.pointerLockElement === renderer.domElement) {
        return;
    }

    if (renderer.domElement.requestPointerLock) {
        renderer.domElement.requestPointerLock();
    }
}

document.addEventListener("pointerlockchange", () => {
    locked = document.pointerLockElement === renderer.domElement;

    if (locked) {
        overlay.style.display = "none";
        paused = false;
    } else {
        overlay.style.display = "flex";
    }
});

document.addEventListener("pointerlockerror", () => {
    console.warn("Pointer lock could not be activated in this browser.");
});

document.addEventListener("mousemove", (event) => {
    if (!locked) return;

    const sensitivity = 0.002;

    yaw -= event.movementX * sensitivity;
    pitch -= event.movementY * sensitivity;

    pitch = Math.max(-1.5, Math.min(1.5, pitch));

    updateCameraRotation();
});

document.addEventListener("keydown", (event) => {
    keys[event.code] = true;

    if (event.code === "Escape" && locked) {
        document.exitPointerLock();
    }
});

document.addEventListener("keyup", (event) => {
    keys[event.code] = false;
});

window.addEventListener("blur", () => {
    for (const key in keys) {
        keys[key] = false;
    }
});

// ------------------------------------------
// START / PAUSE OVERLAY
// ------------------------------------------

const overlay = document.createElement("div");
overlay.id = "start-overlay";

overlay.innerHTML = `
    <div class="start-content">
        <h1>ENDLESS</h1>
        <p>CLICK TO EXPLORE</p>
        <span>WASD TO MOVE · MOUSE TO LOOK · SHIFT TO SPRINT · ESC TO PAUSE</span>
    </div>
`;

document.body.appendChild(overlay);

overlay.addEventListener("click", () => {
    requestLock();
});

// ------------------------------------------
// MOVEMENT
// ------------------------------------------

const clock = new THREE.Clock();

function movePlayer(delta) {
    if (!locked) return;

    let forward = 0;
    let sideways = 0;

    if (keys["KeyW"]) forward += 1;
    if (keys["KeyS"]) forward -= 1;
    if (keys["KeyD"]) sideways += 1;
    if (keys["KeyA"]) sideways -= 1;

    const inputLength = Math.sqrt(
        forward * forward + sideways * sideways
    );

    if (inputLength === 0) return;

    forward /= inputLength;
    sideways /= inputLength;

    const speed = keys["ShiftLeft"] || keys["ShiftRight"]
        ? sprintSpeed
        : walkSpeed;

    const direction = new THREE.Vector3(
        -Math.sin(yaw),
        0,
        -Math.cos(yaw)
    );

    const right = new THREE.Vector3(
        Math.cos(yaw),
        0,
        -Math.sin(yaw)
    );

    const movement = new THREE.Vector3();

    movement.addScaledVector(direction, forward);
    movement.addScaledVector(right, sideways);

    camera.position.addScaledVector(
        movement,
        speed * delta
    );

    // Keep the player inside the mall
    camera.position.x = THREE.MathUtils.clamp(
        camera.position.x,
        -21,
        21
    );

    camera.position.z = THREE.MathUtils.clamp(
        camera.position.z,
        -43,
        43
    );

    camera.position.y = playerHeight;
}

// ------------------------------------------
// ANIMATION LOOP
// ------------------------------------------

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    movePlayer(delta);

    renderer.render(scene, camera);
}

animate();

// ------------------------------------------
// RESIZE
// ------------------------------------------

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});
