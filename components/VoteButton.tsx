'use client'

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function VoteButton({ imageId, initialVotes }: { imageId: string, initialVotes: number }) {
    // Fallback to 0 explicitly to prevent NaN
    const [votes, setVotes] = useState(initialVotes || 0);
    const [hasVoted, setHasVoted] = useState(false);

    const handleVote = async () => {
        if (hasVoted) return;

        setVotes(v => v + 1);
        setHasVoted(true);

        // Make sure your Supabase function is still named 'increment_vote'
        const { error } = await supabase.rpc('increment_vote', { image_id: imageId });

        if (error) {
            console.error('Error recording vote:', error);
            setVotes(v => v - 1);
            setHasVoted(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <span className="text-gray-400 font-medium text-lg">
                {votes} {votes === 1 ? 'Vote' : 'Votes'}
            </span>
            <button
                onClick={handleVote}
                disabled={hasVoted}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${hasVoted
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
            >
                {hasVoted ? 'Voted! ✓' : 'Vote for this'}
            </button>
        </div>
    );
}