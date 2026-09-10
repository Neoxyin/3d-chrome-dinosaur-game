class CameraManager {
    constructor(scene, width, height) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        
        // Create orthographic camera for 2.5D effect
        const aspectRatio = width / height;
        this.camera = new THREE.OrthographicCamera(
            -50 * aspectRatio,
            50 * aspectRatio,
            50,
            -50,
            0.1,
            1000
        );
        
        this.camera.position.z = 100;
        this.scene.add(this.camera);
    }
    
    resize(width, height) {
        this.width = width;
        this.height = height;
        const aspectRatio = width / height;
        
        this.camera.left = -50 * aspectRatio;
        this.camera.right = 50 * aspectRatio;
        this.camera.top = 50;
        this.camera.bottom = -50;
        this.camera.updateProjectionMatrix();
    }
    
    getCamera() {
        return this.camera;
    }
}
