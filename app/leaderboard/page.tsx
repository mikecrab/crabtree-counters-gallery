import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import LeaderboardGrid from '@/components/LeaderboardGrid';

export const dynamic = 'force-dynamic';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Leaderboard() {
    const rendersDir = path.join(process.cwd(), 'public/mockups/renders');
    const renderFiles = fs.readdirSync(rendersDir).filter(file => file.includes('_0001'));

    const { data: voteData } = await supabase.from('votes').select('*');
    const voteMap = new Map(voteData?.map(v => [v.image_name, v.vote_count || 0]) || []);

    // Map the data and sort by highest votes
    const sortedItems = renderFiles.map((renderFile) => {
        const originalFile = renderFile.replace('_0001.jpg', '').replace('_0001.png', '');
        const displayName = originalFile.replace(/\.(jpg|png)$/i, '').replace(/_/g, ' ');
        const nameParts = originalFile.split('_');
        const productId = nameParts.length > 1 ? nameParts[1] : null;

        return {
            renderFile,
            originalFile,
            displayName,
            productId,
            votes: voteMap.get(originalFile) || 0
        };
    }).sort((a, b) => b.votes - a.votes);

    return (
        <main className="bg-gray-950 min-h-screen">
            {/* Navigation Header */}
            <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800 shadow-md">
                <h1 className="text-xl font-bold text-gray-200">Current Rankings</h1>
                <Link
                    href="/"
                    className="text-sm font-bold text-gray-900 bg-gray-200 hover:bg-white px-4 py-2 rounded transition-colors"
                >
                    ← Back to Voting
                </Link>
            </div>

            <LeaderboardGrid items={sortedItems} />
        </main>
    );
}