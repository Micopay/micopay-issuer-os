import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Panel, Subtitulo, Tabla, Titulo, td, tdNum } from '../comun';
import { emisor } from '../ejemplos/emisor';
import { token } from '../format';
import { t } from '../i18n';
import type { Discrepancia } from '../sim/modelo';
import { pesos } from '../sim/modelo';
import { reglas } from '../sim/selectores';
import { useSim } from '../sim/SimProvider';
import { Badge, Pill } from '../ui';

type FiltroTipo = 'todos' | Discrepancia['tipo'];
type FiltroGravedad = 'todas' | Discrepancia['gravedadSimulada'];
type FiltroEstado = 'todos' | Discrepancia['estado'];

function tonoGravedad(g: Discrepancia['gravedadSimulada']) {
  switch (g) {
    case 'Alta':
      return 'naranja';
    case 'Media':
      return 'aviso';
    case 'Baja':
      return 'papel';
  }
}

export default function Discrepancias() {
  const { estado } = useSim();
  const listaReglas = reglas(estado);

  const [tipoFiltro, setTipoFiltro] = useState<FiltroTipo>('todos');
  const [gravedadFiltro, setGravedadFiltro] = useState<FiltroGravedad>('todas');
  const [estadoFiltro, setEstadoFiltro] = useState<FiltroEstado>('todos');

  const discrepanciasFiltradas = estado.discrepancias.filter((d) => {
    if (tipoFiltro !== 'todos' && d.tipo !== tipoFiltro) return false;
    if (gravedadFiltro !== 'todas' && d.gravedadSimulada !== gravedadFiltro) return false;
    if (estadoFiltro !== 'todos' && d.estado !== estadoFiltro) return false;
    return true;
  });

  return (
    <>
      <Titulo cintillo={t('Emisor')}>{t('Discrepancias')}</Titulo>

      {/* Reglas de conciliación */}
      <section aria-label={t('Reglas de ejemplo')} data-testid="seccion-reglas" className="mb-8">
        <Subtitulo>{t('Reglas de ejemplo')}</Subtitulo>
        <p className="mb-4 text-[13px] text-gris">
          {t('Supuestos de ejemplo, no políticas del producto.')}
        </p>
        <Panel>
          <Tabla
            cabeceras={[
              t('Regla'),
              t('Efecto'),
              t('Base'),
              { t: t('Estado'), derecha: true },
            ]}
          >
            {listaReglas.map((r) => (
              <tr key={r.id} data-testid={`regla-${r.id}`} data-activa={r.activa}>
                <td className={td}>
                  <div className="font-bold">
                    {t('Regla {id}', { id: r.id })}: {t(r.regla)}
                  </div>
                </td>
                <td className={td}>{t(r.efecto)}</td>
                <td className={td}>
                  <span className="text-[13px] text-gris">{t(r.base)}</span>
                </td>
                <td className={tdNum}>
                  <Badge tono={r.activa ? 'naranja' : 'papel'}>
                    {r.activa ? t('Activa') : t('Inactiva')}
                  </Badge>
                </td>
              </tr>
            ))}
          </Tabla>
        </Panel>
      </section>

      {/* Discrepancias y Filtros */}
      <section aria-label={t('Discrepancias')} data-testid="seccion-discrepancias">
        <Subtitulo>{t('Discrepancias detectadas')}</Subtitulo>

        <div className="mb-6 space-y-4" data-testid="discrepancias-filtros">
          <div>
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[.12em] text-gris">
              {t('Filtrar por estado')}
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill
                activa={estadoFiltro === 'todos'}
                onClick={() => setEstadoFiltro('todos')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
              >
                {t('Todos los estados')}
              </Pill>
              <Pill
                activa={estadoFiltro === 'abierta'}
                onClick={() => setEstadoFiltro('abierta')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
              >
                {t('Abierta')}
              </Pill>
              <Pill
                activa={estadoFiltro === 'resuelta'}
                onClick={() => setEstadoFiltro('resuelta')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
              >
                {t('Resuelta')}
              </Pill>
            </div>
          </div>

          <div>
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[.12em] text-gris">
              {t('Filtrar por gravedad')}
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill
                activa={gravedadFiltro === 'todas'}
                onClick={() => setGravedadFiltro('todas')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
              >
                {t('Todas las gravedades')}
              </Pill>
              <Pill
                activa={gravedadFiltro === 'Alta'}
                onClick={() => setGravedadFiltro('Alta')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
              >
                {t('Alta')}
              </Pill>
              <Pill
                activa={gravedadFiltro === 'Media'}
                onClick={() => setGravedadFiltro('Media')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
              >
                {t('Media')}
              </Pill>
              <Pill
                activa={gravedadFiltro === 'Baja'}
                onClick={() => setGravedadFiltro('Baja')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
              >
                {t('Baja')}
              </Pill>
            </div>
          </div>

          <div>
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[.12em] text-gris">
              {t('Filtrar por tipo')}
            </div>
            <div className="flex flex-wrap gap-2">
              <Pill
                activa={tipoFiltro === 'todos'}
                onClick={() => setTipoFiltro('todos')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
              >
                {t('Todos los tipos')}
              </Pill>
              <Pill
                activa={tipoFiltro === 'Quema sin pago de redención'}
                onClick={() => setTipoFiltro('Quema sin pago de redención')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
              >
                {t('Quema sin pago de redención')}
              </Pill>
              <Pill
                activa={tipoFiltro === 'Movimiento bancario no identificado'}
                onClick={() => setTipoFiltro('Movimiento bancario no identificado')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
              >
                {t('Movimiento bancario no identificado')}
              </Pill>
              <Pill
                activa={tipoFiltro === 'Diferencia de redondeo'}
                onClick={() => setTipoFiltro('Diferencia de redondeo')}
                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta"
              >
                {t('Diferencia de redondeo')}
              </Pill>
            </div>
          </div>
        </div>

        <Panel>
          <Tabla
            cabeceras={[
              t('Folio'),
              t('Tipo y descripción'),
              t('Gravedad y estado'),
              { t: t('Monto'), derecha: true },
              t('Identificación completa'),
            ]}
            vacio={
              discrepanciasFiltradas.length === 0
                ? t('No hay discrepancias que coincidan con los filtros seleccionados.')
                : false
            }
          >
            {discrepanciasFiltradas.map((d) => (
              <tr key={d.id} data-testid={`discrepancia-${d.id}`}>
                <td className={td}>
                  <span className="font-bold num whitespace-nowrap">{d.id}</span>
                </td>
                <td className={td}>
                  <div className="font-bold text-[15px]">{t(d.tipo)}</div>
                  <p className="mt-1 text-[13px]">{t(d.descripcion)}</p>
                  <p className="mt-1 text-[12px] text-gris">
                    <span className="font-bold">{t('Bloqueo')}:</span> {t(d.bloqueo)}
                  </p>
                </td>
                <td className={td}>
                  <div className="flex flex-col items-start gap-1.5 whitespace-nowrap">
                    <Badge tono={tonoGravedad(d.gravedadSimulada)}>
                      {t(d.gravedadSimulada)}
                    </Badge>
                    <Badge tono={d.estado === 'resuelta' ? 'verde' : 'aviso'}>
                      {t(d.estado === 'resuelta' ? 'Resuelta' : 'Abierta')}
                    </Badge>
                  </div>
                </td>
                <td className={tdNum}>
                  <span className="font-bold">{token(pesos(d.monto))}</span> MXEJ
                </td>
                <td className={td}>
                  <dl className="space-y-1 text-[12px] min-w-[220px]">
                    <div>
                      <dt className="inline font-bold text-gris">{t('Emisor')}: </dt>
                      <dd className="inline font-semibold">{emisor.nombre}</dd>
                    </div>
                    <div>
                      <dt className="inline font-bold text-gris">{t('Red')}: </dt>
                      <dd className="inline font-semibold">{emisor.activo.red}</dd>
                    </div>
                    <div>
                      <dt className="inline font-bold text-gris">{t('Contrato')}: </dt>
                      <dd className="inline font-mono text-[11px] break-all">{emisor.activo.contrato}</dd>
                    </div>
                    <div>
                      <dt className="inline font-bold text-gris">{t('Activo')}: </dt>
                      <dd className="inline font-semibold">{emisor.activo.codigo}</dd>
                    </div>
                    <div>
                      <dt className="inline font-bold text-gris">{t('Operación')}: </dt>
                      <dd className="inline">
                        {d.operacion ? (
                          <Link
                            to={`/operaciones/${d.operacion}`}
                            className="inline-flex min-h-12 items-center font-bold underline"
                          >
                            {d.operacion}
                          </Link>
                        ) : (
                          <span className="text-gris">{t('No aplica')}</span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </td>
              </tr>
            ))}
          </Tabla>
        </Panel>
      </section>
    </>
  );
}
