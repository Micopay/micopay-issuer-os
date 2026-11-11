# MicoPay Issuer OS Project

**Date:** October 30, 2026  
**Status:** proposal under review  
**Conceptual owner:** MicoPay

## 1. Executive summary

MicoPay Issuer OS is a platform for operating backed digital assets and composable financial products. Its main function is not to hold every reserve, but to verifiably coordinate the issuers, custodians, settlement networks, identity providers and applications that use those assets.

The opportunity comes from combining four capabilities that exist separately today:

1. Stellar makes it possible to issue, transfer, authorize and burn assets.
2. Etherfuse offers CETES-related assets, MXN liquidity and SPEI connectivity.
3. MicoPay already develops a mobile wallet, secure signing, KYC, escrow and payment flows.
4. ISO 20022 provides an interoperable financial language for representing payments, statuses, returns and reconciliation.

The proposed product brings those pieces together through accounting, operating policies, reconciliation and dashboards for multiple issuers.

## 2. Problem

Issuing a token is technically simple. Operating it reliably is not.

An issuer needs to continuously demonstrate that:

- the tokens in circulation match its liabilities;
- the liabilities are covered by valid reserves;
- every issuance has a deposit or asset backing it;
- every redemption burns or withdraws the corresponding token;
- bank transfers, on-chain movements and accounting entries represent the same operation;
- no single person can issue, redeem or release reserves alone without controls;
- there is enough evidence to investigate discrepancies and carry out audits.

Blockchains show on-chain movements, but they do not replace the issuer's accounting, custody, bank reconciliation or legal responsibility.

## 3. Value proposition

MicoPay Issuer OS provides a neutral operating layer for:

- companies that want to issue their own asset;
- institutions that manage their own reserves;
- custodians or regulated entities operating on behalf of third parties;
- applications that use assets issued by another organization;
- merchants and products such as MicoPay Coffee;
- wallets that need MXN inflows and outflows;
- auditors and compliance teams.

MicoPay provides the software and the coordination. Each deployment defines who holds the reserves, who controls the keys, who can issue and who is obligated to redeem.

## 4. Operating models

### 4.1 Self-custody

The user controls their wallet and signs from the APK. MicoPay prepares and submits operations, but cannot move funds unilaterally.

### 4.2 Issuer custody

A company manages its reserves, institutional keys and redemption obligation. MicoPay provides the operating system, rules, reconciliation and dashboards.

### 4.3 Authorized third-party custody

A bank, IFPE, custodian or other authorized entity holds the funds. MicoPay integrates through APIs and reflects the operating state without taking control of the reserves.

### 4.4 Hybrid model

An application keeps custodied operating balances for frequent payments, but allows withdrawals to self-custodied wallets. Limits and responsibilities must be shown clearly to the user.

## 5. Conceptual architecture

```text
┌──────────────────────────────── Products ─────────────────────────────────┐
│ MicoPay Coffee │ APK/Wallet │ Merchants │ Issuers │ Enterprise APIs      │
└───────────────────────────────┬───────────────────────────────────────────┘
                                │
┌──────────────────────── MicoPay Issuer OS ────────────────────────────────┐
│ Identity and permissions                                                │
│ Payment, issuance, burn and redemption orders                           │
│ Double-entry ledger                                                     │
│ Three-way reconciliation                                                │
│ Limits, approvals and policy engine                                     │
│ Audit log and evidence                                                  │
│ Dashboard for assets, liabilities, coverage and liquidity               │
│ Canonical model inspired by ISO 20022                                   │
└───────────────┬─────────────────────┬─────────────────────┬───────────────┘
                │                     │                     │
        ┌───────▼────────┐    ┌───────▼────────┐    ┌───────▼────────┐
        │ Stellar        │    │ Reserves       │    │ Fiat rails     │
        │ tokens/SAC     │    │ CETES/custody  │    │ SPEI/banks     │
        └────────────────┘    └────────────────┘    └────────────────┘
```

## 6. Three-way reconciliation

Each issuer will have three sources of truth that must match:

1. **Chain:** circulating supply, balances, locked tokens and burned tokens.
2. **Accounting:** liabilities to users, pending operations, fees and equity.
3. **Reserves:** cash, CETES, receivables pending settlement and positions held by custodians.

The reconciliation engine must detect:

