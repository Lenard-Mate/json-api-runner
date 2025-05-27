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
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    if (!existingUser) {
        users.push(mockUser);
        return mockUser;
    } else {
        return existingUser;
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {getUserProfile,users};