'use client';

import { deleteSubmission } from '@/app/actions/delete-submission';
import { useState } from 'react';

interface FileActionsProps {
    submissionId: string;
    fileUrl: string;
    onEdit: () => void;
}

export function FileActions({ submissionId, fileUrl, onEdit }: FileActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleView = () => {
        window.open(fileUrl, '_blank');
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this submission?')) {
            return;
        }

        setIsDeleting(true);
        const result = await deleteSubmission(submissionId);

        if (result.error) {
            alert(result.error);
            setIsDeleting(false);
        }
        // No need to reset isDeleting on success as the component will unmount
    };

    return (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <button
                onClick={handleView}
                className="btn btn-outline"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
                👁️ View
            </button>
            <button
                onClick={onEdit}
                className="btn btn-outline"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
                ✏️ Edit
            </button>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-outline"
                style={{
                    fontSize: '0.875rem',
                    padding: '0.5rem 1rem',
                    background: '#fee2e2',
                    color: '#dc2626',
                    borderColor: '#fca5a5'
                }}
            >
                {isDeleting ? '🗑️ Deleting...' : '🗑️ Delete'}
            </button>
        </div>
    );
}
