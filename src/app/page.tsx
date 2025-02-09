"use client";

import Image from "next/image";
import Jokepapa from "../assets/logo.png";
import ConnectButton from "@/components/connect-button";
import HeroBanner from "../assets/hero-banner.png";
import useGetAssets from "@/application/use-get-assets";
import { Tweet } from "react-tweet/api";
import {
  type TwitterComponents,
  enrichTweet,
  TweetContainer,
  TweetHeader,
  TweetBody,
  TweetMedia,
  QuotedTweet,
  TweetInfo,
  TweetActions,
} from "react-tweet";
import MintModal from "@/components/mint-modal";
import { ExternalLinkIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import IconX from "@/components/icons/x";
import { Skeleton } from "@/components/ui/skeleton";

const MyTweet = ({
  tweet: t,
  components,
}: {
  tweet?: Tweet;
  components?: TwitterComponents;
}) => {
  console.log(t);
  const tweet = enrichTweet(t ?? ({} as Tweet));
  return (
    <TweetContainer className="!my-[0px] h-full flex flex-col">
      <div className="flex flex-col flex-1 h-full">
        <TweetHeader tweet={tweet} components={components} />
        <div className="flex-1">
          <TweetBody tweet={tweet} />
        </div>
        {tweet.mediaDetails?.length ? (
          <TweetMedia tweet={tweet} components={components} />
        ) : null}
        {tweet.quoted_tweet && <QuotedTweet tweet={tweet.quoted_tweet} />}
        <TweetInfo tweet={tweet} />
        <TweetActions tweet={tweet} />
      </div>
    </TweetContainer>
  );
};

const limit = 6;
export default function Home() {
  const [page, setPage] = useState(0);
  const { assets, error, isPending } = useGetAssets({
    limit,
    offset: page * limit,
  });
  const count = assets?.[0]?.count ?? "0";
  const hasLoadMore = Number(count) > (page + 1) * limit;

  console.log(assets);
  console.log(error);
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-8">
      <div className="p-4 grid grid-cols-3 gap-4 w-full fixed top-[0px] bg-[#000000] z-[999]">
        <div className="flex gap-2 items-center justify-start">
          <Image
            src={Jokepapa.src}
            alt="Logo"
            className="rounded-full sm:w-[50px] sm:h-[50px] w-[30px] h-[30px]"
            width={50}
            height={50}
          />
          <div className="font-normal hidden sm:block">Follow on</div>
          <Link href="https://x.com/thejokepapa">
            <IconX />
          </Link>
        </div>
        <div className="flex gap-2 items-center text-2xl sm:text-5xl text-center font-bold justify-center">
          Jokepapa
        </div>
        <div className="flex gap-2 items-center justify-end">
          <ConnectButton />
        </div>
      </div>
      <div className="flex justify-center mt-[62px] sm:mt-[82px]">
        <Image
          src={HeroBanner.src}
          alt="Hero Banner"
          width={1920}
          height={690}
        />
      </div>
      <div className="flex gap-2 items-center text-2xl sm:text-5xl text-center font-bold justify-center">
        Trending Jokes...
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-[1024px]">
        {assets?.map((asset) => (
          <div
            key={asset.id}
            className="flex flex-col gap-2 items-center bg-[#15202B] p-4 pt-3 rounded-lg"
          >
            <div className="text:2xl sm:text-3xl font-bold flex-1 flex gap-2 items-center">
              <Image
                src={asset.iconUrl}
                alt={asset.symbol}
                className="rounded-full w-[20px] h-[20px] sm:w-[30px] sm:h-[30px]"
                width={30}
                height={30}
              />
              <div className="mt-1">${asset.symbol}</div>
              <Link href={asset.tokenUrl} target="_blank">
                <ExternalLinkIcon className="w-4 h-4 sm:w-6 sm:h-6" />
              </Link>
            </div>
            <div className="block w-full h-full">
              <div data-theme="dark" className="h-full w-full">
                <MyTweet tweet={asset.tweet} />
              </div>
            </div>
            <MintModal asset={asset} />
          </div>
        ))}
        {isPending &&
          Array.from(Array(limit).keys()).map((i) => (
            <Skeleton key={i} className="h-72 w-full rounded-lg" />
          ))}
      </div>

      <Button
        onClick={() => {
          setPage(page + 1);
        }}
        className={`self-center mt-4 text-2xl rounded-full ${
          hasLoadMore ? "" : "opacity-0 invisible"
        }`}
      >
        {isPending && <Loader2 className={`animate-spin`} />}
        Load More
      </Button>

      <div className="flex gap-2 items-center text-xl sm:text-5xl text-center font-bold justify-center my-8">
        Laugh to Earn with Jokepapa!
      </div>
    </div>
  );
}
