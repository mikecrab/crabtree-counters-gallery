import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import CarouselGallery from '@/components/CarouselGallery';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Gallery() {
  const rendersDir = path.join(process.cwd(), 'public/mockups/renders');
  const renderFiles = fs.readdirSync(rendersDir).filter(file => file.includes('_0001'));

  const { data: voteData } = await supabase.from('votes').select('*');

  // Safely map vote_count, defaulting to 0 to prevent NaN
  const voteMap = new Map(voteData?.map(v => [v.image_name, v.vote_count || 0]) || []);

  const galleryItems = renderFiles.map((renderFile) => {
    const originalFile = renderFile.replace('_0001.jpg', '').replace('_0001.png', '');
    const displayName = originalFile.replace(/\.(jpg|png)$/i, '').replace(/_/g, ' ');
    const nameParts = originalFile.split('_');
    const productId = nameParts.length > 1 ? nameParts[1] : null;

    const currentVotes = voteMap.get(originalFile) || 0;

    return {
      renderFile,
      originalFile,
      displayName,
      productId,
      votes: currentVotes
    };
  });

  return (
    <main>
      <CarouselGallery items={galleryItems} />
    </main>
  );
}