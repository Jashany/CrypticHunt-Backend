import { createClient } from "redis";

const client = createClient({
  url: "redis://default:default@localhost:6379",
});

client
  .connect()
  .then(() => {
    console.log(`Redis Database connected at ${client.options.url}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// client.on("connect", () => {
//   console.log("Redis Database connected" + "\n");
// });

// client.on("reconnecting", () => {
//   console.log("Redis client reconnecting");
// });

// client.on("ready", () => {
//   console.log("Redis client is ready");
// });

// client.on("error", (err) => {
//   console.log("Something went wrong " + err);
// });

// client.on("end", () => {
//   console.log("\nRedis client disconnected");
//   console.log("Server is going down now...");
//   process.exit();
// });

// const set = (key, value) => {
//   client.set(key, value, (err, reply) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(reply);
//     }
//   });
// };

// const get = (key) => {
//   return new Promise((resolve, reject) => {
//     client.get(key, (error, result) => {
//       if (error) {
//         console.error(error);
//         reject(error);
//       }
//       resolve(result);
//     });
//   });
// };

// const close = () => {
//   client.quit();
// };

export default client;
