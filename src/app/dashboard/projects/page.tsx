'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

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
                  <div className="card shadow-sm">
                     <div className="card-header d-flex justify-content-between align-items-center bg-white">
                        <h5 className="m-0">{p.name}</h5>
                        <span className="badge bg-info text-dark">{p.status}</span>
                     </div>
                     <div className="card-body">
                        <p>{p.description}</p>
                        
                        <h6 className="mt-4 border-bottom pb-2">Timeline & Updates</h6>
                        {p.updates && p.updates.length > 0 ? (
                           <ul className="list-group list-group-flush">
                              {p.updates.map((u: any) => (
                                 <li className="list-group-item" key={u.id}>
                                    <div className="d-flex w-100 justify-content-between">
                                      <h6 className="mb-1">{u.title}</h6>
                                      <small>{new Date(u.createdAt).toLocaleDateString()}</small>
                                    </div>
                                    <p className="mb-1 text-muted small">{u.description}</p>
                                 </li>
                              ))}
                           </ul>
                        ) : <p className="text-muted small">No updates posted yet.</p>}

                        <h6 className="mt-4 border-bottom pb-2">Progress Board</h6>
                        <div className="d-flex overflow-auto gap-3 pb-3">
                           {p.columns.map((col: any) => (
                              <div key={col.id} style={{ minWidth: '200px' }} className="bg-light p-2 rounded border">
                                 <strong className="d-block mb-2 text-center">{col.name}</strong>
                                 {col.tasks.map((t: any) => (
                                    <div key={t.id} className="card mb-2 p-2 small shadow-sm border-0">
                                       {t.title}
                                    </div>
                                 ))}
                              </div>
                           ))}
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