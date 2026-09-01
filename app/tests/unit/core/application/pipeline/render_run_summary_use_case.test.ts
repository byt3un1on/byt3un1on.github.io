import { describe, expect, it, vi } from 'vitest';
import { RenderRunSummaryUseCase } from '../../../../../core/application/pipeline/render_run_summary_use_case.ts';
import { createPipelineJobResult } from '../../../../../core/domain/dtos/pipeline_job_result_dto.ts';
import type { PipelineJobResultDto } from '../../../../../core/domain/dtos/pipeline_job_result_dto.ts';
import type { PipelineFailureCause } from '../../../../../core/domain/enums/pipeline_failure_cause_enum.ts';
import type { IClassifyPipelineFailureUseCase } from '../../../../../interfaces/core/application/pipeline/i_classify_pipeline_failure_use_case.ts';
import type { QualityGateVerdict } from '../../../../../interfaces/core/application/pipeline/i_evaluate_quality_gate_use_case.ts';

const SUCESSO: PipelineJobResultDto = createPipelineJobResult('Testes', 'sucesso');
const SUCESSO_COM_DETALHE: PipelineJobResultDto = createPipelineJobResult(
  'Cobertura',
  'sucesso',
  'linhas 94%',
);
const FALHA: PipelineJobResultDto = createPipelineJobResult('Testes', 'falha', 'token ausente');
const CANCELADO: PipelineJobResultDto = createPipelineJobResult('Auditoria', 'cancelado');
const FALHA_LONGA: PipelineJobResultDto = createPipelineJobResult(
  'Construcao',
  'falha',
  'linha 1\nlinha 2\nlinha 3\nlinha 4',
);
const FALHA_TRES_LINHAS: PipelineJobResultDto = createPipelineJobResult(
  'Construcao',
  'falha',
  'linha 1\nlinha 2\nlinha 3',
);

function dublarClassificador(causa: PipelineFailureCause): IClassifyPipelineFailureUseCase {
  return { execute: vi.fn<(output: string) => PipelineFailureCause>().mockReturnValue(causa) };
}

const APROVADO: QualityGateVerdict = {
  approved: true,
  failed: [],
  reason: 'as 9 verificacoes aprovaram',
};

const REPROVADO: QualityGateVerdict = {
  approved: false,
  failed: [FALHA, CANCELADO],
  reason: 'reprovaram: Testes, Auditoria',
};

