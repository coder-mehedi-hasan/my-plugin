export function generateRandomString(length:number) {
    let result = '';
    const hexCharacters = '0123456789abcdef';
    for (let i = 0; i < length; i++) {
        result += hexCharacters.charAt(Math.floor(Math.random() * hexCharacters.length));
    }
    return result;
}