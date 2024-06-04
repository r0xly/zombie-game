import { Application, Container, Graphics, Sprite, Ticker } from "pixi.js";
import { InputController } from "./controllers/input-controller";
import { PlayerController } from "./controllers/player-controller";
import { ProjectileController } from "./controllers/projectile-controller";
import { CameraController } from "./controllers/camera-controller";
import { CollisionController } from "./controllers/collision-controller";
import { WindowControler } from "./controllers/window-controller";

export class Game
{
    workspace = new Container();
    
    projectileController = new ProjectileController(this);
    collisionController = new CollisionController(this);
    playerController = new PlayerController(this);
    cameraController = new CameraController(this);
    inputController = new InputController(this);
    windowController = new WindowControler();

    constructor(public pixi: Application)
    {
        const map = Sprite.from("map");
        map.zIndex = -1;
        
        pixi.stage.addChild(this.workspace);
        this.workspace.addChild(map);

        const collisionTestRectangle = new Graphics()
            .rect(200, 200, 400, 200)
            .fill("#000000");
        
        this.workspace.addChild(collisionTestRectangle);
        this.collisionController.addContainer(collisionTestRectangle);
        collisionTestRectangle.zIndex = -1

        this.playerController.spawnPlayer();
    }
}