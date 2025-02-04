import { Camera } from "pixi-game-camera";
import { Game } from "../game";
import { applyMatrix, Ticker } from "pixi.js";

const CAMERA_MOVE_TOLERANCE = 0.1;

export class CameraController
{
    camera: Camera;
    x = 0;
    y = 0;

    constructor(private game: Game)
    {
        this.camera = new Camera(game.pixi.ticker);

        game.pixi.ticker.add(ticker => this.update(ticker));
    }

    private update(ticker: Ticker)
    {
        const player = this.game.playerController.player;

        if (!player)
            return;
        
        const halfScreenWidth = this.game.pixi.screen.width / 2;
        const halfSceenHeight = this.game.pixi.screen.height / 2;

        const widthBound = halfScreenWidth * CAMERA_MOVE_TOLERANCE;
        const heightBound = halfSceenHeight * CAMERA_MOVE_TOLERANCE;

        const topBound = -this.y - heightBound;
        const bottomBound = -this.y + heightBound;
        const rightBound = -this.x + widthBound;
        const leftBound = -this.x - widthBound;
        
        if (player.x > rightBound)
            this.x = -player.x + widthBound;
        if (player.x < leftBound)
            this.x = -player.x - widthBound;
        if (player.y > bottomBound)
            this.y = -player.y + heightBound;
        if (player.y < topBound)
            this.y = -player.y - heightBound;

        this.game.workspace.x = this.x + halfScreenWidth;
        this.game.workspace.y = this.y + halfSceenHeight;
    }
}