import { Animation, IAnimationKey, MeshBuilder, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Scene } from "@babylonjs/core";

export class Obstacle1 {
    private scene: Scene;
    constructor(scene: Scene) {
        this.scene = scene
        this.createObstacle()
    }

    async createObstacle(): Promise<void> {

        const box = MeshBuilder.CreateBox("box", { size: 5, height: 5, width: 5 });
        box.position.z = -25;
        box.position.y = 4;

        var boxAggregate = new PhysicsAggregate(box, PhysicsShapeType.BOX, { mass: 100, restitution: 0 }, this.scene);
        boxAggregate.body.disablePreStep = false;
        boxAggregate.body.setMotionType(PhysicsMotionType.ANIMATED);

        const frameRate = 10;

        const xSlide = new Animation("xSlide", "position.x", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

        const keyFrames: IAnimationKey[] = [];

        keyFrames.push({
            frame: 0,
            value: 10
        });

        keyFrames.push({
            frame: 4*frameRate,
            value: -10
        });

        keyFrames.push({
            frame: 8 * frameRate,
            value: 10
        });

        xSlide.setKeys(keyFrames);

        box.animations.push(xSlide);

        this.scene.beginAnimation(box, 0, 8 * frameRate, true);

    }
}