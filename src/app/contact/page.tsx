import { getSeoMetadata } from '@/lib/seo';
import ContactContent from './content';

export async function generateMetadata() {
  return await getSeoMetadata('/contact');
}

export default function Page() {
  return <ContactContent />;
}
