import { EventEmitter } from "pixi.js";
import { GameWindow } from "./game-window";
import { Inventory } from "../inventory";

export class InventoryWindow extends GameWindow
{

    constructor(private element: HTMLElement, private inventory: Inventory)
    {
        super(element);

        inventory.on("updated", () => this.update());
        this.update();
    }

    update()
    {
        const inventoryItems = this.element.querySelector("#inventory-items")

        inventoryItems.replaceChildren();

        for (const itemData of this.inventory.items)
        {
            const item = document.createElement("div");
            item.classList.add("inventory-header", "flex-space-between");

            const itemName = document.createElement("p");
            itemName.innerHTML = itemData.name

            const itemStats = document.createElement("div");
            itemStats.style.display = "flex";
            itemStats.style.gap = "20px";

            const itemClass = document.createElement("p");
            itemClass.innerHTML = itemData.class;

            const itemWeight = document.createElement("p");
            itemWeight.innerHTML = itemData.weight.toString();

            const itemValue = document.createElement("p");
            itemValue.innerHTML = itemData.value.toString();

            itemStats.append(itemClass, itemWeight, itemValue);
            item.append(itemName, itemStats);
            
            inventoryItems.append(item);
        }
    }
}