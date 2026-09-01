import type { PipelineMode } from '../../../../core/domain/enums/pipeline_mode_enum.ts';

/**
 * RF-09: a configuracao do repositorio define o padrao, e a marcacao aplicada a
 * Pull Request de feature a sobrepoe naquela cadeia. Ausentes as duas, vale o
 * modo automatico.
 */
export interface IResolvePipelineModeUseCase {
  execute(): PipelineMode;
}
