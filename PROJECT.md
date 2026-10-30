# Proyecto MicoPay Issuer OS

**Fecha:** 30 de octubre de 2026  
**Estado:** propuesta para revisión  
**Propietario conceptual:** MicoPay

## 1. Resumen ejecutivo

MicoPay Issuer OS es una plataforma para operar activos digitales respaldados y productos financieros componibles. Su función principal no es poseer todas las reservas, sino coordinar de forma verificable a los emisores, custodios, redes de liquidación, proveedores de identidad y aplicaciones que utilizan esos activos.

La oportunidad surge de combinar cuatro capacidades que hoy existen por separado:

1. Stellar permite emitir, transferir, autorizar y quemar activos.
2. Etherfuse ofrece activos relacionados con CETES, liquidez en MXN y conectividad con SPEI.
3. MicoPay ya desarrolla wallet móvil, firma segura, KYC, escrow y flujos de pagos.
4. ISO 20022 aporta un lenguaje financiero interoperable para representar pagos, estados, devoluciones y conciliación.

El producto propuesto une esas piezas mediante contabilidad, políticas operativas, conciliación y paneles para múltiples emisores.

## 2. Problema

Emitir un token es técnicamente sencillo. Operarlo de forma confiable no lo es.

Un emisor necesita demostrar continuamente que:

- los tokens en circulación coinciden con sus obligaciones;
- las obligaciones están cubiertas por reservas válidas;
- cada emisión tiene un depósito o activo que la respalda;
- cada redención quema o retira el token correspondiente;
- las transferencias bancarias, movimientos en cadena y asientos contables representan la misma operación;
- ninguna persona puede emitir, redimir o liberar reservas por sí sola sin controles;
- existe evidencia suficiente para investigar diferencias y realizar auditorías.

Las blockchains muestran movimientos en cadena, pero no sustituyen la contabilidad, la custodia, la conciliación bancaria ni la responsabilidad legal del emisor.

## 3. Propuesta de valor

MicoPay Issuer OS proporciona una capa operativa neutral para:

- empresas que desean emitir su propio activo;
- instituciones que administran sus propias reservas;
- custodios o entidades reguladas que operan por cuenta de terceros;
- aplicaciones que utilizan activos emitidos por otra organización;
- comercios y productos como MicoPay Coffee;
- wallets que necesitan entradas y salidas en MXN;
- auditores y equipos de cumplimiento.

MicoPay aporta el software y la coordinación. Cada despliegue define quién conserva las reservas, quién controla las claves, quién puede emitir y quién tiene la obligación de redimir.

## 4. Modelos de operación

### 4.1 Autocustodia

El usuario controla su wallet y firma desde la APK. MicoPay prepara y transmite operaciones, pero no puede mover los fondos unilateralmente.

### 4.2 Custodia del emisor

Una empresa administra sus reservas, claves institucionales y obligación de redención. MicoPay proporciona el sistema operativo, reglas, conciliación y paneles.

### 4.3 Custodia de un tercero autorizado

Un banco, IFPE, custodio u otra entidad autorizada conserva los fondos. MicoPay se integra mediante APIs y refleja el estado operativo sin apropiarse de las reservas.

### 4.4 Modelo híbrido

Una aplicación mantiene saldos operativos custodiados para pagos frecuentes, pero permite retiros hacia wallets autocustodiadas. Los límites y responsabilidades deben mostrarse claramente al usuario.

## 5. Arquitectura conceptual

