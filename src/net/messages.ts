export const createSessionMessage = (playerName: string, x: number, y: number): string => {
    return JSON.stringify({
        playerName,
        x,
        y,
    });
}

export const createMovementMessage = (playerName: string, x: number, y: number): string => {
    return JSON.stringify({
        playerName,
        x,
        y,
    });
}