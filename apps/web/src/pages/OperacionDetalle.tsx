import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Aviso, Subtitulo, Titulo } from '../comun';
import { emisor } from '../ejemplos/emisor';
import { fechaHora, token } from '../format';
import { t } from '../i18n';
import { pesos } from '../sim/modelo';
import { useSim } from '../sim/SimProvider';
import { Badge, Icon } from '../ui';

/* Panel y Card usan rounded-sm (2 px). La guía de esta vista pide el radio de
   4 px del token --radius-lg, así que la superficie se compone aquí con los
   mismos tokens (borde de tinta, papel y sombra sólida). */
function Marco({ children, sombra = false, className = '' }: { children: ReactNode; sombra?: boolean; className?: string }) {
  return (
    <div className={`rounded-lg border-2 border-tinta bg-papel overflow-hidden ${sombra ? 'shadow-solida' : ''} ${className}`}>
      {children}
    </div>
  );
}

/** Fecha del ciclo de vida; guion largo cuando todavía no existe. */
function Fecha({ etiqueta, valor }: { etiqueta: string; valor: string | null }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-bold uppercase tracking-[.12em] text-gris">{etiqueta}</dt>
      <dd className={`mt-1 break-words text-[14px] ${valor ? 'num font-bold' : 'text-gris'}`}>
        {valor ? fechaHora(valor) : '—'}
      </dd>
    </div>
  );
}

/** Una fila de referencia externa o de identidad del activo. */
function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="grid gap-0.5 px-4 py-3 sm:grid-cols-[minmax(0,180px)_1fr] sm:gap-4">
      <dt className="text-[11px] font-bold uppercase tracking-[.12em] text-gris">{etiqueta}</dt>
      <dd className="min-w-0 break-all text-[14px] font-bold">{valor}</dd>
    </div>
  );
}

