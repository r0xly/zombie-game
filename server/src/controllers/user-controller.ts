import { UserData } from "../types/user";

export class UserController
{
    createUser(displayName: string)
    {
        const userData: UserData =
        {
            displayName: displayName,
            userId: 0,
            guest: true,
        }

        return userData;
    } 
}