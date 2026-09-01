import { Given, Then, When } from '@cucumber/cucumber';
import { AxeBuilder } from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { staticRoutes } from '../../../../core/domain/constants/site_routes_constants.ts';
import type { VitrineWorld } from '../../support/world.ts';

/**
 * Rotas publicas que a varredura percorre: as fixas mais a de cada projeto. Ate
 * 2026-08-31 esta constante trazia so as fixas, apesar de o comentario prometer
 * as duas — as paginas de projeto ficavam de fora sem que ninguem visse.
 */
async function rotasPublicas(): Promise<readonly string[]> {
  const { projects } = JSON.parse(await readFile('data/catalog.generated.json', 'utf8')) as {
    projects: readonly { slug: string }[];
  };
  return [...staticRoutes(), ...projects.map((p) => `/projetos/${p.slug}`)];
}

let violacoesGraves: string[] = [];
let rotasVarridas: string[] = [];
let alcancados = 0;
let focosDistintos = 0;

Given(
  'que eu abro qualquer página pública do sítio',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit('/projetos');
  },
);

Given('que percorro todas as páginas públicas do sítio', function (): void {
  // As rotas fixas ja estao declaradas em ROTAS_PUBLICAS.
});

Given(
  /^que abro qualquer página pública em uma viewport de ([\d]+) px de largura$/,
  async function (this: VitrineWorld, largura: string): Promise<void> {
    await this.browser.page.setViewportSize({ width: Number(largura), height: 800 });
    await this.browser.visit('/projetos');
  },
);

// --- RNF-08 ----------------------------------------------------------------

When('a página termina de carregar', async function (this: VitrineWorld): Promise<void> {
  await this.browser.page.waitForLoadState('networkidle');
});

Then(
  'todos os dados dos projetos já estão presentes',
  async function (this: VitrineWorld): Promise<void> {
    const cartoes = await this.browser.page.locator('article').count();
    assert.ok(cartoes > 0, 'nenhum projeto chegou renderizado do build');
  },
);

Then(
  'o meu navegador não realizou nenhuma requisição à API do GitHub',
  function (this: VitrineWorld): void {
    assert.deepEqual(
      this.browser.requestsToGithubApi(),
      [],
      'o visitante falou com a API do GitHub, contra o RNF-08',
    );
  },
);

// --- RNF-02: teclado e acessibilidade --------------------------------------

When(
  'eu percorro a página usando somente o teclado',
  async function (this: VitrineWorld): Promise<void> {
    const interativos = await this.browser.page
      .locator('a[href], button, input, select, textarea')
      .count();
    const vistos = new Set<string>();
    for (let i = 0; i < interativos; i += 1) {
      await this.browser.page.keyboard.press('Tab');
      const marca = await this.browser.page.evaluate(() => {
        const alvo = document.activeElement;
        if (alvo === null || alvo === document.body) {
          return '';
        }
        const estilo = getComputedStyle(alvo);
        const visivel = estilo.outlineStyle !== 'none' || estilo.boxShadow !== 'none';
        return `${alvo.tagName}:${alvo.textContent?.trim().slice(0, 20) ?? ''}:${String(visivel)}`;
      });
      if (marca !== '') {
        vistos.add(marca);
      }
    }
    alcancados = vistos.size;
    focosDistintos = vistos.size;
    violacoesGraves = [...vistos].filter((v) => v.endsWith(':false'));
  },
);

Then(
  'eu alcanço e aciono todos os elementos interativos, com foco sempre visível',
  async function (this: VitrineWorld): Promise<void> {
    const interativos = await this.browser.page.locator('a[href], button').count();
    assert.ok(alcancados >= interativos, `alcancei ${alcancados} de ${interativos} elementos`);
    assert.deepEqual(violacoesGraves, [], 'ha elemento focado sem indicacao visivel de foco');
  },
);

Then('nenhum elemento retém o foco impedindo que eu prossiga', function (): void {
  assert.ok(focosDistintos > 1, 'o foco nao avancou: ha armadilha de foco na pagina');
});

