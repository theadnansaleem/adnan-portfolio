import type { Metadata } from 'next';
import RolePage, { roleMetadata } from '@/components/home/RolePage';
import { roles } from '@/lib/roles';

export const metadata: Metadata = roleMetadata(roles.frontend);

export default function FrontendDeveloperPage() {
  return <RolePage role={roles.frontend} />;
}
