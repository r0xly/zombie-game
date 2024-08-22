export interface InventoryItem
{
    name: string,
    class: string,
    value: number,
    weight: number
}

export class Inventory 
{
    items: InventoryItem[] = [];
}