import { Animation, IAnimationKey, MeshBuilder, PhysicsAggregate, PhysicsMotionType, PhysicsShapeType, Scene } from "@babylonjs/core";

export class MovileBox {
    private scene: Scene;
    constructor(scene: Scene) {
        this.scene = scene
        this.createObstacle()
    }

    async createObstacle(): Promise<void> {

        const box = MeshBuilder.CreateBox("box", { size: 1, height: 1, width: 1 });
        box.position.z = -20;
        box.position.y = 1;

        var boxAggregate = new PhysicsAggregate(box, PhysicsShapeType.BOX, { mass: 100, restitution: 0, friction:0.8 }, this.scene);
        boxAggregate.body.disablePreStep = false;
        boxAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);



    }
}