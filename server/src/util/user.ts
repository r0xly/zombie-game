let totalGuest = 0;

export interface UserData
{
    displayName: string,
    userId: string,
    guest: boolean
}

/**
 * Generates a temporary UserData object for unauthenticated players.
 * 
 * @param displayName
 */
export function generateGuestUserData(displayName: string)
{
    const user: UserData =
    {
        displayName: displayName,
        userId: "guest-" + totalGuest++,
        guest: true
    } 

    return user;
}