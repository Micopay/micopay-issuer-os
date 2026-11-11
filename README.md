# MicoPay Issuer OS

Modular infrastructure that lets companies and institutions issue, operate, reconcile and audit backed digital assets, without requiring MicoPay to custody every participant's reserves.

> Status: architecture proposal under review. This repository does not yet represent a deployed product or a regulated offering.

## Core idea

MicoPay Issuer OS aims to act as a control tower between:

- assets issued on Stellar;
- reserves managed by each issuer or by an authorized custodian;
- liquidity and asset providers, such as Etherfuse;
- inflows and outflows through SPEI;
- accounting, reconciliation, compliance and auditing;
- end products such as MicoPay Coffee, wallets and rewards programs.

```text
                         MicoPay Issuer OS
                  policies · accounting · audit
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   Stellar / tokens    Reserves / Etherfuse   SPEI / banks
   issuance and burn    CETES and liquidity   inflow and outflow
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
             Coffee · wallets · issuers · merchants
```

## Principles

1. **Per-issuer separation.** Reserves, liabilities, keys and records are never commingled across organizations.
2. **Explicit custody.** Each asset declares who custodies, who issues, who signs and who guarantees redemption.
3. **Three-way reconciliation.** On-chain supply, the issuer's books and the reserves must match.
4. **No issuance without confirmed backing.** The issuance policy must depend on durable evidence and verifiable authorizations.
5. **No reserve release without a confirmed burn.** A redemption only completes when both legs of the operation are final.
6. **Composable infrastructure.** Stellar, Etherfuse, banks, custodians and identity providers are integrated through replaceable adapters.
7. **ISO 20022 as the internal language.** Its semantic model is adopted without requiring every internal API to use XML.
8. **Self-custody where possible.** Regulated custody is added as an explicit mode, not an accidental one.

## What we reuse

- Stellar native assets and the Stellar Asset Contract.
- Separate issuing and distribution accounts, multisig and authorization controls.
- Stellar Anchor Platform and the SEPs for authentication, KYC, deposits, withdrawals and quotes.
- Etherfuse for CETES, MXN liquidity and SPEI connectivity, subject to contractual availability.
- The MicoPay APK for identity, wallet and signing protected by Android Keystore.
- MicoPay's existing backend and escrow as independent components, not as the issuer's ledger.

## What remains to be built

- double-entry ledger with per-issuer subledgers;
- reconciliation engine across Stellar, reserves and SPEI;
- controlled issuance, burn and redemption flows;
- dashboard for assets, liabilities, coverage and liquidity;
- approval policy, limits and segregation of duties;
- audit portal with evidence of reserves and liabilities;
- adapters for custodians, banks and asset providers;
- Mexico-specific accounting and regulatory exports;
- canonical model compatible with ISO 20022.

## Documentation

The full definition, scope, initial architecture, risks and phases are in [PROJECT.md](./PROJECT.md).

## Limitations

This project describes financial software. It does not replace the legal, accounting, tax or regulatory analysis of each issuer. Responsibility for reserves, redemption, custody and compliance must be assigned contractually and reflected technically in each deployment.

## Proposal date

October 30, 2026.
