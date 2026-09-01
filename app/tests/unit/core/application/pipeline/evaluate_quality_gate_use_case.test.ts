import { describe, expect, it } from 'vitest';
import { EvaluateQualityGateUseCase } from '../../../../../core/application/pipeline/evaluate_quality_gate_use_case.ts';
import { createPipelineJobResult } from '../../../../../core/domain/dtos/pipeline_job_result_dto.ts';
import type { PipelineJobResultDto } from '../../../../../core/domain/dtos/pipeline_job_result_dto.ts';

const FORMATACAO: PipelineJobResultDto = createPipelineJobResult('Formatacao', 'sucesso');
const ESTATICA: PipelineJobResultDto = createPipelineJobResult('Analise estatica', 'sucesso');
const TESTES: PipelineJobResultDto = createPipelineJobResult('Testes', 'falha', 'cobertura 82%');
const COBERTURA: PipelineJobResultDto = createPipelineJobResult('Cobertura', 'falha', 'abaixo');
const AUDITORIA: PipelineJobResultDto = createPipelineJobResult('Auditoria', 'falha', 'contraste');
const COMPORTAMENTO: PipelineJobResultDto = createPipelineJobResult('Comportamento', 'cancelado');

describe('EvaluateQualityGateUseCase', () => {
  it('deve aprovar quando todas as verificacoes terminam em sucesso', () => {
    // Arrange
    const useCase = new EvaluateQualityGateUseCase();

    // Act
    const verdict = useCase.execute([FORMATACAO, ESTATICA]);

    // Assert
    expect(verdict.approved).toBe(true);
  });

  it('deve nao listar reprovacao quando todas as verificacoes terminam em sucesso', () => {
    // Arrange
    const useCase = new EvaluateQualityGateUseCase();

    // Act
    const verdict = useCase.execute([FORMATACAO, ESTATICA]);

    // Assert
    expect(verdict.failed).toEqual([]);
  });

  it('deve contar as verificacoes no motivo quando todas aprovam', () => {
    // Arrange
    const useCase = new EvaluateQualityGateUseCase();

    // Act
    const verdict = useCase.execute([FORMATACAO, ESTATICA]);

    // Assert
    expect(verdict.reason).toBe('as 2 verificacoes aprovaram');
  });

  it('deve reprovar quando uma verificacao falha', () => {
    // Arrange
    const useCase = new EvaluateQualityGateUseCase();

    // Act
    const verdict = useCase.execute([FORMATACAO, TESTES]);

    // Assert
    expect(verdict.approved).toBe(false);
  });

  it('deve nomear a verificacao no motivo quando uma falha', () => {
    // Arrange
    const useCase = new EvaluateQualityGateUseCase();

    // Act
    const verdict = useCase.execute([FORMATACAO, TESTES]);

    // Assert
    expect(verdict.reason).toBe('reprovaram: Testes');
  });

  it('deve listar apenas a verificacao reprovada quando uma falha', () => {
    // Arrange
    const useCase = new EvaluateQualityGateUseCase();

    // Act
    const verdict = useCase.execute([FORMATACAO, TESTES]);

    // Assert
    expect(verdict.failed).toEqual([TESTES]);
  });

  it('deve nomear todas as verificacoes na ordem informada quando tres falham', () => {
    // Arrange
    const useCase = new EvaluateQualityGateUseCase();

    // Act
    const verdict = useCase.execute([TESTES, FORMATACAO, COBERTURA, AUDITORIA]);

    // Assert
    expect(verdict.reason).toBe('reprovaram: Testes, Cobertura, Auditoria');
  });

  it('deve listar as reprovadas na ordem informada quando tres falham', () => {
    // Arrange
    const useCase = new EvaluateQualityGateUseCase();

    // Act
    const verdict = useCase.execute([TESTES, FORMATACAO, COBERTURA, AUDITORIA]);

    // Assert
    expect(verdict.failed).toEqual([TESTES, COBERTURA, AUDITORIA]);
  });

  it('deve reprovar quando uma verificacao e cancelada', () => {
    // Arrange
    const useCase = new EvaluateQualityGateUseCase();

    // Act
    const verdict = useCase.execute([FORMATACAO, COMPORTAMENTO]);

    // Assert
    expect(verdict.approved).toBe(false);
  });

  it('deve nomear a verificacao cancelada no motivo quando ela e a unica nao aprovada', () => {
    // Arrange
    const useCase = new EvaluateQualityGateUseCase();

    // Act
    const verdict = useCase.execute([FORMATACAO, COMPORTAMENTO]);

    // Assert
    expect(verdict.reason).toBe('reprovaram: Comportamento');
  });

  it('deve nomear falha e cancelamento no motivo quando os dois ocorrem', () => {
    // Arrange
    const useCase = new EvaluateQualityGateUseCase();

    // Act
    const verdict = useCase.execute([TESTES, COMPORTAMENTO, FORMATACAO]);

    // Assert
    expect(verdict.reason).toBe('reprovaram: Testes, Comportamento');
  });

  it('deve listar falha e cancelamento quando os dois ocorrem', () => {
    // Arrange
    const useCase = new EvaluateQualityGateUseCase();

    // Act
    const verdict = useCase.execute([TESTES, COMPORTAMENTO, FORMATACAO]);

    // Assert
    expect(verdict.failed).toEqual([TESTES, COMPORTAMENTO]);
  });

  it('deve lancar erro nomeando recebido e esperado quando a lista esta vazia', () => {
    // Arrange
    const useCase = new EvaluateQualityGateUseCase();

    // Act
    const act = (): unknown => useCase.execute([]);

    // Assert
    expect(act).toThrowError('resultados invalidos: recebido 0 resultados, esperado ao menos 1');
  });
});
