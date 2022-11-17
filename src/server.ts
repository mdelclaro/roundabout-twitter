import { TwitterApi, ETwitterStreamEvent } from "twitter-api-v2";
import express from "express";
import { config } from "dotenv";

config();

const USERNAME = "Every3Minutes";

const start = async () => {
  const app = express();
  const port = process.env.PORT;

  app.get("/stream", async (req, res) => {
    const client = new TwitterApi(process.env["BEARER_TOKEN"]);

    await client.v2.updateStreamRules({
      add: [
        { value: `from:${USERNAME}`, tag: USERNAME },
      ],
    });

    const stream = await client.v2.searchStream();

    stream.on(ETwitterStreamEvent.Data, ({ data }) => {
      console.log(`new tweet: ${data.text}`);
      
      res.write(JSON.stringify({ tweet: data?.text }), (err) => {
        if (err) {
          console.log(`err: ${err}`);
          res.end();
        }
      });
    });

    stream.on(ETwitterStreamEvent.DataError, () => res.end());

    await stream.connect({
      autoReconnect: true,
      autoReconnectRetries: Infinity,
    });
  });

  app.listen(port, () => {
    console.log(`server is running at https://localhost:${port}`);
  });
};

start();
