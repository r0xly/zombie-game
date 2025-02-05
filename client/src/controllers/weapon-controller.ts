import { Ticker } from "pixi.js";
import { Game } from "../game";
import { Weapon } from "../objects/tools/weapon";
import { Humanoid } from "../objects/humanoid";
import { ToolState } from "../../../common/src/types/tool-state";
import { boxCollides } from "../util/collision";
import { AttackPlayer, AttackZombie } from "../../../common/src/messages/message-objects";

type AttackMessage = new (
  id: string,
  damage: number,
  knockbackForce: number,
  knockbackAngle: number
) => any;

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

    private handleCollision(weapon: Weapon, humanoid: Humanoid, id: string, cache: Set<string>, message: AttackMessage)
    {
        console.log("hey??")
        if (!cache.has(id) && boxCollides(humanoid, weapon))
        {
        console.log("hey????")
            cache.add(id);

            const player = this.game.playerController.player;
            const knockbackAngle = Math.atan2(humanoid.y - player.y, humanoid.x - player.x);

            this.game.networkController.sendMessage(new message(id, weapon.options.damage, weapon.options.knockbackForce, knockbackAngle));
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

                for (const [zombieId, zombie] of this.game.zombieControler.zombiesMap)
                {
                    this.handleCollision(weapon, zombie, zombieId, this.hitZombieHumanoids, AttackZombie);
                }

                for (const player of this.game.networkController.players.getPlayers())
                {
                    this.handleCollision(weapon, player.humanoid, player.userId, this.hitPlayerHumanoids, AttackPlayer);
                }
            }

            weapon.update(pointer.x, pointer.y);
            this.previousWeaponState = weapon.state;
        }

    }
}