import type { CommunityCategory } from '../../../../core/domain/models/community_channel_model.ts';

/** Entrega ao visitante a descricao que ele pode ver (RF-07, RF-14). */
export interface IDescribeCommunitySpaceUseCase {
  execute(): readonly CommunityCategory[];
}
