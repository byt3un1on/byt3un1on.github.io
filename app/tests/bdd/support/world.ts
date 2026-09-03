import { After, Before, setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import { BrowserDriver } from './browser_driver.ts';
import { ProcessDriver } from './process_driver.ts';
import { PipelineDriver } from './pipeline_driver.ts';
import { WorkflowDriver, type WorkflowDefinition } from './workflow_driver.ts';

setDefaultTimeout(60_000);

/**
 * Dos 28 cenarios da spec, 19 abrem pagina e 9 nao abrem nenhuma. O motor e
 * escolhido **por cenario**, pela etiqueta, e inicializado de forma preguicosa:
 * cenario de processo nao sobe navegador que nao usa.
 */
export class VitrineWorld extends World {
  public readonly browser = new BrowserDriver();
  public readonly process = new ProcessDriver();
  public readonly workflow = new WorkflowDriver();
  public readonly pipeline = new PipelineDriver();
  /** Branch que o cenario de esteira esta descrevendo, quando ele nomeia uma. */
  public esteiraBranch = '';
  /** Pull Request que o cenario nomeia, quando ele nomeia uma. */
  public esteiraPullRequest = '';
  /** Fluxo que a acao do cenario declara, resolvido pelo destino que ela nomeia. */
  public esteiraFluxo: WorkflowDefinition | null = null;
}

setWorldConstructor(VitrineWorld);

Before({ tags: '@navegador' }, async function (this: VitrineWorld): Promise<void> {
  await this.browser.start();
});

After({ tags: '@navegador' }, async function (this: VitrineWorld): Promise<void> {
  await this.browser.stop();
});

Before({ tags: '@esteira' }, function (this: VitrineWorld): void {
  this.pipeline.reset();
});

Before({ tags: '@comunidade and @navegador' }, function (): void {
  return;
});

Before({ tags: '@processo' }, async function (this: VitrineWorld): Promise<void> {
  await this.process.start();
});

After({ tags: '@processo' }, async function (this: VitrineWorld): Promise<void> {
  await this.process.stop();
});
