import { CoinMetadata, getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import Database from "better-sqlite3";
import path from "path";
import { getTweet } from "react-tweet/api";

export const revalidate = 0;

type Memory = {
  id: string;
  type: string;
  createdAt: number;
  content: string;
  embedding?: Buffer;
  userId: string;
  roomId: string;
  agentId: string;
  unique: number;
} & CoinMetadata;

const dbPath = path.join(
  process.cwd(),
  "../jokepapa-ai-agent/data",
  "db.sqlite"
);
const db = new Database(dbPath, { verbose: console.log });

const client = new SuiClient({
  url: getFullnodeUrl("testnet"),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = url.searchParams.get("limit") || 6;
  const offset = url.searchParams.get("offset") || 0;
  const [assets, count]: [Memory[], number] = await Promise.all([
    db
      .prepare(
        "SELECT * FROM 'memories' Where type = 'asset' ORDER BY createdAt DESC LIMIT ? OFFSET ?"
      )
      .all(limit, offset) as Memory[],
    (
      db
        .prepare("SELECT COUNT(*) AS total FROM memories WHERE type = 'asset'")
        .get() as { total: number }
    ).total,
  ]);

  const response = (
    await Promise.all(
      assets.map(async (asset) => {
        const content = JSON.parse(asset.content);
        if (!content?.tokenUrl) {
          return null;
        }
        const splitTokenUrl = content?.tokenUrl?.split("/");
        const coinType = splitTokenUrl?.[splitTokenUrl?.length - 1];

        const [tweet, coinMetadata] = await Promise.all([
          await getTweet(content.tweetId),
          await client.getCoinMetadata({ coinType }),
        ]);

        return {
          ...content,
          count,
          createdAt: asset.createdAt,
          id: asset.id,
          ...coinMetadata,
          coinType,
          tweet: {
            ...tweet,
            text: removeMetionAndAddress(tweet?.text),
          },
        };
      })
    )
  ).filter((asset) => Boolean(asset?.symbol));

  return new Response(JSON.stringify(response), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function removeMetionAndAddress(text?: string) {
  return text?.replace(/0x[a-fA-F0-9]{64}/g, "").replace(/\n/g, " ");
}
