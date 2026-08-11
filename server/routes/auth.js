import bcrypt from 'bcrypt';

const saltRounds = 10;

async function hashPassword(password) {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    return passwordHash;
}

async function checkUser(username, password) {


    const match = await bcrypt.compare(password, username.passwordHash);

    if (match) {


    }

}