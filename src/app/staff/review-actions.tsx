'use client';

import { verifySubmission } from '@/app/actions/staff';
import { useTransition } from 'react';

export function ReviewActions({ submissionId }: { submissionId: string }) {
    const [isPending, startTransition] = useTransition();

    function handleVerify(status: 'APPROVED' | 'REJECTED') {
        startTransition(async () => {
            await verifySubmission(submissionId, status);
        });
    }

    return (
        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
            <button
                onClick={() => handleVerify('APPROVED')}
                className="btn"
                style={{ flex: 1, backgroundColor: 'var(--success)', color: '#fff' }}
                disabled={isPending}
            >
                Approve
            </button>
            <button
                onClick={() => handleVerify('REJECTED')}
                className="btn"
                style={{ flex: 1, backgroundColor: 'var(--error)', color: '#fff' }}
                disabled={isPending}
            >
                Reject
            </button>
        </div>
    );
}
