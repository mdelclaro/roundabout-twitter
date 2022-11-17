import { TwitterApi, ETwitterStreamEvent } from "twitter-api-v2";
import express from "express";
import { config } from "dotenv";

config();

const start = async () => {
  const app = express();
  const port = process.env.PORT;

  app.get("/stream/:username", async (req, res) => {
    const username = req.params.username;

    const client = new TwitterApi(process.env["BEARER_TOKEN"]);

    await client.v2.updateStreamRules({
      add: [
        { value: `from:${username}`, tag: username },
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
