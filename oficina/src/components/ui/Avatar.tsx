import type { Partner, PresenceStatus } from '../../types';
import { StatusDot } from './StatusDot';

const SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
} as const;

interface AvatarProps {
  partner: Pick<Partner, 'name' | 'initials' | 'avatarUrl' | 'color'>;
  size?: keyof typeof SIZES;
  status?: PresenceStatus;
}

export function Avatar({ partner, size = 'md', status }: AvatarProps) {
  return (
    <div className="relative shrink-0">
      {partner.avatarUrl ? (
        <img
          src={partner.avatarUrl}
          alt={partner.name}
          className={`${SIZES[size]} rounded-full object-cover ring-2 ring-gray-900`}
        />
      ) : (
        <div
          aria-label={partner.name}
          className={`${SIZES[size]} grid place-items-center rounded-full bg-gradient-to-br ${partner.color} font-semibold text-white ring-2 ring-gray-900`}
        >
          {partner.initials}
        </div>
      )}
      {status && <StatusDot status={status} className="absolute -bottom-0.5 -right-0.5" />}
    </div>
  );
}
