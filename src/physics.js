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
        // Simple distance-based collision detection
        const dPos = dinosaur.getMesh().position;
        const oPos = obstacle.mesh.position;
        
        // Adjust collision box based on dinosaur state
        const dWidth = 2;
        const dHeight = dinosaur.isDucking ? 1.2 : 2;
        const dX = dPos.x;
        const dY = dPos.y;
        
        const oWidth = obstacle.type === 'cactus' ? 0.8 : 2;
        const oHeight = obstacle.type === 'cactus' ? 2 : 1.6;
        const oX = oPos.x;
        const oY = oPos.y;
        
        // AABB collision
        return !(dX + dWidth < oX - oWidth || 
                 dX - dWidth > oX + oWidth || 
                 dY + dHeight < oY - oHeight || 
                 dY - dHeight > oY + oHeight);
    }
}
