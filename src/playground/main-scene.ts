import '@babylonjs/loaders'
import { CharacterController } from './CharacterController';
import { AnimationGroup, ArcRotateCamera, Color3, Engine, HemisphericLight, Mesh, MeshBuilder, Scene, SceneLoader, StandardMaterial, Texture, Vector3 } from '@babylonjs/core';

export default class MainScene {

  private allAGs: AnimationGroup[];
  private cc: CharacterController;

  constructor(private scene: Scene, private canvas: HTMLCanvasElement, private engine: Engine) {
    this.setCamNLight();
    createGround(scene)
    this.loadPlayerAsync();
  }

  setCamNLight() {

    var camera1 = new ArcRotateCamera("camera1", 3 * Math.PI / 8, 3 * Math.PI / 8, 15, new Vector3(0, 2, 0), this.scene);
    camera1.attachControl(this.canvas, true);
    // this.camera = camera1;

    // lights
    var light1 = new HemisphericLight("light1", new Vector3(1, 0.5, 0), this.scene);
    light1.intensity = 0.7;
    var light2 = new HemisphericLight("light2", new Vector3(-1, -0.5, 0), this.scene);
    light2.intensity = 0.2;

    var box = MeshBuilder.CreateBox("Box", { size: 1 }, this.scene);
    box.material = new StandardMaterial("", this.scene);
    box.position.x += 5
    box.checkCollisions = true;

  }

  async loadPlayerAsync() {
    const model = await SceneLoader.ImportMeshAsync(
      "",
      "./model/",
      "Vincent2.babylon",
      this.scene
  );


      //clean up this player mesh
      //it has camera and lights, lets remove them
      // let m = model.meshes[0].getChildren();
      // let l = m.length - 1;
      // for (let i = l; i >= 0; i--) {
      //   if (m[i].name == "Camera" || m[i].name == "Hemi" || m[i].name == "Lamp") m[i].dispose();
      // }

      let player = model.meshes[0];
        let skeleton = model.skeletons[0];
        player.skeleton = skeleton;

        skeleton.enableBlending(0.1);
        //if the skeleton does not have any animation ranges then set them as below
        // setAnimationRanges(skeleton);

        let sm = <StandardMaterial>player.material;
        if(sm.diffuseTexture!=null){
            sm.backFaceCulling = true;
            sm.ambientColor = new Color3(1,1,1);
        }


        player.position = new Vector3(0,12,0);
        player.checkCollisions = true;
        player.ellipsoid = new Vector3(0.5,1,0.5);
        player.ellipsoidOffset = new Vector3(0,1,0);

        //rotate the camera behind the player
        let alpha = -player.rotation.y-4.69;
        let beta = Math.PI/2.5;
        let target = new Vector3(player.position.x,player.position.y+1.5,player.position.z);
        
        console.log("laoding meshes 1.1");
        let camera = new ArcRotateCamera("ArcRotateCamera",alpha,beta,5,target,this.scene);

        //standard camera setting
        camera.wheelPrecision = 15;
        camera.checkCollisions = false;
        //make sure the keyboard keys controlling camera are different from those controlling player
        //here we will not use any keyboard keys to control camera
        camera.keysLeft = [];
        camera.keysRight = [];
        camera.keysUp = [];
        camera.keysDown = [];
        //how close can the camera come to player
        camera.lowerRadiusLimit = 2;
        //how far can the camera go from the player
        camera.upperRadiusLimit = 20;
        camera.attachControl(this.canvas,false);

        //let CharacterController = org.ssatguru.babylonjs.component.CharacterController;
        let cc = new CharacterController(<Mesh>player,camera,this.scene);
        //below makes the controller point the camera at the player head which is approx
        //1.5m above the player origin
        cc.setCameraTarget(new Vector3(0,1.5,0));

        //if the camera comes close to the player we want to enter first person mode.
        cc.setNoFirstPerson(false);
        //the height of steps which the player can climb
        cc.setStepOffset(0.4);
        //the minimum and maximum slope the player can go up
        //between the two the player will start sliding down if it stops
        cc.setSlopeLimit(30,60);

        //tell controller 
        // - which animation range should be used for which player animation
        // - rate at which to play that animation range
        // - wether the animation range should be looped
        //use this if name, rate or looping is different from default
        cc.setIdleAnim("idle",1,true);
        cc.setTurnLeftAnim("turnLeft",0.5,true);
        cc.setTurnRightAnim("turnRight",0.5,true);
        cc.setWalkBackAnim("walkBack",0.5,true);
        cc.setIdleJumpAnim("idleJump",.5,false);
        cc.setRunJumpAnim("runJump",0.6,false);
        //set the animation range name to "null" to prevent the controller from playing
        //a player animation.
        //here even though we have an animation range called "fall" we donot want to play 
        //the fall animation
        cc.setFallAnim(null,2,false);
        cc.setSlideBackAnim("slideBack",1,false)

        cc.start();

  }

  createAGmap(allAGs) {
    //lets map ag groups to the character controller actions.
    let agMap = {
      idle: allAGs[0],
      strafeLeft: allAGs[3],
      strafeRight: allAGs[4],
      turnRight: allAGs[5],
      walk: allAGs[6],
      fall: allAGs[8],
      slideBack: allAGs[9],
      runJump: allAGs[10],
      turnLeft: allAGs[11],
      walkBack: allAGs[12],
      run: allAGs[13],
      idleJump: allAGs[14],
    };

    return agMap;
  }
}

  function createGround(scene){
    let groundMaterial = createGroundMaterial(scene);
    MeshBuilder.CreateGroundFromHeightMap("ground","./texture/ground_heightMap.png",{
        width:128,
        height:128,
        minHeight:0,
        maxHeight:10,
        subdivisions:32,
        onReady:(grnd)=>{
            grnd.material = groundMaterial;
            grnd.checkCollisions = true;
            grnd.isPickable = true;
            grnd.freezeWorldMatrix();
        }

    },scene);
}

function createGroundMaterial(scene){
    let groundMaterial = new StandardMaterial("groundMat",scene);
    let diffuseTexture:Texture = new Texture("./texture/ground.jpg",scene);
    diffuseTexture.uScale = 4.0;
    diffuseTexture.vScale = 4.0
    groundMaterial.diffuseTexture = diffuseTexture;
    
    let bumpTexture = new Texture("./texture/ground-normal.png",scene);
    bumpTexture.uScale = 12.0;
    bumpTexture.vScale = 12.0;
    groundMaterial.bumpTexture = bumpTexture;
    

    groundMaterial.diffuseColor = new Color3(0.9,0.6,0.4);
    groundMaterial.specularColor = new Color3(0,0,0);
    return groundMaterial;
}

