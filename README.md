# Collateralized
APP [Collateralized](https://avanademike33.github.io/Collateralized)


MINER [Sepolia PoW Faucet](https://sepolia-faucet.pk910.de)

REMIX  [Collateralized](https://app.remix.live/#lang=en&optimize&runs=200&evmVersion&version=soljson-v0.8.34+commit.80d5c536.js)

ETHER ACCOUNT [Account](https://sepolia.etherscan.io/address/0xBBEE047565f37817B5E7eAE804e18EDE706Ca61d)

ETHER ACCOUNT LEAD [Account](https://sepolia.etherscan.io/address/0x1c57a439f8b77273fcc30f6bad0d0ddbb7bc1e7e)

CONTRACT  [Contract Creation](https://sepolia.etherscan.io/tx/0x84bc4dbf7a6c75b34697760087c628f55c7e0451e3f8130d5c784f75d3318b10)
                     [Contract ](https://sepolia.etherscan.io/address/0xb382b04e3c6d914abb50d8cbb975446a5540abc6)

[Contract Deploy](https://sepolia.etherscan.io/address/0x574483ba69EaE314988cC0eDBFbfea17B53759fE)

[Deploy](https://sepolia.etherscan.io/verifycontract?a=0x574483ba69EaE314988cC0eDBFbfea17B53759fE)

[ABI Deploy](https://sepolia.etherscan.io/address/0x574483ba69EaE314988cC0eDBFbfea17B53759fE#code)
                          

CONTRACT  [Fund Loan](https://sepolia.etherscan.io/tx/0x511d161f5316aa0182da3687fb966d947c27e555cd6fd11216199d448d9fe170)


<img width="1518" height="849" alt="image" src="https://github.com/user-attachments/assets/eab06296-fc6c-4b60-94e0-c51b15f41758" />



<img width="2544" height="928" alt="image" src="https://github.com/user-attachments/assets/0edbdd91-0123-4cb0-8bee-937fe6526313" />
<img width="2542" height="954" alt="image" src="https://github.com/user-attachments/assets/a6d4f62c-d191-4807-9893-72571609130f" />
<img width="2555" height="947" alt="image" src="https://github.com/user-attachments/assets/d4cb3f6b-e3e8-4ba1-961b-c3443350d1e8" />
<img width="1412" height="835" alt="image" src="https://github.com/user-attachments/assets/66419d63-5a87-4b6f-ad69-261ee97ef57f" />

<img width="1927" height="889" alt="image" src="https://github.com/user-attachments/assets/c656593e-13ef-42bd-a9d0-4e98dafb9206" />
<img width="1704" height="816" alt="image" src="https://github.com/user-attachments/assets/4dbfbfcd-ce13-4096-b805-6795cfceff43" />
<img width="2483" height="935" alt="image" src="https://github.com/user-attachments/assets/b26588a5-8aba-4dbe-a1ab-2065f3d23521" />
<img width="2127" height="913" alt="image" src="https://github.com/user-attachments/assets/78a14c81-4dfa-49ce-af04-108f882d30da" />
<img width="2552" height="916" alt="image" src="https://github.com/user-attachments/assets/f91fcb87-b9d3-4e88-8578-4c36653d4961" />



# Collateralized Loan DApp

A full-stack decentralized lending application built with Solidity, Hardhat, Ethers.js, MetaMask, and the Ethereum Sepolia test network.

The protocol enables a borrower to lock ETH as collateral and request a loan from another wallet. A lender can fund the request, the borrower can repay principal plus interest, and the lender can claim the collateral if the loan expires without repayment.

> **Important:** This project is intended for development, demonstration, and testnet use. The smart contract has not been professionally audited and must not be used with real funds on Ethereum Mainnet.

---

## 1. Functional Overview

The application supports the complete lifecycle of a collateralized peer-to-peer loan:

```text
Borrower creates a loan request
        ↓
Borrower deposits ETH collateral
        ↓
Lender funds the requested loan
        ↓
Borrower receives the principal
        ↓
Borrower repays principal + interest
        ↓
Lender receives repayment
        ↓
Borrower receives the collateral back
```

If the borrower does not repay before the deadline:

```text
Funded loan reaches its due date
        ↓
Lender claims the locked collateral
```

---

## 2. Participants

### Borrower

The borrower:

- deposits ETH as collateral;
- selects the interest rate;
- selects the loan duration;
- creates the loan request;
- receives the loan principal after funding;
- repays principal plus interest;
- receives the collateral back after successful repayment.

The borrower cannot fund the borrower's own loan.

### Lender

The lender:

- selects an open loan request;
- funds the exact requested loan amount;
- receives principal plus interest after repayment;
- may claim collateral if the funded loan is past due and has not been repaid.

Only the wallet recorded as the lender can claim collateral.

---

## 3. Technology Stack

- **Solidity 0.8.19** for the smart contract
- **Hardhat** for compilation, testing, and deployment
- **Hardhat Toolbox** for Ethers integration, Chai matchers, fixtures, and network helpers
- **Ethers.js 6** for blockchain interaction
- **MetaMask** for wallet connection and transaction signing
- **Ethereum Sepolia** as the public test network
- **Etherscan Sepolia** for transaction inspection and source-code verification
- **HTML, CSS, and JavaScript** for the lightweight frontend
- **GitHub Pages** for static frontend hosting

---

## 4. Project Structure

A typical structure is:

```text
hardhat-js/
├── contracts/
│   └── Collateralized Loan.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── CollateralizedLoan.js
├── artifacts/
│   └── contracts/
│       └── Collateralized Loan.sol/
│           └── CollateralizedLoan.json
├── frontend/
│   └── index.html
├── hardhat.config.js
├── package.json
└── README.md
```

The `artifacts` directory is generated by Hardhat. The generated JSON artifact contains the contract ABI, creation bytecode, and deployed bytecode.

---

## 5. Smart Contract Data Model

Each loan is stored as a `Loan` structure:

```solidity
struct Loan {
    address payable borrower;
    address payable lender;
    uint256 collateralAmount;
    uint256 loanAmount;
    uint256 interestRate;
    uint256 dueDate;
    bool isFunded;
    bool isRepaid;
}
```

Loans are indexed through:

```solidity
mapping(uint256 => Loan) public loans;
uint256 public nextLoanId;
```

The first loan uses ID `0`, the second uses ID `1`, and so on.

### Interest-rate representation

The interest rate is expressed in basis points:

```text
100 basis points  = 1%
500 basis points  = 5%
1,000 basis points = 10%
10,000 basis points = 100%
```

### Collateral ratio

The contract calculates the loan principal as half of the deposited collateral:

```text
Loan amount = Collateral amount / 2
```

Example:

```text
Collateral: 2 ETH
Loan amount: 1 ETH
Interest rate: 500 basis points (5%)
Repayment amount: 1.05 ETH
```

---

## 6. Public Contract Functions

### `depositCollateralAndRequestLoan(uint256 _interestRate, uint256 _duration)`

Creates a new loan request and locks `msg.value` as collateral.

Requirements:

- collateral must be greater than zero;
- duration must be greater than zero;
- interest rate must not exceed 10,000 basis points;
- calculated loan amount must be greater than zero.

The duration is expressed in seconds.

Example values:

```text
Interest rate: 500
Duration: 86400
Collateral sent: 0.01 ETH
```

### `fundLoan(uint256 _loanId)`

Funds an existing loan.

Requirements:

- the loan must exist;
- the loan must not already be funded;
- the borrower cannot fund the borrower's own loan;
- `msg.value` must equal the stored `loanAmount`.

After funding, the loan amount is transferred to the borrower.

### `getRepaymentAmount(uint256 _loanId)`

Returns the total amount required to repay a loan:

```text
repayment = loan amount + interest
```

### `repayLoan(uint256 _loanId)`

Repays a funded loan.

Requirements:

- only the borrower can repay;
- the loan must be funded;
- the loan must not already be repaid;
- repayment must occur on or before the due date;
- `msg.value` must equal the calculated repayment amount.

After repayment:

- the lender receives principal plus interest;
- the borrower receives the collateral back;
- `isRepaid` becomes `true`;
- the stored collateral amount becomes zero.

### `claimCollateral(uint256 _loanId)`

Transfers collateral to the lender after default.

Requirements:

- only the lender can claim;
- the loan must be funded;
- the loan must not have been repaid;
- the due date must have passed;
- collateral must still be available.

### `loans(uint256)`

Auto-generated getter for the public loan mapping. It returns:

```text
borrower
lender
collateralAmount
loanAmount
interestRate
dueDate
isFunded
isRepaid
```

### `nextLoanId()`

Returns the identifier that will be assigned to the next loan.

---

## 7. Contract Events

The contract emits events for each important state transition:

```solidity
LoanRequested
LoanFunded
LoanRepaid
CollateralClaimed
```

Events provide an auditable history that can be read by block explorers, scripts, and frontend applications.

---

## 8. Security Controls

The implementation includes:

- loan-existence validation;
- duplicate-funding prevention;
- exact funding and repayment validation;
- borrower and lender authorization checks;
- due-date enforcement;
- checks-effects-interactions ordering;
- a reentrancy guard around ETH transfers;
- state updates before external calls;
- prevention of repeated collateral claims.

These protections reduce common smart-contract risks, but they do not replace a professional security audit.

---

## 9. Installation

### Prerequisites

Install:

- Node.js
- npm
- MetaMask
- a Sepolia RPC endpoint
- Sepolia test ETH

Clone or open the project and install dependencies:

```bash
npm install
```

If starting from an empty Hardhat project, the development dependencies normally include Hardhat and Hardhat Toolbox.

---

## 10. Hardhat Configuration

The project uses Solidity `0.8.19` and compiler optimization.

A representative configuration is:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    "sepolia-testnet": {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

Create a local `.env` file:

```text
SEPOLIA_RPC_URL=YOUR_SEPOLIA_RPC_ENDPOINT
PRIVATE_KEY=YOUR_TEST_WALLET_PRIVATE_KEY
```

Never commit `.env` or private keys.

Add this to `.gitignore`:

```text
.env
node_modules/
cache/
artifacts/
```

If the project already tracks artifacts for educational or verification purposes, adjust `.gitignore` according to the repository policy.

---

## 11. Compile the Contract

Clean previous artifacts and compile:

```bash
npx hardhat clean
npx hardhat compile
```

Cleaning before a final deployment helps prevent confusion between old and current artifacts.

---

## 12. Automated Testing

Run the complete test suite:

```bash
npx hardhat test
```

The implemented suite covers:

- successful deployment;
- initial `nextLoanId` value;
- successful loan creation;
- zero-collateral rejection;
- zero-duration rejection;
- successful funding;
- incorrect funding amount rejection;
- borrower self-funding rejection;
- duplicate funding rejection;
- successful repayment;
- incorrect repayment rejection;
- unauthorized repayment rejection;
- collateral claim after default;
- premature collateral claim rejection;
- unauthorized collateral claim rejection;
- repeated collateral claim rejection.

Hardhat fixtures provide isolated state for each test. Hardhat's time network helper can advance the local blockchain clock during default tests:

```javascript
await time.increase(LOAN_DURATION + 1);
```

This capability applies to the local Hardhat network. A public network such as Sepolia cannot be artificially advanced by the application, so expiry tests on Sepolia require a short duration and real waiting time.

---

## 13. Deployment Script

A deployment script should print the network, transaction hash, contract address, and bytecode result:

```javascript
const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  const network = await ethers.provider.getNetwork();
  console.log("Chain ID:", network.chainId.toString());

  const Factory =
    await ethers.getContractFactory("CollateralizedLoan");

  const contract = await Factory.deploy();

  console.log(
    "Deployment transaction:",
    contract.deploymentTransaction().hash
  );

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const code = await ethers.provider.getCode(address);

  console.log("Contract address:", address);
  console.log("Bytecode deployed:", code !== "0x");
  console.log("CollateralizedLoan deployed successfully");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
```

---

## 14. Deploy to Sepolia

The network name must exactly match the key defined in `hardhat.config.js`.

For this project:

```bash
npx hardhat run scripts/deploy.js --network sepolia-testnet
```

Using `--network sepolia` produces Hardhat error `HH100` if the configuration only defines `sepolia-testnet`.

A successful deployment returns a new immutable contract address. For the latest deployment used during development:

```text
0x574483ba69EaE314988cC0eDBFbfea17B53759fE
```

Treat the address as environment-specific configuration. If the contract is redeployed, update the frontend and documentation with the new address.

---

## 15. Local Network Versus Sepolia

Running:

```bash
npx hardhat node
```

starts a local JSON-RPC blockchain, normally at:

```text
http://127.0.0.1:8545
```

A deployment without a network argument uses Hardhat's temporary in-memory network:

```bash
npx hardhat run scripts/deploy.js
```

To deploy to a running local node:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

To deploy to Sepolia:

```bash
npx hardhat run scripts/deploy.js --network sepolia-testnet
```

These are separate blockchains. A contract deployed locally is not visible on Sepolia, and a Sepolia contract is not stored in the local Hardhat node.

---

## 16. Frontend Integration

The frontend may be implemented as a single `index.html` file using HTML, CSS, JavaScript, and Ethers.js.

Include Ethers.js 6:

```html
<script src="https://cdn.jsdelivr.net/npm/ethers@6.13.4/dist/ethers.umd.min.js"></script>
```

Configure the current Sepolia contract address:

```javascript
const CONTRACT_ADDRESS =
  "0x574483ba69EaE314988cC0eDBFbfea17B53759fE";
```

Use the ABI generated by Hardhat from:

```text
artifacts/contracts/Collateralized Loan.sol/CollateralizedLoan.json
```

The compact human-readable ABI is:

```javascript
const ABI = [
  "function nextLoanId() view returns(uint256)",
  "function loans(uint256) view returns(address borrower,address lender,uint256 collateralAmount,uint256 loanAmount,uint256 interestRate,uint256 dueDate,bool isFunded,bool isRepaid)",
  "function getRepaymentAmount(uint256) view returns(uint256)",
  "function depositCollateralAndRequestLoan(uint256,uint256) payable",
  "function fundLoan(uint256) payable",
  "function repayLoan(uint256) payable",
  "function claimCollateral(uint256)"
];
```

---

## 17. MetaMask and Sepolia Enforcement

The same wallet address can exist on multiple networks, but balances and contracts are network-specific.

Relevant chain IDs:

```text
Ethereum Mainnet: 1
Ethereum Sepolia: 11155111
Sepolia hexadecimal chain ID: 0xaa36a7
```

The frontend should request Sepolia before creating the provider:

```javascript
await window.ethereum.request({
  method: "wallet_switchEthereumChain",
  params: [{ chainId: "0xaa36a7" }]
});
```

Then initialize the connection:

```javascript
const provider =
  new ethers.BrowserProvider(window.ethereum);

await provider.send("eth_requestAccounts", []);

const signer = await provider.getSigner();

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  ABI,
  signer
);
```

Always verify the active network:

```javascript
const network = await provider.getNetwork();

if (network.chainId !== 11155111n) {
  throw new Error("Please switch MetaMask to Sepolia.");
}
```

---

## 18. Frontend Operations

### Create a loan

```javascript
const tx =
  await contract.depositCollateralAndRequestLoan(
    500n,
    86400n,
    {
      value: ethers.parseEther("0.01")
    }
  );

await tx.wait();
```

### Read a loan

```javascript
const loan = await contract.loans(0);
```

### Fund a loan

The lender enters the loan ID. The frontend retrieves the required amount automatically:

```javascript
const loan = await contract.loans(0);

const tx = await contract.fundLoan(0, {
  value: loan.loanAmount
});

await tx.wait();
```

### Read the repayment amount

```javascript
const amount =
  await contract.getRepaymentAmount(0);
```

### Repay a loan

```javascript
const amount =
  await contract.getRepaymentAmount(0);

const tx = await contract.repayLoan(0, {
  value: amount
});

await tx.wait();
```

### Claim collateral

```javascript
const tx = await contract.claimCollateral(0);
await tx.wait();
```

The claim must be sent by the lender after the due date.

---

## 19. Manual End-to-End Test

Use two MetaMask accounts with Sepolia test ETH.

### Step 1: Borrower creates a loan

Using Account A:

```text
Interest rate: 500
Duration: 86400 seconds
Collateral: 0.01 ETH
```

Submit `depositCollateralAndRequestLoan`.

### Step 2: Read the loan

Load loan ID `0` or the ID assigned to the latest request.

Expected initial state:

```text
borrower: Account A
lender: 0x0000000000000000000000000000000000000000
isFunded: false
isRepaid: false
```

### Step 3: Lender funds the loan

Switch MetaMask to Account B and ensure Account B has Sepolia ETH.

Submit `fundLoan` with the loan ID. The frontend sends the stored `loanAmount`.

Expected state:

```text
lender: Account B
isFunded: true
isRepaid: false
```

### Step 4A: Successful repayment

Switch back to Account A and submit `repayLoan` with the same loan ID.

Expected state:

```text
isFunded: true
isRepaid: true
collateralAmount: 0
```

### Step 4B: Default path

For a separate loan, select a short duration, fund it from Account B, do not repay, wait until the due date passes, and call `claimCollateral` from Account B.

The successful-repayment and default paths are alternatives and should be tested using separate loans.

---

## 20. Reading Raw Loan Output

A raw result such as:

```json
[
  "0xBBEE047565f37817B5E7eAE804e18EDE706Ca61d",
  "0x0000000000000000000000000000000000000000",
  "2",
  "1",
  "500",
  "1792647960",
  false,
  false
]
```

maps to:

```text
borrower          = 0xBBEE...
lender            = zero address
collateralAmount  = 2 wei
loanAmount        = 1 wei
interestRate      = 500 basis points
dueDate           = Unix timestamp 1792647960
isFunded          = false
isRepaid          = false
```

The zero lender address and `isFunded = false` mean that the loan has not yet been funded.

For a user-friendly frontend, format wei with:

```javascript
ethers.formatEther(value)
```

and format the due date with:

```javascript
new Date(Number(dueDate) * 1000).toLocaleString()
```

---

## 21. Etherscan Source-Code Verification

Deployment stores compiled bytecode on Sepolia. Verification publishes the corresponding source code and ABI on Sepolia Etherscan.

Verification enables:

- public source inspection;
- ABI display;
- `Read Contract`;
- `Write Contract`;
- easier event and transaction analysis.

For the verified deployment, use:

```text
Compiler: Solidity 0.8.19
Optimizer: Enabled
Runs: 200
```

The optimizer setting is critical. The same Solidity source compiled with optimizer disabled produces different bytecode. Etherscan performs a byte-for-byte comparison, so verification fails if compiler options differ from deployment options.

The recommended sequence is:

```bash
npx hardhat clean
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia-testnet
```

Immediately verify the newly deployed address using:

- the exact source used for compilation;
- Solidity `0.8.19`;
- optimization enabled;
- 200 optimizer runs;
- the matching SPDX license.

---

## 22. Troubleshooting

### `HH100: Network sepolia doesn't exist`

Cause: the command uses a network name that is not defined in `hardhat.config.js`.

Use the configured name:

```bash
npx hardhat run scripts/deploy.js --network sepolia-testnet
```

### `factory runner does not support sending transactions`

Cause: Hardhat has a provider but no valid signer for the selected network.

Check that the network includes an account/private key and that the environment variables are populated.

### `OutOfFunds`

Possible causes:

- the connected wallet lacks enough native ETH for `msg.value` plus gas;
- MetaMask is connected to Ethereum Mainnet while the funds are on Sepolia.

Display the active chain and balance from the same provider used for the transaction.

### `could not decode result data (value="0x")`

Possible causes:

- no contract exists at the configured address on the active network;
- the frontend uses an old contract address;
- MetaMask is on the wrong network;
- the ABI does not match the deployed contract.

Diagnostic check:

```javascript
const code = await provider.getCode(CONTRACT_ADDRESS);
console.log(code === "0x" ? "NO CONTRACT" : "CONTRACT FOUND");
```

### `Cannot read properties of undefined`

Cause: the contract instance was not created, usually because MetaMask was not connected or connection failed.

Before each operation:

```javascript
if (!contract) {
  alert("Connect MetaMask first");
  return;
}
```

### `invalid BigNumberish string: empty string`

Cause: a numeric field such as loan ID, interest rate, duration, or collateral is empty.

Validate every input before calling the contract.

### `Loan is not funded`

Cause: repayment was attempted before the lender funded the loan.

Correct sequence:

```text
Create → Fund → Repay
```

### `Only lender can claim collateral`

Cause: `claimCollateral` was called by the borrower or another wallet.

Switch MetaMask to the recorded lender account.

### `Borrower cannot fund own loan`

Cause: the borrower attempted to act as lender for the same loan.

Use a second MetaMask account.

### `Loan is not past due`

Cause: collateral claim was attempted before `dueDate`.

Wait until the public network timestamp passes the due date.

### `Unable to find matching Contract Bytecode and ABI`

Cause: Etherscan compiled bytecode does not match the deployed bytecode.

Check:

- exact source file;
- exact compiler version;
- optimizer enabled/disabled;
- optimizer runs;
- constructor arguments;
- libraries;
- deployment address.

For this project, enabling optimization with 200 runs resolved the mismatch.

### Favicon `404`

A missing `/favicon.ico` does not affect the DApp. Add a favicon or ignore the warning.

---

## 23. Test ETH and Wallet Safety

Sepolia ETH has no real monetary value and is intended for testing.

Use a faucet to obtain Sepolia ETH when required. Never send real Mainnet ETH to test-only workflows.

Security rules:

- never publish a private key;
- never commit `.env`;
- do not reuse a valuable Mainnet wallet for experimental development;
- never import Hardhat's publicly known local development keys into a wallet used for real funds;
- verify the selected network before confirming a transaction.

---

## 24. Known Limitations

- ETH-only collateral and lending
- fixed 50% loan-to-collateral calculation
- no partial repayment
- no loan cancellation or collateral withdrawal before funding
- no lender marketplace pagination
- no token collateral
- no price oracle
- no automatic liquidation service
- no upgrade mechanism
- no production security audit

---

## 25. Potential Enhancements

Possible next steps include:

- ERC-20 collateral and lending assets;
- Chainlink price feeds;
- dynamic loan-to-value ratios;
- loan cancellation before funding;
- pull-payment withdrawals;
- OpenZeppelin `ReentrancyGuard`;
- custom errors to reduce gas;
- frontend event history;
- transaction links to Sepolia Etherscan;
- wallet and network change listeners;
- responsive loan cards instead of raw tuple output;
- deployment-address configuration by environment;
- continuous integration for compile and test;
- automated verification through a Hardhat verification plugin.

---

## 26. Operational Checklist

Before deployment:

- [ ] Confirm Solidity version
- [ ] Confirm optimizer settings
- [ ] Run `npx hardhat clean`
- [ ] Run `npx hardhat compile`
- [ ] Run all tests
- [ ] Confirm Sepolia RPC configuration
- [ ] Confirm deployer has Sepolia ETH
- [ ] Confirm private key is not committed

After deployment:

- [ ] Record the new contract address
- [ ] Record the deployment transaction hash
- [ ] Confirm deployed bytecode is not `0x`
- [ ] Open the address on Sepolia Etherscan
- [ ] Update frontend `CONTRACT_ADDRESS`
- [ ] Update ABI if the interface changed
- [ ] Publish the frontend
- [ ] Force-refresh the hosted page
- [ ] Test wallet connection and chain ID
- [ ] Run the borrower/lender workflow
- [ ] Verify source code with optimizer enabled and 200 runs

---

## 27. Disclaimer

This software is provided for educational, development, and testnet demonstration purposes. It is not financial advice and is not approved for production use. Smart contracts can contain vulnerabilities that may result in permanent loss of funds. A professional audit, threat model, economic review, and extensive testing are required before any Mainnet deployment.

---

## 28. Summary

This project demonstrates the complete Ethereum DApp lifecycle:

```text
Protocol design
→ Solidity implementation
→ automated testing
→ compilation
→ Sepolia deployment
→ MetaMask integration
→ Ethers.js frontend
→ multi-wallet functional testing
→ Etherscan inspection
→ source-code verification
→ troubleshooting and hardening
```

The most important operational lesson is consistency. The frontend address, ABI, active MetaMask network, compiler version, optimizer settings, artifact, and deployed bytecode must all refer to the same build and deployment.

