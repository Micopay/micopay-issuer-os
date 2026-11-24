import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { t } from '../i18n';
import { emitir } from '../sim/acciones';
import { escenarioInicial } from '../sim/escenario';
import type { Estado } from '../sim/modelo';
import { SimProvider, useSim } from '../sim/SimProvider';
import Tablero from './Tablero';

const CLAVE = 'issuer-os-sim-v1';

function renderTablero(estado: Estado = escenarioInicial()) {
  localStorage.setItem(CLAVE, JSON.stringify(estado));
  return render(
    <SimProvider>
      <MemoryRouter initialEntries={['/']}>
        <Tablero />
      </MemoryRouter>
    </SimProvider>,
  );
}

/** Exposes simulator actions so a test can prove the dashboard follows state changes. */
function Controles() {
  const { ejecutar, reiniciar } = useSim();
  return (
    <div>
      <button
        type="button"
        onClick={() =>
          ejecutar((e) =>
            emitir(e, {
              monto: 1_000_000,
              cliente: 'Cliente Nueva',
              claveRastreo: 'TEST-1',
              ahora: '2026-11-18T20:00:00Z',
            }),
          )
        }
      >
        emitir
      </button>
      <button type="button" onClick={reiniciar}>
        reiniciar
      </button>
    </div>
  );
}

function renderConControles(estado: Estado = escenarioInicial()) {
  localStorage.setItem(CLAVE, JSON.stringify(estado));
  return render(
    <SimProvider>
      <MemoryRouter initialEntries={['/']}>
        <Controles />
        <Tablero />
      </MemoryRouter>
    </SimProvider>,
  );
}

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe('tablero', () => {
  it('muestra las cifras iniciales: circulación, CETES, banco y conversión pendiente', () => {
    renderTablero();

    expect(screen.getAllByText(/1,000,000\.00/).length).toBeGreaterThan(0);

    const posiciones = screen.getByTestId('tablero-posiciones');
    expect(within(posiciones).getByText(/50,000\.00/)).toBeTruthy();
    expect(within(posiciones).getByText(t('Pendiente'))).toBeTruthy();
    expect(within(posiciones).getByText(t('No se suma al respaldo hasta confirmar el abono.'))).toBeTruthy();

    const indicadores = screen.getByTestId('tablero-indicadores');
    expect(within(indicadores).getByText('110%')).toBeTruthy();
    expect(within(indicadores).getByText('10%')).toBeTruthy();
    expect(within(indicadores).getByText(t('Cobertura suficiente'))).toBeTruthy();
  });

  it('rastrea el saldo del banco partida por partida y confirma que cuadra', () => {
    renderTablero();
    const partidas = screen.getByTestId('tablero-partidas');

    expect(within(partidas).getByText(/80,000\.00/)).toBeTruthy();
    expect(within(partidas).getByText(/50,000\.00/)).toBeTruthy();
    expect(within(partidas).getByText(/-.*30,000\.00/)).toBeTruthy();
    expect(within(partidas).getByText(t('Suma de partidas'))).toBeTruthy();
    expect(within(partidas).getByText(t('Cuadra con el saldo'))).toBeTruthy();
  });

  it('liga las partidas con operación y las solicitudes pendientes a su detalle', () => {
    renderTablero();

    const partidas = screen.getByTestId('tablero-partidas');
    expect(within(partidas).getByRole('link', { name: 'OP-0001' }).getAttribute('href')).toBe(
      '/operaciones/OP-0001',
    );
    expect(within(partidas).getByRole('link', { name: 'OP-0002' }).getAttribute('href')).toBe(
      '/operaciones/OP-0002',
    );

    const solicitudes = screen.getByTestId('tablero-solicitudes');
    expect(within(solicitudes).getByRole('link', { name: 'OP-0002' }).getAttribute('href')).toBe(
      '/operaciones/OP-0002',
    );
    expect(within(solicitudes).getByText(t('Incompleta'))).toBeTruthy();
  });

  it('incluye las notas de rendimiento por definir y sin atestación', () => {
    renderTablero();
    const notas = screen.getByTestId('tablero-notas');
    expect(
      within(notas).getByText(t('Rendimiento de los CETES: por definir (no asignado a nadie).')),
    ).toBeTruthy();
    expect(within(notas).getByText(t('Sin atestación registrada en el ejemplo.'))).toBeTruthy();
  });

  it('actualiza las cifras con una acción y vuelve al escenario inicial al reiniciar', () => {
    renderConControles();

    expect(screen.queryByText(/1,010,000\.00/)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'emitir' }));
    expect(screen.getAllByText(/1,010,000\.00/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/110,000\.00/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: 'reiniciar' }));
    expect(screen.queryByText(/1,010,000\.00/)).toBeNull();
    expect(screen.getAllByText(/1,000,000\.00/).length).toBeGreaterThan(0);
  });
});
