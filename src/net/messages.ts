export const createSessionMessage = (playerName: string, x: number, y: number, modelId: string): string => {
    return JSON.stringify({
        playerName,
        x,
        y,
        modelId,
    });
}

export const createMovementMessage = (playerName: string, x: number, y: number): string => {
    return JSON.stringify({
        playerName,
        x,
        y,
    });
}