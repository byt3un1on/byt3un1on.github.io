import { ClassifyPipelineFailureUseCase } from '../../../core/application/pipeline/classify_pipeline_failure_use_case.ts';
import { ClassifyVersionBumpUseCase } from '../../../core/application/pipeline/classify_version_bump_use_case.ts';
import { EvaluateQualityGateUseCase } from '../../../core/application/pipeline/evaluate_quality_gate_use_case.ts';
import { RenderRunSummaryUseCase } from '../../../core/application/pipeline/render_run_summary_use_case.ts';
import { ResolveNextVersionUseCase } from '../../../core/application/pipeline/resolve_next_version_use_case.ts';
import { ResolvePipelineModeUseCase } from '../../../core/application/pipeline/resolve_pipeline_mode_use_case.ts';
import { createPipelineJobResult } from '../../../core/domain/dtos/pipeline_job_result_dto.ts';
import {
  formatSemanticVersion,
  parseSemanticVersion,
  type SemanticVersion,
} from '../../../core/domain/models/semantic_version_model.ts';
import { ConfigTool } from '../../../infra/tools/config_tool.ts';
import type { PipelineJobResultDto } from '../../../core/domain/dtos/pipeline_job_result_dto.ts';
import type { PipelineFailureCause } from '../../../core/domain/enums/pipeline_failure_cause_enum.ts';
import type { PipelineMode } from '../../../core/domain/enums/pipeline_mode_enum.ts';
import type { QualityGateVerdict } from '../../../interfaces/core/application/pipeline/i_evaluate_quality_gate_use_case.ts';
import type { IGitHistoryRepository } from '../../../interfaces/adapters/repositories/i_git_history_repository.ts';

/**
 * Historico que o cenario descreve. E o unico dublê deste motor: git e estado
 * externo, e o cenario fala justamente sobre qual estado ele encontra.
 */
class ScriptedHistory implements IGitHistoryRepository {
  constructor(
    private readonly latest: SemanticVersion | null,
    private readonly messages: readonly string[],
  ) {}

  public findLatestVersion(): Promise<SemanticVersion | null> {
    return Promise.resolve(this.latest);
  }

  public listCommitMessagesSince(): Promise<readonly string[]> {
    return Promise.resolve(this.messages);
  }
}

/**
 * Motor de decisao: exercita os casos de uso da esteira de verdade, sem rede,
 * sem navegador e sem processo. O que os cenarios de decisao afirmam e o que a
 * esteira **decide** — versao, modo, veredito, causa e resumo —, e nao a forma
 * dos fluxos, que e assunto do motor de definicao.
 */
export class PipelineDriver {
  private readonly render = new RenderRunSummaryUseCase(new ClassifyPipelineFailureUseCase());
  private readonly gate = new EvaluateQualityGateUseCase();

  public results: PipelineJobResultDto[] = [];
  public verdict: QualityGateVerdict | null = null;
  public summary = '';
  public latestVersion: SemanticVersion | null = null;
  public commitMessages: readonly string[] = [];
  public nextVersion: SemanticVersion | null = null;
  public mode: PipelineMode | null = null;
  public environment: Record<string, string> = {};
  public cause: PipelineFailureCause | null = null;

  public reset(): void {
    this.results = [];
    this.verdict = null;
    this.summary = '';
    this.latestVersion = null;
    this.commitMessages = [];
    this.nextVersion = null;
    this.mode = null;
    this.environment = {};
    this.cause = null;
  }

  public stageResult(name: string, status: string, detail = ''): void {
    this.results.push(createPipelineJobResult(name, status, detail));
  }

  public evaluateGate(): void {
    this.verdict = this.gate.execute(this.results);
    this.summary = this.render.renderVerdict(this.verdict);
  }

  public renderJob(name: string, status: string, detail = ''): void {
    this.summary = this.render.renderJob(createPipelineJobResult(name, status, detail));
  }

  public setLatestVersion(version: string | null): void {
    this.latestVersion = version === null ? null : parseSemanticVersion(version);
  }

  public async resolveVersion(): Promise<void> {
    const history = new ScriptedHistory(this.latestVersion, this.commitMessages);
    this.nextVersion = await new ResolveNextVersionUseCase(
      history,
      new ClassifyVersionBumpUseCase(),
    ).execute();
  }

  public formattedNextVersion(): string {
    if (this.nextVersion === null) {
      throw new Error('versao ausente: recebido null, esperado a versao ja decidida pelo cenario');
    }
    return formatSemanticVersion(this.nextVersion);
  }

  public resolveMode(): void {
    this.mode = new ResolvePipelineModeUseCase(new ConfigTool(this.environment)).execute();
  }

  public classifyFailure(output: string): void {
    this.cause = new ClassifyPipelineFailureUseCase().execute(output);
  }
}
