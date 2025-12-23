import { getSeoMetadata } from '@/lib/seo';
import ProjectsContent from './content';

export async function generateMetadata() {
  return await getSeoMetadata('/projects');
}

export default function Page() {
  return <ProjectsContent />;
}
