export const createSessionMessage = (playerName: string, x: number, y: number): string => {
    return JSON.stringify({
        playerName,
        x,
        y,
    });
}