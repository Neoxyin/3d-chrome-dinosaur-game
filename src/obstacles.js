class Obstacle {
    constructor(scene, type, speed) {
        this.scene = scene;
        this.type = type; // 'cactus' or 'pterodactyl'
        this.speed = speed;
        this.position = { x: 50, y: type === 'pterodactyl' ? 3 : 0 };
        this.mesh = null;
        this.animationTime = 0;
        
        if (type === 'cactus') {
            this.createCactus();
        } else {
            this.createPterodactyl();
        }
    }
    
    createCactus() {
        const group = new THREE.Group();
        
        // Main trunk
        const trunkGeometry = new THREE.BoxGeometry(0.4, 2, 0.4);
        const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x00AA00 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1;
        trunk.castShadow = true;
        group.add(trunk);
        
        // Left arm
        const armGeometry = new THREE.BoxGeometry(0.8, 0.3, 0.3);
        const armMaterial = new THREE.MeshPhongMaterial({ color: 0x00AA00 });
        const armLeft = new THREE.Mesh(armGeometry, armMaterial);
        armLeft.position.set(-0.5, 1.5, 0);
        armLeft.castShadow = true;
        group.add(armLeft);
        
        // Right arm
        const armRight = new THREE.Mesh(armGeometry.clone(), armMaterial);
        armRight.position.set(0.5, 1.5, 0);
        armRight.castShadow = true;
        group.add(armRight);
        
        group.position.x = this.position.x;
        group.position.y = this.position.y;
        this.scene.add(group);
        this.mesh = group;
    }
    
    createPterodactyl() {
        const group = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.3);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.ConeGeometry(0.4, 1, 8);
        const headMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.x = 1;
        head.castShadow = true;
        group.add(head);
        
        // Left wing
        const wingGeometry = new THREE.BoxGeometry(2, 0.2, 0.8);
        const wingMaterial = new THREE.MeshPhongMaterial({ color: 0x777777 });
        const wingLeft = new THREE.Mesh(wingGeometry, wingMaterial);
        wingLeft.position.set(0, 0.5, 0.8);
        wingLeft.castShadow = true;
        group.add(wingLeft);
        
        // Right wing
        const wingRight = new THREE.Mesh(wingGeometry.clone(), wingMaterial);
        wingRight.position.set(0, 0.5, -0.8);
        wingRight.castShadow = true;
        group.add(wingRight);
        
        group.position.x = this.position.x;
        group.position.y = this.position.y;
        this.scene.add(group);
        this.mesh = group;
    }
    
    update() {
        this.position.x -= this.speed;
        this.mesh.position.x = this.position.x;
        
        // Pterodactyl flying animation
        if (this.type === 'pterodactyl') {
            this.animationTime += 0.05;
            this.mesh.position.y = this.position.y + Math.sin(this.animationTime) * 0.5;
        }
    }
    
    isOffScreen() {
        return this.position.x < -60;
    }
    
    remove() {
        this.scene.remove(this.mesh);
    }
}

class ObstacleManager {
    constructor(scene) {
        this.scene = scene;
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnRate = 100; // frames between spawns
        this.baseSpeed = 0.5;
        this.speed = this.baseSpeed;
    }
    
    update(difficulty) {
        this.spawnTimer++;
        
        // Increase spawn rate with difficulty
        this.spawnRate = Math.max(40, 100 - difficulty * 0.5);
        this.speed = this.baseSpeed + difficulty * 0.01;
        
        // Spawn new obstacles
        if (this.spawnTimer > this.spawnRate) {
            this.spawn();
            this.spawnTimer = 0;
        }
        
        // Update and remove off-screen obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].update();
            
            if (this.obstacles[i].isOffScreen()) {
                this.obstacles[i].remove();
                this.obstacles.splice(i, 1);
            }
        }
    }
    
    spawn() {
        const type = Math.random() > 0.6 ? 'pterodactyl' : 'cactus';
        const obstacle = new Obstacle(this.scene, type, this.speed);
        this.obstacles.push(obstacle);
    }
    
    getObstacles() {
        return this.obstacles;
    }
    
    clear() {
        this.obstacles.forEach(obs => obs.remove());
        this.obstacles = [];
    }
}
