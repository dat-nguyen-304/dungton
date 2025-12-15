# Danogo Swap SDK

An SDK to calculate and execute swaps on the Danogo liquidity platform on the Cardano network.

## Installation

```bash
npm install dungton
```

## Usage

### Prerequisites

This SDK relies on `@lucid-evolution/lucid` for wallet management and transaction building.

### 1. Fetch Liquidity Pools

Retrieve a list of available liquidity pools.

```typescript
import { DanogoSwap } from "dungton";

const API_PUBLIC_URL = "http://127.0.0.1:10082/api/v1/get-concentrated-pool-swap-params";
const API_POOL_URL = "https://liquidity-pair-indexer.dev.tekoapis.net";
const sdk = new DanogoSwap(API_PUBLIC_URL, API_POOL_URL);

const limit = 10;
const offset = "0"; // Pagination cursor

// Optional: Filter by token policyID + hexName
const tokenA = "token_A"; 
const tokenB = "token_B";

const pools = await sdk.getLiquidityPools(limit, offset, tokenA, tokenB);

if (pools.length > 0) {
  console.log("Pool ID:", pools[0].outRef);
  console.log("Pool Assets:", pools[0].multiAssets);
}
```

### 2. Calculate Swap Output (Preview)

Calculate the expected output of a swap without submitting a transaction. This is useful for UI previews or checking rates.

```typescript
import { DanogoSwap } from "dungton";

const API_PUBLIC_URL = "http://127.0.0.1:10082/api/v1/get-concentrated-pool-swap-params";
const API_POOL_URL = "https://liquidity-pair-indexer.dev.tekoapis.net";
const sdk = new DanogoSwap(API_PUBLIC_URL, API_POOL_URL);

const poolId = "your_pool_id_here"; // e.g., "txHash#index"
// Positive string: Selling Token Y -> Buying Token X
// Negative string: Selling Token X -> Buying Token Y
const deltaAmount = "1000000"; 

try {
  const expectedOutput = await sdk.calculateSwapOut(poolId, deltaAmount);
  console.log(`Expected output amount: ${expectedOutput}`);
} catch (error) {
  console.error("Calculation failed", error);
}
```

### 3. Submit Swap Transaction

Build and submit a swap transaction using a Lucid instance.

```typescript
import { DanogoSwap } from "dungton";
import { Lucid, Kupmios } from "@lucid-evolution/lucid";

const API_PUBLIC_URL = "http://127.0.0.1:10082/api/v1/get-concentrated-pool-swap-params";
const API_POOL_URL = "https://liquidity-pair-indexer.dev.tekoapis.net";
const sdk = new DanogoSwap(API_PUBLIC_URL, API_POOL_URL);

async function main() {
  // 1. Initialize Lucid with your provider (recommend Kupmios)
  const lucid = await Lucid(
    new Kupmios("kupo_url", "ogmios_url"),
    "Preprod"
  );
  
  // 2. Select wallet
  lucid.selectWallet.fromSeed("your seed phrase");

  const poolId = "your_pool_id_here";
  const deltaAmount = "1000000";
  const minOutChangeAmount = "900000"; // Minimum amount to receive (slippage protection)

  try {
    const txHash = await sdk.submitSwap(lucid, poolId, deltaAmount, minOutChangeAmount);
    console.log(`Transaction submitted: ${txHash}`);
  } catch (error) {
    console.error("Swap failed", error);
  }
}
```

Note for Kupmios Users: There is currently a known issue with lucid-evolution when using Kupmios for transaction evaluation. If you encounter errors during submission, you may need to manually patch node_modules/@lucid-evolution/provider/dist/index.js node_modules/@lucid-evolution/provider/dist/index.cjs by commenting out the additionalUtxo line in the evaluateTx method: 
```javascript
 const data = {
      jsonrpc: "2.0",
      method: "evaluateTransaction",
      params: {
        transaction: { cbor: tx },
        // additionalUtxo: toOgmiosUTxOs(additionalUTxOs)  // comment here
      },
      id: null
    };
 ```