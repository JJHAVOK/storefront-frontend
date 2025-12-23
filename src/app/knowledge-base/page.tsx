import { getSeoMetadata } from '@/lib/seo';
import KBContent from './content';

export async function generateMetadata() {
  return await getSeoMetadata('/kb');
}

export default function Page() {
  return <KBContent />;
}
