// Fuzzy-Train: Driving Training Game
// Three.js + Cannon.js Physics Engine

let scene, camera, renderer;
let world;
let car, carBody;
let ground, groundBody;
let gameActive = false;
let currentScenario = '';
let score = 0;
let gameTime = 0;
let mistakes = 0;

const keys = {};
const carProperties = {
    mass: 1000,
    width: 1.6,
    height: 2,
    depth: 4,
    maxSpeed: 50,
    acceleration: 0.3,
    friction: 0.5,
    turnSpeed: 3
};

let carState = {
    speed: 0,
    angle: 0,
    acceleration: 0,
    steering: 0,
    isBraking: false
};

const scenarios = {
    basic: {
        name: 'Basic Controls',
        instructions: 'Learn basic driving controls. Drive forward, turn, and brake.',
        duration: 60,
        objectives: ['Reach 30 km/h', 'Make a 90° turn', 'Come to complete stop']
    },
    parking: {
        name: 'Parking Training',
        instructions: 'Practice parallel parking. Park your car within the marked area.',
        duration: 120,
        objectives: ['Position car correctly', 'Don\'t hit boundaries', 'Park smoothly']
    },
    lane: {
        name: 'Lane Changes',
        instructions: 'Practice changing lanes safely. Avoid other vehicles.',
        duration: 90,
        objectives: ['Change lanes 3 times', 'Avoid collisions', 'Signal properly']
    },
    obstacle: {
        name: 'Obstacle Course',
        instructions: 'Navigate through obstacles without hitting them.',
        duration: 120,
        objectives: ['Complete the course', 'Avoid all obstacles', 'Minimize time']
    },
    emergency: {
        name: 'Emergency Stop',
        instructions: 'Practice emergency braking. React quickly when obstacles appear.',
        duration: 90,
        objectives: ['Stop in time', 'Maintain control', 'React quickly']
    },
    traffic: {
        name: 'Traffic Navigation',
        instructions: 'Navigate through traffic safely. Follow traffic rules.',
        duration: 150,
        objectives: ['Avoid collisions', 'Follow traffic lights', 'Stay in lanes']
    }
};

function initGame(scenario) {
    currentScenario = scenario;
    score = 0;
    mistakes = 0;
    gameTime = 0;

    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';

    document.getElementById('scenario').textContent = scenarios[scenario].name;
    document.getElementById('instructions').textContent = scenarios[scenario].instructions;

    initScene();
    initPhysics();
    initGameObjects();
    setupControls();

    gameActive = true;
    gameLoop();
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 500, 1000);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, -15);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('gameCanvas') });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    window.addEventListener('resize', onWindowResize);
}

function initPhysics() {
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.defaultContactMaterial.friction = 0.3;
}

function initGameObjects() {
    createGround();
    createCar();
    createScenarioObjects();
}

function createGround() {
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const groundShape = new CANNON.Plane();
    groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(groundBody);

    addRoadMarkings();
}

function addRoadMarkings() {
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const linePoints = [];
    for (let i = -200; i <= 200; i += 10) {
        linePoints.push(new THREE.Vector3(-50, 0.01, i));
        linePoints.push(new THREE.Vector3(-50, 0.01, i + 5));
    }
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
}

function createCar() {
    const carGroup = new THREE.Group();

    const bodyGeometry = new THREE.BoxGeometry(carProperties.width, carProperties.height / 2, carProperties.depth);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.castShadow = true;
    carGroup.add(bodyMesh);

    const roofGeometry = new THREE.BoxGeometry(carProperties.width * 0.7, carProperties.height / 3, carProperties.depth * 0.6);
    const roofMaterial = new THREE.MeshPhongMaterial({ color: 0xcc0000 });
    const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
    roofMesh.position.y = carProperties.height / 2;
    roofMesh.castShadow = true;
    carGroup.add(roofMesh);

    for (let i = 0; i < 4; i++) {
        const wheelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 16);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;

        const offsetX = i < 2 ? -carProperties.width / 2 - 0.15 : carProperties.width / 2 + 0.15;
        const offsetZ = i % 2 === 0 ? -carProperties.depth / 3 : carProperties.depth / 3;

        wheel.position.set(offsetX, 0.6, offsetZ);
        carGroup.add(wheel);
    }

    carGroup.position.set(0, 0.5, 0);
    car = carGroup;
    scene.add(car);

    const carShape = new CANNON.Box(
        new CANNON.Vec3(carProperties.width / 2, carProperties.height / 2, carProperties.depth / 2)
    );
    carBody = new CANNON.Body({
        mass: carProperties.mass,
        shape: carShape,
        linearDamping: 0.3,
        angularDamping: 0.8
    });
    carBody.position.set(0, 0.5, 0);
    world.addBody(carBody);
}

