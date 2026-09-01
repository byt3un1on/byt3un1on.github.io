import { describe, expect, it } from 'vitest';
import {
  JOB_STATUSES,
  createPipelineJobResult,
  isJobStatus,
  runnerStatusToJobStatus,
} from '../../../../../core/domain/dtos/pipeline_job_result_dto.ts';

describe('isJobStatus', () => {
  it('deve reconhecer a situacao quando o valor e sucesso', () => {
    // Arrange
    const valor: unknown = 'sucesso';

    // Act
    const reconhecido = isJobStatus(valor);

    // Assert
    expect(reconhecido).toBe(true);
  });

  it('deve reconhecer a situacao quando o valor e falha', () => {
    // Arrange
    const valor: unknown = 'falha';

    // Act
    const reconhecido = isJobStatus(valor);

    // Assert
    expect(reconhecido).toBe(true);
  });

  it('deve reconhecer a situacao quando o valor e cancelado', () => {
    // Arrange
    const valor: unknown = 'cancelado';

    // Act
    const reconhecido = isJobStatus(valor);

    // Assert
    expect(reconhecido).toBe(true);
  });

  it('deve recusar quando o valor e um texto fora das situacoes declaradas', () => {
    // Arrange
    const valor: unknown = 'pulado';

    // Act
    const reconhecido = isJobStatus(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });

  it('deve recusar quando o valor difere apenas na caixa das letras', () => {
    // Arrange
    const valor: unknown = 'Sucesso';

    // Act
    const reconhecido = isJobStatus(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });

  it('deve recusar quando o valor e nulo', () => {
    // Arrange
    const valor: unknown = null;

    // Act
    const reconhecido = isJobStatus(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });

  it('deve recusar quando o valor e um numero', () => {
    // Arrange
    const valor: unknown = 1;

    // Act
    const reconhecido = isJobStatus(valor);

    // Assert
    expect(reconhecido).toBe(false);
  });
});

describe('JOB_STATUSES', () => {
  it('deve declarar as tres situacoes possiveis de um job quando consultada', () => {
    // Arrange
    const declaradas = JOB_STATUSES;

    // Act
    const lista = [...declaradas];

    // Assert
    expect(lista).toEqual(['sucesso', 'falha', 'cancelado']);
  });
});

describe('createPipelineJobResult', () => {
  it('deve preservar o nome do job quando os dados sao validos', () => {
    // Arrange
    const nome = 'testes';

    // Act
    const resultado = createPipelineJobResult(nome, 'sucesso', 'cobertura 94%');

    // Assert
    expect(resultado.name).toBe('testes');
  });

  it('deve preservar o detalhe quando ele e informado', () => {
    // Arrange
    const detalhe = 'cobertura 94%';

    // Act
    const resultado = createPipelineJobResult('testes', 'sucesso', detalhe);

    // Assert
    expect(resultado.detail).toBe('cobertura 94%');
  });

  it('deve registrar a situacao sucesso quando ela e informada', () => {
    // Arrange
    const situacao = 'sucesso';

    // Act
    const resultado = createPipelineJobResult('testes', situacao);

    // Assert
    expect(resultado.status).toBe('sucesso');
  });

  it('deve registrar a situacao falha quando ela e informada', () => {
    // Arrange
    const situacao = 'falha';

    // Act
    const resultado = createPipelineJobResult('auditoria', situacao, 'contraste abaixo do minimo');

    // Assert
    expect(resultado.status).toBe('falha');
  });

  it('deve registrar a situacao cancelado quando ela e informada', () => {
    // Arrange
    const situacao = 'cancelado';

    // Act
    const resultado = createPipelineJobResult('publicacao', situacao);

    // Assert
    expect(resultado.status).toBe('cancelado');
  });

  it('deve usar detalhe vazio quando ele e omitido', () => {
    // Arrange
    const nome = 'lint';

    // Act
    const resultado = createPipelineJobResult(nome, 'sucesso');

    // Assert
    expect(resultado.detail).toBe('');
  });

  it('deve descartar espacos ao redor do detalhe quando ele vem com folga', () => {
    // Arrange
    const detalhe = '  contraste abaixo do minimo  ';

    // Act
    const resultado = createPipelineJobResult('auditoria', 'falha', detalhe);

    // Assert
    expect(resultado.detail).toBe('contraste abaixo do minimo');
  });

  it('deve descartar espacos ao redor do nome quando ele vem com folga', () => {
    // Arrange
    const nome = '  auditoria  ';

    // Act
    const resultado = createPipelineJobResult(nome, 'falha');

    // Assert
    expect(resultado.name).toBe('auditoria');
  });

  it('deve congelar o resultado quando ele e construido', () => {
    // Arrange
    const nome = 'testes';

    // Act
    const resultado = createPipelineJobResult(nome, 'sucesso');

    // Assert
    expect(Object.isFrozen(resultado)).toBe(true);
  });

  it('deve recusar o resultado quando o nome vem vazio', () => {
    // Arrange
    const nome = '';

    // Act
    const act = (): unknown => createPipelineJobResult(nome, 'sucesso');

    // Assert
    expect(act).toThrow('name invalido: recebido "", esperado texto nao vazio');
  });

  it('deve recusar o resultado quando o nome vem so com espacos', () => {
    // Arrange
    const nome = '   ';

    // Act
    const act = (): unknown => createPipelineJobResult(nome, 'sucesso');

    // Assert
    expect(act).toThrow('name invalido: recebido "   ", esperado texto nao vazio');
  });

  it('deve recusar o resultado quando a situacao e desconhecida', () => {
    // Arrange
    const situacao = 'pulado';

    // Act
    const act = (): unknown => createPipelineJobResult('testes', situacao);

    // Assert
    expect(act).toThrow(
      'status invalido: recebido "pulado", esperado um de sucesso, falha, cancelado',
    );
  });

  it('deve recusar o resultado quando a situacao vem vazia', () => {
    // Arrange
    const situacao = '';

    // Act
    const act = (): unknown => createPipelineJobResult('testes', situacao);

    // Assert
    expect(act).toThrow('status invalido: recebido "", esperado um de sucesso, falha, cancelado');
  });
  it('deve traduzir success para sucesso quando a situacao vem do executor', () => {
    // Arrange
    const situacao = 'success';

    // Act
    const traduzida = runnerStatusToJobStatus(situacao);

    // Assert
    expect(traduzida).toBe('sucesso');
  });

  it('deve traduzir cancelled para cancelado quando a situacao vem do executor', () => {
    // Arrange
    const situacao = 'cancelled';

    // Act
    const traduzida = runnerStatusToJobStatus(situacao);

    // Assert
    expect(traduzida).toBe('cancelado');
  });

  it('deve traduzir skipped para cancelado quando o job nao chegou a rodar', () => {
    // Arrange
    const situacao = 'skipped';

    // Act
    const traduzida = runnerStatusToJobStatus(situacao);

    // Assert
    expect(traduzida).toBe('cancelado');
  });

  it('deve traduzir failure para falha quando o job reprovou', () => {
    // Arrange
    const situacao = 'failure';

    // Act
    const traduzida = runnerStatusToJobStatus(situacao);

    // Assert
    expect(traduzida).toBe('falha');
  });

  it('deve preservar a situacao quando ela ja esta no vocabulario do dominio', () => {
    // Arrange
    const situacao = 'cancelado';

    // Act
    const traduzida = runnerStatusToJobStatus(situacao);

    // Assert
    expect(traduzida).toBe('cancelado');
  });

  it('deve ignorar maiusculas e espacos quando traduz a situacao', () => {
    // Arrange
    const situacao = '  SUCCESS  ';

    // Act
    const traduzida = runnerStatusToJobStatus(situacao);

    // Assert
    expect(traduzida).toBe('sucesso');
  });

  it('deve fechar o portao traduzindo para falha quando a situacao e desconhecida', () => {
    // Arrange
    const situacao = 'neutral';

    // Act
    const traduzida = runnerStatusToJobStatus(situacao);

    // Assert
    expect(traduzida).toBe('falha');
  });
});
