import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

describe('Componente Login', () => {
  it('Debería renderizar el formulario correctamente', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Verifica que el título y el botón estén en pantalla
    expect(screen.getByText('Iniciar Sesión - TaskFlow')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });
});