import { EvaluateGateCommand } from '../../adapters/commands/evaluate_gate_command.ts';
import { ResolveModeCommand } from '../../adapters/commands/resolve_mode_command.ts';
import { ResolveVersionCommand } from '../../adapters/commands/resolve_version_command.ts';
import { WriteSummaryCommand } from '../../adapters/commands/write_summary_command.ts';
import { GitHistoryRepository } from '../../adapters/repositories/git_history_repository.ts';
import { RunSummaryRepository } from '../../adapters/repositories/run_summary_repository.ts';
import { ClassifyPipelineFailureUseCase } from '../../core/application/pipeline/classify_pipeline_failure_use_case.ts';
import { ClassifyVersionBumpUseCase } from '../../core/application/pipeline/classify_version_bump_use_case.ts';
import { EvaluateQualityGateUseCase } from '../../core/application/pipeline/evaluate_quality_gate_use_case.ts';
import { RenderRunSummaryUseCase } from '../../core/application/pipeline/render_run_summary_use_case.ts';
import { ResolveNextVersionUseCase } from '../../core/application/pipeline/resolve_next_version_use_case.ts';
import { ResolvePipelineModeUseCase } from '../../core/application/pipeline/resolve_pipeline_mode_use_case.ts';
import { PipelineCliEntry } from '../cli/pipeline_cli_entry.ts';
import { ConfigTool } from '../tools/config_tool.ts';
import { LoggerTool } from '../tools/logger_tool.ts';
import type { IPipelineCliEntry } from '../../interfaces/infra/cli/i_pipeline_cli_entry.ts';

/** Liga interface a implementacao. Sem condicao a decidir: cada interface tem
 *  uma implementacao so, ligada uma vez. Por isso e isento de cobertura. */
export function buildPipelineCliEntry(): IPipelineCliEntry {
  const config = new ConfigTool();
  const logger = new LoggerTool();
  const summary = new RunSummaryRepository(config);
  const render = new RenderRunSummaryUseCase(new ClassifyPipelineFailureUseCase());
  return new PipelineCliEntry(
    new ResolveVersionCommand(
      new ResolveNextVersionUseCase(new GitHistoryRepository(), new ClassifyVersionBumpUseCase()),
      logger,
    ),
    new ResolveModeCommand(new ResolvePipelineModeUseCase(config), logger),
    new EvaluateGateCommand(config, new EvaluateQualityGateUseCase(), render, summary, logger),
    new WriteSummaryCommand(config, render, summary, logger),
    logger,
  );
}
