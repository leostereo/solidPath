import { ArcRotateCamera, Engine, Scene, Tools, HemisphericLight, Vector3, Color3, SpotLight } from "@babylonjs/core";
import { Ramps } from "./components/ramps";


export class FallingBallScene {

    private camera: ArcRotateCamera;

    constructor(private scene: Scene,
        private canvas: HTMLCanvasElement,
        private engine: Engine) {
        console.log("falling scene building")
        this.setCamera(this.scene);
        this.setLight(this.scene)
        this.loadComponents()
    }

    setCamera(scene: Scene): void {
        this.camera = new ArcRotateCamera('camera', Tools.ToRadians(20), Tools.ToRadians(50), 70, Vector3.Zero(), scene)
        this.camera.attachControl(this.canvas, true)
        this.camera.setTarget(Vector3.Zero())
    }

    setLight(scene: Scene): void {
        // const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
        // light.intensity = 0.7;

        var lightRed = new SpotLight("spotLight", new Vector3(-0.9, 1 , 10.8), new Vector3(0, -1, 0), Math.PI / 2, 1.5, scene);
        lightRed.diffuse = new Color3(1, 0, 0);
        lightRed.specular = new Color3(0, 0, 0);
    }

    loadComponents(): void {
        // Load your files in order
        new Ramps(this.scene)
    }

}