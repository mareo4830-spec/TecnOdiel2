import { PARTNER_META } from '../../lib/partners';
import type { PartnerId } from '../../types';
import { Avatar } from './Avatar';

/** Avatares superpuestos de los socios que han trabajado en algo. */
export function AvatarStack({ ids, size = 'xs' }: { ids: PartnerId[]; size?: 'xs' | 'sm' }) {
  return (
    <div className="flex -space-x-2" aria-label={ids.map((id) => PARTNER_META[id].name).join(', ')}>
      {ids.map((id) => (
        <div key={id} title={PARTNER_META[id].name}>
          <Avatar partner={{ ...PARTNER_META[id], avatarUrl: null }} size={size} />
        </div>
      ))}
    </div>
  );
}
