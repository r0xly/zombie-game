import { Inventory } from "../objects/inventory";
import { GameWindow } from "../objects/windows/game-window";
import { InventoryWindow } from "../objects/windows/inventory-window";

const playerInventory = new Inventory();
playerInventory.items.push(
{
    name: "AA22",
    value: 100,
    weight: 10,
    class: "gun"
})
playerInventory.items.push(
{
    name: "AA22",
    value: 100,
    weight: 10,
    class: "gun"
})

playerInventory.items.push(
{
    name: "AA22",
    value: 100,
    weight: 10,
    class: "gun"
})
playerInventory.items.push(
{
    name: "AA22",
    value: 100,
    weight: 10,
    class: "gun"
})
export class WindowControler
{
    playerInventory = new InventoryWindow(document.getElementById("inventory"), playerInventory);    
}