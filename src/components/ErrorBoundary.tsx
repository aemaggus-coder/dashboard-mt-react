import { Component, type ErrorInfo, type ReactNode } from 'react';
import errorTracking from '../lib/errorTracking';

interface Props  { children: ReactNode; }
interface State  { error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    errorTracking.captureException(error, { componentStack: info.componentStack });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', fontFamily: 'var(--font-ui)', color: 'var(--text, #f7fbff)', background: 'var(--bg, #0b1430)', textAlign: 'center', padding: '24px' }}>
          <div style={{ fontSize: '20px', fontWeight: 700 }}>Произошла ошибка</div>
          <div style={{ fontSize: '13px', opacity: 0.55, maxWidth: '480px' }}>{this.state.error.message}</div>
          <button onClick={() => window.location.reload()} style={{ marginTop: '8px', padding: '10px 24px', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Перезагрузить страницу
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
