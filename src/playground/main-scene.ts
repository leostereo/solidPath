import * as BABYLON from '@babylonjs/core/Legacy/legacy'
// import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import '@babylonjs/loaders'

import { Ground } from './ground'
import { ThirdPersonController } from './thirdPersonController'
import { Obstacle1 } from './obstacle1'
import { MovileBox } from './movileBox'

export default class MainScene {
  private camera: BABYLON.ArcRotateCamera

  constructor(private scene: BABYLON.Scene, private canvas: HTMLCanvasElement, private engine: BABYLON.Engine) {
    this._setCamera(scene)
    this._setLight(scene)
    this._setSkyBox();
    this.loadComponents()
  }

  _setCamera(scene: BABYLON.Scene): void {
    this.camera = new BABYLON.ArcRotateCamera('camera', BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(80), 20, BABYLON.Vector3.Zero(), scene)
    this.camera.attachControl(this.canvas, true)
    this.camera.setTarget(BABYLON.Vector3.Zero())
  }

  _setLight(scene: BABYLON.Scene): void {
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene)
    light.intensity = 0.7
  }

  // _setPipeLine(): void {
  //   const pipeline = new BABYLON.DefaultRenderingPipeline('default-pipeline', false, this.scene, [this.scene.activeCamera!])
  // }

  _setSkyBox():void{
    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 20000 }, this.scene);
    sphere.infiniteDistance = true;
    const sphereMaterial = new BABYLON.StandardMaterial('sphereMaterial', this.scene);
    // sphereMaterial.emissiveTexture = new BABYLON.Texture(
    //     import.meta.env.BASE_URL + '/skybox.png',
    //     this.scene
    // );
    //sphereMaterial.emissiveTexture.coordinatesMode = BABYLON.Texture.SPHERICAL_MODE;
    sphereMaterial.backFaceCulling = false;
    sphereMaterial.disableLighting = true;
    sphere.material = sphereMaterial;
  }

  loadComponents(): void {
    // Load your files in order
    new Ground(this.scene);
    new Obstacle1(this.scene);
    new MovileBox(this.scene);
    new ThirdPersonController(this.camera,this.scene)
  }
}
