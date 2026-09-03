import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { staticRoutes } from '../../../../core/domain/constants/site_routes_constants.ts';
import { CATALOG_FILTER_PARAM } from '../../../../core/domain/constants/site_routes_constants.ts';
import type { VitrineWorld } from '../../support/world.ts';

interface CatalogoGerado {
  readonly projects: readonly {
    readonly slug: string;
    readonly name: string;
    readonly summary: string;
    readonly highlighted: boolean;
    readonly technologies: readonly string[];
  }[];
}

async function catalogo(): Promise<CatalogoGerado> {
  return JSON.parse(await readFile('data/catalog.generated.json', 'utf8')) as CatalogoGerado;
}

/** Rotas fixas mais a de cada projeto publicado — o conjunto publico completo. */
async function rotasPublicas(): Promise<readonly string[]> {
  const { projects } = await catalogo();
  return [...staticRoutes(), ...projects.map((p) => `/projetos/${p.slug}`)];
}

// --- Estado partilhado entre os passos de um mesmo cenario -----------------

let rotasVisitadas: string[] = [];
let fundoEscuroPorRota: Record<string, boolean> = {};
let coresForaDoConjunto: string[] = [];
let enquadramentos: Record<string, string> = {};
let recursosDeImagem: string[] = [];
let niveis: Record<string, Record<string, string>> = {};
let espacos = { entreItens: 0, dentroDoItem: 0 };
let destaque = { difereEm: [] as string[], mesmaLargura: false, mesmaOrdem: false };
let restricao = { difereEm: [] as string[] };
let foco = { alcancados: 0, semIndicacao: [] as string[] };
let aparenciaPadrao: string[] = [];
let movimento: string[] = [];
let textosDivergentes: string[] = [];

/**
 * Converte cor computada em componentes numericos. O navegador devolve sempre
 * `rgb()` ou `rgba()`, mas devolve tambem o totalmente transparente para quem
 * nao declarou cor alguma — e esse caso nao e cor avulsa, e ausencia de cor.
 */
function corParaChave(valor: string): string | null {
  const m = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/.exec(valor.trim());
  if (m === null) {
    return null;
  }
  const alfa = m[4] === undefined ? 1 : Number(m[4]);
  if (alfa === 0) {
    return null;
  }
  return `${m[1]},${m[2]},${m[3]}`;
}

function luminancia(chave: string): number {
  const canal = (v: number): number => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = chave.split(',').map(Number);
  return 0.2126 * canal(r ?? 0) + 0.7152 * canal(g ?? 0) + 0.0722 * canal(b ?? 0);
}

// --- RF-01: fundo escuro com texto claro -----------------------------------

/**
 * O `Dado` e o `Quando` deste cenario ja existem na suite da 001 e sao
 * reaproveitados. Por isso a medicao mora no `Entao`: redefini-los aqui faria
 * o Cucumber reprovar por definicao ambigua.
 */
Then(
  'o fundo é mais escuro que o texto que ele carrega',
  async function (this: VitrineWorld): Promise<void> {
    rotasVisitadas = [...(await rotasPublicas())];
    fundoEscuroPorRota = {};
    for (const rota of rotasVisitadas) {
      await this.browser.visit(rota);
      const par = await this.browser.page.evaluate(() => {
        const estilo = getComputedStyle(document.body);
        return { fundo: estilo.backgroundColor, texto: estilo.color };
      });
      const fundo = corParaChave(par.fundo);
      const texto = corParaChave(par.texto);
      fundoEscuroPorRota[rota] =
        fundo !== null && texto !== null && luminancia(fundo) < luminancia(texto);
    }
    const claras = Object.entries(fundoEscuroPorRota)
      .filter(([, escuro]) => !escuro)
      .map(([rota]) => rota);
    assert.deepEqual(claras, [], `rotas sem fundo mais escuro que o texto: ${claras.join(', ')}`);
  },
);

Then('nenhuma página pública é servida com fundo claro', function (): void {
  assert.ok(rotasVisitadas.length > 0, 'nenhuma rota publica foi medida');
  assert.equal(Object.keys(fundoEscuroPorRota).length, rotasVisitadas.length);
});

