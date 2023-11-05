import { useServer } from "./server";

const port = process.env.PORT || 5001;
const { server } = useServer();

server.listen(port, () => {
  console.log(`running at on port ${port}`);
});
