# MicoPay Issuer OS

Infraestructura modular para que empresas e instituciones puedan emitir, operar, conciliar y auditar activos digitales respaldados, sin obligar a MicoPay a custodiar las reservas de todos los participantes.

> Estado: propuesta de arquitectura para revisión. Este repositorio no representa todavía un producto desplegado ni una oferta regulada.

## Idea central

MicoPay Issuer OS busca funcionar como una torre de control entre:

- activos emitidos en Stellar;
- reservas administradas por cada emisor o por un custodio autorizado;
- proveedores de liquidez y activos, como Etherfuse;
- entradas y salidas mediante SPEI;
- contabilidad, conciliación, cumplimiento y auditoría;
- productos finales como MicoPay Coffee, wallets y programas de recompensas.

```text
                         MicoPay Issuer OS
                políticas · contabilidad · auditoría
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   Stellar / tokens    Reservas / Etherfuse   SPEI / bancos
   emisión y quema      CETES y liquidez      entrada y salida
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
             Coffee · wallets · emisores · comercios
```

## Principios

1. **Separación por emisor.** Reservas, obligaciones, claves y registros nunca se mezclan entre organizaciones.
2. **Custodia explícita.** Cada activo declara quién custodia, quién emite, quién firma y quién garantiza la redención.
3. **Conciliación de tres vías.** La oferta en cadena, la contabilidad del emisor y las reservas deben coincidir.
4. **No emitir sin respaldo confirmado.** La política de emisión debe depender de evidencia durable y autorizaciones verificables.
5. **No liberar reservas sin quema confirmada.** Una redención solo concluye cuando las dos partes de la operación son definitivas.
6. **Infraestructura componible.** Stellar, Etherfuse, bancos, custodios y proveedores de identidad se integran mediante adaptadores sustituibles.
7. **ISO 20022 como lenguaje interno.** Se adopta su modelo semántico sin obligar a que todas las APIs internas utilicen XML.
8. **Autocustodia cuando sea posible.** La custodia regulada se incorpora como un modo explícito, no accidental.

## Qué reutilizamos

- Activos nativos de Stellar y Stellar Asset Contract.
- Cuentas separadas de emisión y distribución, multisig y controles de autorización.
- Stellar Anchor Platform y los SEP de autenticación, KYC, depósitos, retiros y cotizaciones.
- Etherfuse para CETES, liquidez MXN y conectividad con SPEI, sujeto a disponibilidad contractual.
- MicoPay APK para identidad, wallet y firma protegida por Android Keystore.
- El backend y el escrow existentes de MicoPay como componentes independientes, no como contabilidad del emisor.

## Qué falta construir

- libro contable de doble partida y sublibros por emisor;
- motor de conciliación entre Stellar, reservas y SPEI;
- flujos controlados de emisión, quema y redención;
- panel de activos, obligaciones, cobertura y liquidez;
- política de aprobaciones, límites y separación de funciones;
- portal de auditoría y evidencia de reservas y pasivos;
- adaptadores para custodios, bancos y proveedores de activos;
- exportaciones contables y regulatorias específicas para México;
- modelo canónico compatible con ISO 20022.

## Documentación

La definición completa, alcance, arquitectura inicial, riesgos y fases se encuentran en [PROJECT.md](./PROJECT.md).

## Límites

Este proyecto describe software financiero. No sustituye el análisis legal, contable, fiscal o regulatorio de cada emisor. La responsabilidad sobre reservas, redención, custodia y cumplimiento deberá asignarse contractualmente y reflejarse técnicamente en cada despliegue.

## Fecha de la propuesta

30 de octubre de 2026.