```text
┌──────────────────────────────── Productos ────────────────────────────────┐
│ MicoPay Coffee │ APK/Wallet │ Comercios │ Emisores │ APIs empresariales │
└───────────────────────────────┬───────────────────────────────────────────┘
                                │
┌──────────────────────── MicoPay Issuer OS ────────────────────────────────┐
│ Identidad y permisos                                                    │
│ Órdenes de pago, emisión, quema y redención                             │
│ Libro contable de doble partida                                         │
│ Conciliación de tres vías                                               │
│ Límites, aprobaciones y motor de políticas                              │
│ Registro de auditoría y evidencia                                       │
│ Panel de activos, pasivos, cobertura y liquidez                         │
│ Modelo canónico inspirado en ISO 20022                                  │
└───────────────┬─────────────────────┬─────────────────────┬───────────────┘
                │                     │                     │
        ┌───────▼────────┐    ┌───────▼────────┐    ┌───────▼────────┐
        │ Stellar       │    │ Reservas       │    │ Rieles fiat    │
        │ tokens/SAC    │    │ CETES/custodia │    │ SPEI/bancos    │
        └────────────────┘    └────────────────┘    └────────────────┘
```

## 6. Conciliación de tres vías

Cada emisor tendrá tres fuentes de verdad que deben coincidir:

1. **Cadena:** oferta en circulación, balances, tokens bloqueados y tokens quemados.
2. **Contabilidad:** obligaciones con usuarios, operaciones pendientes, comisiones y patrimonio.
3. **Reservas:** efectivo, CETES, cuentas por liquidar y posiciones mantenidas por custodios.

El motor de conciliación debe detectar:

- emisión sin reserva confirmada;
- reserva recibida sin emisión correspondiente;
- quema sin pago de redención;
- pago de redención sin quema definitiva;
- duplicados o reintentos;
- diferencias de redondeo;
- movimientos bancarios no identificados;
- eventos en cadena asociados al emisor, contrato o activo incorrecto.

Una diferencia abierta puede bloquear automáticamente nuevas emisiones o redenciones según su severidad.

## 7. Contabilidad

La plataforma requiere un libro de doble partida. No basta con calcular balances a partir de eventos de Stellar.

En un modelo típico de token 1:1:

- los activos de reserva representan recursos del emisor o del vehículo correspondiente;
- los tokens redimibles representan una obligación, conforme a la estructura legal aplicable;
- una emisión aumenta simultáneamente la reserva reconocida y la obligación;
- una redención reduce la obligación y, cuando corresponde, libera o entrega la reserva;
- comisiones, rendimiento y diferencias de valuación se registran por separado.

Cada emisor necesita:

- catálogo de cuentas configurable;
- moneda funcional;
- reglas de valuación;
- periodos y cierres;
- asientos reversibles, nunca edición destructiva;
- referencias cruzadas a operaciones externas;
- exportación para el sistema contable elegido;
- separación entre saldos disponibles, bloqueados y pendientes.

La clasificación contable y fiscal definitiva debe validarse con especialistas mexicanos para cada estructura jurídica.

## 8. Panel de activos y obligaciones

El panel debe mostrar, como mínimo:

- tokens emitidos y en circulación;
- tokens en tesorería, bloqueados o pendientes de quema;
- solicitudes de emisión y redención pendientes;
- valor de las reservas por tipo y custodio;
- efectivo disponible inmediatamente;
- activos con liquidación T+1 o posterior;
- cobertura total y cobertura líquida;
- rendimiento generado y destinatario económico del rendimiento;
- movimientos SPEI pendientes, confirmados, devueltos o rechazados;
- diferencias de conciliación;
- operaciones que requieren aprobación;
- estado de KYC/KYB y límites aplicables;
- evidencia y fecha de la última atestación.

El panel no es solo informativo: debe impedir operaciones cuando una política crítica no se cumple.

## 9. ISO 20022

ISO 20022 se utilizará como referencia semántica, no necesariamente como formato interno XML.

El modelo canónico conservará:

- ordenante y beneficiario;
- cuentas e instituciones participantes;
- importe, moneda y comisiones;
- propósito y datos de remesa;
- identificadores de instrucción, operación y extremo a extremo;
- estados, rechazos, devoluciones y reembolsos;
- fechas de creación, autorización, liquidación y acreditación.

Para México también se conservarán sin pérdida:

- clave de rastreo SPEI;
- referencia numérica;
- CLABE o cuenta beneficiaria;
- instituciones emisora y receptora;
- CEP y evidencia asociada;
- estado y motivo de devolución del proveedor.