// --- RNF-05: alcance de dispositivos ---------------------------------------

When('a página é renderizada', async function (this: VitrineWorld): Promise<void> {
  await this.browser.page.waitForLoadState('load');
});

Then(
  'todo o conteúdo permanece legível e utilizável',
  async function (this: VitrineWorld): Promise<void> {
    const cartoes = await this.browser.page.locator('article').count();
    assert.ok(cartoes > 0, 'o conteudo sumiu na viewport estreita');
  },
);

Then('não há rolagem horizontal', async function (this: VitrineWorld): Promise<void> {
  const excedente = await this.browser.page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  assert.ok(excedente <= 0, `a pagina excede a viewport em ${excedente}px`);
});

// --- RNF-07: idioma unico --------------------------------------------------

When('eu leio o conteúdo voltado ao visitante', function (): void {
  // A leitura acontece nas assercoes, rota a rota.
});

Then('todo ele está em português do Brasil', async function (this: VitrineWorld): Promise<void> {
  for (const rota of await rotasPublicas()) {
    await this.browser.visit(rota);
    const idioma = await this.browser.page.getAttribute('html', 'lang');
    assert.equal(idioma, 'pt-BR', `a rota ${rota} declara idioma ${String(idioma)}`);
  }
});

Then(
  'não há alternador de idioma nem conteúdo em segundo idioma',
  async function (this: VitrineWorld): Promise<void> {
    for (const rota of await rotasPublicas()) {
      await this.browser.visit(rota);
      const alternadores = await this.browser.page.locator('[hreflang], [lang]:not(html)').count();
      assert.equal(alternadores, 0, `a rota ${rota} tem marcacao de segundo idioma`);
    }
  },
);

// --- RNF-02 e RNF-09: varredura axe ----------------------------------------

When(
  'a verificação automática de acessibilidade é executada',
  async function (this: VitrineWorld): Promise<void> {
    violacoesGraves = [];
    rotasVarridas = [];
    for (const rota of await rotasPublicas()) {
      await this.browser.visit(rota);
      const resultado = await new AxeBuilder({ page: this.browser.page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      rotasVarridas.push(rota);
      for (const violacao of resultado.violations) {
        // Contraste entra em qualquer severidade: o RNF-01 e o RNF-02 da 002
        // fixam o minimo por numero, e nao pela etiqueta que o axe atribui.
        if (
          violacao.impact === 'critical' ||
          violacao.impact === 'serious' ||
          violacao.id.includes('color-contrast')
        ) {
          violacoesGraves.push(`${rota}: ${violacao.id} (${violacao.impact})`);
        }
      }
    }
  },
);

Then('nenhuma violação crítica ou séria de acessibilidade é encontrada', function (): void {
  assert.deepEqual(
    violacoesGraves,
    [],
    `violacoes graves de acessibilidade: ${violacoesGraves.join('; ')}`,
  );
});

Then('nenhuma página é dispensada da verificação', async function (): Promise<void> {
  assert.deepEqual(
    rotasVarridas,
    [...(await rotasPublicas())],
    'alguma rota publica ficou de fora da varredura de acessibilidade',
  );
});

// --- RNF-01 e RNF-02 da 002: contraste --------------------------------------
// Vivem aqui, e nao em `appearance_steps.ts`, porque leem o resultado da mesma
// varredura que o `Quando` acima guarda. Definir o `Quando` duas vezes faria o
// Cucumber reprovar por ambiguidade.

Then('nenhuma violação de contraste é encontrada', function (): void {
  const contraste = violacoesGraves.filter((v) => v.includes('color-contrast'));
  assert.deepEqual(contraste, [], `violacoes de contraste: ${contraste.join('; ')}`);
});

Then('nenhuma página pública é dispensada da verificação', async function (): Promise<void> {
  assert.deepEqual(
    rotasVarridas,
    [...(await rotasPublicas())],
    'alguma rota publica ficou de fora da varredura de acessibilidade',
  );
});
