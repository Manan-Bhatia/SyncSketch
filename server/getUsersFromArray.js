import User from "./userModel.js";
// users: string[]
export async function getUsersFromArray(users) {
    let usersArray = [];
    for (let i = 0; i < users.length; i++) {
        let user = await User.findById(users[i]);
        usersArray.push({
            id: user._id,
            username: user.username,
        });
    }
    return usersArray;
}
