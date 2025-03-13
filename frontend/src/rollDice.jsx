export function rollD20(){
    return Math.floor(Math.random() * 20) + 1;
}

// Roll dice based on notation like "2d8+6"
export function rollDice(rollNotation){
    const dicePattern = /(\d*)d(\d+)([+-]\d+)?/; // Regex to match dice notation
    const match = rollNotation.match(dicePattern);

    if (!match) {
        throw new Error("Invalid dice notation");
    }

    const numDice = match[1] ? parseInt(match[1], 10) : 1; // Number of dice (default 1)
    const diceType = parseInt(match[2], 10); // Type of dice (e.g., d8)
    const modifier = match[3] ? parseInt(match[3], 10) : 0; // Modifier (e.g., +6)

    let total = 0;
    for (let i = 0; i < numDice; i++) {
        total += Math.floor(Math.random() * diceType) + 1; // Roll each die
    }

    return total + modifier; // Add modifier
}