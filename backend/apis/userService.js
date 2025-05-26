const {faker} = require('@faker-js/faker');
const users = [];

async function getUserProfile(email) {

    const mockUser = {
        name: faker.person.fullName(),
        email: email,
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        avatar: faker.image.avatar(),
    };
    const existingUser = users.find(user => user.email === mockUser.email);
    if (!existingUser) {
        users.push(mockUser);
        return mockUser;
    } else {
        return existingUser;
    }
}

module.exports = {getUserProfile,users};