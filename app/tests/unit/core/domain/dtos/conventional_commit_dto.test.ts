import { describe, expect, it } from 'vitest';
import { parseConventionalCommit } from '../../../../../core/domain/dtos/conventional_commit_dto.ts';

describe('parseConventionalCommit', () => {
  it('deve devolver o tipo quando o cabecalho traz apenas tipo e assunto', () => {
    // Arrange
    const mensagem = 'feat: adiciona a vitrine';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto?.type).toBe('feat');
  });

  it('deve devolver o assunto quando o cabecalho traz apenas tipo e assunto', () => {
    // Arrange
    const mensagem = 'feat: adiciona a vitrine';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto?.subject).toBe('adiciona a vitrine');
  });

  it('deve devolver escopo nulo quando o cabecalho nao traz parenteses', () => {
    // Arrange
    const mensagem = 'fix: corrige o rodape';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto?.scope).toBeNull();
  });

  it('deve devolver o escopo quando o cabecalho traz parenteses', () => {
    // Arrange
    const mensagem = 'fix(esteira): corrige o disparo';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto?.scope).toBe('esteira');
  });

  it('deve devolver o tipo em minusculo quando o cabecalho traz o tipo em maiusculo', () => {
    // Arrange
    const mensagem = 'FEAT(Esteira): publica a versao';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto?.type).toBe('feat');
  });

  it('deve negar incompatibilidade quando nao ha exclamacao nem aviso no corpo', () => {
    // Arrange
    const mensagem = 'chore(deps): atualiza o angular\n\nSem nada de mais.';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto?.isBreaking).toBe(false);
  });

  it('deve marcar incompatibilidade quando o cabecalho traz exclamacao antes dos dois-pontos', () => {
    // Arrange
    const mensagem = 'feat!: remove o endpoint antigo';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto?.isBreaking).toBe(true);
  });

  it('deve marcar incompatibilidade quando o cabecalho traz escopo e exclamacao', () => {
    // Arrange
    const mensagem = 'feat(api)!: remove o endpoint antigo';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto?.isBreaking).toBe(true);
  });

  it('deve marcar incompatibilidade quando o corpo traz linha BREAKING CHANGE com espaco', () => {
    // Arrange
    const mensagem = 'fix: ajusta o contrato\n\nBREAKING CHANGE: o campo slug sumiu';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto?.isBreaking).toBe(true);
  });

  it('deve marcar incompatibilidade quando o corpo traz linha BREAKING-CHANGE com hifen', () => {
    // Arrange
    const mensagem = 'fix: ajusta o contrato\n\nBREAKING-CHANGE: o campo slug sumiu';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto?.isBreaking).toBe(true);
  });

  it('deve negar incompatibilidade quando o aviso aparece no meio da linha do corpo', () => {
    // Arrange
    const mensagem = 'fix: ajusta o contrato\n\nnada de BREAKING CHANGE: aqui';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto?.isBreaking).toBe(false);
  });

  it('deve devolver nulo quando a mensagem esta fora do padrao', () => {
    // Arrange
    const mensagem = 'ajustes gerais no projeto';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto).toBeNull();
  });

  it('deve devolver nulo quando a mensagem e texto vazio', () => {
    // Arrange
    const mensagem = '';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto).toBeNull();
  });

  it('deve devolver nulo quando o assunto e vazio', () => {
    // Arrange
    const mensagem = 'feat(esteira):   ';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto).toBeNull();
  });

  it('deve devolver nulo quando o escopo vem sem conteudo entre parenteses', () => {
    // Arrange
    const mensagem = 'feat(): publica a versao';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto).toBeNull();
  });

  it('deve devolver o assunto sem espacos nas pontas quando o cabecalho tem espacos sobrando', () => {
    // Arrange
    const mensagem = '   feat(esteira):    publica a versao   ';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto?.subject).toBe('publica a versao');
  });

  it('deve interpretar a mensagem de merge quando ela segue a forma do padrao', () => {
    // Arrange
    const mensagem = 'merge: feature/x em develop';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto).toEqual({
      type: 'merge',
      scope: null,
      isBreaking: false,
      subject: 'feature/x em develop',
    });
  });

  it('deve considerar apenas a primeira linha quando a mensagem tem corpo', () => {
    // Arrange
    const mensagem = 'docs(readme): descreve a esteira\n\nfix(outro): isto e corpo, nao cabecalho';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(dto?.subject).toBe('descreve a esteira');
  });

  it('deve congelar o resultado quando a mensagem segue o padrao', () => {
    // Arrange
    const mensagem = 'feat: congela o retorno';

    // Act
    const dto = parseConventionalCommit(mensagem);

    // Assert
    expect(Object.isFrozen(dto)).toBe(true);
  });
});
