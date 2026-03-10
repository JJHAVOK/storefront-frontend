'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/customer/portal/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      <h2 className="mb-4">My Projects</h2>
      {projects.length === 0 ? (
         <div className="alert alert-info">No active projects found.</div>
      ) : (
         <div className="row">
            {projects.map(p => (
               <div className="col-12 mb-4" key={p.id}>
                  <div className="card shadow-sm border-0">
                     <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                        <h5 className="m-0 fw-bold">{p.name}</h5>
                        <span className="badge bg-primary">{p.status}</span>
                     </div>
                     <div className="card-body">
                        <p className="text-muted">{p.description || 'No description provided.'}</p>
                        
                        <div className="d-flex justify-content-end mt-3">
                           <Link href={`/dashboard/projects/${p.id}`} className="btn btn-outline-primary">
                             View Project Details <i className="fas fa-arrow-right ms-2"></i>
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      )}
    </div>
  );
}