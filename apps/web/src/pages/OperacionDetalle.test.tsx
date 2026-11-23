import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { t } from '../i18n';
import { solicitarRedencion } from '../sim/acciones';
import { escenarioInicial } from '../sim/escenario';
import type { Estado } from '../sim/modelo';
import { SimProvider } from '../sim/SimProvider';
import OperacionDetalle from './OperacionDetalle';

const CLAVE = 'issuer-os-sim-v1';

/** The simulator reads its seed from localStorage on mount, so a test can render any state. */
function renderDetalle(id: string, estado: Estado = escenarioInicial()) {
  localStorage.setItem(CLAVE, JSON.stringify(estado));
  return render(
    <SimProvider>
      <MemoryRouter initialEntries={[`/operaciones/${id}`]}>
        <Routes>
          <Route path="/operaciones/:id" element={<OperacionDetalle />} />
        </Routes>
      </MemoryRouter>
    </SimProvider>,
  );
}

const titulo = () => screen.getByRole('heading', { level: 1 }).textContent ?? '';

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe('detalle de operación', () => {
  it('OP-0001 muestra el ciclo completo con clave de rastreo y CEP', () => {
    renderDetalle('OP-0001');
    expect(titulo()).toContain('OP-0001');
    expect(screen.getByText(t('Completa'))).toBeTruthy();
    expect(screen.getByText(/50,000\.00/)).toBeTruthy();

    const fechas = screen.getByTestId('operacion-fechas');
    expect(within(fechas).queryAllByText('—')).toHaveLength(0);

    const refs = screen.getByTestId('operacion-referencias');
    expect(within(refs).getByText('EJEMPLO-RASTREO-0001')).toBeTruthy();
    expect(within(refs).getByText('CEP ficticio (ejemplo)')).toBeTruthy();

    const pasos = screen.getByTestId('operacion-pasos');
    expect(pasos.querySelectorAll('[data-estado="confirmado"]')).toHaveLength(3);
    expect(screen.queryByTestId('operacion-faltante')).toBeNull();
  });

  it('OP-0002 muestra el CEP pendiente, las fechas faltantes y el faltante explicado', () => {
    renderDetalle('OP-0002');
    expect(screen.getByText(t('Incompleta'))).toBeTruthy();

    expect(within(screen.getByTestId('operacion-fechas')).getAllByText('—')).toHaveLength(2);
    expect(within(screen.getByTestId('operacion-referencias')).getByText('Pendiente')).toBeTruthy();

    const pasos = screen.getByTestId('operacion-pasos');
    expect(within(pasos).getAllByText(t('Confirmado'))).toHaveLength(3);
    expect(within(pasos).getByText(t('Pendiente'))).toBeTruthy();
    expect(pasos.querySelectorAll('[data-estado="pendiente"]')).toHaveLength(1);

    expect(screen.getByTestId('operacion-faltante').textContent).toContain('CEP');
  });

  it('OP-0003 es una transferencia sin campos de redención: dicen "No aplica"', () => {
    renderDetalle('OP-0003');
    expect(screen.getByText(t('Pago de café'))).toBeTruthy();

    const refs = screen.getByTestId('operacion-referencias');
    expect(within(refs).getAllByText('No aplica')).toHaveLength(5);
    expect(within(refs).getByText('No disponible')).toBeTruthy();

    const activo = screen.getByTestId('operacion-activo');
    expect(within(activo).getByText('MXEJ')).toBeTruthy();
    expect(within(activo).getByText('C-EJEMPLO-CONTRATO-NO-EXISTE')).toBeTruthy();
  });

  it('una operación creada por una acción del simulador también se renderiza', () => {
    const r = solicitarRedencion(escenarioInicial(), {
      monto: 10_000_00,
      tenedor: 'Tenedor Nuevo',
      ahora: '2026-11-18T19:00:00Z',
    });
    if (!r.ok) throw new Error(r.error);
    const nueva = r.estado.operaciones.at(-1)!;

    renderDetalle(nueva.id, r.estado);
    expect(titulo()).toContain(nueva.id);
    expect(screen.getByText(t('Redención con SPEI'))).toBeTruthy();
    expect(screen.getByText('Tenedor Nuevo')).toBeTruthy();
    expect(within(screen.getByTestId('operacion-referencias')).getAllByText('Pendiente').length).toBeGreaterThan(0);
    expect(screen.getByTestId('operacion-faltante').textContent).toContain('CEP');
  });

  it('un folio desconocido conserva el mensaje de no encontrado', () => {
    renderDetalle('OP-9999');
    expect(screen.getByText(t('No existe una operación {id} en el ejemplo.', { id: 'OP-9999' }))).toBeTruthy();
  });

  it('los valores largos no fuerzan scroll horizontal (wrapping activo)', () => {
    renderDetalle('OP-0001');
    const hash = within(screen.getByTestId('operacion-referencias')).getByText('hash-ficticio-op-0001');
    expect(hash.className).toContain('break-all');
    expect(hash.className).toContain('min-w-0');
  });
});
