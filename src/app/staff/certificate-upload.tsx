'use client';

import { useState, useTransition } from 'react';
import { uploadCertificate, removeCertificate } from '@/app/actions/certificate';

interface CertificateUploadProps {
    submissionId: string;
    status: string;
    certificateFile: string | null;
}

export function CertificateUpload({ submissionId, status, certificateFile }: CertificateUploadProps) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState('');

    const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        startTransition(async () => {
            const result = await uploadCertificate(submissionId, formData);
            if (result.error) {
                setMessage(result.error);
            } else {
                setMessage('Certificate uploaded successfully!');
                form.reset();
                setTimeout(() => setMessage(''), 3000);
            }
        });
    };

    const handleRemove = () => {
        if (!confirm('Remove this certificate? Students will no longer be able to download it.')) return;

        startTransition(async () => {
            const result = await removeCertificate(submissionId);
            if (result.error) {
                setMessage(result.error);
            } else {
                setMessage('Certificate removed');
                setTimeout(() => setMessage(''), 3000);
            }
        });
    };

    // Only show for approved submissions
    if (status !== 'APPROVED') {
        return null;
    }

    return (
        <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'var(--input-bg)',
            borderRadius: '0.5rem',
            border: '1px solid var(--card-border)'
        }}>
            <div style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
                color: 'var(--foreground)'
            }}>
                📜 Certificate Management
            </div>

            {certificateFile ? (
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.75rem',
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        borderRadius: '0.5rem',
                        color: '#fff'
                    }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                ✅ Certificate Uploaded
                            </div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                                {certificateFile}
                            </div>
                        </div>
                        <a
                            href={`/uploads/certificates/${certificateFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn"
                            style={{
                                background: '#fff',
                                color: '#059669',
                                fontSize: '0.75rem',
                                padding: '0.5rem 0.75rem',
                                textDecoration: 'none'
                            }}
                        >
                            👁️ View
                        </a>
                    </div>
                    <button
                        onClick={handleRemove}
                        disabled={isPending}
                        className="btn btn-outline"
                        style={{
                            width: '100%',
                            fontSize: '0.875rem',
                            padding: '0.5rem',
                            background: '#fee2e2',
                            color: '#dc2626',
                            borderColor: '#fca5a5'
                        }}
                    >
                        {isPending ? 'Removing...' : '🗑️ Remove Certificate'}
                    </button>
                </div>
            ) : (
                <form onSubmit={handleUpload}>
                    <input
                        type="file"
                        name="certificate"
                        accept=".pdf"
                        required
                        disabled={isPending}
                        className="input"
                        style={{
                            fontSize: '0.875rem',
                            marginBottom: '0.5rem',
                            padding: '0.5rem'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isPending}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            fontSize: '0.875rem',
                            padding: '0.5rem'
                        }}
                    >
                        {isPending ? 'Uploading...' : '📤 Upload Certificate PDF'}
                    </button>
                </form>
            )}

            {message && (
                <div style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    background: message.includes('success') ? '#d1fae5' : '#fee2e2',
                    color: message.includes('success') ? '#059669' : '#dc2626'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
}
