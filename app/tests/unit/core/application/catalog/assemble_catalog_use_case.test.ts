import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AssembleCatalogUseCase } from '../../../../../core/application/catalog/assemble_catalog_use_case.ts';
import type {
  CurationDto,
  CurationProjectDto,
} from '../../../../../core/domain/dtos/curation_dto.ts';
import {
  type CodeRepository,
  type CodeRepositoryProps,
  createCodeRepository,
} from '../../../../../core/domain/entities/code_repository.ts';

function repo(overrides: Partial<CodeRepositoryProps> = {}): CodeRepository {
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

function entrada(overrides: Partial<CurationProjectDto> = {}): CurationProjectDto {
  return {
    slug: 'shortsmaker',
    name: 'Shortsmaker',
    summary: 'Pipeline de geracao de videos curtos.',
    highlighted: false,
    repositories: ['shortsmaker-api'],
    ...overrides,
  };
}

function curadoria(projects: readonly CurationProjectDto[]): CurationDto {
  return { projects };
}

describe('AssembleCatalogUseCase', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-31T09:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve carimbar o momento da geracao quando o catalogo e montado', () => {
    // Arrange
    const useCase = new AssembleCatalogUseCase();

    // Act
    const catalogo = useCase.execute(curadoria([entrada()]), [repo()]);

    // Assert
    expect(catalogo.generatedAt).toBe('2026-08-31T09:00:00.000Z');
  });

  it('deve preservar a ordem da curadoria quando ha varios projetos', () => {
    // Arrange
    const useCase = new AssembleCatalogUseCase();
    const curation = curadoria([
      entrada({ slug: 'b', repositories: ['b-repo'] }),
      entrada({ slug: 'a', repositories: ['a-repo'] }),
    ]);
    const repositorios = [repo({ name: 'b-repo' }), repo({ name: 'a-repo' })];

    // Act
    const catalogo = useCase.execute(curation, repositorios);

    // Assert
    expect(catalogo.projects.map((p) => p.slug)).toEqual(['b', 'a']);
  });

  it('deve manter o destaque como sinalizacao sem reordenar quando ele e declarado', () => {
    // Arrange
    const useCase = new AssembleCatalogUseCase();
    const curation = curadoria([
      entrada({ slug: 'primeiro', repositories: ['a-repo'], highlighted: false }),
      entrada({ slug: 'destacado', repositories: ['b-repo'], highlighted: true }),
    ]);
    const repositorios = [repo({ name: 'a-repo' }), repo({ name: 'b-repo' })];

    // Act
    const catalogo = useCase.execute(curation, repositorios);

    // Assert
    expect(catalogo.projects.map((p) => [p.slug, p.highlighted])).toEqual([
      ['primeiro', false],
      ['destacado', true],
    ]);
  });

  it('deve reunir as tecnologias dos repositorios quando o projeto agrupa varios', () => {
    // Arrange
    const useCase = new AssembleCatalogUseCase();
    const curation = curadoria([entrada({ repositories: ['api', 'front', 'infra'] })]);
    const repositorios = [
      repo({ name: 'api', technology: 'Python' }),
      repo({ name: 'front', technology: 'TypeScript' }),
      repo({ name: 'infra', technology: null }),
    ];

    // Act
    const catalogo = useCase.execute(curation, repositorios);

    // Assert
    expect(catalogo.projects[0]?.technologies).toEqual(['Python', 'TypeScript']);
  });

  it('deve usar a atividade mais recente quando o projeto agrupa varios repositorios', () => {
    // Arrange
    const useCase = new AssembleCatalogUseCase();
    const curation = curadoria([entrada({ repositories: ['api', 'docs'] })]);
    const repositorios = [
      repo({ name: 'api', lastActivityAt: '2026-01-14T05:31:18Z' }),
      repo({ name: 'docs', lastActivityAt: '2026-01-11T19:01:03Z' }),
    ];

    // Act
    const catalogo = useCase.execute(curation, repositorios);

    // Assert
    expect(catalogo.projects[0]?.lastActivityAt).toBe('2026-01-14T05:31:18.000Z');
  });

  it('deve expor o endereco publicado quando algum repositorio do projeto tem um', () => {
    // Arrange
    const useCase = new AssembleCatalogUseCase();
    const curation = curadoria([entrada({ repositories: ['api', 'site'] })]);
    const repositorios = [
      repo({ name: 'api', homepage: null }),
      repo({ name: 'site', homepage: 'https://byt3un1on.github.io' }),
    ];

    // Act
    const catalogo = useCase.execute(curation, repositorios);

    // Assert
    expect(catalogo.projects[0]?.homepage).toBe('https://byt3un1on.github.io');
  });

  it('deve ignorar repositorio nao declarado na curadoria quando ele existe na organizacao', () => {
    // Arrange
    const useCase = new AssembleCatalogUseCase();
    const curation = curadoria([entrada({ repositories: ['shortsmaker-api'] })]);
    const repositorios = [repo(), repo({ name: 'shared-claude-plugin' })];

    // Act
    const catalogo = useCase.execute(curation, repositorios);

    // Assert
    expect(catalogo.projects[0]?.repositories.map((r) => r.name)).toEqual(['shortsmaker-api']);
  });

  it('deve excluir repositorio privado ainda que a curadoria o declare', () => {
    // Arrange
    const useCase = new AssembleCatalogUseCase();
    const curation = curadoria([entrada({ repositories: ['shortsmaker-api', 'niche-scout'] })]);
    const repositorios = [repo(), repo({ name: 'niche-scout', isPrivate: true })];

    // Act
    const catalogo = useCase.execute(curation, repositorios);

    // Assert
    expect(catalogo.projects[0]?.repositories.map((r) => r.name)).toEqual(['shortsmaker-api']);
  });

  it('deve excluir repositorio arquivado ainda que a curadoria o declare', () => {
    // Arrange
    const useCase = new AssembleCatalogUseCase();
    const curation = curadoria([entrada({ repositories: ['shortsmaker-api', 'antigo'] })]);
    const repositorios = [repo(), repo({ name: 'antigo', isArchived: true })];

    // Act
    const catalogo = useCase.execute(curation, repositorios);

    // Assert
    expect(catalogo.projects[0]?.repositories.map((r) => r.name)).toEqual(['shortsmaker-api']);
  });

  it('deve excluir repositorio sem commit ainda que a curadoria o declare', () => {
    // Arrange
    const useCase = new AssembleCatalogUseCase();
    const curation = curadoria([
      entrada({ repositories: ['shortsmaker-api', 'documentation-site'] }),
    ]);
    const repositorios = [repo(), repo({ name: 'documentation-site', hasCommits: false })];

    // Act
    const catalogo = useCase.execute(curation, repositorios);

    // Assert
    expect(catalogo.projects[0]?.repositories.map((r) => r.name)).toEqual(['shortsmaker-api']);
  });

  it('deve omitir o projeto inteiro quando nenhum repositorio dele e elegivel', () => {
    // Arrange
    const useCase = new AssembleCatalogUseCase();
    const curation = curadoria([entrada({ slug: 'vazio', repositories: ['documentation-site'] })]);
    const repositorios = [repo({ name: 'documentation-site', hasCommits: false })];

    // Act
    const catalogo = useCase.execute(curation, repositorios);

    // Assert
    expect(catalogo.projects).toEqual([]);
  });

  it('deve omitir o projeto quando o repositorio declarado nao esta na organizacao', () => {
    // Arrange
    const useCase = new AssembleCatalogUseCase();
    const curation = curadoria([entrada({ slug: 'fantasma', repositories: ['sumiu'] })]);

    // Act
    const catalogo = useCase.execute(curation, []);

    // Assert
    expect(catalogo.projects).toEqual([]);
  });

  it('deve devolver catalogo vazio quando a curadoria nao declara projeto algum', () => {
    // Arrange
    const useCase = new AssembleCatalogUseCase();

    // Act
    const catalogo = useCase.execute(curadoria([]), [repo()]);

    // Assert
    expect(catalogo.projects).toEqual([]);
  });

  it('deve copiar os dados do repositorio para o catalogo quando o projeto e montado', () => {
    // Arrange
    const useCase = new AssembleCatalogUseCase();
    const curation = curadoria([entrada()]);

    // Act
    const catalogo = useCase.execute(curation, [repo({ description: 'API do Shortsmaker' })]);

    // Assert
    expect(catalogo.projects[0]?.repositories[0]).toEqual({
      name: 'shortsmaker-api',
      url: 'https://github.com/byt3un1on/shortsmaker-api',
      description: 'API do Shortsmaker',
      technology: 'Python',
      homepage: null,
      lastActivityAt: '2026-01-14T05:31:18.000Z',
    });
  });
});
