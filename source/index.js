"use strict"
import * as THREE from 'three';
import earthMap from './media/images/earth-map.jpg';
import earthMapBump from './media/images/earthbump.jpg';

let OrbitControls = require('three-orbit-controls')(THREE);

let canvas = document.getElementById('main-canvas');
let scene = new THREE.Scene();
let camera, renderer, light, controls, stats;

initScene();
addLights();
createEarth();
rendering();

function initScene() {
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
	renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas }); // antialias - сглаживаем ребра
	// camera.position.set(0, 615, 700);
	camera.position.set(0, -100, 10);
	camera.lookAt(10, 20, 30);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
	renderer.setSize(window.innerWidth - 5, window.innerHeight - 5);
	renderer.gammaInput = renderer.gammaOutput = true;
	renderer.toneMapping = THREE.LinearToneMapping;
	// renderer.toneMappingExposure = 1;
	renderer.setClearColor(0x000000);
}

function resize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.updateProjectionMatrix()
}

function addLights() {
	let light = new THREE.AmbientLight(0x404040, 2);
	scene.add(light);
}

function createEarth() {
	let geometry = new THREE.SphereGeometry(25, 132, 132),
		material = new THREE.MeshPhongMaterial({
		map: THREE.ImageUtils.loadTexture(earthMap),
		displacementMap: THREE.ImageUtils.loadTexture(earthMapBump),
		displacementScale: 1.5,
		// map: THREE.ImageUtils.loadTexture(image),
		// alphaMap: THREE.ImageUtils.loadTexture(imageBump),
		// transparent : true,
		// depthWrite  : false
		// displacementMap: THREE.ImageUtils.loadTexture(imageBump),
		// displacementScale: 10,
		// normalScale: 10
	});
	let sphere = new THREE.Mesh(geometry, material);
	scene.add(sphere);
}

controls = new OrbitControls(camera);

function rendering() {
	requestAnimationFrame(rendering);
	renderer.render(scene, camera);
};

window.addEventListener('resize', function(e) {
	resize();
});