Cada operación tendrá un identificador interno inmutable y una colección de identificadores externos:

```text
operation_id
├── Stellar transaction hash
├── contrato y activo exactos
├── Etherfuse transaction ID
├── clave de rastreo SPEI
├── referencia numérica
├── CEP
└── EndToEndId u otro identificador ISO, cuando exista
```

## 10. Seguridad y gobierno

- claves institucionales protegidas mediante HSM, MPC o controles equivalentes;
- claves de usuario protegidas mediante Android Keystore cuando la firma sea móvil;
- aprobaciones de cuatro ojos para emisión y liberación de reservas;
- roles separados para operación, tesorería, cumplimiento y auditoría;
- límites por importe, activo, emisor, usuario y periodo;
- idempotencia en todas las operaciones financieras;
- registro de auditoría append-only;
- alertas por discrepancias y operaciones atípicas;
- recuperación probada y procedimientos de continuidad;
- identificación obligatoria por red, emisor, contrato, activo y operación.

## 11. Integraciones iniciales

### Stellar

- emisión y distribución;
- transferencias y quema;
- flags de autorización y clawback cuando sean legalmente necesarios;
- multisig y separación de funciones;
- Stellar Asset Contract para interoperabilidad con contratos.

### Etherfuse

- CETES y otros activos disponibles;
- cotización y conversión;
- entrada y salida en MXN;
- estados y webhooks de operaciones;
- evidencia de redención y liquidación.

### SPEI o proveedor bancario

- instrucciones de pago;
- clave de rastreo y referencias;
- confirmación de acreditación;
- CEP;
- devoluciones, rechazos y conciliación.

### Identidad

- KYC/KYB mediante proveedor configurable;
- restricciones por país, producto y nivel de riesgo;
- conservación de referencias y resultados necesarios, minimizando datos sensibles.

## 12. Relación con MicoPay Coffee

MicoPay Coffee puede funcionar como el primer producto vertical sobre Issuer OS.

Una compra puede producir:

1. una orden de pago;
2. una autorización del usuario;
3. una transferencia o reserva de saldo;
4. asientos para comercio, plataforma y comisiones;
5. liquidación al comercio;
6. conciliación contra Stellar o SPEI;
7. comprobante y evidencia de auditoría.

Coffee valida el núcleo con un caso real y cotidiano. El mismo núcleo puede reutilizarse posteriormente para recompensas, nómina, wallets de marca blanca, comercios y emisores institucionales.

## 13. Relación con sistemas existentes de MicoPay

- **MicoPay Protocol:** contiene el producto transaccional actual, backend, APK y escrow. Issuer OS no debe duplicarlo sin una migración deliberada.
- **MicoPay Bridge:** aloja las iniciativas de bridge, x402, agentes y componentes relacionados que fueron separados del protocolo principal.
- **MicoPay Issuer OS:** será la capa financiera multiemisor, contable y de conciliación descrita en este documento.

Las integraciones deben realizarse mediante APIs y eventos versionados. Ningún repositorio debe depender directamente de tablas internas de otro sistema.

## 14. Estrategia de implementación

### Fase 0 — Descubrimiento y límites

- definir actores y responsabilidades legales;
- elegir el primer emisor y activo de prueba;
- confirmar capacidades contractuales de Etherfuse;
- validar tratamiento contable con especialistas;
- definir modelo de amenazas y custodia.

### Fase 1 — Libro y modelo canónico

- crear operaciones e identificadores internos;
- implementar libro de doble partida;
- definir estados y eventos idempotentes;
- crear adaptador de lectura de Stellar;
- conciliar oferta en cadena contra el libro.

### Fase 2 — Reservas y redención

- integrar proveedor de reservas;
- implementar emisión contra evidencia;
- implementar quema y redención;
- separar liquidez inmediata de activos T+1;
- bloquear operaciones ante diferencias críticas.

### Fase 3 — SPEI y México