- issuance without confirmed reserves;
- reserves received without a corresponding issuance;
- a burn without a redemption payment;
- a redemption payment without a final burn;
- duplicates or retries;
- rounding differences;
- unidentified bank movements;
- on-chain events tied to the wrong issuer, contract or asset.

An open discrepancy can automatically block new issuances or redemptions depending on its severity.

## 7. Accounting

The platform requires a double-entry ledger. Calculating balances from Stellar events is not enough.

In a typical 1:1 token model:

- reserve assets represent resources of the issuer or of the relevant vehicle;
- redeemable tokens represent a liability, according to the applicable legal structure;
- an issuance simultaneously increases the recognized reserve and the liability;
- a redemption reduces the liability and, where applicable, releases or delivers the reserve;
- fees, yield and valuation differences are recorded separately.

Each issuer needs:

- a configurable chart of accounts;
- a functional currency;
- valuation rules;
- periods and closings;
- reversible entries, never destructive edits;
- cross-references to external operations;
- exports for the accounting system of choice;
- separation between available, locked and pending balances.

The final accounting and tax classification must be validated with Mexican specialists for each legal structure.

## 8. Assets and liabilities dashboard

The dashboard must show, at a minimum:

- tokens issued and in circulation;
- tokens in treasury, locked or pending burn;
- pending issuance and redemption requests;
- reserve value by type and custodian;
- immediately available cash;
- assets with T+1 or later settlement;
- total coverage and liquid coverage;
- yield generated and the economic recipient of that yield;
- pending, confirmed, returned or rejected SPEI movements;
- reconciliation discrepancies;
- operations that require approval;
- KYC/KYB status and applicable limits;
- evidence and date of the latest attestation.

The dashboard is not just informational: it must prevent operations when a critical policy is not met.

## 9. ISO 20022

ISO 20022 will be used as a semantic reference, not necessarily as an internal XML format.

The canonical model will keep:

- debtor and creditor;
- participating accounts and institutions;
- amount, currency and fees;
- purpose and remittance data;
- instruction, transaction and end-to-end identifiers;
- statuses, rejections, returns and refunds;
- creation, authorization, settlement and crediting dates.

For Mexico, the following will also be kept without loss:

- SPEI tracking key (clave de rastreo);
- numeric reference;
- beneficiary CLABE or account;
- sending and receiving institutions;
- CEP and associated evidence;
- the provider's return status and reason.

Each operation will have an immutable internal identifier and a collection of external identifiers:

```text
operation_id
├── Stellar transaction hash
├── exact contract and asset
├── Etherfuse transaction ID
├── SPEI tracking key
├── numeric reference
├── CEP
└── EndToEndId or another ISO identifier, when available
```

## 10. Security and governance

- institutional keys protected by HSM, MPC or equivalent controls;
- user keys protected by Android Keystore when signing happens on mobile;
- four-eyes approvals for issuance and reserve release;
- separate roles for operations, treasury, compliance and audit;
- limits by amount, asset, issuer, user and period;
- idempotency in every financial operation;
- append-only audit log;
- alerts for discrepancies and unusual operations;
- tested recovery and business continuity procedures;
- mandatory identification by network, issuer, contract, asset and operation.

## 11. Initial integrations

### Stellar

- issuance and distribution;
- transfers and burns;
- authorization and clawback flags when legally required;
- multisig and segregation of duties;
- Stellar Asset Contract for interoperability with contracts.

### Etherfuse

- CETES and other available assets;
- quotes and conversion;
- MXN inflows and outflows;
- operation statuses and webhooks;
- redemption and settlement evidence.

### SPEI or banking provider

- payment instructions;
- tracking key and references;
- crediting confirmation;
- CEP;
- returns, rejections and reconciliation.

### Identity

- KYC/KYB through a configurable provider;
- restrictions by country, product and risk level;
- retention of the necessary references and results, minimizing sensitive data.

## 12. Relationship with MicoPay Coffee

MicoPay Coffee can serve as the first vertical product on top of Issuer OS.

A purchase can produce:

1. a payment order;
2. a user authorization;
3. a transfer or balance hold;
4. entries for the merchant, the platform and fees;
5. settlement to the merchant;
6. reconciliation against Stellar or SPEI;
7. a receipt and audit evidence.

Coffee validates the core with a real, everyday use case. The same core can later be reused for rewards, payroll, white-label wallets, merchants and institutional issuers.

## 13. Relationship with existing MicoPay systems

