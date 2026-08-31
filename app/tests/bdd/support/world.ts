import { After, Before, setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import { BrowserDriver } from './browser_driver.ts';
import { ProcessDriver } from './process_driver.ts';

setDefaultTimeout(60_000);

/**
 * Dos 28 cenarios da spec, 19 abrem pagina e 9 nao abrem nenhuma. O motor e
 * escolhido **por cenario**, pela etiqueta, e inicializado de forma preguicosa:
 * cenario de processo nao sobe navegador que nao usa.
 */
export class VitrineWorld extends World {
  public readonly browser = new BrowserDriver();
  public readonly process = new ProcessDriver();
}

setWorldConstructor(VitrineWorld);

Before({ tags: '@navegador' }, async function (this: VitrineWorld): Promise<void> {
  await this.browser.start();
});

After({ tags: '@navegador' }, async function (this: VitrineWorld): Promise<void> {
  await this.browser.stop();
});

Before({ tags: '@processo' }, async function (this: VitrineWorld): Promise<void> {
  await this.process.start();
});

After({ tags: '@processo' }, async function (this: VitrineWorld): Promise<void> {
  await this.process.stop();
});
