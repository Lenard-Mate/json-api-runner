const { getUserProfile, users } = require('../apis/userService');

describe('getUserProfile', () => {
    beforeEach(() => {
        users.length = 0;
    });

    test('should create a new user if not existing', async () => {
        const email = 'test@example.com';

        const user = await getUserProfile(email);

        expect(user.email).toBe(email);
        expect(users.length).toBe(1);
        expect(users[0]).toEqual(user);
    });

    test('should return existing user if email already exists', async () => {
        const email = 'existing@example.com';

        const firstUser = await getUserProfile(email);
        const secondUser = await getUserProfile(email);

        expect(secondUser).toBe(firstUser); // Same object reference
        expect(users.length).toBe(1);
    });

    test('should create different users for different emails', async () => {
        const user1 = await getUserProfile('user1@example.com');
        const user2 = await getUserProfile('user2@example.com');

        expect(user1).not.toBe(user2);
        expect(users.length).toBe(2);
    });
});
