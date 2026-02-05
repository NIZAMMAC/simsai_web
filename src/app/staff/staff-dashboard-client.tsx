'use client';

import { useState } from 'react';
import { ReviewActions } from './review-actions';
import { CertificateUpload } from './certificate-upload';

const DEPARTMENTS = [
    { value: 'COMPUTER_SCIENCE', label: 'Computer Science' },
    { value: 'CIVIL', label: 'Civil' },
    { value: 'MECHANICAL', label: 'Mechanical' },
    { value: 'EEE', label: 'EEE' },
    { value: 'AI', label: 'AI' },
    { value: 'AUTOMOBILE', label: 'Automobile' }
];

interface StaffDashboardClientProps {
    submissions: Array<{
        id: string;
        title: string;
        description: string | null;
        fileUrl: string;
        fileType: string;
        status: string;
        certificateFile: string | null;
        createdAt: Date;
        student: {
            name: string;
            email: string;
            courseType: string | null;
            department: string | null;
            semester: number | null;
        };
    }>;
}

export function StaffDashboardClient({ submissions }: StaffDashboardClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
    const [courseTypeFilter, setCourseTypeFilter] = useState<'ALL' | 'BTECH' | 'POLYTECHNIC'>('ALL');
    const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
    const [semesterFilter, setSemesterFilter] = useState<string>('ALL');
    const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: string; title: string } | null>(null);

    // Dynamic semester options based on course type filter
    const getSemesterOptions = () => {
        if (courseTypeFilter === 'BTECH') {
            return [1, 2, 3, 4, 5, 6, 7, 8];
        } else if (courseTypeFilter === 'POLYTECHNIC') {
            return [1, 2, 3, 4, 5, 6];
        }
        return [1, 2, 3, 4, 5, 6, 7, 8]; // Show all when 'ALL' is selected
    };

    // Filter submissions
    const filteredSubmissions = submissions.filter((sub) => {
        const matchesSearch = sub.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
        const matchesCourseType = courseTypeFilter === 'ALL' || sub.student.courseType === courseTypeFilter;
        const matchesDepartment = departmentFilter === 'ALL' || sub.student.department === departmentFilter;
        const matchesSemester = semesterFilter === 'ALL' || sub.student.semester?.toString() === semesterFilter;
        return matchesSearch && matchesStatus && matchesCourseType && matchesDepartment && matchesSemester;
    });

    return (
        <>
            {/* Search and Filter Bar */}
            <div style={{ maxWidth: '1200px', margin: '0 auto 2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="🔍 Search by student name, email, or project..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input"
                    style={{ flex: '1 1 250px', fontSize: '1rem' }}
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="input"
                    style={{ fontSize: '1rem', minWidth: '140px' }}
                >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
                <select
                    value={courseTypeFilter}
                    onChange={(e) => setCourseTypeFilter(e.target.value as any)}
                    className="input"
                    style={{ fontSize: '1rem', minWidth: '140px' }}
                >
                    <option value="ALL">All Courses</option>
                    <option value="BTECH">B.Tech</option>
                    <option value="POLYTECHNIC">Polytechnic</option>
                </select>
                <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="input"
                    style={{ fontSize: '1rem', minWidth: '160px' }}
                >
                    <option value="ALL">All Departments</option>
                    {DEPARTMENTS.map(dept => (
                        <option key={dept.value} value={dept.value}>{dept.label}</option>
                    ))}
                </select>
                <select
                    value={semesterFilter}
                    onChange={(e) => setSemesterFilter(e.target.value)}
                    className="input"
                    style={{ fontSize: '1rem', minWidth: '120px' }}
                >
                    <option value="ALL">All Semesters</option>
                    {getSemesterOptions().map(sem => (
                        <option key={sem} value={sem.toString()}>S{sem}</option>
                    ))}
                </select>
            </div>

            {/* Submissions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
                {filteredSubmissions.map((sub) => (
                    <div key={sub.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Header */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{sub.title}</h3>
                                <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
                                    {new Date(sub.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </p>
                            </div>
                            <span style={{
                                fontSize: '0.75rem',
                                padding: '0.4rem 0.75rem',
                                borderRadius: '4px',
                                background: sub.status === 'APPROVED' ? 'var(--success)' : sub.status === 'REJECTED' ? 'var(--error)' : 'var(--warning)',
                                color: '#fff',
                                fontWeight: 600,
                                height: 'fit-content'
                            }}>
                                {sub.status}
                            </span>
                        </div>

                        {/* Student Info */}
                        < div style={{
                            background: 'var(--input-bg)',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0ea5e9, #ec4899)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                color: '#fff'
                            }}>
                                {(sub.student.name && sub.student.name.length > 0) ? sub.student.name[0].toUpperCase() : '?'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.95rem', fontWeight: 500, margin: 0 }}>{sub.student.name}</p>
                                <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>{sub.student.email}</p>
                            </div>
                        </div>

                        {/* Department & Semester Badges */}
                        {(sub.student.courseType || sub.student.department || sub.student.semester) && (
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {sub.student.courseType && (
                                    <span style={{
                                        background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                                        color: '#fff',
                                        padding: '0.25rem 0.65rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 500
                                    }}>
                                        {sub.student.courseType === 'BTECH' ? 'B.Tech' : 'Polytechnic'}
                                    </span>
                                )}
                                {sub.student.department && (
                                    <span style={{
                                        background: 'linear-gradient(135deg, #ec4899, #f472b6)',
                                        color: '#fff',
                                        padding: '0.25rem 0.65rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 500
                                    }}>
                                        {sub.student.department.replace(/_/g, ' ')}
                                    </span>
                                )}
                                {sub.student.semester && (
                                    <span style={{
                                        background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                                        color: '#fff',
                                        padding: '0.25rem 0.65rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 500
                                    }}>
                                        S{sub.student.semester}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Description */}
                        {sub.description && (
                            <p style={{ fontSize: '0.875rem', color: '#aaa', margin: 0 }}>{sub.description}</p>
                        )}

                        {/* Media Preview */}
                        <div
                            style={{
                                background: '#000',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                padding: '1rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onClick={() => setSelectedMedia({ url: sub.fileUrl, type: sub.fileType, title: sub.title })}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {sub.fileType === 'VIDEO' ? (
                                <video style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '4px' }}>
                                    <source src={sub.fileUrl} type="video/mp4" />
                                </video>
                            ) : (
                                <img src={sub.fileUrl} alt={sub.title} style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain', borderRadius: '4px' }} />
                            )}
                            <div style={{ fontSize: '0.75rem', color: '#0ea5e9', marginTop: '0.5rem', fontWeight: 500 }}>
                                🔍 Click to view full size
                            </div>
                        </div>


                        {/* Review Actions */}
                        {sub.status === 'PENDING' && <ReviewActions submissionId={sub.id} />}

                        {/* Certificate Upload */}
                        <CertificateUpload
                            submissionId={sub.id}
                            status={sub.status}
                            certificateFile={sub.certificateFile}
                        />
                    </div >
                ))
                }

                {
                    filteredSubmissions.length === 0 && (
                        <p style={{ color: '#666', gridColumn: '1 / -1', textAlign: 'center', fontSize: '1.125rem' }}>
                            No submissions found matching your criteria.
                        </p>
                    )
                }
            </div >

            {/* Full Screen Media Modal */}
            {
                selectedMedia && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.95)',
                            zIndex: 1000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem'
                        }}
                        onClick={() => setSelectedMedia(null)}
                    >
                        <button
                            onClick={() => setSelectedMedia(null)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: '#fff',
                                color: '#000',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            ×
                        </button>
                        <div style={{ maxWidth: '90vw', maxHeight: '90vh', textAlign: 'center' }}>
                            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>{selectedMedia.title}</h2>
                            {selectedMedia.type === 'VIDEO' ? (
                                <video controls autoPlay style={{ maxWidth: '100%', maxHeight: '80vh' }}>
                                    <source src={selectedMedia.url} type="video/mp4" />
                                </video>
                            ) : (
                                <img src={selectedMedia.url} alt={selectedMedia.title} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
                            )}
                            <div style={{ marginTop: '1rem' }}>
                                <a
                                    href={selectedMedia.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#0ea5e9', textDecoration: 'underline' }}
                                >
                                    Open in new tab
                                </a>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
