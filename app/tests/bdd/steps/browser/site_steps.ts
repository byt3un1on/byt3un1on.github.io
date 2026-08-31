import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { ORGANIZATION } from '../../../../core/domain/constants/organization_constants.ts';
import type { VitrineWorld } from '../../support/world.ts';

// --- RF-01: apresentacao ---------------------------------------------------

Given('que eu nunca acessei a vitrine da Byte Union', function (): void {
  // Cada cenario ja abre um navegador novo, sem estado anterior.
});

When('eu abro a página inicial do sítio', async function (this: VitrineWorld): Promise<void> {
  await this.browser.visit('/');
});

Then(
  'eu vejo o nome da organização e uma declaração do que ela faz como oficina de projetos',
  async function (this: VitrineWorld): Promise<void> {
    const titulo = await this.browser.page.getByRole('heading', { level: 1 }).textContent();
    assert.equal(titulo?.trim(), ORGANIZATION.name);
    const texto = await this.browser.page
      .getByText(/oficina de projetos/i)
      .first()
      .textContent();
    assert.ok((texto ?? '').length > 0, 'nenhuma declaracao sobre a oficina foi encontrada');
  },
);

Then(
  'essa declaração está visível sem que eu role a página',
  async function (this: VitrineWorld): Promise<void> {
    const alvo = this.browser.page.getByText(/oficina de projetos/i).first();
    const caixa = await alvo.boundingBox();
    const altura = this.browser.page.viewportSize()?.height ?? 720;
    assert.ok(caixa !== null, 'a declaracao nao foi renderizada');
    assert.ok(caixa.y + caixa.height <= altura, `declaracao abaixo da dobra: y=${caixa.y}`);
  },
);

Then(
  'não me é exigida nenhuma ação, cadastro ou aceite antes de ler',
  async function (this: VitrineWorld): Promise<void> {
    const bloqueios = await this.browser.page.evaluate(
      () =>
        document.querySelectorAll('form, dialog[open], [role="dialog"], [role="alertdialog"]')
          .length,
    );
    assert.equal(bloqueios, 0, 'ha formulario ou dialogo interpondo-se a leitura');
  },
);

// --- RF-10: contato --------------------------------------------------------

Given(
  'que estou em qualquer página pública do sítio',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit('/');
  },
);

When('eu procuro por quem mantém a Byte Union', async function (this: VitrineWorld): Promise<void> {
  await this.browser.page.getByRole('contentinfo').waitFor();
});

Then(
  'eu encontro a autoria apresentada como organização',
  async function (this: VitrineWorld): Promise<void> {
    const rodape = await this.browser.page.getByRole('contentinfo').textContent();
    assert.match(rodape ?? '', new RegExp(ORGANIZATION.name));
  },
);

Then(
  'encontro uma ligação para o perfil da organização no GitHub e outra para o grupo da comunidade no Discord',
  async function (this: VitrineWorld): Promise<void> {
    const enderecos = await this.browser.page
      .getByRole('contentinfo')
      .getByRole('link')
      .evaluateAll((links) => links.map((l) => (l as HTMLAnchorElement).href));
    assert.ok(
      enderecos.some((e) => e.includes('github.com/byt3un1on')),
      'ligacao para o perfil da organizacao no GitHub ausente',
    );
    assert.ok(
      enderecos.some((e) => e.includes('discord')),
      'ligacao para o grupo no Discord ausente: o canal segue pendente na curadoria',
    );
  },
);

Then(
  'eu não vejo nome, papel, biografia ou perfil individual de nenhum autor',
  async function (this: VitrineWorld): Promise<void> {
    const enderecos = await this.browser.page
      .getByRole('contentinfo')
      .getByRole('link')
      .evaluateAll((links) => links.map((l) => (l as HTMLAnchorElement).href));
    const perfisPessoais = enderecos.filter(
      (e) => /github\.com\/[^/]+\/?$/.test(e) && !e.includes('byt3un1on'),
    );
    assert.deepEqual(perfisPessoais, [], 'ha perfil individual no rodape');
  },
);

// --- RF-12: endereco inexistente -------------------------------------------

Given(
  'que eu abro um endereço que não corresponde a nenhuma página do sítio',
  async function (this: VitrineWorld): Promise<void> {
    await this.browser.visit('/404');
  },
);

When('a página é exibida', async function (this: VitrineWorld): Promise<void> {
  await this.browser.page.getByRole('heading', { level: 1 }).waitFor();
});

Then(
  'eu vejo uma página de erro do próprio sítio, com a identidade da Byte Union',
  async function (this: VitrineWorld): Promise<void> {
    const titulo = await this.browser.page.getByRole('heading', { level: 1 }).textContent();
    assert.match(titulo ?? '', /nao encontrado/i);
    const cabecalho = await this.browser.page.getByRole('banner').textContent();
    assert.match(cabecalho ?? '', new RegExp(ORGANIZATION.name));
  },
);

Then(
  'vejo uma ligação que me leva ao catálogo de projetos',
  async function (this: VitrineWorld): Promise<void> {
    const ligacao = this.browser.page.getByRole('link', { name: 'Ver os projetos' });
    assert.equal(await ligacao.getAttribute('href'), '/projetos');
  },
);

Then(
  'eu não vejo página de erro genérica do serviço de hospedagem',
  async function (this: VitrineWorld): Promise<void> {
    const conteudo = await this.browser.page.content();
    assert.equal(/GitHub Pages|404 File not found/i.test(conteudo), false);
    assert.match(conteudo, new RegExp(ORGANIZATION.name));
  },
);
