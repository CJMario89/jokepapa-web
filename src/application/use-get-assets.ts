import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useRef } from "react";
import { Tweet } from "react-tweet/api";

export type Asset = {
  text: string;
  symbol: string;
  assetName: string;
  tweetId: string;
  mintPrice: number;
  iconUrl: string;
  description: string;
  posterAddress: string;
  tokenUrl: string;
  createdAt: number;
  coinType: string;
  mintPool: string;
  tweet: Tweet;
  count: number;
  id: string;
};
type UseGetAssetsProps = Omit<
  UseQueryOptions<Asset[]> & {
    limit?: number;
    offset?: number;
  },
  "queryKey"
>;

const useGetAssets = (options?: UseGetAssetsProps) => {
  const limit = options?.limit || 6;
  const offset = options?.offset || 0;

  const assetsRef = useRef<Asset[]>([]);

  const query = useQuery({
    queryKey: ["assets", limit, offset],
    queryFn: async () => {
      const response = await fetch(
        `/api/assets?limit=${limit}&offset=${offset}`
      );
      const assets: Asset[] = await response.json();
      if (
        !assetsRef.current.some((asset) =>
          assets.some((a) => a.id === asset.id)
        )
      ) {
        assetsRef.current.push(...assets);
      }
      return assetsRef.current;
    },
  });
  return {
    ...query,
    assets: assetsRef.current,
  };
};

export default useGetAssets;