// --- RF-02: nenhuma cor fora do conjunto declarado -------------------------

Given('que o sítio declara um conjunto finito de cores', async function (): Promise<void> {
  rotasVisitadas = [...(await rotasPublicas())];
  coresForaDoConjunto = [];
});

When('eu percorro todas as páginas públicas', async function (this: VitrineWorld): Promise<void> {
  for (const rota of rotasVisitadas) {
    await this.browser.visit(rota);
    const encontradas = await this.browser.page.evaluate(() => {
      const raiz = getComputedStyle(document.documentElement);
      const declaradas = new Set<string>();
      for (const nome of Array.from(raiz)) {
        if (!nome.startsWith('--')) {
          continue;
        }
        const valor = raiz.getPropertyValue(nome).trim();
        // A ficha e declarada em hexadecimal; o navegador so normaliza para
        // rgb() quando ela e usada. Resolver aqui, pintando um elemento
        // descartavel, e o que permite comparar fichas com cores computadas.
        const sonda = document.createElement('span');
        sonda.style.color = valor;
        if (sonda.style.color === '') {
          continue;
        }
        document.body.appendChild(sonda);
        declaradas.add(getComputedStyle(sonda).color);
        sonda.remove();
      }
      // O requisito fala de cor **exibida**. O navegador computa cor tambem
      // onde nada e pintado — borda de largura zero, contorno sem estilo,
      // elemento sem texto proprio —, e essas nao sao cor avulsa: sao valor
      // inicial. Sem este recorte o cenario reprovaria a paleta correta.
      const temTextoProprio = (el: Element): boolean =>
        Array.from(el.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() !== '',
        );
      const fora: string[] = [];
      for (const el of Array.from(document.querySelectorAll('*'))) {
        const estilo = getComputedStyle(el);
        if (estilo.display === 'none' || estilo.visibility === 'hidden') {
          continue;
        }
        const candidatos: [string, string][] = [];
        if (temTextoProprio(el)) {
          candidatos.push(['color', estilo.color]);
        }
        candidatos.push(['backgroundColor', estilo.backgroundColor]);
        for (const lado of ['Top', 'Right', 'Bottom', 'Left'] as const) {
          const largura = parseFloat(estilo[`border${lado}Width` as 'borderTopWidth']);
          const tipo = estilo[`border${lado}Style` as 'borderTopStyle'];
          if (largura > 0 && tipo !== 'none') {
            candidatos.push([
              `border${lado}Color`,
              estilo[`border${lado}Color` as 'borderTopColor'],
            ]);
          }
        }
        if (estilo.outlineStyle !== 'none' && parseFloat(estilo.outlineWidth) > 0) {
          candidatos.push(['outlineColor', estilo.outlineColor]);
        }
        for (const [prop, valor] of candidatos) {
          if (valor === '' || declaradas.has(valor)) {
            continue;
          }
          fora.push(`${el.tagName.toLowerCase()}.${prop}=${valor}`);
        }
      }
      return fora;
    });
    for (const achado of encontradas) {
      const chave = corParaChave(achado.split('=')[1] ?? '');
      if (chave !== null) {
        coresForaDoConjunto.push(`${rota}: ${achado}`);
      }
    }
  }
});

Then('toda cor de texto, de fundo e de limite pertence a esse conjunto', function (): void {
  assert.deepEqual(
    coresForaDoConjunto.slice(0, 10),
    [],
    `cores fora do conjunto declarado (${coresForaDoConjunto.length} no total): ` +
      coresForaDoConjunto.slice(0, 10).join(' | '),
  );
});

Then('nenhuma página introduz cor avulsa', function (): void {
  assert.equal(coresForaDoConjunto.length, 0);
});

// --- RF-08: o enquadramento e o mesmo em toda pagina -----------------------

Given(
  'que eu percorro todas as páginas públicas do sítio',
  async function (this: VitrineWorld): Promise<void> {
    rotasVisitadas = [...(await rotasPublicas())];
    enquadramentos = {};
    recursosDeImagem = [];
  },
);

