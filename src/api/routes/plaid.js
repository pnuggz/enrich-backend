import accessToken from "./subRoutes/plaid/accessToken";

const UserRouter = app => {
  accessToken(app);
};

export default UserRouter;
