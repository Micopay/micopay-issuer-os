import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { t } from '../i18n';
import { resolverDiscrepancia } from '../sim/acciones';
import { escenarioInicial } from '../sim/escenario';
import type { Estado } from '../sim/modelo';
import { SimProvider, useSim } from '../sim/SimProvider';
import Discrepancias from './Discrepancias';

const CLAVE = 'issuer-os-sim-v1';

function renderDiscrepancias(estado: Estado = escenarioInicial()) {
  localStorage.setItem(CLAVE, JSON.stringify(estado));
  return render(
    <SimProvider>
      <MemoryRouter initialEntries={['/discrepancias']}>
        <Discrepancias />
      </MemoryRouter>
    </SimProvider>,
  );
}

function ControlesResolver({ id = 'D-02' }: { id?: string }) {
  const { ejecutar } = useSim();
  return (
    <button
      type="button"
      onClick={() =>
        ejecutar((e) =>
          resolverDiscrepancia(e, {
            id,
            ahora: '2026-11-18T20:00:00Z',
          }),
        )
      }
    >
      resolver-{id}
    </button>
  );
}

function renderConControles(estado: Estado = escenarioInicial()) {
  localStorage.setItem(CLAVE, JSON.stringify(estado));
  return render(
    <SimProvider>
      <MemoryRouter initialEntries={['/discrepancias']}>
        <ControlesResolver id="D-02" />
        <Discrepancias />
      </MemoryRouter>
    </SimProvider>,
  );
}

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe('discrepancias panel (IOS-3)', () => {
  it('muestra el escenario inicial con D-01, D-02 y D-03 y su identificación completa', () => {
    renderDiscrepancias();

    // D-01
    const d01 = screen.getByTestId('discrepancia-D-01');
    expect(within(d01).getByText('D-01')).toBeTruthy();
    expect(within(d01).getByText(t('Quema sin pago de redención'))).toBeTruthy();
    expect(within(d01).getByText(t('Alta'))).toBeTruthy();
    expect(within(d01).getByText(t('Abierta'))).toBeTruthy();
    expect(within(d01).getByText(/30,000\.00/)).toBeTruthy();
    expect(within(d01).getByText('Emisora Ejemplo')).toBeTruthy();
    expect(within(d01).getByText('Stellar testnet (ficticia)')).toBeTruthy();
    expect(within(d01).getByText('C-EJEMPLO-CONTRATO-NO-EXISTE')).toBeTruthy();
    expect(within(d01).getAllByText('MXEJ').length).toBeGreaterThan(0);
    expect(within(d01).getByRole('link', { name: 'OP-0002' }).getAttribute('href')).toBe('/operaciones/OP-0002');

    // D-02
    const d02 = screen.getByTestId('discrepancia-D-02');
    expect(within(d02).getByText('D-02')).toBeTruthy();
    expect(within(d02).getByText(t('Movimiento bancario no identificado'))).toBeTruthy();
    expect(within(d02).getByText(t('Media'))).toBeTruthy();
    expect(within(d02).getByText(t('Abierta'))).toBeTruthy();
    expect(within(d02).getByText(/25,000\.00/)).toBeTruthy();
    expect(within(d02).getByText(t('No aplica'))).toBeTruthy();

    // D-03
    const d03 = screen.getByTestId('discrepancia-D-03');
    expect(within(d03).getByText('D-03')).toBeTruthy();
    expect(within(d03).getByText(t('Diferencia de redondeo'))).toBeTruthy();
    expect(within(d03).getByText(t('Baja'))).toBeTruthy();
    expect(within(d03).getByText(t('Abierta'))).toBeTruthy();
    expect(within(d03).getByText(/0\.01/)).toBeTruthy();
    expect(within(d03).getByRole('link', { name: 'OP-0003' }).getAttribute('href')).toBe('/operaciones/OP-0003');
  });

  it('muestra las reglas: regla 4 activa y reglas 2 y 3 inactivas con leyenda de supuestos', () => {
    renderDiscrepancias();

    expect(screen.getByText(t('Supuestos de ejemplo, no políticas del producto.'))).toBeTruthy();

    const regla1 = screen.getByTestId('regla-1');
    expect(within(regla1).getByText(t('Inactiva'))).toBeTruthy();

    const regla2 = screen.getByTestId('regla-2');
    expect(within(regla2).getByText(t('Inactiva'))).toBeTruthy();

    const regla3 = screen.getByTestId('regla-3');
    expect(within(regla3).getByText(t('Inactiva'))).toBeTruthy();

    const regla4 = screen.getByTestId('regla-4');
    expect(within(regla4).getByText(t('Activa'))).toBeTruthy();
  });

  it('filtra por gravedad, tipo y estado, e incluye estado vacío', () => {
    renderDiscrepancias();

    // Filtro por gravedad: Alta
    fireEvent.click(screen.getByRole('button', { name: t('Alta') }));
    expect(screen.getByTestId('discrepancia-D-01')).toBeTruthy();
    expect(screen.queryByTestId('discrepancia-D-02')).toBeNull();
    expect(screen.queryByTestId('discrepancia-D-03')).toBeNull();

    // Filtro por gravedad: Media
    fireEvent.click(screen.getByRole('button', { name: t('Media') }));
    expect(screen.queryByTestId('discrepancia-D-01')).toBeNull();
    expect(screen.getByTestId('discrepancia-D-02')).toBeTruthy();
    expect(screen.queryByTestId('discrepancia-D-03')).toBeNull();

    // Filtro por gravedad: Todas
    fireEvent.click(screen.getByRole('button', { name: t('Todas las gravedades') }));
    expect(screen.getByTestId('discrepancia-D-01')).toBeTruthy();
    expect(screen.getByTestId('discrepancia-D-02')).toBeTruthy();
    expect(screen.getByTestId('discrepancia-D-03')).toBeTruthy();

    // Filtro por tipo: Diferencia de redondeo
    fireEvent.click(screen.getByRole('button', { name: t('Diferencia de redondeo') }));
    expect(screen.queryByTestId('discrepancia-D-01')).toBeNull();
    expect(screen.queryByTestId('discrepancia-D-02')).toBeNull();
    expect(screen.getByTestId('discrepancia-D-03')).toBeTruthy();

    // Restablecer tipo
    fireEvent.click(screen.getByRole('button', { name: t('Todos los tipos') }));

    // Filtro por estado: Resuelta (todas están abiertas al inicio -> estado vacío)
    fireEvent.click(screen.getByRole('button', { name: t('Resuelta') }));
    expect(screen.queryByTestId('discrepancia-D-01')).toBeNull();
    expect(screen.queryByTestId('discrepancia-D-02')).toBeNull();
    expect(screen.queryByTestId('discrepancia-D-03')).toBeNull();
    expect(screen.getByText(t('No hay discrepancias que coincidan con los filtros seleccionados.'))).toBeTruthy();

    // Combinación que no produce filas (Alta + Resuelta)
    fireEvent.click(screen.getByRole('button', { name: t('Alta') }));
    expect(screen.getByText(t('No hay discrepancias que coincidan con los filtros seleccionados.'))).toBeTruthy();
  });

  it('actualiza el estado de D-02 en vivo al resolverla con resolverDiscrepancia', () => {
    renderConControles();

    const d02 = screen.getByTestId('discrepancia-D-02');
    expect(within(d02).getByText(t('Abierta'))).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'resolver-D-02' }));

    const d02Actualizada = screen.getByTestId('discrepancia-D-02');
    expect(within(d02Actualizada).getByText(t('Resuelta'))).toBeTruthy();
  });
});
