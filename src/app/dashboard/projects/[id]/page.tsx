'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/customer/portal/projects')
      .then(res => {
         const found = res.data.find((p: any) => p.id === id);
         setProject(found);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading project details...</div>;
  if (!project) return <div className="alert alert-danger">Project not found.</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
         <h2 className="mb-0">{project.name}</h2>
         <Link href="/dashboard/projects" className="btn btn-outline-secondary btn-sm">
           <i className="fas fa-arrow-left me-2"></i> Back to Projects
         </Link>
      </div>

      <div className="row">
        {/* Progress Board */}
        <div className="col-lg-8 mb-4">
           <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white fw-bold py-3"><i className="fas fa-tasks me-2 text-primary"></i> Progress Board</div>
              <div className="card-body bg-light">
                 <div className="d-flex overflow-auto gap-3 pb-3" style={{ minHeight: '300px' }}>
                    {project.columns?.filter((col: any) => col.isPublic).map((col: any) => (
                       <div key={col.id} style={{ minWidth: '250px' }} className="bg-white p-3 rounded shadow-sm border">
                          <strong className="d-block mb-3 text-center border-bottom pb-2">{col.name}</strong>
                          {col.tasks?.filter((t: any) => t.isPublic).map((t: any) => (
                             <div key={t.id} className="card mb-2 p-3 small shadow-sm border-0 bg-light">
                                <div className="fw-bold mb-1">{t.title}</div>
                                {t.description && <div className="text-muted" style={{ fontSize: '12px' }}>{t.description}</div>}
                                <div className="mt-2 text-end">
                                   <span className={`badge ${t.priority === 'High' ? 'bg-danger' : 'bg-secondary'}`}>{t.priority}</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    ))}
                    {(!project.columns || project.columns.length === 0) && <p className="text-muted w-100 text-center mt-5">No board columns setup yet.</p>}
                 </div>
              </div>
           </div>
        </div>

        {/* Timeline & Updates */}
        <div className="col-lg-4 mb-4">
           <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white fw-bold py-3"><i className="fas fa-history me-2 text-primary"></i> Timeline Updates</div>
              <div className="card-body p-0">
                 {project.updates && project.updates.length > 0 ? (
                    <ul className="list-group list-group-flush">
                       {project.updates.filter((u: any) => u.isPublic).map((u: any) => (
                          <li className="list-group-item p-3" key={u.id}>
                             <div className="d-flex w-100 justify-content-between mb-1">
                               <h6 className="mb-0 fw-bold">{u.title}</h6>
                               <small className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</small>
                             </div>
                             <p className="mb-0 text-muted small">{u.description}</p>
                          </li>
                       ))}
                    </ul>
                 ) : (
                    <div className="p-4 text-center text-muted">No updates posted yet.</div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
