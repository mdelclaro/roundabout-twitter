// client example that consumes the tweets stream

import { config } from "dotenv";
import http from "http";

config();

const start = async () => {
  console.log('client is listening...\n')

  const url = "http://localhost:8080/stream";

  http.get(url, res => {
    res.on("data", (data) => console.log(data?.toString()));
  });
};

start();