When(
  'eu comparo o cabeçalho, o rodapé e o fundo de cada uma',
  async function (this: VitrineWorld): Promise<void> {
    for (const rota of rotasVisitadas) {
      await this.browser.visit(rota);
      enquadramentos[rota] = await this.browser.page.evaluate(() => {
        const corpo = getComputedStyle(document.body);
        const cabecalho = document.querySelector('header');
        const rodape = document.querySelector('footer');
        const resumo = (el: Element | null): string => {
          if (el === null) {
            return 'ausente';
          }
          const e = getComputedStyle(el);
          return [e.backgroundColor, e.color, e.fontFamily, e.borderTopWidth].join('|');
        };
        return [corpo.backgroundColor, corpo.color, corpo.fontFamily]
          .concat(resumo(cabecalho), resumo(rodape))
          .join('||');
      });
    }
  },
);

Then('eles são idênticos entre todas as páginas', function (): void {
  const distintos = new Set(Object.values(enquadramentos));
  assert.equal(
    distintos.size,
    1,
    `enquadramentos diferentes entre rotas: ${JSON.stringify(enquadramentos, null, 1)}`,
  );
});

Then('nenhuma página pública aparece com enquadramento próprio', function (): void {
  assert.equal(Object.keys(enquadramentos).length, rotasVisitadas.length);
});

// --- RF-09: a identidade nao depende de imagem -----------------------------

/**
 * A identidade continua sem imagem: tipografia, ritmo e cor sustentam sozinhos
 * a aparencia do sitio. O que passou a existir e imagem de **conteudo** — as
 * capturas do servidor na pagina da comunidade, que ilustram o que o texto ao
 * lado ja diz. Uma coisa e a identidade nao depender de ilustracao; outra seria
 * proibir que pagina alguma mostre o que descreve.
 */
const ROTAS_COM_IMAGEM_DE_CONTEUDO: readonly string[] = ['/comunidade'];

Then(
  'nenhuma imagem decorativa, ilustração ou ícone é carregada como recurso',
  async function (this: VitrineWorld): Promise<void> {
    recursosDeImagem = [];
    const rotasDeIdentidade = (await rotasPublicas()).filter(
      (rota) => !ROTAS_COM_IMAGEM_DE_CONTEUDO.includes(rota),
    );
    for (const rota of rotasDeIdentidade) {
      await this.browser.visit(rota);
      const achados = await this.browser.page.evaluate(() => {
        const fora: string[] = [];
        if (document.images.length > 0) {
          fora.push(`${document.images.length} elemento(s) img`);
        }
        for (const el of Array.from(document.querySelectorAll('*'))) {
          const fundo = getComputedStyle(el).backgroundImage;
          if (fundo !== 'none' && fundo.includes('url(')) {
            fora.push(`background-image em ${el.tagName.toLowerCase()}: ${fundo}`);
          }
        }
        return fora;
      });
      recursosDeImagem.push(...achados.map((a) => `${rota}: ${a}`));
    }
    assert.deepEqual(recursosDeImagem, [], `recursos de imagem: ${recursosDeImagem.join(' | ')}`);
  },
);

Then(
  'o sítio continua tendo aparência própria',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit('/');
    const fundo = await this.browser.page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    const chave = corParaChave(fundo);
    assert.ok(chave !== null, 'o corpo nao declara cor de fundo');
    assert.notEqual(chave, '255,255,255', 'o corpo esta com o branco padrao do navegador');
  },
);

// --- RF-03: hierarquia tipografica -----------------------------------------

Given('que eu abro o catálogo de projetos', async function (this: VitrineWorld): Promise<void> {
  await this.browser.visit('/projetos');
});

When(
  'eu comparo o título da página, o título de um projeto, o texto corrido e o metadado',
  async function (this: VitrineWorld): Promise<void> {
    niveis = await this.browser.page.evaluate(() => {
      // O cartao sem destaque tem dois paragrafos; o destacado tem tres. E
      // assim que se acha o resumo sem consultar classe de estilo.
      const cartoes = Array.from(document.querySelectorAll('article'));
      const simples = cartoes.find((c) => c.querySelectorAll('p').length === 2) ?? cartoes[0];
      const ler = (el: Element | null | undefined): Record<string, string> => {
        if (el === undefined || el === null) {
          return {};
        }
        const e = getComputedStyle(el);
        return {
          fontSize: e.fontSize,
          fontWeight: e.fontWeight,
          lineHeight: e.lineHeight,
          letterSpacing: e.letterSpacing,
          fontFamily: e.fontFamily,
          textTransform: e.textTransform,
        };
      };
      return {
        pagina: ler(document.querySelector('h1')),
        projeto: ler(simples?.querySelector('h3')),
        corrido: ler(simples?.querySelector('p')),
        metadado: ler(simples?.querySelector('ul[aria-label="Tecnologias"] li')),
      };
    });
  },
);

