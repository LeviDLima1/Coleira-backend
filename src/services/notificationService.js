const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
const expo = new Expo();

// Function to send push notification
async function sendPushNotification(pushToken, title, body, data = {}) {
  try {
    // Check if the push token is valid
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      return false;
    }

    // Create the message
    const message = {
      to: pushToken,
      sound: 'default',
      title,
      body,
      data,
    };

    // Send the message
    const ticket = await expo.sendPushNotificationsAsync([message]);
    console.log('Push notification sent:', ticket);

    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
}

// Function to send safe zone alert notification
async function sendSafeZoneAlertNotification(pushToken, petName, latitude, longitude) {
  const title = 'Alerta de Zona Segura';
  const body = `${petName} saiu da zona segura!`;
  const data = {
    type: 'safe_zone_alert',
    petName,
    latitude,
    longitude,
  };

  return sendPushNotification(pushToken, title, body, data);
}

module.exports = {
  sendPushNotification,
  sendSafeZoneAlertNotification,
}; 