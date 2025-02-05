import { Ticker } from "pixi.js";
import { Game } from "../game";
import { Weapon } from "../objects/tools/weapon";
import { Humanoid } from "../objects/humanoid";
import { ToolState } from "../../../common/src/types/tool-state";
import { boxCollides } from "../util/collision";
import { AttackZombie } from "../../../common/src/messages/message-objects";

export class WeaponController
{
    // A set of humanoids that have already been registered for collisions. The key is their respective ID. This resets every swing.
    private hitZombieHumanoids = new Set<string>();
    private hitPlayerHumanoids = new Set<string>();

    private previousWeaponState = ToolState.idle;

    constructor(private game: Game)
    {
        game.pixi.ticker.add(ticker => this.update(ticker));
    }

    private handleCollision(weapon: Weapon, humanoid: Humanoid, id: string, cache: Set<string>)
    {
        if (!cache.has(id) && boxCollides(humanoid, weapon))
        {
            cache.add(id);

            const player = this.game.playerController.player;
            const knockbackAngle = Math.atan2(humanoid.y - player.y, humanoid.x - player.x);

            this.game.networkController.sendMessage(new AttackZombie(id, weapon.options.damage, weapon.options.knockbackForce, knockbackAngle));
        }
    }

    private update(ticker: Ticker)
    {
        const pointer = this.game.inputController.pointer;
        const player = this.game.playerController.player;

        if (player && player.equippedTool && player.equippedTool instanceof Weapon)
        {
            const weapon = player.equippedTool;

            if (pointer.down)
            {
                weapon.swing();
            }

            // Check for collision is the tool is currently swinging
            if (weapon.state === ToolState.active)
            {
                // Resets the hit cache if this a new swing
                if (this.previousWeaponState === ToolState.idle)
                {
                    this.hitPlayerHumanoids.clear();
                    this.hitZombieHumanoids.clear();
                }

                this.game.zombieControler.zombiesMap.forEach((zombie, zombieId) => this.handleCollision(weapon, zombie, zombieId, this.hitZombieHumanoids));
            }

            weapon.update(pointer.x, pointer.y);
            this.previousWeaponState = weapon.state;
        }

    }
}