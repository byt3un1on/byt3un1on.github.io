import { execFile } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GitHistoryRepository } from '../../../../adapters/repositories/git_history_repository.ts';
import { parseSemanticVersion } from '../../../../core/domain/models/semantic_version_model.ts';

const run = promisify(execFile);

let repositorio = '';

async function git(...args: readonly string[]): Promise<void> {
  await run('git', ['-C', repositorio, ...args]);
}

async function commit(mensagem: string): Promise<void> {
  await git('commit', '--allow-empty', '-m', mensagem);
}

/** Executa o `git` dentro do repositorio temporario, e nao no diretorio corrente. */
function repository(): GitHistoryRepository {
  return new GitHistoryRepository(async (args) => {
    const { stdout } = await run('git', ['-C', repositorio, ...args]);
    return stdout;
  });
}

describe('GitHistoryRepository contra um repositorio git real', () => {
  beforeEach(async () => {
    repositorio = await mkdtemp(join(tmpdir(), 'esteira-git-'));
    await git('init', '--initial-branch=master');
    await git('config', 'user.email', 'esteira@byt3un1on.dev');
    await git('config', 'user.name', 'Esteira');
  });

  afterEach(async () => {
    await rm(repositorio, { recursive: true, force: true });
  });

  it('deve devolver nulo quando o repositorio nao tem marca alguma', async () => {
    // Arrange
    await commit('chore: primeiro commit');

    // Act
    const versao = await repository().findLatestVersion();

    // Assert
    expect(versao).toBeNull();
  });

  it('deve devolver a maior marca quando o repositorio tem varias', async () => {
    // Arrange
    await commit('chore: primeiro commit');
    await git('tag', 'v1.2.3');
    await commit('feat: segunda entrega');
    await git('tag', 'v1.10.0');

    // Act
    const versao = await repository().findLatestVersion();

    // Assert
    expect(versao).toEqual(parseSemanticVersion('v1.10.0'));
  });

  it('deve ignorar marca fora do padrao semantico quando ela existe', async () => {
    // Arrange
    await commit('chore: primeiro commit');
    await git('tag', 'release-antiga');
    await git('tag', 'v0.9.1');

    // Act
    const versao = await repository().findLatestVersion();

    // Assert
    expect(versao).toEqual(parseSemanticVersion('v0.9.1'));
  });

  it('deve devolver apenas os commits desde a marca quando ela existe', async () => {
    // Arrange
    await commit('chore: antes da marca');
    await git('tag', 'v1.0.0');
    await commit('feat: depois da marca');

    // Act
    const mensagens = await repository().listCommitMessagesSince(parseSemanticVersion('v1.0.0'));

    // Assert
    expect(mensagens).toEqual(['feat: depois da marca']);
  });

  it('deve devolver todo o historico quando nao ha marca anterior', async () => {
    // Arrange
    await commit('chore: primeiro');
    await commit('feat: segundo');

    // Act
    const mensagens = await repository().listCommitMessagesSince(null);

    // Assert
    expect(mensagens).toEqual(['feat: segundo', 'chore: primeiro']);
  });

  it('deve preservar o corpo inteiro quando a mensagem e multilinha', async () => {
    // Arrange
    await commit('feat: muda o contrato\n\nBREAKING CHANGE: o endereco das rotas mudou');

    // Act
    const mensagens = await repository().listCommitMessagesSince(null);

    // Assert
    expect(mensagens[0]).toContain('BREAKING CHANGE: o endereco das rotas mudou');
  });
});
