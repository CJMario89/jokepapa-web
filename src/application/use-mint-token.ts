import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type UseMintTokenProps = UseMutationOptions<
  void,
  Error,
  {
    cointype: string;
    suiAmount: string;
    tokenAmount: string;
  }
>;

const useMintToken = (options?: UseMintTokenProps) => {
  const account = useCurrentAccount();
  // const { mutateAsync: getCoins } = useGetCoins();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      onError: (error) => {
        console.error(error);
      },
    });
  return useMutation({
    mutationFn: async ({
      mintPool,
      cointype,
      suiAmount,
      tokenAmount,
    }: {
      mintPool: string;
      cointype: string;
      suiAmount: string;
      tokenAmount: string;
    }) => {
      const module = cointype.split("::")[1];
      const packageId = cointype.split("::")[0];
      if (!account) {
        throw new Error("Account is required");
      }
      if (!cointype) {
        throw new Error("CoinType is required");
      }
      if (!packageId) {
        throw new Error("Package is required");
      }
      const tx = new Transaction();

      const coinId = tx.splitCoins(tx.gas, [
        tx.pure.u64(Number(suiAmount) * Math.pow(10, 9)),
      ]);
      // const coinId = await getCoins({
      //   tx,
      //   owner: account?.address,
      //   coinType: "0x2::sui::SUI",
      //   amount: Number(suiAmount) * Math.pow(10, 9),
      // });

      tx.moveCall({
        module,
        package: packageId,
        function: "mint",
        arguments: [
          tx.object(mintPool),
          coinId,
          tx.pure.u64(Number(tokenAmount) * Math.pow(10, 2)),
        ],
      });

      await signAndExecuteTransaction({
        transaction: tx,
      });
      return;
    },
    ...options,
  });
};

export default useMintToken;