function createScenarioObjects() {
    switch (currentScenario) {
        case 'parking':
            createParkingSpot();
            break;
        case 'lane':
            createLaneMarkers();
            break;
        case 'obstacle':
            createObstacles();
            break;
        case 'emergency':
            createEmergencyObstacles();
            break;
        case 'traffic':
            createTrafficElements();
            break;
    }
}

function createParkingSpot() {
    const boundaryMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const boundaryGeometry = new THREE.BufferGeometry();
    const boundaryPoints = [
        new THREE.Vector3(-8, 0.1, 30),
        new THREE.Vector3(8, 0.1, 30),
        new THREE.Vector3(8, 0.1, 50),
        new THREE.Vector3(-8, 0.1, 50),
        new THREE.Vector3(-8, 0.1, 30)
    ];
    boundaryGeometry.setFromPoints(boundaryPoints);
    const boundary = new THREE.Line(boundaryGeometry, boundaryMaterial);
    scene.add(boundary);

    const spotGeometry = new THREE.PlaneGeometry(16, 20);
    const spotMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.5 });
    const spot = new THREE.Mesh(spotGeometry, spotMaterial);
    spot.position.set(0, 0.05, 40);
    spot.rotation.x = -Math.PI / 2;
    scene.add(spot);
}

function createLaneMarkers() {
    for (let i = 0; i < 3; i++) {
        const laneX = -30 + i * 30;
        const markerGeometry = new THREE.PlaneGeometry(25, 5);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3 });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(laneX, 0.05, 100);
        marker.rotation.x = -Math.PI / 2;
        scene.add(marker);
    }
}

function createObstacles() {
    for (let i = 0; i < 8; i++) {
        const obstacleGeometry = new THREE.ConeGeometry(0.8, 2, 8);
        const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0xff9900 });
        const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        obstacle.position.set(-20 + i * 5, 1, 50 + (i % 2) * 10);
        obstacle.castShadow = true;
        scene.add(obstacle);
    }
}

function createEmergencyObstacles() {
    const obstacleGeometry = new THREE.BoxGeometry(5, 2, 1);
    const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set(0, 1, 80);
    obstacle.castShadow = true;
    scene.add(obstacle);
}

function createTrafficElements() {
    const postGeometry = new THREE.CylinderGeometry(0.2, 0.2, 5, 8);
    const postMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.set(-80, 2.5, 0);
    post.castShadow = true;
    scene.add(post);
}

function setupControls() {
    window.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        if (e.key === ' ') {
            e.preventDefault();
            carState.isBraking = true;
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
        if (e.key === ' ') {
            e.preventDefault();
            carState.isBraking = false;
        }
    });
}

function updateCarPhysics() {
    let accel = 0;
    let steering = 0;

    if (keys['w'] || keys['arrowup']) accel = 1;
    if (keys['s'] || keys['arrowdown']) accel = -1;
    if (keys['a'] || keys['arrowleft']) steering = 1;
    if (keys['d'] || keys['arrowright']) steering = -1;

    const currentSpeed = carBody.velocity.length() * 3.6;
    carState.speed = Math.min(Math.max(currentSpeed, 0), carProperties.maxSpeed);

    const accelerationForce = accel * carProperties.acceleration * carProperties.mass;
    const forwardDirection = new CANNON.Vec3(
        Math.sin(carState.angle) * accelerationForce,
        0,
        Math.cos(carState.angle) * accelerationForce
    );

    carBody.velocity.x = forwardDirection.x / carProperties.mass * 10;
    carBody.velocity.z = forwardDirection.z / carProperties.mass * 10;

    carState.angle += steering * carProperties.turnSpeed * 0.016;
    carBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), carState.angle);

    if (carState.isBraking || accel < 0) {
        carBody.velocity.x *= 0.95;
        carBody.velocity.z *= 0.95;
    }

    car.position.copy(carBody.position);
    car.quaternion.copy(carBody.quaternion);

    const cameraDistance = 15;
    const cameraHeight = 5;
    camera.position.x = car.position.x + Math.sin(carState.angle) * cameraDistance;
    camera.position.z = car.position.z + Math.cos(carState.angle) * cameraDistance;
    camera.position.y = car.position.y + cameraHeight;
    camera.lookAt(car.position.x, car.position.y + 1, car.position.z);
}

