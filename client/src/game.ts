import { Application, Container, Graphics, Point, RenderLayer, Sprite, Ticker } from "pixi.js";
import { InputController } from "./controllers/input-controller";
import { PlayerController } from "./controllers/player-controller";
import { ProjectileController } from "./controllers/projectile-controller";
import { CameraController } from "./controllers/camera-controller";
import { CollisionController } from "./controllers/collision-controller";
import { NetworkController } from "./controllers/network-controller";
import { ZombieController } from "./controllers/zombie-controller";
import { WeaponController } from "./controllers/weapon-controller";
import { PopupWindowController } from "./controllers/ui/popup-window-controller";


export class Game
{
    uiLayer = new RenderLayer();
    workspace = new Container();
    
    popupWindowController = new PopupWindowController();
    networkController = new NetworkController(this, "ws://127.0.0.1:9001", "Player");
    projectileController = new ProjectileController(this);
    collisionController = new CollisionController(this);
    playerController = new PlayerController(this);
    cameraController = new CameraController(this);
    inputController = new InputController(this);
    zombieControler = new ZombieController(this);
    weaponController = new WeaponController(this); 

    constructor(public pixi: Application)
    {
        const map = Sprite.from("map");
        map.zIndex = -1;
        
        this.workspace.sortableChildren = true;
        pixi.stage.addChild(this.workspace);
        this.workspace.addChild(map);

        const collisionTestRectangle = new Graphics()
            .rect(110, 200, 400, 200)
            .fill("#000000")

        
        this.workspace.addChild(collisionTestRectangle);
        this.collisionController.addContainer(collisionTestRectangle);
        this.zombieControler.spawnZombie("test", 0, 0);
        collisionTestRectangle.zIndex = -1
    }
}