import { useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";

const useGetCoins = () => {
  const suiClient = useSuiClient();
  return useMutation({
    mutationFn: async ({
      tx,
      owner,
      coinType,
      amount,
    }: {
      tx: Transaction;
      owner: string;
      coinType: string;
      amount: number;
    }) => {
      const coins = await suiClient.getCoins({
        owner,
        coinType,
        limit: 10,
      });
      if (coins.data.length === 0) {
        alert("No coins found");
        throw new Error("No coins found");
      }
      if (coins.data.length === 1) {
        console.log("coins.data", coins.data);
        console.log(amount, "amount");
        return tx.splitCoins(tx.object(coins.data[0].coinObjectId), [amount]);
      } else {
        console.log("coins.data", coins.data.slice(1));
        tx.mergeCoins(
          tx.object(coins.data[0].coinObjectId),
          coins.data.slice(1).map((c) => tx.object(c.coinObjectId))
        );
        return tx.splitCoins(tx.object(coins.data[0].coinObjectId), [amount]);
      }
    },
  });
};

export default useGetCoins;
