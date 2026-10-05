import type { Metadata } from 'next';
import RolePage, { roleMetadata } from '@/components/home/RolePage';
import { roles } from '@/lib/roles';

export const metadata: Metadata = roleMetadata(roles.azure);

export default function AzureDeveloperPage() {
  return <RolePage role={roles.azure} />;
}
