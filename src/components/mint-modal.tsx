import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "./ui/dialog";
import { Asset } from "@/application/use-get-assets";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import IconClose from "./icons/close";
import IconChevronDown from "./icons/chevron-down";
import Image from "next/image";
import { useEffect, useState } from "react";
import useMintToken from "@/application/use-mint-token";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

const inputClassName = "!bg-[#15202B] rounded-lg p-4 w-full text-xl";

const MintModal = ({ asset }: { asset: Asset }) => {
  const { toast } = useToast();
  const price = Number(asset.mintPrice ?? 0);
  const [open, setOpen] = useState(false);
  const [suiAmount, setSuiAmount] = useState("1");
  const [tokenAmount, setTokenAmount] = useState((1 / price).toString());
  const account = useCurrentAccount();
  const { mutate: mint, isPending: isMinting } = useMintToken({
    onSuccess: () => {
      setOpen(false);
      toast({
        title: "Minted",
        description: `You have successfully minted ${tokenAmount} ${asset.symbol}`,
      });
    },
  });

  useEffect(() => {
    setSuiAmount("1");
    setTokenAmount((1 / price).toString());
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div
        onClick={() => setOpen(false)}
        className={`w-full h-full z-[999] fixed top-0 left-0 bg-black opacity-50 ${
          open ? "block" : "hidden"
        }`}
      />
      <DialogTrigger asChild>
        <Button
          className="rounded-full mt-2 text:xl sm:text-2xl pt-1"
          size="lg"
        >
          Buy ${asset.symbol}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center gap-4 w-full max-w-[500px] rounded-lg fixed top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] bg-[#15202B] p-8 z-[1000]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Image
              src={asset.iconUrl}
              alt={asset.symbol}
              className="rounded-full"
              width={30}
              height={30}
            />
            <DialogTitle className="text-3xl mt-1">
              Buy ${asset.symbol}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex items-center flex-col p-12 gap-6 bg-[#05101B] rounded-lg">
          <label className="relative w-full">
            <Input
              style={{ appearance: "textfield" }}
              type="number"
              className={inputClassName}
              value={suiAmount}
              onChange={(e) => {
                setSuiAmount(e.target.value);
                const unitAmount = Number(e.target.value);
                setTokenAmount(
                  (unitAmount / price).toFixed(2).replace(/\.?0+$/, "")
                );
              }}
            />
            <div className="absolute top-[50%] right-4 transform translate-y-[-50%]">
              Sui
            </div>
          </label>
          <IconChevronDown />
          <label className="relative w-full">
            <Input
              type="number"
              className={inputClassName}
              value={tokenAmount}
              onChange={(e) => {
                setTokenAmount(e.target.value);
                const unitAmount = Number(e.target.value);
                setSuiAmount(
                  (unitAmount * price).toFixed(9).replace(/\.?0+$/, "")
                );
              }}
            />
            <div className="absolute top-[50%] right-4 transform translate-y-[-50%]">
              {asset.symbol}
            </div>
          </label>
          <div className="">
            Lauch price: 1 ${asset.symbol} = {asset.mintPrice} Sui
          </div>
        </div>
        <DialogFooter className=" sm:flex-col flex flex-col items-center gap-4">
          <div className="text-sm px-8 text-center">
            In the Beta version, tokens are minted on the testnet, so you need
            to switch to the <span className="font-bold text-lg">testnet</span>{" "}
            to mint tokens.
          </div>
          {Boolean(account?.address) ? (
            <Button
              className="rounded-full mt-1 text-2xl"
              onClick={() => {
                mint({
                  mintPool: asset.mintPool,
                  cointype: asset.coinType,
                  suiAmount,
                  tokenAmount,
                });
              }}
              disabled={isMinting}
            >
              {isMinting && <Loader2 className="animate-spin" />}
              Mint
            </Button>
          ) : (
            <ConnectButton />
          )}
        </DialogFooter>
        <DialogClose className="absolute" asChild>
          <Button
            type="button"
            size="icon"
            className="top-4 right-4 hover:!bg-[#05101B] active:!bg-[#05101B]"
            variant="ghost"
          >
            <IconClose />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default MintModal;
