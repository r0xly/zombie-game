import { WeaponData } from "../data/weapon-data";
import { Weapon } from "../objects/tools/weapon";

export function getTool(catagory: string, toolName: string)
{
    if (catagory === "weapon" && WeaponData[toolName])
    {
        return new Weapon(WeaponData[toolName]);
    }
}