- **MicoPay Protocol:** contains the current transactional product, backend, APK and escrow. Issuer OS must not duplicate it without a deliberate migration.
- **MicoPay Bridge:** hosts the bridge, x402, agent and related initiatives that were split off from the main protocol.
- **MicoPay Issuer OS:** will be the multi-issuer financial, accounting and reconciliation layer described in this document.

Integrations must happen through versioned APIs and events. No repository should depend directly on another system's internal tables.

## 14. Implementation strategy

### Phase 0 — Discovery and boundaries

- define actors and legal responsibilities;
- choose the first test issuer and asset;
- confirm Etherfuse's contractual capabilities;
- validate the accounting treatment with specialists;
- define the threat and custody model.

### Phase 1 — Ledger and canonical model

- create operations and internal identifiers;
- implement the double-entry ledger;
- define idempotent statuses and events;
- build a Stellar read adapter;
- reconcile on-chain supply against the ledger.

### Phase 2 — Reserves and redemption

- integrate a reserve provider;
- implement issuance against evidence;
- implement burn and redemption;
- separate immediate liquidity from T+1 assets;
- block operations when critical discrepancies exist.

### Phase 3 — SPEI and Mexico

- integrate bank inflows and outflows;
- keep the tracking key, CEP and statuses;
- handle returns and duplicates;
- produce accounting exports and audit evidence.

### Phase 4 — Dashboard and multi-issuer

- assets and liabilities dashboard;
- per-organization separation;
- roles and approvals;
- audit portal;
- controlled onboarding of a second issuer.

### Phase 5 — Composable products

- integrate MicoPay Coffee;
- APIs for wallets and merchants;
- alternative custody and reserve connectors;
- dedicated or customer-managed deployments.

## 15. Initial acceptance criteria

- no issuance can exist without a balanced entry and reserve evidence;
- no redemption is marked complete before the burn and payment are confirmed;
- retries do not create duplicate issuances, payments or entries;
- a discrepancy identifies exactly the issuer, network, contract, asset and operation;
- every dashboard balance can be explained through entries and external evidence;
- the reserves of two issuers are never consolidated as if they were interchangeable;
- a read-only auditor can reconstruct the full lifecycle of an operation;
- temporarily losing a provider does not destroy history or invent final statuses.

## 16. Main risks

1. **Accidental custody:** taking on custody or redemption responsibilities without having designed or authorized them.
2. **Incorrect accounting:** confusing on-chain events with final accounting entries.
3. **Liquidity mismatch:** promising immediate redemption when the reserve requires T+1.
4. **Compromised keys:** allowing issuance or burns with a single operational credential.
5. **Provider dependency:** building everything around a single reserve or ramp API.
6. **Ambiguous data:** identifying assets only by ticker rather than by network, issuer and contract.
7. **Commingled reserves:** using one issuer's liquidity to cover another's liabilities.
8. **Changing regulation:** designing an interface that promises a universal legal treatment.
9. **Premature complexity:** implementing every ISO 20022 message before it is needed.

## 17. Recommended decisions

- build a provider-neutral core;
- use Etherfuse as the first Mexican adapter, not as the only possible source;
- study Brale as a reference and possible connector, not copy it as a central dependency;
- keep custody as an explicit per-product configuration;
- start with one asset and one issuer before enabling multi-issuer;
- keep the escrow simple and separate from reserve accounting;
- adopt ISO 20022 semantic compatibility from the model design onward;
- do not describe any proposed feature as implemented until it has been tested.

## 18. Open questions for review

- Who will be the first pilot issuer?
- Will the first asset be MEXe, MXNe, CETES or another test asset?
- Who will contractually take on the redemption obligation?
- Who will control the issuing and distribution keys?
- What share of the CETES yield belongs to the issuer, the user or the platform?
- Which banking provider will deliver SPEI and CEP information automatically?
- Which accounting system will consume the exports?
- Which limits require halting issuance or redemption?
- Which reserve information can be public and which must remain restricted?
- Will Coffee use self-custodied, custodied or hybrid balances in its first pilot?

## 19. Expected outcome

If implemented correctly, MicoPay will be able to offer infrastructure that lets third parties operate their own assets, reserves and distribution networks, while keeping responsibilities separate and evidence verifiable.

The strategic value does not come from the token alone. It comes from becoming the layer that connects issuance, reserves, payments, accounting, compliance, auditing and end products.