Then('cada nível se distingue do seguinte por mais de um atributo tipográfico', function (): void {
  const ordem = ['pagina', 'projeto', 'corrido', 'metadado'];
  const fracos: string[] = [];
  for (let i = 0; i < ordem.length - 1; i += 1) {
    const a = niveis[ordem[i] ?? ''] ?? {};
    const b = niveis[ordem[i + 1] ?? ''] ?? {};
    const diferentes = Object.keys(a).filter((k) => a[k] !== b[k]);
    if (diferentes.length < 2) {
      fracos.push(`${ordem[i]} x ${ordem[i + 1]}: difere so em ${diferentes.join(',') || 'nada'}`);
    }
  }
  assert.deepEqual(fracos, [], fracos.join(' | '));
});

Then('nenhum par de níveis se distingue apenas pelo tamanho da letra', function (): void {
  const ordem = ['pagina', 'projeto', 'corrido', 'metadado'];
  const soTamanho: string[] = [];
  for (let i = 0; i < ordem.length - 1; i += 1) {
    const a = niveis[ordem[i] ?? ''] ?? {};
    const b = niveis[ordem[i + 1] ?? ''] ?? {};
    const diferentes = Object.keys(a).filter((k) => a[k] !== b[k]);
    if (diferentes.length === 1 && diferentes[0] === 'fontSize') {
      soTamanho.push(`${ordem[i]} x ${ordem[i + 1]}`);
    }
  }
  assert.deepEqual(soTamanho, [], soTamanho.join(' | '));
});

// --- RF-06: os itens do catalogo se leem como unidades ---------------------

Given(
  'que o catálogo exibe mais de um projeto',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit('/projetos');
    const total = await this.browser.page.locator('article').count();
    assert.ok(total > 1, `catalogo com ${total} projeto(s): o cenario precisa de mais de um`);
  },
);

When('eu observo o espaço entre os itens', async function (this: VitrineWorld): Promise<void> {
  espacos = await this.browser.page.evaluate(() => {
    const cartoes = Array.from(document.querySelectorAll('article'));
    const caixas = cartoes.map((c) => c.getBoundingClientRect());
    let entreItens = Number.POSITIVE_INFINITY;
    for (let i = 0; i < caixas.length - 1; i += 1) {
      const a = caixas[i];
      const b = caixas[i + 1];
      if (a === undefined || b === undefined) {
        continue;
      }
      const vertical = b.top - a.bottom;
      const horizontal = b.left - a.right;
      entreItens = Math.min(entreItens, Math.max(vertical, horizontal));
    }
    let dentroDoItem = 0;
    const primeiro = cartoes[0];
    if (primeiro !== undefined) {
      const filhos = Array.from(primeiro.children).map((f) => f.getBoundingClientRect());
      for (let i = 0; i < filhos.length - 1; i += 1) {
        const a = filhos[i];
        const b = filhos[i + 1];
        if (a === undefined || b === undefined) {
          continue;
        }
        dentroDoItem = Math.max(dentroDoItem, b.top - a.bottom);
      }
    }
    return { entreItens: Number.isFinite(entreItens) ? entreItens : 0, dentroDoItem };
  });
});

Then(
  'o espaço que separa um item do seguinte é maior que o espaço interno do item',
  function (): void {
    assert.ok(
      espacos.entreItens > espacos.dentroDoItem,
      `espaco entre itens ${espacos.entreItens.toFixed(1)}px nao supera o interno ` +
        `${espacos.dentroDoItem.toFixed(1)}px`,
    );
  },
);

Then('nenhum item se confunde visualmente com o item vizinho', function (): void {
  assert.ok(espacos.entreItens > 0, 'itens vizinhos encostam');
});