- integrar entrada y salida bancaria;
- conservar clave de rastreo, CEP y estados;
- manejar devoluciones y duplicados;
- producir exportaciones contables y evidencia de auditoría.

### Fase 4 — Panel y multiemisor

- panel de activos y obligaciones;
- separación por organización;
- roles y aprobaciones;
- portal de auditoría;
- incorporación controlada de un segundo emisor.

### Fase 5 — Productos componibles

- integrar MicoPay Coffee;
- APIs para wallets y comercios;
- conectores alternativos de custodia y reservas;
- despliegues dedicados o administrados por el cliente.

## 15. Criterios de aceptación iniciales

- ninguna emisión puede quedar sin un asiento balanceado y evidencia de reserva;
- ninguna redención se marca completada antes de la quema y el pago confirmados;
- los reintentos no crean emisiones, pagos ni asientos duplicados;
- una discrepancia identifica exactamente emisor, red, contrato, activo y operación;
- cada saldo del panel puede explicarse mediante asientos y evidencia externa;
- las reservas de dos emisores nunca se consolidan como si fueran intercambiables;
- un auditor de solo lectura puede reconstruir el ciclo completo de una operación;
- perder temporalmente un proveedor no destruye el historial ni inventa estados finales.

## 16. Riesgos principales

1. **Custodia accidental:** asumir responsabilidades de custodia o redención sin haberlas diseñado o autorizado.
2. **Contabilidad incorrecta:** confundir eventos en cadena con asientos contables definitivos.
3. **Desfase de liquidez:** prometer redención inmediata cuando la reserva requiere T+1.
4. **Claves comprometidas:** permitir emisión o quema con una sola credencial operativa.
5. **Dependencia de proveedor:** construir todo alrededor de una única API de reservas o rampa.
6. **Datos ambiguos:** identificar activos solamente por ticker y no por red, emisor y contrato.
7. **Mezcla de reservas:** usar liquidez de un emisor para cubrir obligaciones de otro.
8. **Regulación cambiante:** diseñar una interfaz que prometa un tratamiento jurídico universal.
9. **Complejidad prematura:** implementar todos los mensajes ISO 20022 antes de necesitarlos.

## 17. Decisiones recomendadas

- construir un núcleo neutral a proveedores;
- usar Etherfuse como primer adaptador mexicano, no como única fuente posible;
- estudiar Brale como referencia y posible conector, no copiarlo como dependencia central;
- mantener la custodia como una configuración explícita por producto;
- comenzar con un activo y un emisor antes de habilitar multiemisor;
- mantener el escrow simple y separado de la contabilidad de reservas;
- adoptar compatibilidad semántica ISO 20022 desde el diseño del modelo;
- no describir ninguna función propuesta como implementada hasta contar con pruebas.

## 18. Preguntas pendientes para revisión

- ¿Cuál será el primer emisor piloto?
- ¿El primer activo será MEXe, MXNe, CETES u otro activo de prueba?
- ¿Quién asumirá contractualmente la obligación de redención?
- ¿Quién controlará las claves de emisión y distribución?
- ¿Qué parte del rendimiento de CETES corresponde al emisor, al usuario o a la plataforma?
- ¿Qué proveedor bancario entregará información SPEI y CEP de forma automatizada?
- ¿Qué sistema contable consumirá las exportaciones?
- ¿Qué límites obligan a detener emisión o redención?
- ¿Qué información de reservas puede ser pública y cuál debe permanecer restringida?
- ¿Coffee utilizará saldo autocustodiado, custodiado o híbrido en su primer piloto?

## 19. Resultado esperado

Si se implementa correctamente, MicoPay podrá ofrecer una infraestructura que permita a terceros operar sus propios activos, reservas y redes de distribución, manteniendo separación de responsabilidades y evidencia verificable.

El valor estratégico no proviene únicamente del token. Proviene de convertirse en la capa que conecta emisión, reservas, pagos, contabilidad, cumplimiento, auditoría y productos finales.
