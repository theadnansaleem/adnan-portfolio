import type { Metadata } from 'next';
import RolePage, { roleMetadata } from '@/components/home/RolePage';
import { roles } from '@/lib/roles';

export const metadata: Metadata = roleMetadata(roles.foxpro);

export default function VisualFoxProMigrationPage() {
  return <RolePage role={roles.foxpro} />;
}
