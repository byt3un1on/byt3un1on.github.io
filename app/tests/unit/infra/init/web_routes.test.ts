import { describe, expect, it } from 'vitest';
import { WEB_ROUTES, withoutLeadingSlash } from '../../../../infra/init/web_routes.ts';
import { SITE_ROUTES } from '../../../../core/domain/constants/site_routes_constants.ts';

describe('withoutLeadingSlash', () => {
  it('deve remover a barra inicial quando ela existe', () => {
    // Arrange
    const rota = '/projetos';

    // Act
    const resultado = withoutLeadingSlash(rota);

    // Assert
    expect(resultado).toBe('projetos');
  });

  it('deve devolver texto vazio quando a rota e a raiz', () => {
    // Arrange
    const rota = SITE_ROUTES.home;

    // Act
    const resultado = withoutLeadingSlash(rota);

    // Assert
    expect(resultado).toBe('');
  });

  it('deve preservar a rota quando ela ja vem sem barra inicial', () => {
    // Arrange
    const rota = 'projetos';

    // Act
    const resultado = withoutLeadingSlash(rota);

    // Assert
    expect(resultado).toBe('projetos');
  });
});

describe('WEB_ROUTES', () => {
  it('deve declarar todas as rotas publicas do sitio quando inspecionada', () => {
    // Arrange
    const esperadas = ['', 'projetos', 'projetos/:slug', '404', '**'];

    // Act
    const caminhos = WEB_ROUTES.map((route) => route.path);

    // Assert
    expect(caminhos).toEqual(esperadas);
  });

  it('deve terminar em rota coringa quando inspecionada', () => {
    // Arrange
    const ultima = WEB_ROUTES[WEB_ROUTES.length - 1];

    // Act
    const caminho = ultima?.path;

    // Assert
    expect(caminho).toBe('**');
  });

  it('deve apontar cada rota para um componente quando inspecionada', () => {
    // Arrange
    const semComponente = WEB_ROUTES.filter((route) => route.component === undefined);

    // Act
    const total = semComponente.length;

    // Assert
    expect(total).toBe(0);
  });
});
