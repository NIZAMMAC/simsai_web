'use client';

import { useState } from 'react';
import { uploadFile } from '@/app/actions/upload';
import { useRouter } from 'next/navigation';

interface UploadFormProps {
    editingSubmission?: {
        id: string;
        title: string;
        description: string | null;
    } | null;
    onCancelEdit?: () => void;
}

export function UploadForm({ editingSubmission, onCancelEdit }: UploadFormProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsUploading(true);
        setMessage('');

        const formData = new FormData(event.currentTarget);

        // Add submission ID if editing
        if (editingSubmission) {
            formData.append('submissionId', editingSubmission.id);
        }

        const result = await uploadFile(formData);

        if (result?.error) {
            setMessage(result.error);
        } else {
            setMessage(editingSubmission ? 'Updated successfully!' : 'Upload successful!');
            (event.target as HTMLFormElement).reset();
            router.refresh();
            if (onCancelEdit) onCancelEdit();
        }
        setIsUploading(false);
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {editingSubmission && (
                <div style={{
                    background: '#e0f2fe',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: 500 }}>
                        ✏️ Editing: {editingSubmission.title}
                    </span>
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        style={{
                            fontSize: '0.875rem',
                            background: 'none',
                            border: 'none',
                            color: '#0369a1',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Project Title</label>
                <input
                    type="text"
                    name="title"
                    className="input"
                    placeholder="My Project"
                    defaultValue={editingSubmission?.title}
                    required
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
                <textarea
                    name="description"
                    className="input"
                    rows={3}
                    placeholder="Brief description..."
                    defaultValue={editingSubmission?.description || ''}
                ></textarea>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    File (Image/Video) {editingSubmission && '(leave empty to keep current file)'}
                </label>
                <input
                    type="file"
                    name="file"
                    className="input"
                    accept="image/*,video/*"
                    required={!editingSubmission}
                />
            </div>

            {message && (
                <p style={{
                    fontSize: '0.875rem',
                    color: message.includes('successful') || message.includes('Updated') ? 'var(--success)' : 'var(--error)'
                }}>
                    {message}
                </p>
            )}

            <button type="submit" className="btn btn-primary" disabled={isUploading}>
                {isUploading ? (editingSubmission ? 'Updating...' : 'Uploading...') : (editingSubmission ? 'Update Work' : 'Submit Work')}
            </button>
        </form>
    );
}
