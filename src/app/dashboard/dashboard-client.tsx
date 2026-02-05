'use client';

import { useState } from 'react';
import { UploadForm } from './upload-form';
import { FileActions } from './file-actions';
import { ChangePasswordForm } from './change-password-form';

interface DashboardContentProps {
    user: {
        id: string;
        name: string;
        submissions: Array<{
            id: string;
            title: string;
            description: string | null;
            fileUrl: string;
            fileType: string;
            status: string;
            certificateFile: string | null;
            createdAt: Date;
        }>;
    };
}

export function DashboardContent({ user }: DashboardContentProps) {
    const [editingSubmission, setEditingSubmission] = useState<{
        id: string;
        title: string;
        description: string | null;
    } | null>(null);

    const handleEdit = (submission: { id: string; title: string; description: string | null }) => {
        setEditingSubmission(submission);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingSubmission(null);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card">
                {/* Upload Section */}
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                        {editingSubmission ? 'Edit Work' : 'Upload New Work'}
                    </h2>
                    <UploadForm
                        editingSubmission={editingSubmission}
                        onCancelEdit={handleCancelEdit}
                    />
                </section>

                <hr style={{ border: 'none', borderTop: '2px solid var(--card-border)', margin: '2rem 0' }} />

                {/* History Section */}
                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your Submissions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {user.submissions.length === 0 ? (
                            <p style={{ color: '#666' }}>No submissions yet.</p>
                        ) : (
                            user.submissions.map((sub) => (
                                <div key={sub.id} className="card" style={{ padding: '1rem', background: 'var(--input-bg)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{sub.title}</h3>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            background: sub.status === 'APPROVED' ? 'var(--success)' : sub.status === 'REJECTED' ? 'var(--error)' : 'var(--warning)',
                                            color: '#fff'
                                        }}>
                                            {sub.status}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: '#a3a3a3', marginBottom: '0.5rem' }}>{sub.description || 'No description'}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#666' }}>Type: {sub.fileType} • {new Date(sub.createdAt).toLocaleDateString()}</p>

                                    <FileActions
                                        submissionId={sub.id}
                                        fileUrl={sub.fileUrl}
                                        onEdit={() => handleEdit({ id: sub.id, title: sub.title, description: sub.description })}
                                    />

                                    {/* Certificate Download */}
                                    {sub.certificateFile && (
                                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '0.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.875rem', color: '#fff', fontWeight: 600, marginBottom: '0.25rem' }}>
                                                        🎓 Certificate Available
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#d1fae5' }}>
                                                        Your certificate is ready to download
                                                    </div>
                                                </div>
                                                <a
                                                    href={sub.certificateFile}
                                                    download
                                                    className="btn"
                                                    style={{
                                                        background: '#fff',
                                                        color: '#059669',
                                                        fontSize: '0.875rem',
                                                        padding: '0.5rem 1rem',
                                                        fontWeight: 600,
                                                        textDecoration: 'none'
                                                    }}
                                                >
                                                    📥 Download
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Check if user is logged in (implicit) and show settings */}
                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
}

