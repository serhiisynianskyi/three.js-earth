"use strict"
import * as THREE from 'three';
import earthMap from './media/images/earth-map.jpg';
import earthMapBump from './media/images/earthbump.jpg';
import vertexShader from './vertex-shader.js'
import fragmentShader from './fragment-shader.js'

let OrbitControls = require('three-orbit-controls')(THREE);

let canvas = document.getElementById('main-canvas'),
	scene = new THREE.Scene(),
	camera, renderer, light, controls, stats,
	time = 0,
	R = 26,
	planes = [],
	group = new THREE.Group();
scene.add(group);

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

let points = [{
		title: 'Bali',
		lat: -8.409518,
		long: 115.188919
	},
	{
		title: 'Yevpatoriya',
		lat: 45.20091,
		long: 33.36655
	},
	{
		title: 'Kyiv',
		lat: 50.431782,
		long: 30.516382
	},
	{
		title: 'New York',
		lat: 40.730610,
		long: -73.968285
	},
	{
		title: 'Managua',
		lat: 12.136389,
		long: -86.251389
	},
	{
		title: 'Sydney',
		lat: -33.865143,
		long: 151.215256
	},
	{
		title: 'Berlin',
		lat: 52.520645,
		long: 13.409779
	},
	{
		title: 'Lisboa',
		lat: 38.736946,
		long: -9.142685
	}
];

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
	time++;
	// group.rotation.x = time/100;
	planes.forEach(e => {
		let conj = new THREE.Quaternion();
		conj.copy(group.quaternion);
		conj.conjugate();

		e.quaternion.multiplyQuaternions(
			conj,
			camera.quaternion
		);

		// e.quaternion.copy(camera.quaternion);
	});
	requestAnimationFrame(rendering);
	renderer.render(scene, camera);
};

window.addEventListener('resize', function(e) {
	resize();
});

points.forEach(p => {
	let pos = calcPosFromLatLonRad(p.lat, p.long, R);
	let geometry = new THREE.PlaneGeometry(1, 1);
	let material = new THREE.MeshBasicMaterial({
		color: 0x00ff00,
		side: THREE.DoubleSide,

		// wireframe: true
	});
	let material1 = new THREE.RawShaderMaterial({
		uniforms: {
			time: { value: 0 },
			hover: { value: 1 }
		},
		transparent: true,
		vertexShader: vertexShader(),
		fragmentShader: fragmentShader()
	});
	let plane = new THREE.Mesh(geometry, material1);
	plane.position.x = pos[0];
	plane.position.y = pos[1];
	plane.position.z = pos[2];
	group.add(plane);
	planes.push(plane);
});


function calcPosFromLatLonRad(lat, lon, radius) {

	var phi = (90 - lat) * (Math.PI / 180);
	var theta = (lon + 180) * (Math.PI / 180);

	let x = -((radius) * Math.sin(phi) * Math.cos(theta));
	let z = ((radius) * Math.sin(phi) * Math.sin(theta));
	let y = ((radius) * Math.cos(phi));
	// console.log([x, y, z]);
	return [x, y, z];
}