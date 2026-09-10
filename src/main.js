// Game configuration
const CONFIG = {
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: window.devicePixelRatio || 1
};

let scene, renderer, camera;
let dinosaur, obstacleManager, physics, ui;
let keys = {};
let gameRunning = true;

// Input handling
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Jump with Space or Up Arrow
    if ((e.key === ' ' || e.key === 'ArrowUp') && gameRunning) {
        e.preventDefault();
        if (ui.isGameOver()) {
            restartGame();
        } else {
            physics.startJump(dinosaur);
        }
    }
    
    // Duck with Down Arrow
    if (e.key === 'ArrowDown' && gameRunning && !ui.isGameOver()) {
        e.preventDefault();
        physics.startDuck(dinosaur);
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    
    // Stop ducking
    if (e.key === 'ArrowDown') {
        physics.endDuck(dinosaur);
    }
});

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    renderer.setSize(width, height);
    camera.resize(width, height);
});

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xccccff);
    scene.fog = new THREE.Fog(0xccccff, 200, 50);
    
    // Renderer setup
    const container = document.getElementById('game-container');
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(CONFIG.width, CONFIG.height);
    renderer.setPixelRatio(CONFIG.dpr);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    container.appendChild(renderer.domElement);
    
    // Camera setup
    const cameraManager = new CameraManager(scene, CONFIG.width, CONFIG.height);
    camera = cameraManager.getCamera();
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(30, 40, 20);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);
    
    // Create ground
    createGround();
    
    // Create background
    createBackground();
    
    // Game objects
    dinosaur = new Dinosaur(scene);
    obstacleManager = new ObstacleManager(scene);
    physics = new PhysicsManager();
    ui = new UIManager();
    
    // Start game loop
    animate();
}

function createGround() {
    const groundGeometry = new THREE.PlaneGeometry(500, 5);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xccaa77 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    ground.position.y = -2.5;
    scene.add(ground);
}

function createBackground() {
    // Far mountains
    const mountainGeometry = new THREE.BoxGeometry(80, 30, 1);
    const mountainMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain.position.set(0, 10, -20);
    mountain.receiveShadow = true;
    scene.add(mountain);
    
    // Clouds
    for (let i = 0; i < 5; i++) {
        const cloudGeometry = new THREE.BoxGeometry(10, 4, 1);
        const cloudMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloud.position.set(-40 + i * 20, 30, -25);
        cloud.receiveShadow = true;
        scene.add(cloud);
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    if (gameRunning && !ui.isGameOver()) {
        // Update dinosaur physics
        physics.updateJump(dinosaur);
        dinosaur.update();
        
        // Update obstacles
        obstacleManager.update(ui.score);
        
        // Check collisions
        const obstacles = obstacleManager.getObstacles();
        for (let obstacle of obstacles) {
            if (physics.checkCollision(dinosaur, obstacle)) {
                endGame();
                break;
            }
        }
        
        // Update score
        ui.updateScore(0.5);
    }
    
    renderer.render(scene, camera);
}

function endGame() {
    gameRunning = false;
    ui.showGameOver();
}

function restartGame() {
    gameRunning = true;
    ui.reset();
    dinosaur.position.y = 0;
    dinosaur.velocityY = 0;
    dinosaur.isJumping = false;
    dinosaur.isDucking = false;
    dinosaur.scale.y = 1;
    obstacleManager.clear();
}

// Start the game
init();