export default function OperacionDetalle() {
  const { id = '' } = useParams();
  const { operaciones } = useSim().estado;
  const operacion = operaciones.find((o) => o.id === id);

  if (!operacion) {
    return (
      <>
        <Titulo cintillo={t('Detalle de operación')}>{t('Operación {id}', { id })}</Titulo>
        <Aviso tono="aviso">
          <p>{t('No existe una operación {id} en el ejemplo.', { id })}</p>
          <Link to="/operaciones" className="mt-1 inline-flex min-h-12 items-center font-bold underline">{t('Ver todas las operaciones')}</Link>
        </Aviso>
      </>
    );
  }

  const o = operacion;
  const esCompleta = o.estado === 'Completa';

  const referencias: Array<[string, string]> = [
    [t('Hash de Stellar'), o.referencias.hashStellar],
    [t('Clave de rastreo SPEI'), o.referencias.claveRastreoSpei],
    [t('Referencia numérica'), o.referencias.referenciaNumerica],
    [t('CLABE beneficiaria'), o.referencias.clabeBeneficiaria],
    ['CEP', o.referencias.cep],
    [t('End-to-End ID'), o.referencias.endToEndId],
    [t('Etherfuse'), o.referencias.etherfuse],
  ];

  const activo: Array<[string, string]> = [
    [t('Código'), emisor.activo.codigo],
    [t('Contrato'), emisor.activo.contrato],
    [t('Red'), emisor.activo.red],
  ];

  return (
    <>
      <Titulo
        cintillo={t('Detalle de operación')}
        accion={
          <Link to="/operaciones" className="inline-flex min-h-12 items-center gap-2 px-1 font-bold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta">
            <Icon name="arrow_back" size={20} /> {t('Volver a operaciones')}
          </Link>
        }
      >
        {t('Operación {id}', { id })}
      </Titulo>

      <div className="grid gap-6">
        <Marco sombra className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-[.12em] text-gris">{t('Monto de la operación')}</div>
              <div className="num mt-1.5 font-display text-[34px] font-extrabold leading-none tracking-[-.02em]" style={{ fontVariationSettings: '"wdth" 108' }}>
                {token(pesos(o.monto))} <span className="text-[18px]">MXEJ</span>
              </div>
            </div>
            <div className="flex min-w-0 flex-col items-start gap-2">
              <Badge tono={esCompleta ? 'verde' : 'aviso'}>{t(o.estado)}</Badge>
              <span className="font-bold text-[15px]">{t(o.tipo)}</span>
            </div>
          </div>
          <dl className="mt-5 grid gap-4 border-t-2 border-linea pt-4 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-[11px] font-bold uppercase tracking-[.12em] text-gris">{t('Deudor')}</dt>
              <dd className="mt-1 break-words text-[14px] font-bold">{o.deudor}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[11px] font-bold uppercase tracking-[.12em] text-gris">{t('Acreedor')}</dt>
              <dd className="mt-1 break-words text-[14px] font-bold">{o.acreedor}</dd>
            </div>
          </dl>
        </Marco>

        <section aria-labelledby="fechas">
          <Subtitulo>{t('Fechas')}</Subtitulo>
          <Marco>
            <dl id="fechas" data-testid="operacion-fechas" className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <Fecha etiqueta={t('Creación')} valor={o.fechas.creacion} />
              <Fecha etiqueta={t('Autorización')} valor={o.fechas.autorizacion} />
              <Fecha etiqueta={t('Liquidación')} valor={o.fechas.liquidacion} />
              <Fecha etiqueta={t('Abono')} valor={o.fechas.abono} />
            </dl>
          </Marco>
        </section>

        <section aria-labelledby="pasos">
          <Subtitulo>{t('Línea de tiempo')}</Subtitulo>
          <Marco>
            <ol id="pasos" data-testid="operacion-pasos" className="divide-y-2 divide-linea">
              {o.pasos.map((paso, i) => {
                const confirmado = paso.estado === 'confirmado';
                return (
                  <li key={`${paso.descripcion}-${i}`} data-estado={paso.estado} className="flex gap-3 p-4">
                    <Icon
                      name={confirmado ? 'check_circle' : 'pending'}
                      filled={confirmado}
                      className={confirmado ? 'text-verde' : 'text-naranja'}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-[15px]">{paso.descripcion}</p>
                        <Badge tono={confirmado ? 'verde' : 'aviso'}>{t(confirmado ? 'Confirmado' : 'Pendiente')}</Badge>
                      </div>
                      <p className={`mt-1 text-[13px] ${paso.fecha ? 'num text-gris' : 'text-gris'}`}>
                        {paso.fecha ? fechaHora(paso.fecha) : '—'}
                      </p>
                      <p className="mt-1 break-words text-[13px] text-gris">
                        {t('Evidencia')}: <span className="break-all font-bold text-tinta">{paso.evidencia}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Marco>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section aria-labelledby="referencias">
            <Subtitulo>{t('Referencias externas')}</Subtitulo>
            <Marco>
              <dl id="referencias" data-testid="operacion-referencias" className="divide-y divide-linea">
                {referencias.map(([etiqueta, valor]) => <Fila key={etiqueta} etiqueta={etiqueta} valor={valor} />)}
              </dl>
              <p className="border-t-2 border-linea px-4 py-3 text-[12px] text-gris">
                {t('Identificadores ficticios: no son enlaces ni existen en la red.')}
              </p>
            </Marco>
          </section>

          <section aria-labelledby="activo">
            <Subtitulo>{t('Identidad del activo')}</Subtitulo>
            <Marco>
              <dl id="activo" data-testid="operacion-activo" className="divide-y divide-linea">
                {activo.map(([etiqueta, valor]) => <Fila key={etiqueta} etiqueta={etiqueta} valor={valor} />)}
              </dl>
            </Marco>
          </section>
        </div>

        {o.faltante && (
          <div data-testid="operacion-faltante">
            <Aviso tono="aviso">
              <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[.12em]">
                <Icon name="warning" size={20} /> {t('Faltante')}
              </div>
              <p className="mt-2">{t(o.faltante)}</p>
            </Aviso>
          </div>
        )}
      </div>
    </>
  );
}
