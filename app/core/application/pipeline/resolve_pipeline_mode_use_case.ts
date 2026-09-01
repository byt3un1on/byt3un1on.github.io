import type { IResolvePipelineModeUseCase } from '../../../interfaces/core/application/pipeline/i_resolve_pipeline_mode_use_case.ts';
import type { IConfigTool } from '../../../interfaces/infra/tools/i_config_tool.ts';
import {
  DEFAULT_PIPELINE_MODE,
  isPipelineMode,
  type PipelineMode,
} from '../../domain/enums/pipeline_mode_enum.ts';

/** Marcacao que, aplicada a Pull Request de feature, forca o modo manual (RF-09). */
const MANUAL_MODE_LABEL: PipelineMode = 'manual';

/** As marcacoes chegam do executor em uma linha so, separadas por virgula. */
const LABEL_SEPARATOR = ',';

/**
 * RF-09, esclarecimento 2. A marcacao e consultada antes da configuracao porque
 * e ela que sobrepoe o padrao do repositorio naquela cadeia: na ordem inversa,
 * um repositorio configurado como `automatico` ignoraria o pedido de aprovacao
 * humana feito na propria Pull Request. Valor de configuracao que nao e modo
 * nao vira erro: cai no padrao, para o texto livre do ambiente nunca derrubar
 * a esteira.
 */
export class ResolvePipelineModeUseCase implements IResolvePipelineModeUseCase {
  constructor(private readonly config: IConfigTool) {}

  public execute(): PipelineMode {
    if (this.hasManualLabel()) {
      return MANUAL_MODE_LABEL;
    }
    const configured = this.config.pipelineMode();
    return isPipelineMode(configured) ? configured : DEFAULT_PIPELINE_MODE;
  }

  private hasManualLabel(): boolean {
    const labels = this.config.pipelineModeLabel();
    if (labels === null) {
      return false;
    }
    return labels
      .split(LABEL_SEPARATOR)
      .some((label) => label.trim().toLowerCase() === MANUAL_MODE_LABEL);
  }
}
