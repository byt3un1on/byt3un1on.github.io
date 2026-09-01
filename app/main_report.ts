import { buildCliEntry } from './infra/init/cli_ioc_init.ts';

// Instancia o container, pede o inicializador, executa. Sem regra de negocio.
process.exitCode = await buildCliEntry().run(['report', ...process.argv.slice(2)]);
