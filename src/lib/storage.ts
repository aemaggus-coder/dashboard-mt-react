const storage = {
  get(key: string, fallback: string | null = null): string | null {
    try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  },
  set(key: string, value: string): void {
    try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
  },
  remove(key: string): void {
    try { localStorage.removeItem(key); } catch { /* storage unavailable */ }
  },
};

export default storage;
