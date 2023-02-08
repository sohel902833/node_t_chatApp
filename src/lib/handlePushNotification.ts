import webPush from "web-push";
const PUBLIC_VAPID_KEY: string = process.env.PUBLIC_VAPID_KEY as string;
const PRIVATE_VAPID_KEY: string = process.env.PRIVATE_VAPID_KEY as string;

webPush.setVapidDetails(
  "mailto:mdsohelranask6869@gmail.com",
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

export const sendPushNotification = async (
  subscription: any,
  payload: string
) => {
  return await webPush.sendNotification(subscription, payload).catch((err) => {
    console.log(err);
  });
};
