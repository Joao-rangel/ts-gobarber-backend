import User from "../models/User";

class UserMap {
  public static toDTO(user: User) {
    const { password, ...userDTO } = user;

    return userDTO;
  }
}

export default UserMap;