function updateGameLogic() {
    gameTime += 0.016;

    document.getElementById('speedometer').textContent = Math.round(carState.speed);
    document.getElementById('score').textContent = score;

    switch (currentScenario) {
        case 'basic':
            updateBasicScenario();
            break;
        case 'parking':
            updateParkingScenario();
            break;
        case 'lane':
            updateLaneScenario();
            break;
    }

    if (gameTime > scenarios[currentScenario].duration) {
        endScenario();
    }
}

function updateBasicScenario() {
    if (carState.speed >= 30 && !window.basicReached30) {
        window.basicReached30 = true;
        score += 100;
        showFeedback('✓ Reached 30 km/h!', 'success');
    }

    if (Math.abs(carState.angle) > Math.PI / 4 && !window.basicTurned) {
        window.basicTurned = true;
        score += 100;
        showFeedback('✓ Made a turn!', 'success');
    }

    if (carState.speed < 1 && window.basicTurned && !window.basicStopped) {
        window.basicStopped = true;
        score += 100;
        showFeedback('✓ Came to a complete stop!', 'success');
    }
}

function updateParkingScenario() {
    const parkingSpotX = 0;
    const parkingSpotZ = 40;
    const distToSpot = Math.sqrt(
        Math.pow(car.position.x - parkingSpotX, 2) +
        Math.pow(car.position.z - parkingSpotZ, 2)
    );

    if (distToSpot < 5 && carState.speed < 2) {
        score += 50;
        showFeedback('✓ Successfully parked!', 'success');
        endScenario();
    }

    if (Math.abs(car.position.x) > 10 || (car.position.z > 52 || car.position.z < 28)) {
        if (!window.parkingHitBoundary) {
            window.parkingHitBoundary = true;
            mistakes++;
            showFeedback('✗ Hit boundary!', 'error');
            score -= 25;
        }
    }
}

function updateLaneScenario() {
    const currentLane = Math.round((car.position.x + 30) / 30);
    if (currentLane !== window.lastLane) {
        window.lastLane = currentLane;
        window.laneChanges = (window.laneChanges || 0) + 1;
        showFeedback(`Lane change #${window.laneChanges}`, 'success');
        score += 50;
    }

    if (window.laneChanges >= 3) {
        showFeedback('✓ Completed all lane changes!', 'success');
        endScenario();
    }
}

function showFeedback(message, type = 'info') {
    const feedbackPanel = document.getElementById('feedbackPanel');
    feedbackPanel.textContent = message;
    feedbackPanel.className = `feedback-panel ${type}`;

    setTimeout(() => {
        feedbackPanel.textContent = '';
    }, 3000);
}

function endScenario() {
    gameActive = false;
    const finalScore = score - mistakes * 25;
    const rating = finalScore > 400 ? 'Excellent!' : finalScore > 300 ? 'Good!' : finalScore > 200 ? 'Fair' : 'Needs improvement';
    showFeedback(`Score: ${finalScore} - ${rating}`, 'success');

    setTimeout(() => {
        backToMenu();
    }, 3000);
}

function gameLoop() {
    if (gameActive) {
        requestAnimationFrame(gameLoop);
        world.step(1 / 60);
        updateCarPhysics();
        updateGameLogic();
        renderer.render(scene, camera);
    }
}

function onWindowResize() {
    if (renderer) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
}

function startGame(scenario) {
    initGame(scenario);
}

function backToMenu() {
    gameActive = false;
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'flex';

    window.basicReached30 = false;
    window.basicTurned = false;
    window.basicStopped = false;
    window.parkingHitBoundary = false;
    window.lastLane = null;
    window.laneChanges = 0;

    if (renderer) {
        renderer.dispose();
    }
    if (scene) {
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
    }
}

window.addEventListener('load', () => {
    console.log('Fuzzy-Train Driving Game loaded!');
});