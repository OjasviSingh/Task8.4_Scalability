// Server code

const mqtt = require("mqtt");

// Define the MQTT broker connection for the server
const brokerUrl = "mqtt://broker.hivemq.com:1883";
const serverClient = mqtt.connect(brokerUrl); // Define and initialize the server client

// Initialize battery levels and last reported locations
const batteryLevels = {};
const lastReportedLocations = {};

// Function to simulate data from a drone and publish it to the MQTT broker
function simulateDroneDataPeriodically(droneId, category) {
    // Generate random data for battery levels and latitude/longitude
    let data;
  
    if (category === "battery") {
      // Simulate battery levels between 1% and 100%
      data = `${Math.floor(Math.random() * 100) + 1}%`;
    } else if (category === "lat_long") {
      // Simulate latitude and longitude within a range
      const latitude = 42.0 + Math.random() * 1.0; // Range: 42.0 - 43.0
      const longitude = -71.0 + Math.random() * 1.0; // Range: -71.0 - -70.0
      data = `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`;
    }
  
    const topic = `drones/${droneId}/${category}`;
    serverClient.publish(topic, data);
    console.log(`Published data to topic: ${topic}, Data: ${data}`);
  
    // Update battery levels and last reported locations
    if (category === "battery") {
      batteryLevels[droneId] = data;
    } else if (category === "lat_long") {
      lastReportedLocations[droneId] = {
        location: data,
        timestamp: new Date().getTime(),
      };
    }
  
    // Scenario 1: Check battery levels
    const lowBatteryCount = Object.values(batteryLevels).filter(
      (level) => parseFloat(level) < 10
    ).length;
    if (lowBatteryCount > 2) {
      // Publish an alert if more than two drones have low battery levels
      serverClient.publish(
        "alerts",
        "Alert: More than two drones have low battery levels"
      );
    }
  
    // Scenario 2: Check stationary drones
    const currentTime = new Date().getTime();
    for (const droneId in lastReportedLocations) {
      const locationData = lastReportedLocations[droneId];
      const { location, timestamp } = locationData;
      const latitude = parseFloat(location.split(",")[0].split(":")[1].trim());
      const altitude = parseFloat(location.split(",")[1].split(":")[1].trim());
  
      // Calculate time difference in minutes
      const timeDifference = (currentTime - timestamp) / (1000 * 60);
  
      if (timeDifference > 10 && altitude > 100) {
        // Publish an alert if a drone has been stationary for more than 10 minutes at high altitude
        serverClient.publish(
          "alerts",
          `Alert: Drone ${droneId} has been stationary for more than 10 minutes at altitude above 100 meters`
        );
      }
    }
  }
  
  // Periodically simulate sending data from drones every 2 seconds
  setInterval(() => {
    // Simulate battery levels of drones
    simulateDroneDataPeriodically("1234", "battery");
    simulateDroneDataPeriodically("5678", "battery");
    simulateDroneDataPeriodically("9012", "battery");
  
    // Simulate latitude and longitude values of drones
    simulateDroneDataPeriodically("1234", "lat_long");
    simulateDroneDataPeriodically("5678", "lat_long");
    simulateDroneDataPeriodically("9012", "lat_long");
  }, 2000); // Execute every 2 seconds