import { COMMUNITY_SPACE } from '../../domain/constants/community_space_constants.ts';
import {
  isPublicCategory,
  type CommunityCategory,
} from '../../domain/models/community_channel_model.ts';
import type { IDescribeCommunitySpaceUseCase } from '../../../interfaces/core/application/community/i_describe_community_space_use_case.ts';

/**
 * O que o visitante pode ver do servidor.
 *
 * A categoria fechada atravessa com o nome e o proposito, e sem canal algum
 * (RF-07 e RF-14): dizer que ela existe explica por que o visitante enxerga
 * menos que um membro; listar o que ha dentro seria expor o que e fechado.
 * A poda acontece aqui, e nao no gabarito, para que o sigilo seja regra de
 * dominio e nao disciplina de quem escreve HTML.
 */
export class DescribeCommunitySpaceUseCase implements IDescribeCommunitySpaceUseCase {
  public execute(): readonly CommunityCategory[] {
    return COMMUNITY_SPACE.map((category: CommunityCategory) =>
      isPublicCategory(category) ? category : { ...category, channels: [] },
    );
  }
}
