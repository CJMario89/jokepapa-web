"use client";

import {
  ConnectModal,
  useAccounts,
  useCurrentAccount,
  useCurrentWallet,
  useDisconnectWallet,
  useSwitchAccount,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import IconCheck from "./icons/check";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@radix-ui/react-menubar";
import IconWallet from "./icons/wallet";

export const formatAddress = (address?: string) =>
  `${address?.slice(0, 4)}...${address?.slice(-2)}`;

const ConnectButton = () => {
  const { mutate: switchAccount } = useSwitchAccount();
  const currentAccount = useCurrentAccount();
  const accounts = useAccounts();
  const { connectionStatus } = useCurrentWallet();

  const { mutate: disconnect } = useDisconnectWallet();
  const [open, setOpen] = useState(false);

  return (
    <>
      {connectionStatus === "connected" ? (
        <Menubar className="flex">
          <MenubarMenu>
            <MenubarTrigger>
              <div className="flex items-center gap-2">
                <IconWallet />
                <div className="items-center">
                  {formatAddress(currentAccount?.address)}
                </div>
              </div>
            </MenubarTrigger>
            <MenubarContent className="gap-2 bg-[#111111] rounded-lg">
              {accounts.map((account) => (
                <MenubarItem key={account.address}>
                  <Button
                    onClick={() => switchAccount({ account })}
                    variant="ghost"
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    {account.address === currentAccount?.address && (
                      <IconCheck />
                    )}
                    {formatAddress(account.address)}
                  </Button>
                </MenubarItem>
              ))}
              <MenubarItem>
                <Button
                  size="sm"
                  onClick={() => {
                    disconnect();
                    setOpen(false);
                  }}
                  variant="ghost"
                >
                  Disconnect
                </Button>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      ) : (
        <ConnectModal
          trigger={
            <Button disabled={!!currentAccount}>
              {currentAccount ? currentAccount.address : "Connect Wallet"}
            </Button>
          }
          open={open}
          onOpenChange={(isOpen) => setOpen(isOpen)}
        />
      )}
    </>
  );
};

export default ConnectButton;
