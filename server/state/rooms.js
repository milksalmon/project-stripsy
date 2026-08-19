const CHARS='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const rooms = new Map();

function generateRoomCode(length = 6) {
    let code;
    // reset code if rooms has similar code.
    do {
        code = '';
        for (let i = 0; i < length; i++) {
        // Math floor to round decimal points to whole number.
        code += CHARS[Math.floor(Math.random() * CHARS.length)]
        }
    } while (rooms.has(code))

    return code;
}

