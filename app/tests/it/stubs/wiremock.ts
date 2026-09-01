/**
 * Cada teste de integracao arma seus proprios stubs e os limpa depois. Sem
 * isso, um teste passaria a depender do que outro deixou para tras, e a ordem
 * de execucao mudaria o resultado.
 */
const ADMIN = `${process.env['WIREMOCK_BASE_URL'] ?? 'http://wiremock:8080'}/__admin`;

export interface StubMapping {
  readonly request: Readonly<Record<string, unknown>>;
  readonly response: Readonly<Record<string, unknown>>;
}

export async function resetStubs(): Promise<void> {
  const response = await fetch(`${ADMIN}/mappings`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`wiremock nao respondeu ao reset: status ${response.status}`);
  }
}

export async function registerStub(mapping: StubMapping): Promise<void> {
  const response = await fetch(`${ADMIN}/mappings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mapping),
  });
  if (!response.ok) {
    throw new Error(`wiremock recusou o stub: status ${response.status}`);
  }
}
