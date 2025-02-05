import { Point, Ticker } from "pixi.js";
import { Game } from "../game";
import { Humanoid } from "../objects/humanoid";
import { Blaster } from "../objects/blaster";
import { BlasterData } from "../data/blaster-data";
import { UpdatePlayerHumanoid } from "../../../common/src/messages/message-objects";
import { Weapon } from "../objects/tools/weapon";
import { WeaponData } from "../data/weapon-data";
import { HumanoidState } from "../../../common/src/types/humanoid-state";
import { MessageType } from "../../../common/src/messages/message-type";

const PLAYER_SPEED = 8;

export class PlayerController
{
    player?: Humanoid;
    knockbackVelocity = new Point();

    constructor(private game: Game)
    {
        game.pixi.ticker.add(ticker => this.update(ticker));

        game.networkController.on(MessageType.TakeDamage, message =>
        {
            this.player.health -= message.damage;
            this.knockbackVelocity.x = Math.cos(message.knockbackAngle) * message.knockbackForce / 100;
            this.knockbackVelocity.y = Math.sin(message.knockbackAngle) * message.knockbackForce / 100;
        });
    }

    spawnPlayer()
    {
        this.despawnPlayer();

        this.player = new Humanoid();

        this.player.equipTool(new Weapon(WeaponData.IronSword));

        this.player.on("stateChanged", (newState, oldState) =>
        {
            if (newState === HumanoidState.dead)
            {
                this.spawnPlayer();
            }
        });

        this.game.workspace.addChild(this.player);
    }

    despawnPlayer()
    {
        if (this.player)
        {
            this.player.destroy();
            this.player = undefined;
        }

    }

    update(ticker: Ticker)
    {
        const player = this.player;

        if (!player || this.player.state === HumanoidState.dead)
            return;

        try
        {
            this.game.networkController.sendMessage(new UpdatePlayerHumanoid(player.getHumanoidData()));
        }
        catch
        {
            
        }
        const collisionController = this.game.collisionController;
        const deltaTime = ticker.deltaTime;

        const moveDirection = new Point(this.game.inputController.getHorizontalAxis(), this.game.inputController.getVerticalAxis()).normalize();

        const x = player.x + (PLAYER_SPEED * deltaTime * moveDirection.x || 0) + this.knockbackVelocity.x * deltaTime;
        const y = player.y + (PLAYER_SPEED * deltaTime * moveDirection.y || 0) + this.knockbackVelocity.y * deltaTime;

        if (!collisionController.pointCollides(x, this.player.y)) 
            this.player.x = x;

        if (!collisionController.pointCollides(this.player.x, y)) 
            this.player.y = y;                
    
        this.knockbackVelocity.x *= 0.9;
        this.knockbackVelocity.y *= 0.9;
    }
}