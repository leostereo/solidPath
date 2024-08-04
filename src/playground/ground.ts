import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import '@babylonjs/loaders'



interface PlatformData {
  name:string;
  height:number;
  width:number;
  size:number;
  pos_x:number;
  pos_y:number;
  pos_z:number;
  ang_x:number;
  ang_y:number;
  ang_z:number;
}
export class Ground {
  constructor(private scene: BABYLON.Scene) {
    this._createGround();
    //this._createSphere();
    this._generateRandomPlatforms();
  }

  _createGround(): void {
    const { scene } = this

    const mesh = BABYLON.MeshBuilder.CreateGround('ground', { width: 30, height: 30 }, scene)
    new BABYLON.PhysicsAggregate(mesh, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene)
  }

  _createSphere(): void {
    const mesh = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2, segments: 32 }, this.scene)
    mesh.position.y = 4

    new BABYLON.PhysicsAggregate(mesh, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, this.scene)
  }

  async generateBasicPath(){
    const ramps = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "./model/",
      "basic_path.glb",
      this.scene
    );
    ramps.meshes[0].position = new BABYLON.Vector3(0, -12, -6)
    for (const ramp of ramps.meshes) {
      this.addPhysicsAggregate(ramp);

    }
  }

  async _generateRandomPlatforms() {
    this.createPlatForm({name:'plat1',size:40,height:1,width:10,pos_x:0,pos_y:0,pos_z:-35,ang_x:0,ang_y:0,ang_z:0})  
    this.createPlatForm({name:'plat2',size:10,height:1,width:40,pos_x:-20,pos_y:0,pos_z:-60,ang_x:0,ang_y:0,ang_z:0})  
    this.createPlatForm({name:'plat3',size:40,height:1,width:10,pos_x:-35,pos_y:0,pos_z:-35,ang_x:15,ang_y:0,ang_z:0})  
    this.createPlatForm({name:'plat4',size:40,height:1,width:10,pos_x:-35,pos_y:10,pos_z:0,ang_x:0,ang_y:0,ang_z:0})  
    this.createPlatForm({name:'plat5',size:10,height:1,width:20,pos_x:-20,pos_y:5,pos_z:10,ang_x:0,ang_y:0,ang_z:-10})  
  }
  
  createPlatForm(platData:PlatformData):void{
    const path = BABYLON.MeshBuilder.CreateBox(
      platData.name, { size: platData.size, height: platData.height, width: platData.width },
      this.scene
    );
    path.position = new BABYLON.Vector3(platData.pos_x,platData.pos_y,platData.pos_z);
    path.rotation = new BABYLON.Vector3(platData.ang_x,platData.ang_y,platData.ang_z);
    this.addPhysicsAggregate(path);
  
  }

  private addPhysicsAggregate(meshe: BABYLON.TransformNode) {
    const res = new BABYLON.PhysicsAggregate(
      meshe,
      BABYLON.PhysicsShapeType.BOX,
      { mass: 0, friction: 0.9 },
      this.scene
    );
    // this.physicsViewer.showBody(res.body);
    return res;
  }
}
