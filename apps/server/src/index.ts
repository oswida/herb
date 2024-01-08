import express from "express";
import cors from "cors";
import setupServer from "./server";

const port = process.env.PORT || 5001;
const app = express();
app.use(cors({ origin: "*", maxAge: 60 * 60 * 24 }));

const server = app.listen(port, () => {
  console.log(`running at on port ${port}`);
});

setupServer(server, app);
