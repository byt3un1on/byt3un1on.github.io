import { describe, expect, it, vi } from 'vitest';
import {
  gitCommandExecutor,
  GitHistoryRepository,
  type GitExecutor,
} from '../../../../adapters/repositories/git_history_repository.ts';
import type { SemanticVersion } from '../../../../core/domain/models/semantic_version_model.ts';

const { execFileAsync } = vi.hoisted(() => ({
  execFileAsync: vi.fn<(file: string, args: readonly string[]) => Promise<{ stdout: string }>>(),
}));

vi.mock('node:child_process', () => ({
  execFile: Object.assign(vi.fn(), {
    [Symbol.for('nodejs.util.promisify.custom')]: execFileAsync,
  }),
}));

function gitStub(outputs: Readonly<Record<string, string>>): GitExecutor {
  return vi.fn<GitExecutor>((args: readonly string[]) =>
    Promise.resolve(outputs[args[0] ?? ''] ?? ''),
  );
}

const VERSAO: SemanticVersion = { major: 1, minor: 2, patch: 3 };

describe('GitHistoryRepository', () => {
  it('deve lancar erro nomeando recebido e esperado quando o clone e raso', async () => {
    // Arrange
    const repository = new GitHistoryRepository(gitStub({ 'rev-parse': 'true\n' }));

    // Act
    const busca = repository.findLatestVersion();

    // Assert
    await expect(busca).rejects.toThrow(
      'historico raso: recebido clone shallow, esperado historico completo (checkout com fetch-depth 0)',
    );
  });

  it('deve consultar o tipo de clone antes das etiquetas quando busca a ultima versao', async () => {
    // Arrange
    const git = gitStub({ 'rev-parse': 'false\n', tag: 'v1.2.3\n' });
    const repository = new GitHistoryRepository(git);

    // Act
    await repository.findLatestVersion();

    // Assert
    expect(git).toHaveBeenNthCalledWith(1, ['rev-parse', '--is-shallow-repository']);
  });

  it('deve pedir as etiquetas ordenadas por versao decrescente quando busca a ultima versao', async () => {
    // Arrange
    const git = gitStub({ 'rev-parse': 'false\n', tag: 'v1.2.3\n' });
    const repository = new GitHistoryRepository(git);

    // Act
    await repository.findLatestVersion();

    // Assert
    expect(git).toHaveBeenNthCalledWith(2, ['tag', '--list', 'v*.*.*', '--sort=-v:refname']);
  });

  it('deve chamar o git exatamente duas vezes quando busca a ultima versao', async () => {
    // Arrange
    const git = gitStub({ 'rev-parse': 'false\n', tag: 'v1.2.3\n' });
    const repository = new GitHistoryRepository(git);

    // Act
    await repository.findLatestVersion();

    // Assert
    expect(git).toHaveBeenCalledTimes(2);
  });

  it('deve consumir o stdout resolvido pelo git quando busca a ultima versao', async () => {
    // Arrange
    const git = gitStub({ 'rev-parse': 'false\n', tag: 'v1.2.3\n' });
    const repository = new GitHistoryRepository(git);

    // Act
    await repository.findLatestVersion();

    // Assert
    await expect(vi.mocked(git).mock.results[1]?.value).resolves.toBe('v1.2.3\n');
  });

  it('deve devolver nulo quando o repositorio nao tem etiqueta alguma', async () => {
    // Arrange
    const repository = new GitHistoryRepository(gitStub({ 'rev-parse': 'false\n', tag: '' }));

    // Act
    const versao = await repository.findLatestVersion();

    // Assert
    expect(versao).toBeNull();
  });

  it('deve devolver nulo quando nenhuma etiqueta tem formato valido', async () => {
    // Arrange
    const git = gitStub({ 'rev-parse': 'false\n', tag: 'rascunho\nv1.2\nv01.2.3\n' });
    const repository = new GitHistoryRepository(git);

    // Act
    const versao = await repository.findLatestVersion();

    // Assert
    expect(versao).toBeNull();
  });

  it('deve ignorar a etiqueta malformada quando ha etiqueta valida em seguida', async () => {
    // Arrange
    const git = gitStub({ 'rev-parse': 'false\n', tag: 'v1.2\nv1.2.3\n' });
    const repository = new GitHistoryRepository(git);

    // Act
    const versao = await repository.findLatestVersion();

    // Assert
    expect(versao).toEqual(VERSAO);
  });

  it('deve devolver a maior versao quando ha varias etiquetas validas', async () => {
    // Arrange
    const git = gitStub({ 'rev-parse': 'false\n', tag: 'v2.10.0\nv2.9.9\nv1.2.3\n' });
    const repository = new GitHistoryRepository(git);

    // Act
    const versao = await repository.findLatestVersion();

    // Assert
    expect(versao).toEqual({ major: 2, minor: 10, patch: 0 });
  });

  it('deve pedir o intervalo desde a versao quando ha versao anterior', async () => {
    // Arrange
    const git = gitStub({ log: 'feat: nova secao\0' });
    const repository = new GitHistoryRepository(git);

    // Act
    await repository.listCommitMessagesSince(VERSAO);

    // Assert
    expect(git).toHaveBeenCalledExactlyOnceWith(['log', 'v1.2.3..HEAD', '--format=%B%x00']);
  });

  it('deve pedir o historico completo quando nao ha versao anterior', async () => {
    // Arrange
    const git = gitStub({ log: 'feat: nova secao\0' });
    const repository = new GitHistoryRepository(git);

    // Act
    await repository.listCommitMessagesSince(null);

    // Assert
    expect(git).toHaveBeenCalledExactlyOnceWith(['log', '--format=%B%x00']);
  });

  it('deve preservar a mensagem multilinha inteira quando o commit tem corpo', async () => {
    // Arrange
    const git = gitStub({ log: 'feat: nova secao\n\nBREAKING CHANGE: rota trocada\n\0' });
    const repository = new GitHistoryRepository(git);

    // Act
    const mensagens = await repository.listCommitMessagesSince(null);

    // Assert
    expect(mensagens).toEqual(['feat: nova secao\n\nBREAKING CHANGE: rota trocada']);
  });

  it('deve devolver uma mensagem por commit quando o historico tem varios', async () => {
    // Arrange
    const git = gitStub({ log: 'feat: uma\0fix: duas\0\n' });
    const repository = new GitHistoryRepository(git);

    // Act
    const mensagens = await repository.listCommitMessagesSince(null);

    // Assert
    expect(mensagens).toEqual(['feat: uma', 'fix: duas']);
  });

  it('deve devolver lista vazia quando o git nao devolve saida alguma', async () => {
    // Arrange
    const repository = new GitHistoryRepository(gitStub({ log: '' }));

    // Act
    const mensagens = await repository.listCommitMessagesSince(null);

    // Assert
    expect(mensagens).toEqual([]);
  });

  it('deve invocar o git com os argumentos recebidos quando usa o executor padrao', async () => {
    // Arrange
    execFileAsync.mockClear();
    execFileAsync.mockResolvedValue({ stdout: 'v1.2.3\n' });

    // Act
    await gitCommandExecutor(['tag', '--list']);

    // Assert
    expect(execFileAsync).toHaveBeenCalledExactlyOnceWith('git', ['tag', '--list']);
  });

  it('deve devolver o stdout do processo quando usa o executor padrao', async () => {
    // Arrange
    execFileAsync.mockClear();
    execFileAsync.mockResolvedValue({ stdout: 'v1.2.3\n' });

    // Act
    const saida = await gitCommandExecutor(['tag', '--list']);

    // Assert
    expect(saida).toBe('v1.2.3\n');
  });
});