describe('RenderRunSummaryUseCase', () => {
  it('deve devolver so o titulo quando o job termina em sucesso e nao ha detalhe', () => {
    // Arrange
    const classificador = dublarClassificador('desconhecida');
    const useCase = new RenderRunSummaryUseCase(classificador);

    // Act
    const bloco = useCase.renderJob(SUCESSO);

    // Assert
    expect(bloco).toBe('### ✅ Testes\n');
  });

  it('deve nao chamar o classificador quando o job termina em sucesso', () => {
    // Arrange
    const classificador = dublarClassificador('desconhecida');
    const useCase = new RenderRunSummaryUseCase(classificador);

    // Act
    useCase.renderJob(SUCESSO);

    // Assert
    expect(vi.mocked(classificador.execute)).not.toHaveBeenCalled();
  });

  it('deve acrescentar as linhas do detalhe quando o job termina em sucesso com detalhe', () => {
    // Arrange
    const classificador = dublarClassificador('desconhecida');
    const useCase = new RenderRunSummaryUseCase(classificador);

    // Act
    const bloco = useCase.renderJob(SUCESSO_COM_DETALHE);

    // Assert
    expect(bloco).toBe('### ✅ Cobertura\nlinhas 94%\n');
  });

  it('deve marcar o titulo com a causa classificada quando o job falha', () => {
    // Arrange
    const classificador = dublarClassificador('credencial');
    const useCase = new RenderRunSummaryUseCase(classificador);

    // Act
    const bloco = useCase.renderJob(FALHA);

    // Assert
    expect(bloco).toBe('### ❌ Testes\n**Causa**: credencial\ntoken ausente\n');
  });

  it('deve chamar o classificador uma vez com o detalhe quando o job falha', () => {
    // Arrange
    const classificador = dublarClassificador('credencial');
    const useCase = new RenderRunSummaryUseCase(classificador);

    // Act
    useCase.renderJob(FALHA);

    // Assert
    expect(vi.mocked(classificador.execute)).toHaveBeenCalledExactlyOnceWith('token ausente');
  });

  it('deve usar o retorno do classificador quando o job falha', () => {
    // Arrange
    const classificador = dublarClassificador('permissao');
    const useCase = new RenderRunSummaryUseCase(classificador);

    // Act
    useCase.renderJob(FALHA);

    // Assert
    expect(vi.mocked(classificador.execute).mock.results).toEqual([
      { type: 'return', value: 'permissao' },
    ]);
  });

  it('deve marcar o titulo com o simbolo de parada quando o job e cancelado', () => {
    // Arrange
    const classificador = dublarClassificador('desconhecida');
    const useCase = new RenderRunSummaryUseCase(classificador);

    // Act
    const bloco = useCase.renderJob(CANCELADO);

    // Assert
    expect(bloco).toBe('### ⏹️ Auditoria\n');
  });

  it('deve nao chamar o classificador quando o job e cancelado', () => {
    // Arrange
    const classificador = dublarClassificador('desconhecida');
    const useCase = new RenderRunSummaryUseCase(classificador);

    // Act
    useCase.renderJob(CANCELADO);

    // Assert
    expect(vi.mocked(classificador.execute)).not.toHaveBeenCalled();
  });

  it('deve truncar o detalhe em tres linhas quando ele tem mais que tres', () => {
    // Arrange
    const classificador = dublarClassificador('conflito');
    const useCase = new RenderRunSummaryUseCase(classificador);

    // Act
    const bloco = useCase.renderJob(FALHA_LONGA);

    // Assert
    expect(bloco).toBe(
      '### ❌ Construcao\n**Causa**: conflito\nlinha 1\nlinha 2\nlinha 3\n… (detalhe truncado)\n',
    );
  });

  it('deve manter o detalhe inteiro quando ele tem exatamente tres linhas', () => {
    // Arrange
    const classificador = dublarClassificador('conflito');
    const useCase = new RenderRunSummaryUseCase(classificador);

    // Act
    const bloco = useCase.renderJob(FALHA_TRES_LINHAS);

    // Assert
    expect(bloco).toBe('### ❌ Construcao\n**Causa**: conflito\nlinha 1\nlinha 2\nlinha 3\n');
  });

  it('deve anunciar o portao aprovado com o motivo quando o veredito aprova', () => {
    // Arrange
    const classificador = dublarClassificador('desconhecida');
    const useCase = new RenderRunSummaryUseCase(classificador);

    // Act
    const bloco = useCase.renderVerdict(APROVADO);

    // Assert
    expect(bloco).toBe('## ✅ Portão aprovado\nas 9 verificacoes aprovaram\n');
  });

  it('deve listar cada verificacao reprovada quando o veredito reprova', () => {
    // Arrange
    const classificador = dublarClassificador('desconhecida');
    const useCase = new RenderRunSummaryUseCase(classificador);

    // Act
    const bloco = useCase.renderVerdict(REPROVADO);

    // Assert
    expect(bloco).toBe(
      '## ❌ Portão reprovado\nreprovaram: Testes, Auditoria\n- Testes — token ausente\n- Auditoria\n',
    );
  });

  it('deve nao chamar o classificador quando renderiza o veredito', () => {
    // Arrange
    const classificador = dublarClassificador('desconhecida');
    const useCase = new RenderRunSummaryUseCase(classificador);

    // Act
    useCase.renderVerdict(REPROVADO);

    // Assert
    expect(vi.mocked(classificador.execute)).not.toHaveBeenCalled();
  });
});
