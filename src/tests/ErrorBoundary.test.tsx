import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

const Throw = ({ message }: { message: string }) => {
  throw new Error(message);
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error', () => {
    render(<ErrorBoundary><div>OK</div></ErrorBoundary>);
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('renders fallback UI when child throws', () => {
    render(
      <ErrorBoundary>
        <Throw message="test error" />
      </ErrorBoundary>
    );
    expect(screen.getByText('Произошла ошибка')).toBeInTheDocument();
    expect(screen.getByText('test error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /перезагрузить/i })).toBeInTheDocument();
  });
});
