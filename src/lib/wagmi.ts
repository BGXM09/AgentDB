"use client";

import { createConfig, http } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";
import { injected } from "wagmi/connectors/injected";

export const wagmiConfig = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [injected()],
  transports: { [bsc.id]: http(), [bscTestnet.id]: http() },
  ssr: true,
});

declare module "wagmi" { interface Register { config: typeof wagmiConfig } }
