import { buildPipelineCliEntry } from './infra/init/pipeline_ioc_init.ts';

// Instancia o container, pede o inicializador, executa. Sem regra de negocio.
process.exitCode = await buildPipelineCliEntry().run(process.argv.slice(2));
