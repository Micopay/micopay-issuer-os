import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Panel, Subtitulo, Tabla, Titulo, td, tdNum } from '../comun';
import { dia, mxn, porcentaje, token } from '../format';
import { t } from '../i18n';
import { pesos } from '../sim/modelo';
import {
  cobertura,
  coberturaLiquida,
  conversionesPendientes,
  pasivo,
  respaldoTotal,
  solicitudesPendientes,
  sumaPartidasBanco,
} from '../sim/selectores';
import { useSim } from '../sim/SimProvider';
import { Badge, MoneyBlock } from '../ui';

/* Bloque de cifra con nota y distintivo. Usa el radio de 4 px del token
   --radius-lg (el mismo Marco de OperacionDetalle), no tarjetas dentro de
   tarjetas: cada bloque vive en una rejilla, no dentro de un Panel. */
function Metrica({
  etiqueta,
  children,
  nota,
  badge,
}: {
  etiqueta: string;
  children: ReactNode;
  nota?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <div className="rounded-lg border-2 border-tinta bg-papel p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="text-[11px] font-bold uppercase tracking-[.12em] text-gris">{etiqueta}</div>
        {badge}
      </div>
      <div
        className="num mt-1.5 font-display text-[22px] font-extrabold leading-none tracking-[-.01em]"
        style={{ fontVariationSettings: '"wdth" 106' }}
        translate="no"
      >
        {children}
      </div>
      {nota ? <div className="mt-2 text-[13px] text-gris">{nota}</div> : null}
    </div>
  );
}

