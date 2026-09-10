class PhysicsManager {
    constructor() {
        this.gravity = -0.6;
        this.jumpPower = 15;
    }
    
    updateJump(dinosaur) {
        if (dinosaur.isJumping) {
            dinosaur.velocityY += this.gravity;
            dinosaur.position.y += dinosaur.velocityY;
            
            // Land on ground
            if (dinosaur.position.y <= 0) {
                dinosaur.position.y = 0;
                dinosaur.isJumping = false;
                dinosaur.velocityY = 0;
            }
        }
    }
    
    startJump(dinosaur) {
        if (!dinosaur.isJumping && !dinosaur.isDucking) {
            dinosaur.isJumping = true;
            dinosaur.velocityY = this.jumpPower;
        }
    }
    
    startDuck(dinosaur) {
        if (!dinosaur.isJumping) {
            dinosaur.isDucking = true;
            dinosaur.scale.y = 0.6;
        }
    }
    
    endDuck(dinosaur) {
        dinosaur.isDucking = false;
        dinosaur.scale.y = 1;
    }
    
    checkCollision(dinosaur, obstacle) {
        // Get bounding boxes
        const dBox = this.getBoundingBox(dinosaur);
        const oBox = this.getBoundingBox(obstacle.mesh);
        
        // AABB collision detection
        return !(dBox.max.x < oBox.min.x || 
                 dBox.min.x > oBox.max.x || 
                 dBox.max.y < oBox.min.y || 
                 dBox.min.y > oBox.max.y);
    }
    
    getBoundingBox(object) {
        const geometry = object.geometry;
        geometry.computeBoundingBox();
        
        const box = {
            min: object.position.clone().add(geometry.boundingBox.min),
            max: object.position.clone().add(geometry.boundingBox.max)
        };
        
        return box;
    }
}
