import { describe, expect, it, vi } from 'vitest';
import { ResolveNextVersionUseCase } from '../../../../../core/application/pipeline/resolve_next_version_use_case.ts';
import type { VersionBump } from '../../../../../core/domain/enums/version_bump_enum.ts';
import {
  FIRST_SEMANTIC_VERSION,
  type SemanticVersion,
} from '../../../../../core/domain/models/semantic_version_model.ts';
import type { IGitHistoryRepository } from '../../../../../interfaces/adapters/repositories/i_git_history_repository.ts';
import type { IClassifyVersionBumpUseCase } from '../../../../../interfaces/core/application/pipeline/i_classify_version_bump_use_case.ts';

const ANTERIOR: SemanticVersion = { major: 1, minor: 2, patch: 3 };
const MENSAGENS: readonly string[] = ['feat: publica a vitrine', 'fix: corrige o rodape'];

interface Dubles {
  readonly gitHistoryRepository: IGitHistoryRepository;
  readonly classifyVersionBump: IClassifyVersionBumpUseCase;
}

function dubles(
  anterior: SemanticVersion | null = ANTERIOR,
  mensagens: readonly string[] = MENSAGENS,
  incremento: VersionBump = 'patch',
): Dubles {
  return {
    gitHistoryRepository: {
      findLatestVersion: vi.fn().mockResolvedValue(anterior),
      listCommitMessagesSince: vi.fn().mockResolvedValue(mensagens),
    },
    classifyVersionBump: { execute: vi.fn().mockReturnValue(incremento) },
  };
}

function construir(d: Dubles): ResolveNextVersionUseCase {
  return new ResolveNextVersionUseCase(d.gitHistoryRepository, d.classifyVersionBump);
}

describe('ResolveNextVersionUseCase', () => {
  it('deve devolver a primeira versao sem incremento quando o repositorio nao tem marca alguma', async () => {
    // Arrange
    const d = dubles(null);

    // Act
    const proxima = await construir(d).execute();

    // Assert
    expect(proxima).toBe(FIRST_SEMANTIC_VERSION);
  });

  it('deve nao consultar o historico quando o repositorio nao tem marca alguma', async () => {
    // Arrange
    const d = dubles(null);

    // Act
    await construir(d).execute();

    // Assert
    expect(d.gitHistoryRepository.listCommitMessagesSince).not.toHaveBeenCalled();
  });

  it('deve nao classificar incremento quando o repositorio nao tem marca alguma', async () => {
    // Arrange
    const d = dubles(null);

    // Act
    await construir(d).execute();

    // Assert
    expect(d.classifyVersionBump.execute).not.toHaveBeenCalled();
  });

  it('deve procurar a ultima versao exatamente uma vez quando executa', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).execute();

    // Assert
    expect(d.gitHistoryRepository.findLatestVersion).toHaveBeenCalledExactlyOnceWith();
  });

  it('deve receber a ultima versao marcada quando procura no repositorio', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).execute();

    // Assert
    await expect(
      vi.mocked(d.gitHistoryRepository.findLatestVersion).mock.results[0].value,
    ).resolves.toBe(ANTERIOR);
  });

  it('deve pedir as mensagens desde a ultima versao quando ha marca anterior', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).execute();

    // Assert
    expect(d.gitHistoryRepository.listCommitMessagesSince).toHaveBeenCalledExactlyOnceWith(
      ANTERIOR,
    );
  });

  it('deve receber as mensagens do historico quando pede ao repositorio', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).execute();

    // Assert
    await expect(
      vi.mocked(d.gitHistoryRepository.listCommitMessagesSince).mock.results[0].value,
    ).resolves.toBe(MENSAGENS);
  });

  it('deve classificar exatamente as mensagens lidas do historico quando ha marca anterior', async () => {
    // Arrange
    const d = dubles();

    // Act
    await construir(d).execute();

    // Assert
    expect(d.classifyVersionBump.execute).toHaveBeenCalledExactlyOnceWith(MENSAGENS);
  });

  it('deve receber o incremento classificado quando consulta a classificacao', async () => {
    // Arrange
    const d = dubles(ANTERIOR, MENSAGENS, 'minor');

    // Act
    await construir(d).execute();

    // Assert
    expect(vi.mocked(d.classifyVersionBump.execute).mock.results[0].value).toBe('minor');
  });

  it('deve devolver a versao com o patch elevado quando o incremento e patch', async () => {
    // Arrange
    const d = dubles(ANTERIOR, MENSAGENS, 'patch');

    // Act
    const proxima = await construir(d).execute();

    // Assert
    expect(proxima).toEqual({ major: 1, minor: 2, patch: 4 });
  });

  it('deve devolver a versao com o minor elevado quando o incremento e minor', async () => {
    // Arrange
    const d = dubles(ANTERIOR, MENSAGENS, 'minor');

    // Act
    const proxima = await construir(d).execute();

    // Assert
    expect(proxima).toEqual({ major: 1, minor: 3, patch: 0 });
  });

  it('deve devolver a versao com o major elevado quando o incremento e major', async () => {
    // Arrange
    const d = dubles(ANTERIOR, MENSAGENS, 'major');

    // Act
    const proxima = await construir(d).execute();

    // Assert
    expect(proxima).toEqual({ major: 2, minor: 0, patch: 0 });
  });

  it('deve classificar a lista vazia quando nao ha commit desde a ultima versao', async () => {
    // Arrange
    const d = dubles(ANTERIOR, []);

    // Act
    await construir(d).execute();

    // Assert
    expect(d.classifyVersionBump.execute).toHaveBeenCalledExactlyOnceWith([]);
  });

  it('deve devolver a versao com o patch elevado quando nao ha commit desde a ultima versao', async () => {
    // Arrange
    const d = dubles(ANTERIOR, [], 'patch');

    // Act
    const proxima = await construir(d).execute();

    // Assert
    expect(proxima).toEqual({ major: 1, minor: 2, patch: 4 });
  });
});