export default function Tablero() {
  const { estado } = useSim();
  const e = estado;

  const coberturaTotal = cobertura(e);
  const coberturaTotalOk = coberturaTotal >= 1;
  const partidas = sumaPartidasBanco(e);
  const cuadra = partidas === e.banco;
  const pendientes = solicitudesPendientes(e);

  return (
    <>
      <Titulo cintillo={t('Emisor')}>{t('Tablero')}</Titulo>

      <div className="grid gap-6 md:grid-cols-2">
        <MoneyBlock
          etiqueta={t('Circulación')}
          cifra={`${token(pesos(pasivo(e)))} MXEJ`}
          tipo="saldo"
          pie={t('Incluye {monto} MXEJ apartados para quemar.', {
            monto: token(pesos(e.pendientesDeQuema)),
          })}
        />
        <MoneyBlock
          etiqueta={t('Saldo bancario disponible en el ejemplo')}
          cifra={mxn(pesos(e.banco))}
          tipo="cobro"
          pie={t('Solo el saldo bancario puede pagar por SPEI en el ejemplo.')}
        />
      </div>

      <section aria-label={t('Posiciones')} data-testid="tablero-posiciones">
        <Subtitulo>{t('Posiciones')}</Subtitulo>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Metrica
            etiqueta={t('CETES tokenizados')}
            badge={<Badge tono="papel">{t('Valuación simulada')}</Badge>}
            nota={
              <>
                {t('Corte: {fecha}.', { fecha: dia(e.corte) })}{' '}
                {t('Rendimiento de los CETES: por definir (no asignado a nadie).')}
              </>
            }
          >
            {mxn(pesos(e.cetes))}
          </Metrica>
          <Metrica
            etiqueta={t('Saldo bancario')}
            nota={t('Única posición que puede pagar por SPEI en el ejemplo.')}
          >
            {mxn(pesos(e.banco))}
          </Metrica>
          <Metrica
            etiqueta={t('Conversiones pendientes de CETES a banco')}
            badge={<Badge tono="aviso">{t('Pendiente')}</Badge>}
            nota={t('No se suma al respaldo hasta confirmar el abono.')}
          >
            {mxn(pesos(conversionesPendientes(e)))}
          </Metrica>
        </div>
      </section>

      <section aria-label={t('Indicadores')} data-testid="tablero-indicadores">
        <Subtitulo>{t('Indicadores')}</Subtitulo>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Metrica
            etiqueta={t('Respaldo total')}
            nota={t('CETES más banco. No incluye conversiones pendientes ni depósitos sin identificar.')}
          >
            {mxn(pesos(respaldoTotal(e)))}
          </Metrica>
          <Metrica
            etiqueta={t('Cobertura total')}
            badge={
              <Badge tono={coberturaTotalOk ? 'verde' : 'aviso'}>
                {t(coberturaTotalOk ? 'Cobertura suficiente' : 'Cobertura insuficiente')}
              </Badge>
            }
            nota={t('Respaldo total entre el pasivo.')}
          >
            {porcentaje(coberturaTotal)}
          </Metrica>
          <Metrica
            etiqueta={t('Cobertura bancaria')}
            badge={<Badge tono="aviso">{t('Solo banco')}</Badge>}
            nota={t('Saldo bancario entre el pasivo: lo que puede pagarse por SPEI.')}
          >
            {porcentaje(coberturaLiquida(e))}
          </Metrica>
        </div>
      </section>

      <section aria-label={t('Saldo bancario rastreable')} data-testid="tablero-partidas">
        <Subtitulo>{t('Saldo bancario rastreable')}</Subtitulo>
        <Panel>
          <div className="border-b-2 border-linea px-4 py-3 text-[13px] text-gris">
            {t('Cada partida del banco con su evidencia; las ligadas a una operación abren su detalle.')}
          </div>
          <Tabla
            cabeceras={[
              t('Fecha'),
              t('Concepto'),
              t('Evidencia'),
              t('Operación'),
              { t: t('Monto'), derecha: true },
            ]}
          >
            {e.partidasBanco.map((p, i) => (
              <tr key={`${p.fecha}-${p.concepto}-${i}`}>
                <td className={td + ' num whitespace-nowrap'}>{dia(p.fecha)}</td>
                <td className={td}>{p.concepto}</td>
                <td className={td + ' text-gris'}>{p.evidencia}</td>
                <td className={td}>
                  {p.operacion ? (
                    <Link
                      to={`/operaciones/${p.operacion}`}
                      className="inline-flex min-h-12 items-center font-bold underline num whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
                    >
                      {p.operacion}
                    </Link>
                  ) : (
                    <span className="text-gris">—</span>
                  )}
                </td>
                <td className={tdNum}>{mxn(pesos(p.monto))}</td>
              </tr>
            ))}
          </Tabla>
          <dl className="grid gap-3 border-t-2 border-tinta px-4 py-3 text-[14px] sm:grid-cols-3">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[.12em] text-gris">
                {t('Suma de partidas')}
              </dt>
              <dd className="num mt-1 font-bold">{mxn(pesos(partidas))}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[.12em] text-gris">
                {t('Saldo del banco')}
              </dt>
              <dd className="num mt-1 font-bold">{mxn(pesos(e.banco))}</dd>
            </div>
            <div className="sm:text-right">
              <Badge tono={cuadra ? 'verde' : 'aviso'}>
                {t(cuadra ? 'Cuadra con el saldo' : 'No cuadra con el saldo')}
              </Badge>
            </div>
          </dl>
        </Panel>
      </section>

      <section aria-label={t('Solicitudes pendientes')} data-testid="tablero-solicitudes">
        <Subtitulo>{t('Solicitudes pendientes')}</Subtitulo>
        <Panel>
          <p className="border-b-2 border-linea px-4 py-3 text-[13px] text-gris">
            {t('Solicitudes que aún no están completas; cada folio abre su detalle.')}
          </p>
          <Tabla
            cabeceras={[t('Folio'), t('Tipo'), t('Estado'), { t: t('Monto'), derecha: true }]}
            vacio={pendientes.length === 0 ? t('No hay solicitudes pendientes en el ejemplo.') : false}
          >
            {pendientes.map((o) => (
              <tr key={o.id}>
                <td className={td}>
                  <Link
                    to={`/operaciones/${o.id}`}
                    className="inline-flex min-h-12 items-center font-bold underline num whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
                  >
                    {o.id}
                  </Link>
                </td>
                <td className={td}>{t(o.tipo)}</td>
                <td className={td}>
                  <Badge tono={o.estado === 'Completa' ? 'verde' : 'aviso'}>{t(o.estado)}</Badge>
                </td>
                <td className={tdNum}>{token(pesos(o.monto))} MXEJ</td>
              </tr>
            ))}
          </Tabla>
        </Panel>
      </section>

      <section aria-label={t('Notas del ejemplo')} data-testid="tablero-notas">
        <Subtitulo>{t('Notas del ejemplo')}</Subtitulo>
        <div className="rounded-lg border-2 border-tinta bg-aviso px-4 py-3 text-[14px] text-aviso-texto">
          <ul className="grid gap-2">
            <li>{t('Rendimiento de los CETES: por definir (no asignado a nadie).')}</li>
            <li>{t('Sin atestación registrada en el ejemplo.')}</li>
          </ul>
        </div>
      </section>
    </>
  );
}
