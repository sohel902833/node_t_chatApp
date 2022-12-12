import User from "../../models/user.model";
export const getUser = async (filter: any) => {
  return User.findOne(filter);
};
