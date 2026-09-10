class Dinosaur {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.position = { x: -30, y: 0 };
        this.velocityY = 0;
        
        // State flags
        this.isJumping = false;
        this.isDucking = false;
        this.runCycle = 0;
        
        // Create dinosaur body parts
        this.createBody();
        
        this.group.position.x = this.position.x;
        this.group.position.y = this.position.y;
        this.scene.add(this.group);
    }
    
    createBody() {
        // Body (brown box)
        const bodyGeometry = new THREE.BoxGeometry(2, 2, 1);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x8B6914 });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.y = 1;
        this.body.castShadow = true;
        this.group.add(this.body);
        
        // Head
        const headGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.9);
        const headMaterial = new THREE.MeshPhongMaterial({ color: 0x9B7A24 });
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.set(1.2, 2, 0);
        this.head.castShadow = true;
        this.group.add(this.head);
        
        // Eye
        const eyeGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        this.eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        this.eye.position.set(1.8, 2.3, 0.5);
        this.eye.castShadow = true;
        this.group.add(this.eye);
        
        // Tail
        const tailGeometry = new THREE.BoxGeometry(3, 0.6, 0.8);
        const tailMaterial = new THREE.MeshPhongMaterial({ color: 0x8B6914 });
        this.tail = new THREE.Mesh(tailGeometry, tailMaterial);
        this.tail.position.set(-2, 1.5, 0);
        this.tail.castShadow = true;
        this.group.add(this.tail);
        
        // Front leg left
        const legGeometry = new THREE.BoxGeometry(0.4, 1.5, 0.5);
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0x7A5A1A });
        
        this.legFL = new THREE.Mesh(legGeometry, legMaterial);
        this.legFL.position.set(0.5, 0.25, 0.4);
        this.legFL.castShadow = true;
        this.group.add(this.legFL);
        
        // Front leg right
        this.legFR = new THREE.Mesh(legGeometry.clone(), legMaterial);
        this.legFR.position.set(0.5, 0.25, -0.4);
        this.legFR.castShadow = true;
        this.group.add(this.legFR);
        
        // Back leg left
        this.legBL = new THREE.Mesh(legGeometry.clone(), legMaterial);
        this.legBL.position.set(-1, 0.25, 0.4);
        this.legBL.castShadow = true;
        this.group.add(this.legBL);
        
        // Back leg right
        this.legBR = new THREE.Mesh(legGeometry.clone(), legMaterial);
        this.legBR.position.set(-1, 0.25, -0.4);
        this.legBR.castShadow = true;
        this.group.add(this.legBR);
    }
    
    update() {
        this.group.position.y = this.position.y;
        this.group.position.x = this.position.x;
        
        // Animate running legs
        if (!this.isJumping) {
            this.runCycle += 0.15;
            const legRotation = Math.sin(this.runCycle) * 0.3;
            this.legFL.rotation.x = legRotation;
            this.legFR.rotation.x = -legRotation;
            this.legBL.rotation.x = -legRotation;
            this.legBR.rotation.x = legRotation;
        } else {
            // Reset leg positions while jumping
            this.legFL.rotation.x = -0.3;
            this.legFR.rotation.x = -0.3;
            this.legBL.rotation.x = 0.1;
            this.legBR.rotation.x = 0.1;
        }
        
        // Head animation while ducking
        if (this.isDucking) {
            this.head.position.y = 1.2;
        } else {
            this.head.position.y = 2;
        }
    }
    
    getMesh() {
        return this.group;
    }
}
