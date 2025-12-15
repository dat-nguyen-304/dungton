import { ApiMultiAsset } from "./lpResponse";

export interface ConcentratedPool {
  outRef: string;
  validityNft: string;
  address: string;
  coin: string;
  multiAssets: ApiMultiAsset[];
  refScriptCborHex?: string | null;
  lpTokenTotalSupply: string;
  tokenA: string;
  tokenAReserve: string;
  tokenB: string;
  tokenBReserve: string;
  lpFee: number;
  platformFeeRate: number;
  priceLowerNum: string;
  priceLowerDen: string;
  priceUpperNum: string;
  priceUpperDen: string;
  platformFeeA: string;
  platformFeeB: string;
  minAChange: string;
  minBChange: string;
  lastWithdrawEpoch: number;
}

export interface DanogoPools {
  liquidityPools: ConcentratedPool[];
  offset: string;
}