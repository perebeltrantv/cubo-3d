import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/controls/OrbitControls.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);

// Crear materiales con imágenes famosas
const textures = [
  'https://uploads5.wikiart.org/images/vincent-van-gogh/starry-night.jpg',
  'https://uploads8.wikiart.org/images/leonardo-da-vinci/mona-lisa.jpg',
  'https://uploads4.wikiart.org/images/edvard-munch/the-scream.jpg',
  'https://uploads7.wikiart.org/images/pablo-picasso/guernica.jpg',
  'https://uploads0.wikiart.org/images/claude-monet/water-lilies.jpg',
  'https://uploads0.wikiart.org/images/johannes-vermeer/girl-with-a-pearl-earring.jpg'
];

const materials = textures.map(url => {
  const tex = new THREE.TextureLoader().load(url);
  return new THREE.MeshBasicMaterial({ map: tex });
});

// Cubos pequeños
const cubeSize = 1;
const smallCubes = [];
const positions = [
  [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5],
  [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5],
  [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5],
  [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5],
];

positions.forEach((pos, i) => {
  const geo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  // Usamos material individual para cada cubo pequeño (por simplicidad, un material por cubo)
  const mesh = new THREE.Mesh(geo, materials[i % materials.length]);
  mesh.position.set(...pos);
  smallCubes.push(mesh);
  scene.add(mesh);
});

// Agrupar cubos pequeños
const bigCube = new THREE.Group();
smallCubes.forEach(c => bigCube.add(c));
scene.add(bigCube);

camera.position.z = 5;

let expanded = false;

document.getElementById('toggleBtn').addEventListener('click', () => {
  expanded = !expanded;
  if (expanded) {
    // Expandir a una pared 4x2
    smallCubes.forEach((c, i) => {
      c.position.set((i % 4) - 1.5, -Math.floor(i / 4) + 0.5, 0);
    });
  } else {
    // Volver al cubo 2x2x2
    positions.forEach((pos, i) => {
      smallCubes[i].position.set(...pos);
    });
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animación de rotación para cada cubo pequeño
function animate() {
  requestAnimationFrame(animate);

  // Hacer rotar cada cubo pequeño independientemente
  smallCubes.forEach(cube => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  });

  renderer.render(scene, camera);
}

animate();
