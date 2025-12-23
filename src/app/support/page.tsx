import { getSeoMetadata } from '@/lib/seo';
import SupportContent from './content';

export async function generateMetadata() {
  return await getSeoMetadata('/support');
}

export default function Page() {
  return <SupportContent />;
}
