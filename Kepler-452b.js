import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true });  // Enable transparency
renderer.outputColorSpace = THREE.SRGBColorSpace;
const height=600;
renderer.setSize(window.innerWidth*0.75, window.innerHeight*0.75);
// Change the clear color to white or any other color you prefer
renderer.setClearColor(0xffffff, 0);  // The second parameter is the alpha value (0 for transparent)
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = null;  // Remove the scene background color

// Move the camera closer to the moon
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(6, 3, 8);  // Bring the camera closer to the moon

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;  // Allow the camera to get very close to the moon
controls.maxDistance = 4;
controls.minPolarAngle = 0;  // Allow the camera to rotate freely around
controls.maxPolarAngle = Math.PI;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// Lights
const spotLight = new THREE.SpotLight(0xffffff, 1, 100, 0.22, 1);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

// Add ambient light for overall visibility
const ambientLight = new THREE.AmbientLight(0x404040, 2);  // Global light
scene.add(ambientLight);

// Add directional lights to illuminate from multiple angles
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(10, 10, 0);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(-10, 10, 0);
scene.add(directionalLight2);

// Load the Moon model
let moonMesh;  // Global variable to store the moon mesh
const clock = new THREE.Clock();  // Create a clock to track elapsed time

const loader = new GLTFLoader().setPath('temp/kepler_-_452b_planet/');
loader.load('scene.gltf', (gltf) => {
  console.log('loading model');
  moonMesh = gltf.scene;  // Store the mesh in the global variable

  moonMesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Place the moon in front of the camera
  moonMesh.position.set(0, 0, -2);  // Center it in front of the camera
  moonMesh.scale.set(0.5, 0.5, 0.5);  // Keep the moon size large
  scene.add(moonMesh);
  controls.target.copy(moonMesh.position);
  controls.update(); 

  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});

// Resize event handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate the scene
function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();  // Get elapsed time

  // Rotate the moonMesh on the Y-axis based on elapsed time
  if (moonMesh) {
    moonMesh.rotation.y = elapsedTime * 0.5;  // Adjust speed with multiplier (0.5)
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
