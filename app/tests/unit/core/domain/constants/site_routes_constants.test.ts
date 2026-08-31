import { describe, expect, it } from 'vitest';
import {
  SITE_ROUTES,
  projectRoute,
  staticRoutes,
} from '../../../../../core/domain/constants/site_routes_constants.ts';

describe('SITE_ROUTES', () => {
  it('deve declarar toda rota relativa a raiz quando inspecionadas', () => {
    // Arrange
    const routes = Object.values(SITE_ROUTES);

    // Act
    const relativas = routes.filter((route) => route.startsWith('/'));

    // Assert
    expect(relativas).toHaveLength(routes.length);
  });

  it('deve declarar nenhuma rota com esquema ou host quando inspecionadas', () => {
    // Arrange
    const routes = Object.values(SITE_ROUTES);

    // Act
    const absolutas = routes.filter(
      (route) => /^[a-z]+:\/\//.test(route) || route.startsWith('//'),
    );

    // Assert
    expect(absolutas).toEqual([]);
  });
});

describe('projectRoute', () => {
  it('deve montar o endereco do projeto quando o slug e valido', () => {
    // Arrange
    const slug = 'shortsmaker';

    // Act
    const route = projectRoute(slug);

    // Assert
    expect(route).toBe('/projetos/shortsmaker');
  });

  it('deve descartar espacos ao redor quando o slug vem com folga', () => {
    // Arrange
    const slug = '  templates-library  ';

    // Act
    const route = projectRoute(slug);

    // Assert
    expect(route).toBe('/projetos/templates-library');
  });

  it('deve recusar o slug quando ele e vazio', () => {
    // Arrange
    const slug = '   ';

    // Act
    const act = (): string => projectRoute(slug);

    // Assert
    expect(act).toThrow('slug invalido: recebido "   ", esperado texto nao vazio');
  });
});

describe('staticRoutes', () => {
  it('deve devolver apenas as rotas fixas quando chamada', () => {
    // Arrange
    const esperado = ['/', '/projetos', '/404'];

    // Act
    const routes = staticRoutes();

    // Assert
    expect(routes).toEqual(esperado);
  });

  it('deve excluir a rota parametrizada quando chamada', () => {
    // Arrange
    const parametrizada = SITE_ROUTES.project;

    // Act
    const routes = staticRoutes();

    // Assert
    expect(routes).not.toContain(parametrizada);
  });
});
