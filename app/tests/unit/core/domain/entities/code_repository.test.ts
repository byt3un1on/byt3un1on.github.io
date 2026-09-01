import { describe, expect, it } from 'vitest';
import {
  type CodeRepositoryProps,
  createCodeRepository,
  isEligibleForShowcase,
} from '../../../../../core/domain/entities/code_repository.ts';

function props(overrides: Partial<CodeRepositoryProps> = {}): CodeRepositoryProps {
  return {
    name: 'shortsmaker-api',
    url: 'https://github.com/byt3un1on/shortsmaker-api',
    description: null,
    technology: 'Python',
    homepage: null,
    lastActivityAt: '2026-01-14T05:31:18Z',
    isPrivate: false,
    isArchived: false,
    hasCommits: true,
    ...overrides,
  };
}

describe('createCodeRepository', () => {
  it('deve converter a data textual em Date quando os dados sao validos', () => {
    // Arrange
    const entrada = props();

    // Act
    const repositorio = createCodeRepository(entrada);

    // Assert
    expect(repositorio.lastActivityAt.toISOString()).toBe('2026-01-14T05:31:18.000Z');
  });

  it('deve aceitar Date ja construida quando ela e passada', () => {
    // Arrange
    const data = new Date('2025-10-06T00:35:54Z');

    // Act
    const repositorio = createCodeRepository(props({ lastActivityAt: data }));

    // Assert
    expect(repositorio.lastActivityAt).toEqual(data);
  });

  it('deve descartar espacos ao redor do nome quando ele vem com folga', () => {
    // Arrange
    const entrada = props({ name: '  templates-library  ' });

    // Act
    const repositorio = createCodeRepository(entrada);

    // Assert
    expect(repositorio.name).toBe('templates-library');
  });

  it('deve congelar o repositorio quando ele e construido', () => {
    // Arrange
    const entrada = props();

    // Act
    const repositorio = createCodeRepository(entrada);

    // Assert
    expect(Object.isFrozen(repositorio)).toBe(true);
  });

  it('deve recusar a construcao quando o nome e vazio', () => {
    // Arrange
    const entrada = props({ name: '   ' });

    // Act
    const act = (): unknown => createCodeRepository(entrada);

    // Assert
    expect(act).toThrow('name invalido: recebido "   ", esperado texto nao vazio');
  });

  it('deve recusar a construcao quando o endereco e vazio', () => {
    // Arrange
    const entrada = props({ url: '' });

    // Act
    const act = (): unknown => createCodeRepository(entrada);

    // Assert
    expect(act).toThrow('url invalido: recebido "", esperado texto nao vazio');
  });

  it('deve recusar a construcao quando a data nao e reconhecivel', () => {
    // Arrange
    const entrada = props({ lastActivityAt: 'ontem' });

    // Act
    const act = (): unknown => createCodeRepository(entrada);

    // Assert
    expect(act).toThrow('lastActivityAt invalido: recebido "ontem", esperado data valida');
  });
});

describe('isEligibleForShowcase', () => {
  it('deve aprovar o repositorio quando ele e publico, ativo e tem commit', () => {
    // Arrange
    const repositorio = createCodeRepository(props());

    // Act
    const elegivel = isEligibleForShowcase(repositorio);

    // Assert
    expect(elegivel).toBe(true);
  });

  it('deve reprovar o repositorio quando ele e privado', () => {
    // Arrange
    const repositorio = createCodeRepository(props({ isPrivate: true }));

    // Act
    const elegivel = isEligibleForShowcase(repositorio);

    // Assert
    expect(elegivel).toBe(false);
  });

  it('deve reprovar o repositorio quando ele esta arquivado', () => {
    // Arrange
    const repositorio = createCodeRepository(props({ isArchived: true }));

    // Act
    const elegivel = isEligibleForShowcase(repositorio);

    // Assert
    expect(elegivel).toBe(false);
  });

  it('deve reprovar o repositorio quando ele nao tem commit', () => {
    // Arrange
    const repositorio = createCodeRepository(props({ hasCommits: false }));

    // Act
    const elegivel = isEligibleForShowcase(repositorio);

    // Assert
    expect(elegivel).toBe(false);
  });
});
