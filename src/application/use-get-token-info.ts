import { useSuiClient } from "@mysten/dapp-kit";
import { CoinMetadata, SuiObjectResponse } from "@mysten/sui/client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type UseGetTokenInfoProps = Omit<
  UseQueryOptions<CoinMetadata | null> & {
    coinType: string;
  },
  "queryKey"
>;

const useGetTokenInfo = (options?: UseGetTokenInfoProps) => {
  const coinType = options?.coinType;
  const client = useSuiClient();
  return useQuery({
    queryKey: ["token-info", coinType],
    queryFn: async () => {
      if (!coinType) {
        throw new Error("ID is required");
      }
      console.log("coinType", coinType);
      return client.getCoinMetadata({
        coinType,
      });
    },
    ...options,
  });
};

export default useGetTokenInfo;