// --- RF-04: o destaque da curadoria ----------------------------------------

Given('que a curadoria declara um projeto como destaque', async function (): Promise<void> {
  const { projects } = await catalogo();
  assert.ok(
    projects.some((p) => p.highlighted),
    'nenhum projeto destacado na curadoria: o cenario ficaria sem objeto',
  );
});

When('eu observo o catálogo de projetos', async function (this: VitrineWorld): Promise<void> {
  await this.browser.visit('/projetos');
  const { projects } = await catalogo();
  const nomeDestacado = projects.find((p) => p.highlighted)?.name ?? '';
  destaque = await this.browser.page.evaluate((nome) => {
    const cartoes = Array.from(document.querySelectorAll('article'));
    const alvo = cartoes.find((c) => c.querySelector('h3')?.textContent?.trim() === nome);
    const outros = cartoes.filter((c) => c !== alvo);
    const primeiroOutro = outros[0];
    if (alvo === undefined || primeiroOutro === undefined) {
      return { difereEm: [], mesmaLargura: false, mesmaOrdem: false };
    }
    const props = [
      'borderLeftWidth',
      'borderLeftColor',
      'backgroundColor',
      'paddingLeft',
      'boxShadow',
      'outlineWidth',
    ] as const;
    const a = getComputedStyle(alvo);
    const b = getComputedStyle(primeiroOutro);
    const difereEm = props.filter((p) => a[p] !== b[p]);
    return {
      difereEm: [...difereEm],
      mesmaLargura:
        Math.abs(alvo.getBoundingClientRect().width - primeiroOutro.getBoundingClientRect().width) <
        1,
      mesmaOrdem: cartoes.indexOf(alvo) === 0,
    };
  }, nomeDestacado);
});

Then('o item desse projeto se distingue visualmente dos demais', function (): void {
  assert.ok(
    destaque.difereEm.length > 0,
    'o cartao destacado tem exatamente o mesmo estilo dos demais',
  );
});

Then('a sua posição e o seu tamanho permanecem os mesmos dos demais itens', function (): void {
  assert.ok(destaque.mesmaLargura, 'o cartao destacado tem largura diferente dos demais');
  assert.ok(destaque.mesmaOrdem, 'o cartao destacado saiu da posicao que a curadoria lhe deu');
});

Then('a distinção não se reduz a uma palavra escrita no cartão', function (): void {
  assert.ok(
    destaque.difereEm.length > 0,
    'a unica marca de destaque e o texto: falta canal visual',
  );
});

// --- RF-05: a restricao aplicada e visivel ---------------------------------

Given(
  'que eu restrinjo o catálogo a uma tecnologia',
  async function (this: VitrineWorld): Promise<void> {
    const { projects } = await catalogo();
    const tecnologia = projects.flatMap((p) => p.technologies)[0];
    assert.ok(tecnologia, 'catalogo sem tecnologia alguma');
    await this.browser.visit(`/projetos?${CATALOG_FILTER_PARAM}=${encodeURIComponent(tecnologia)}`);
  },
);

When('eu observo o controle de restrição', async function (this: VitrineWorld): Promise<void> {
  restricao = await this.browser.page.evaluate(() => {
    const aplicado = document.querySelector('button[aria-pressed="true"]');
    const solto = document.querySelector('button[aria-pressed="false"]');
    if (aplicado === null || solto === null) {
      return { difereEm: [] };
    }
    const props = [
      'color',
      'backgroundColor',
      'fontWeight',
      'borderBottomWidth',
      'borderBottomColor',
      'textDecorationLine',
      'boxShadow',
      'borderStyle',
    ] as const;
    const a = getComputedStyle(aplicado);
    const b = getComputedStyle(solto);
    return { difereEm: props.filter((p) => a[p] !== b[p]).map(String) };
  });
});

Then('o critério aplicado se distingue visualmente dos não aplicados', function (): void {
  assert.ok(
    restricao.difereEm.length > 0,
    'o botao aplicado tem exatamente o mesmo estilo dos nao aplicados',
  );
});

Then('a distinção não se reduz à cor', function (): void {
  const naoCor = restricao.difereEm.filter((p) => !p.toLowerCase().includes('color'));
  assert.ok(
    naoCor.length > 0,
    `a distincao usa so cor: difere em ${restricao.difereEm.join(', ')}`,
  );
});

