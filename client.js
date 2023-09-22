//Client code

const mqtt = require("mqtt");

// Define the MQTT broker connection
const brokerUrl = "mqtt://broker.hivemq.com:1883";
const client = mqtt.connect(brokerUrl);

// Listen for the 'connect' event
client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Scenario a: Subscribe to all drone messages
  client.subscribe("drones/#", (err) => {
    if (!err) {
      console.log("Subscribed to all drone messages");
    }
  });

  // Scenario b: Subscribe to the Speeds of Short distance drones
  client.subscribe("drones/short_distance/speed", (err) => {
    if (!err) {
      console.log("Subscribed to Short distance drone speeds");
    }
  });

  // Scenario c: Subscribe to the battery levels of all drones
  client.subscribe("drones/+/battery", (err) => {
    if (!err) {
      console.log("Subscribed to battery levels of all drones");
    }
  });

  // Scenario d: Subscribe to the latitude and longitude values of Long distance drones
  client.subscribe("drones/long_distance/lat_long", (err) => {
    if (!err) {
      console.log("Subscribed to Long distance drone latitude and longitude");
    }
  });

  // Subscribe to the alerts topic for scenario alerts
  client.subscribe("alerts", (err) => {
    if (!err) {
      console.log("Subscribed to alerts");
    }
  });
});

// Listen for the 'message' event
client.on("message", (topic, message) => {
  console.log(
    `Received message on topic: ${topic}, Message: ${message.toString()}`
  );
});
