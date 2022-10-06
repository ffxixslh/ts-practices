import { Collection } from "./models/Collection";
import { IUserProps, User } from "./models/User";
import { UserList } from "./views/UserList";

const users = new Collection(
  "http://localhost:3000/users",
  (json: IUserProps) => {
    return User.buildUser(json);
  }
);

console.log(users);


users.on("change", () => {
  const root = document.getElementById("root");

  if (root) {
    new UserList(root, users).render();
  }
});

users.fetch();
