import { registerStub, type StubMapping } from './wiremock.ts';

const REPO = 'byt3un1on/byt3un1on.github.io';

/** Questoes abertas no repositorio do sitio — os dois estados que RF-16 distingue. */
export async function stubOpenIssues(issues: readonly Record<string, unknown>[]): Promise<void> {
  await registerStub({
    request: { method: 'GET', urlPath: `/repos/${REPO}/issues` },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: issues,
    },
  } satisfies StubMapping);
}

export async function stubOpenIssueCreation(number: number): Promise<void> {
  await registerStub({
    request: { method: 'POST', urlPath: `/repos/${REPO}/issues` },
    response: {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: { number },
    },
  } satisfies StubMapping);
}

export async function stubIssueClosure(number: number): Promise<void> {
  await registerStub({
    request: { method: 'PATCH', urlPath: `/repos/${REPO}/issues/${number}` },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: { number, state: 'closed' },
    },
  } satisfies StubMapping);
}
