import { HumanoidState } from "./humanoid-state"

export interface HumanoidData 
{
    position:
    {
        x: number,
        y: number,
    },

    velocity:
    {
        x: number,
        y: number
    }

    tool?: 
    {
        name: string,
        catagory: string,
        rotation: number
    } 

    state: HumanoidState,
}