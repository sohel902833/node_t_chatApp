import User from "../../models/user.model";
export const getUser = async (filter: any) => {
  return User.findOne(filter);
};

export const updateUser = async (id: string, update: any) => {
  return User.updateOne({ _id: id }, update);
};

export const getAllUserSubscription = async (userIdS: string[]) => {
  const ids: any[] = userIdS.map((id) => ({ _id: id }));
  return User.find(
    {
      $or: [...ids],
    },
    {
      subscription: 1,
    }
  );
};
