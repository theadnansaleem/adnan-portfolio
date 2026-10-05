import type { Metadata } from 'next';
import RolePage, { roleMetadata } from '@/components/home/RolePage';
import { roles } from '@/lib/roles';

export const metadata: Metadata = roleMetadata(roles.dotnet);

export default function DotnetDeveloperPage() {
  return <RolePage role={roles.dotnet} />;
}
