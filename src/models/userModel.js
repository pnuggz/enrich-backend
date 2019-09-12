import { Connection } from "../loaders/mysql";

const get = async () => {
  const queryString = "SELECT * FROM USERS";

  try {
    let [rows, fields] = await Connection().query(queryString);
    return rows;
  } catch (err) {
    console.log(err);
    return;
  }
};

const UserModel = {
  get: get
};

export default UserModel;