// --- RF-07: o foco e sempre visivel ----------------------------------------

Given(
  'que eu percorro qualquer página pública somente pelo teclado',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit('/projetos');
    foco = { alcancados: 0, semIndicacao: [] };
  },
);

When('o foco alcança cada elemento interativo', async function (this: VitrineWorld): Promise<void> {
  foco = await this.browser.page.evaluate(() => {
    const interativos = Array.from(
      document.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea'),
    );
    const semIndicacao: string[] = [];
    const props = ['outlineWidth', 'outlineColor', 'outlineStyle', 'boxShadow'] as const;
    for (const el of interativos) {
      const antes = props.map((p) => getComputedStyle(el)[p]).join('|');
      el.focus();
      const depois = props.map((p) => getComputedStyle(el, null)[p]).join('|');
      if (antes === depois) {
        semIndicacao.push(`${el.tagName.toLowerCase()}: ${el.textContent?.trim().slice(0, 24)}`);
      }
      el.blur();
    }
    return { alcancados: interativos.length, semIndicacao };
  });
});

Then('a aparência do elemento focado difere da do elemento não focado', function (): void {
  assert.ok(foco.alcancados > 0, 'nenhum elemento interativo encontrado');
  assert.deepEqual(
    foco.semIndicacao,
    [],
    `sem indicacao de foco: ${foco.semIndicacao.join(' | ')}`,
  );
});

Then('nenhum elemento interativo recebe foco sem indicação visível', function (): void {
  assert.equal(foco.semIndicacao.length, 0);
});

// --- RF-10: nenhum controle com aparencia padrao do navegador --------------

When('eu observo os elementos interativos', async function (this: VitrineWorld): Promise<void> {
  aparenciaPadrao = [];
  for (const rota of await rotasPublicas()) {
    await this.browser.visit(rota);
    const achados = await this.browser.page.evaluate(async () => {
      // A referencia e o mesmo elemento renderizado sem a folha do sitio, num
      // documento isolado — e nao uma lista de valores presumidos.
      const quadro = document.createElement('iframe');
      quadro.setAttribute('srcdoc', '<!doctype html><body></body>');
      document.body.appendChild(quadro);
      await new Promise((r) => quadro.addEventListener('load', r, { once: true }));
      const doc = quadro.contentDocument;
      const props = [
        'color',
        'backgroundColor',
        'fontFamily',
        'borderTopStyle',
        'textDecorationLine',
        'padding',
      ] as const;
      const iguais: string[] = [];
      if (doc !== null) {
        for (const el of Array.from(
          document.querySelectorAll<HTMLElement>('a[href], button, fieldset'),
        )) {
          const tag = el.tagName.toLowerCase();
          const referencia = doc.createElement(tag);
          if (tag === 'a') {
            referencia.setAttribute('href', '#');
          }
          referencia.textContent = 'x';
          doc.body.appendChild(referencia);
          const meu = getComputedStyle(el);
          const padrao = getComputedStyle(referencia);
          if (props.every((p) => meu[p] === padrao[p])) {
            iguais.push(tag);
          }
          referencia.remove();
        }
      }
      quadro.remove();
      return iguais;
    });
    aparenciaPadrao.push(...achados.map((a) => `${rota}: ${a}`));
  }
});

Then('todos apresentam aparência declarada pelo sítio', function (): void {
  assert.deepEqual(
    aparenciaPadrao,
    [],
    `elementos com a aparencia padrao do navegador: ${aparenciaPadrao.join(' | ')}`,
  );
});

Then('nenhum aparece com a aparência que o navegador daria por omissão', function (): void {
  assert.equal(aparenciaPadrao.length, 0);
});

// --- RNF-01 e RNF-02: contraste --------------------------------------------
// O `Quando` da varredura e os dois `Entao` de contraste vivem em
// `quality_steps.ts`, onde o resultado da varredura ja e guardado. Duplicar a
// definicao aqui faria o Cucumber reprovar por ambiguidade.

// --- RNF-06: nenhuma requisicao a dominio externo --------------------------

