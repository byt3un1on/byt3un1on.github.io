import { describe, expect, it } from 'vitest';
import {
  type CodeRepositoryProps,
  createCodeRepository,
} from '../../../../../core/domain/entities/code_repository.ts';
import {
  type Project,
  createProject,
  projectHomepage,
  projectLastActivityAt,
  projectTechnologies,
} from '../../../../../core/domain/entities/project.ts';

function repo(
  overrides: Partial<CodeRepositoryProps> = {},
): ReturnType<typeof createCodeRepository> {
  return createCodeRepository({
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
  });
}

function projeto(overrides: Partial<Project> = {}): Project {
  return createProject({
    slug: 'shortsmaker',
    name: 'Shortsmaker',
    summary: 'Pipeline de geracao de videos curtos.',
    highlighted: false,
    repositories: [repo()],
    ...overrides,
  });
}

describe('createProject', () => {
  it('deve construir o projeto quando os dados sao validos', () => {
    // Arrange
    const repositorios = [repo()];

    // Act
    const resultado = projeto({ repositories: repositorios });

    // Assert
    expect(resultado.slug).toBe('shortsmaker');
  });

  it('deve descartar espacos ao redor do resumo quando ele vem com folga', () => {
    // Arrange
    const summary = '  Pipeline de geracao de videos curtos.  ';

    // Act
    const resultado = projeto({ summary });

    // Assert
    expect(resultado.summary).toBe('Pipeline de geracao de videos curtos.');
  });

  it('deve congelar o projeto quando ele e construido', () => {
    // Arrange
    const resultado = projeto();

    // Act
    const congelado = Object.isFrozen(resultado);

    // Assert
    expect(congelado).toBe(true);
  });

  it('deve recusar a construcao quando nao ha repositorio algum', () => {
    // Arrange
    const repositorios: readonly ReturnType<typeof repo>[] = [];

    // Act
    const act = (): unknown => projeto({ repositories: repositorios });

    // Assert
    expect(act).toThrow('esperado ao menos um repositorio em "shortsmaker"');
  });

  it('deve recusar a construcao quando o slug e vazio', () => {
    // Arrange
    const slug = '  ';

    // Act
    const act = (): unknown => projeto({ slug });

    // Assert
    expect(act).toThrow('slug invalido: recebido "  ", esperado texto nao vazio');
  });

  it('deve recusar a construcao quando o nome e vazio', () => {
    // Arrange
    const name = '';

    // Act
    const act = (): unknown => projeto({ name });

    // Assert
    expect(act).toThrow('name invalido: recebido "", esperado texto nao vazio');
  });

  it('deve recusar a construcao quando o resumo e vazio', () => {
    // Arrange
    const summary = '   ';

    // Act
    const act = (): unknown => projeto({ summary });

    // Assert
    expect(act).toThrow('summary invalido: recebido "   ", esperado texto nao vazio');
  });
});

describe('projectTechnologies', () => {
  it('deve reunir as tecnologias dos repositorios quando o projeto tem varios', () => {
    // Arrange
    const resultado = projeto({
      repositories: [
        repo({ name: 'shortsmaker-api', technology: 'Python' }),
        repo({ name: 'shortsmaker-frontend', technology: 'TypeScript' }),
        repo({ name: 'shortsmaker-infra', technology: 'Makefile' }),
      ],
    });

    // Act
    const tecnologias = projectTechnologies(resultado);

    // Assert
    expect(tecnologias).toEqual(['Makefile', 'Python', 'TypeScript']);
  });

  it('deve descartar repeticao quando dois repositorios usam a mesma tecnologia', () => {
    // Arrange
    const resultado = projeto({
      repositories: [
        repo({ name: 'a', technology: 'TypeScript' }),
        repo({ name: 'b', technology: 'TypeScript' }),
      ],
    });

    // Act
    const tecnologias = projectTechnologies(resultado);

    // Assert
    expect(tecnologias).toEqual(['TypeScript']);
  });

  it('deve ignorar repositorio sem linguagem quando o projeto os reune', () => {
    // Arrange
    const resultado = projeto({
      repositories: [repo({ name: 'a', technology: null }), repo({ name: 'b', technology: 'Go' })],
    });

    // Act
    const tecnologias = projectTechnologies(resultado);

    // Assert
    expect(tecnologias).toEqual(['Go']);
  });

  it('deve devolver lista vazia quando nenhum repositorio declara linguagem', () => {
    // Arrange
    const resultado = projeto({ repositories: [repo({ technology: null })] });

    // Act
    const tecnologias = projectTechnologies(resultado);

    // Assert
    expect(tecnologias).toEqual([]);
  });
});

describe('projectLastActivityAt', () => {
  it('deve devolver a data mais recente quando o projeto reune varios repositorios', () => {
    // Arrange
    const resultado = projeto({
      repositories: [
        repo({ name: 'a', lastActivityAt: '2026-01-11T19:12:46Z' }),
        repo({ name: 'b', lastActivityAt: '2026-01-14T05:31:18Z' }),
        repo({ name: 'c', lastActivityAt: '2025-10-05T21:16:43Z' }),
      ],
    });

    // Act
    const data = projectLastActivityAt(resultado);

    // Assert
    expect(data.toISOString()).toBe('2026-01-14T05:31:18.000Z');
  });

  it('deve devolver a data do unico repositorio quando o projeto tem um so', () => {
    // Arrange
    const resultado = projeto({ repositories: [repo({ lastActivityAt: '2025-09-15T02:23:44Z' })] });

    // Act
    const data = projectLastActivityAt(resultado);

    // Assert
    expect(data.toISOString()).toBe('2025-09-15T02:23:44.000Z');
  });
});

describe('projectHomepage', () => {
  it('deve devolver o endereco publicado quando algum repositorio tem um', () => {
    // Arrange
    const resultado = projeto({
      repositories: [
        repo({ name: 'a', homepage: null }),
        repo({ name: 'b', homepage: 'https://byt3un1on.github.io' }),
      ],
    });

    // Act
    const homepage = projectHomepage(resultado);

    // Assert
    expect(homepage).toBe('https://byt3un1on.github.io');
  });

  it('deve devolver nulo quando nenhum repositorio tem endereco publicado', () => {
    // Arrange
    const resultado = projeto({ repositories: [repo({ homepage: null })] });

    // Act
    const homepage = projectHomepage(resultado);

    // Assert
    expect(homepage).toBeNull();
  });
});
