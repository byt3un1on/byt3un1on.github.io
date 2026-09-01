import { registerStub, type StubMapping } from './wiremock.ts';

const ORG = 'byt3un1on';

export function repositoryPayload(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    name: 'shortsmaker-api',
    description: 'API do Shortsmaker',
    html_url: `https://github.com/${ORG}/shortsmaker-api`,
    homepage: null,
    language: 'Python',
    private: false,
    archived: false,
    pushed_at: '2026-01-14T05:31:18Z',
    ...overrides,
  };
}

/** Listagem publica da organizacao, como a API a devolve. */
export async function stubOrganizationRepositories(
  repositories: readonly Record<string, unknown>[],
): Promise<void> {
  await registerStub({
    request: { method: 'GET', urlPath: `/orgs/${ORG}/repos` },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: repositories,
    },
  } satisfies StubMapping);
}

/** Falha no meio da obtencao — o cenario que RF-14 precisa enxergar. */
export async function stubOrganizationUnavailable(status = 503): Promise<void> {
  await registerStub({
    request: { method: 'GET', urlPath: `/orgs/${ORG}/repos` },
    response: { status },
  } satisfies StubMapping);
}

/** Repositorio com commits responde 200; vazio responde 409. */
export async function stubCommits(repositoryName: string, status: 200 | 409): Promise<void> {
  await registerStub({
    request: { method: 'GET', urlPath: `/repos/${ORG}/${repositoryName}/commits` },
    response: {
      status,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: status === 200 ? [{ sha: 'abc123' }] : { message: 'Git Repository is empty.' },
    },
  } satisfies StubMapping);
}