Then(
  'nenhuma requisição foi feita a domínio externo ao sítio',
  function (this: VitrineWorld): void {
    assert.deepEqual(
      this.browser.requestsToOtherHosts(),
      [],
      `requisicoes a dominio externo: ${this.browser.requestsToOtherHosts().join(', ')}`,
    );
  },
);

Then(
  'todos os recursos de que a página precisa foram servidos',
  function (this: VitrineWorld): void {
    assert.deepEqual(
      this.browser.responsesThatFailed(),
      [],
      `recursos que falharam: ${this.browser.responsesThatFailed().join(', ')}`,
    );
  },
);

// --- RNF-08: movimento reduzido --------------------------------------------

Given(
  'que o meu sistema sinaliza preferência por movimento reduzido',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.useReducedMotion();
  },
);

When(
  'eu abro qualquer página pública do sítio',
  async function (this: VitrineWorld): Promise<void> {
    movimento = [];
    for (const rota of await rotasPublicas()) {
      await this.browser.visit(rota);
      const achados = await this.browser.page.evaluate(() => {
        const perceptivel = (valor: string): boolean =>
          valor.split(',').some((parte) => Number(parte.trim().replace('s', '')) > 0.05);
        const fora: string[] = [];
        for (const el of Array.from(document.querySelectorAll('*'))) {
          const e = getComputedStyle(el);
          if (perceptivel(e.animationDuration) || perceptivel(e.transitionDuration)) {
            fora.push(
              `${el.tagName.toLowerCase()}: ${e.animationDuration}/${e.transitionDuration}`,
            );
          }
        }
        return fora;
      });
      movimento.push(...achados.map((a) => `${rota}: ${a}`));
    }
  },
);

Then('nenhuma animação ou transição de duração perceptível é executada', function (): void {
  assert.deepEqual(movimento, [], `movimento sob preferencia reduzida: ${movimento.join(' | ')}`);
});

Then('o conteúdo continua chegando completo', async function (this: VitrineWorld): Promise<void> {
  await this.browser.visit('/projetos');
  const cartoes = await this.browser.page.locator('article').count();
  assert.ok(cartoes > 0, 'nenhum projeto renderizado sob preferencia de movimento reduzido');
});

// --- RNF-09: o conteudo nao mudou ------------------------------------------

Given('que o catálogo declara os projetos publicados', async function (): Promise<void> {
  const { projects } = await catalogo();
  assert.ok(projects.length > 0, 'catalogo vazio: o cenario ficaria sem objeto');
  textosDivergentes = [];
});

When(
  'eu percorro o catálogo e as páginas de projeto',
  async function (this: VitrineWorld): Promise<void> {
    const { projects } = await catalogo();
    await this.browser.visit('/projetos');
    const noCatalogo = await this.browser.page.evaluate(() =>
      Array.from(document.querySelectorAll('article')).map((c) => c.textContent ?? ''),
    );
    for (const projeto of projects) {
      const cartao = noCatalogo.find((t) => t.includes(projeto.name));
      if (cartao === undefined) {
        textosDivergentes.push(`catalogo nao exibe "${projeto.name}"`);
        continue;
      }
      if (!cartao.includes(projeto.summary)) {
        textosDivergentes.push(`resumo divergente em "${projeto.name}"`);
      }
      for (const tecnologia of projeto.technologies) {
        if (!cartao.includes(tecnologia)) {
          textosDivergentes.push(`tecnologia "${tecnologia}" ausente em "${projeto.name}"`);
        }
      }
      await this.browser.visit(`/projetos/${projeto.slug}`);
      const naPagina = await this.browser.page.evaluate(() => document.body.textContent ?? '');
      if (!naPagina.includes(projeto.name) || !naPagina.includes(projeto.summary)) {
        textosDivergentes.push(`pagina de "${projeto.name}" divergente do catalogo`);
      }
    }
  },
);

Then('cada nome, resumo, tecnologia e data exibido é idêntico ao do catálogo', function (): void {
  assert.deepEqual(textosDivergentes, [], textosDivergentes.join(' | '));
});

Then('nenhum texto de projeto passou a ser escrito em código de apresentação', function (): void {
  assert.equal(textosDivergentes.length, 0);
});
