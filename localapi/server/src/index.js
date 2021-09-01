import express from "express";
import { ApolloServer } from "apollo-server-express";
import resolvers from "./resolvers/index.js";
import schema from "./schema/index.js";
import { readDB } from "./dbController.js";
// import cors from "cors";
// import messagesRoute from "./routes/messages.js";
// import usersRoute from "./routes/users.js";

// const app = express();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    db: {
      messages: readDB("messages"),
      users: readDB("users"),
    },
  },
});
const app = express();
await server.start();
server.applyMiddleware({
  app,
  path: "/graphql",
  cors: {
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true,
  },
});

// const routes = [...messagesRoute, ...usersRoute];
// routes.forEach(({ method, route, handler }) => {
//   app[method](route, handler);
// });

// app[method](route, handler)
// app.get("/", (req, res) => {
//   res.send("ok");
// });

// app.post('/messages', (req, res) => {
//     ...
// })
// app.put('/messages/:id', (req, res) => {
//     ...
// })
// app.delete(...)

// app.listen(8000, () => {
//   console.log("server listening on 8000...");
// });

await app.listen({ port: 8000 });
console.log("server listening on 8000... ");
