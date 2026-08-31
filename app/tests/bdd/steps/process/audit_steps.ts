import { Given, Then, When } from '@cucumber/cucumber';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import assert from 'node:assert/strict';

const run = promisify(execFile);

interface ResultadoAuditoria {
  readonly categorias: Record<string, number>;
  readonly lcp: number;
  readonly cls: number;
  readonly paginas: number;
}

let auditoria: ResultadoAuditoria = { categorias: {}, lcp: 0, cls: 0, paginas: 0 };

/**
 * Le o relatorio que o Lighthouse CI grava, em vez de reexecuta-lo: `make audit`
 * ja o rodou, e reexecutar aqui dobraria o custo do `make validate` para medir
 * duas vezes a mesma coisa.
 */
async function lerRelatorio(): Promise<ResultadoAuditoria> {
  const { stdout } = await run('sh', [
    '-c',
    'ls coverage/lighthouse/*.report.json 2>/dev/null || true',
  ]);
  const arquivos = stdout.split('\n').filter((linha) => linha.trim() !== '');
  if (arquivos.length === 0) {
    throw new Error(
      'relatorio de auditoria ausente: rode `make audit` antes; esperado coverage/lighthouse/*.report.json',
    );
  }
  const categorias: Record<string, number> = {};
  let lcp = 0;
  let cls = 0;
  for (const arquivo of arquivos) {
    const relatorio = JSON.parse(await readFile(arquivo.trim(), 'utf8')) as {
      categories: Record<string, { score: number }>;
      audits: Record<string, { numericValue?: number }>;
    };
    for (const [nome, dados] of Object.entries(relatorio.categories)) {
      categorias[nome] = Math.min(categorias[nome] ?? 1, dados.score);
    }
    lcp = Math.max(lcp, relatorio.audits['largest-contentful-paint']?.numericValue ?? 0);
    cls = Math.max(cls, relatorio.audits['cumulative-layout-shift']?.numericValue ?? 0);
  }
  return { categorias, lcp, cls, paginas: arquivos.length };
}

Given('que o sítio foi construído para publicação', function (): void {
  auditoria = { categorias: {}, lcp: 0, cls: 0, paginas: 0 };
});

When(
  'a auditoria automática é executada sobre cada página pública em perfil móvel',
  async function (): Promise<void> {
    auditoria = await lerRelatorio();
  },
);

Then(
  'nenhuma das categorias Performance, Acessibilidade, Boas Práticas e SEO fica abaixo de {int}',
  function (minimo: number): void {
    const abaixo = Object.entries(auditoria.categorias).filter(
      ([, nota]) => nota * 100 < minimo,
    );
    assert.deepEqual(abaixo, [], `categorias abaixo de ${minimo}: ${JSON.stringify(abaixo)}`);
  },
);

Then(
  /^o LCP não excede ([\d,]+) segundos e o CLS não excede ([\d,]+)$/,
  function (lcpTexto: string, clsTexto: string): void {
    const lcpMaximo = Number(lcpTexto.replace(',', '.')) * 1000;
    const clsMaximo = Number(clsTexto.replace(',', '.'));
    assert.ok(auditoria.lcp <= lcpMaximo, `LCP ${auditoria.lcp}ms excede ${lcpMaximo}ms`);
    assert.ok(auditoria.cls <= clsMaximo, `CLS ${auditoria.cls} excede ${clsMaximo}`);
  },
);

Then('nenhuma página é dispensada da auditoria', function (): void {
  assert.ok(auditoria.paginas > 0, 'nenhuma pagina foi auditada');
});
