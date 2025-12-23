import { getSeoMetadata } from '@/lib/seo';
import ShopContent from './content';

export async function generateMetadata() {
  return await getSeoMetadata('/shop'); 
}

export default function Page() {
  return <ShopContent />;
}
