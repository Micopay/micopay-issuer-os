/**
 * Minimal i18n, same mechanism as micopay-cafe: keys are the Spanish strings,
 * English is the default language and `?lang=` wins over the saved choice.
 * `{name}` placeholders are interpolated. Unknown strings fall back to themselves.
 */
export type Lang = 'es' | 'en';

function initialLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q === 'es' || q === 'en') { localStorage.setItem('lang', q); return q; }
    const saved = localStorage.getItem('lang');
    if (saved === 'es' || saved === 'en') return saved;
  } catch { /* storage unavailable: use default */ }
  return 'en';
}

export const lang: Lang = initialLang();
export const locale = lang === 'en' ? 'en-US' : 'es-MX';

export function setLang(l: Lang) {
  try { localStorage.setItem('lang', l); } catch { /* ignore */ }
  const url = new URL(window.location.href);
  url.searchParams.delete('lang');
  window.location.replace(url.toString());
}

export function t(s: string, vars?: Record<string, string | number>): string {
  let out = lang === 'en' ? EN[s] ?? s : s;
  if (vars) for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
  return out;
}

const EN: Record<string, string> = {
  // chrome
  'Emisor': 'Issuer',
  'Tablero': 'Dashboard',
  'Operaciones': 'Operations',
  'Discrepancias': 'Discrepancies',
  'Activo': 'Asset',
  'Red': 'Network',
  'Cuenta emisora': 'Issuing account',
  'Contrato': 'Contract',
  'Prototipo con datos ficticios': 'Prototype with fictitious data',
  'Nada de esta pantalla es real: ni el emisor, ni el activo, ni las reservas, ni las operaciones. Las cifras y las reglas son supuestos de ejemplo, no políticas del producto. MicoPay no emite ni custodia este activo.':
    'Nothing on this screen is real: not the issuer, the asset, the reserves or the operations. Figures and rules are example assumptions, not product policies. MicoPay does not issue or hold this asset.',
  // placeholders
  'Vista pendiente': 'View pending',
  'Esta vista se construye en {issue}. El estado y las acciones del simulador ya están en {archivo}.': 'This view is built in {issue}. The simulator state and actions are already in {archivo}.',
  'Reiniciar escenario': 'Reset scenario',
  '¿Volver al escenario inicial? Se pierde todo lo que hiciste en la maqueta.': 'Go back to the initial scenario? Everything you did in the mock-up is lost.',
  'Redención con SPEI': 'Redemption via SPEI',
  'Pendiente de fondos': 'Pending funds',
  'Detalle de operación': 'Operation detail',
  'Operación {id}': 'Operation {id}',
  'No existe una operación {id} en el ejemplo.': 'There is no operation {id} in the example.',
  'Ver todas las operaciones': 'See all operations',
  'Página no encontrada': 'Page not found',
  'Ir al tablero': 'Go to the dashboard',
  'Folio': 'ID',
  'Tipo': 'Type',
  'Estado': 'Status',
  'Monto': 'Amount',
  // operation types and statuses (example data)
  'Emisión': 'Issuance',
  'Pago de café': 'Coffee payment',
  'Completa': 'Complete',
  'Incompleta': 'Incomplete',
  // operation detail (IOS-2)
  'Volver a operaciones': 'Back to operations',
  'Monto de la operación': 'Operation amount',
  'Deudor': 'Debtor',
  'Acreedor': 'Creditor',
  'Fechas': 'Dates',
  'Creación': 'Creation',
  'Autorización': 'Authorization',
  'Liquidación': 'Settlement',
  'Abono': 'Crediting',
  'Línea de tiempo': 'Timeline',
  'Confirmado': 'Confirmed',
  'Pendiente': 'Pending',
  'Evidencia': 'Evidence',
  'Referencias externas': 'External references',
  'Hash de Stellar': 'Stellar hash',
  'Clave de rastreo SPEI': 'SPEI tracking key',
  'Referencia numérica': 'Numeric reference',
  'CLABE beneficiaria': 'Beneficiary CLABE',
  'End-to-End ID': 'End-to-End ID',
  'Etherfuse': 'Etherfuse',
  'Identidad del activo': 'Asset identity',
  'Código': 'Code',
  'Identificadores ficticios: no son enlaces ni existen en la red.': 'Fictitious identifiers: they are not links and do not exist on the network.',
  'Faltante': 'Missing evidence',
  'Falta el CEP del pago SPEI. Una redención no se marca como completa antes de confirmar la quema y el pago (PROJECT.md §15).':
    'The SPEI payment CEP is missing. A redemption is not marked complete before the burn and the payment are confirmed (PROJECT.md §15).',
  'Regla 3: el saldo bancario no alcanza para pagarla. Los tokens quedan apartados hasta que haya fondos.':
    'Rule 3: the bank balance is not enough to pay it. The tokens stay set aside until funds are available.',
  // dashboard (IOS-1)
  'Circulación': 'Circulation',
  'Incluye {monto} MXEJ apartados para quemar.': 'Includes {monto} MXEJ set aside for burning.',
  'Saldo bancario disponible en el ejemplo': 'Bank balance available in the example',
  'Solo el saldo bancario puede pagar por SPEI en el ejemplo.':
    'Only the bank balance can pay out by SPEI in the example.',
  'Posiciones': 'Positions',
  'CETES tokenizados': 'Tokenized CETES',
  'Valuación simulada': 'Simulated valuation',
  'Corte: {fecha}.': 'Cut-off: {fecha}.',
  'Rendimiento de los CETES: por definir (no asignado a nadie).':
    'CETES yield: to be defined (not assigned to anyone).',
  'Saldo bancario': 'Bank balance',
  'Única posición que puede pagar por SPEI en el ejemplo.':
    'The only position that can pay out by SPEI in the example.',
  'Conversiones pendientes de CETES a banco': 'Pending CETES-to-bank conversions',
  'No se suma al respaldo hasta confirmar el abono.':
    'Not added to backing until the credit is confirmed.',
  'Indicadores': 'Indicators',
  'Respaldo total': 'Total backing',
  'CETES más banco. No incluye conversiones pendientes ni depósitos sin identificar.':
    'CETES plus bank. Excludes pending conversions and unidentified deposits.',
  'Cobertura total': 'Total coverage',
  'Cobertura suficiente': 'Sufficient coverage',
  'Cobertura insuficiente': 'Insufficient coverage',
  'Respaldo total entre el pasivo.': 'Total backing over liabilities.',
  'Cobertura bancaria': 'Bank coverage',
  'Solo banco': 'Bank only',
  'Saldo bancario entre el pasivo: lo que puede pagarse por SPEI.':
    'Bank balance over liabilities: what can be paid out by SPEI.',
  'Saldo bancario rastreable': 'Traceable bank balance',
  'Cada partida del banco con su evidencia; las ligadas a una operación abren su detalle.':
    'Every bank entry with its evidence; entries tied to an operation open its detail.',
  'Fecha': 'Date',
  'Concepto': 'Description',
  'Operación': 'Operation',
  'Suma de partidas': 'Sum of entries',
  'Saldo del banco': 'Bank balance',
  'Cuadra con el saldo': 'Matches the balance',
  'No cuadra con el saldo': 'Does not match the balance',
  'Solicitudes pendientes': 'Pending requests',
  'Solicitudes que aún no están completas; cada folio abre su detalle.':
    'Requests that are not complete yet; each ID opens its detail.',
  'No hay solicitudes pendientes en el ejemplo.': 'There are no pending requests in the example.',
  'Notas del ejemplo': 'Example notes',
  'Sin atestación registrada en el ejemplo.': 'No attestation recorded in the example.',
  // discrepancies panel (IOS-3)
  'Discrepancias detectadas': 'Detected discrepancies',
  'Reglas de ejemplo': 'Example rules',
  'Supuestos de ejemplo, no políticas del producto.': 'Example assumptions, not product policies.',
  'Regla': 'Rule',
  'Efecto': 'Effect',
  'Base': 'Basis',
  'Activa': 'Active',
  'Inactiva': 'Inactive',
  'Regla {id}': 'Rule {id}',
  'Sin evidencia del depósito': 'Without deposit evidence',
  'No se emite': 'Not issued',
  'README.md (principio 4) y PROJECT.md §15': 'README.md (principle 4) and PROJECT.md §15',
  'Respaldo total menor a 100 %': 'Total backing under 100%',
  'Bloquea nuevas emisiones': 'Blocks new issuances',
  'Política ficticia del ejemplo': 'Fictitious example policy',
  'Saldo bancario insuficiente para una redención': 'Insufficient bank balance for a redemption',
  'La redención queda pendiente de fondos, con alerta': 'Redemption stays pending funds, with alert',
  'Política ficticia del ejemplo; la real no está documentada (PROJECT.md §18)': 'Fictitious example policy; real policy is not documented (PROJECT.md §18)',
  'Quema sin pago SPEI confirmado': 'Burn without confirmed SPEI payment',
  'Discrepancia; la redención queda incompleta': 'Discrepancy; redemption stays incomplete',
  'PROJECT.md §6 y §15': 'PROJECT.md §6 and §15',
  'Filtrar por estado': 'Filter by status',
  'Todos los estados': 'All statuses',
  'Abierta': 'Open',
  'Resuelta': 'Resolved',
  'Filtrar por gravedad': 'Filter by severity',
  'Todas las gravedades': 'All severities',
  'Alta': 'High',
  'Media': 'Medium',
  'Baja': 'Low',
  'Filtrar por tipo': 'Filter by type',
  'Todos los tipos': 'All types',
  'Quema sin pago de redención': 'Burn without redemption payment',
  'Movimiento bancario no identificado': 'Unidentified bank movement',
  'Diferencia de redondeo': 'Rounding difference',
  'Tipo y descripción': 'Type and description',
  'Gravedad y estado': 'Severity and status',
  'Identificación completa': 'Full identification',
  'Bloqueo': 'Blocks',
  'No aplica': 'Not applicable',
  'No hay discrepancias que coincidan con los filtros seleccionados.': 'No discrepancies match the selected filters.',
  'Los tokens se quemaron y el pago SPEI ya se inició, pero falta la evidencia (CEP).': 'The tokens were burned and SPEI payment initiated, but evidence (CEP) is missing.',
  'La redención queda incompleta. No bloquea otras operaciones en el ejemplo.': 'Redemption stays incomplete. Does not block other operations in the example.',
  'Un depósito en la cuenta de Banco Ejemplo sin operación que lo explique.': 'A deposit in Example Bank account without an explaining operation.',
  'No se cuenta en el saldo bancario ni en el respaldo hasta identificarlo.': 'Not counted in bank balance or backing until identified.',
  'MXN 0.01 de diferencia entre el importe pactado y el transferido.': 'MXN 0.01 difference between agreed and transferred amount.',
  'Ninguno.': 'None.',
};
