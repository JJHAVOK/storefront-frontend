'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';


export default function KnowledgeBaseList() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      api.get('/knowledge-base/categories')
         .then(res => setCategories(res.data))
         .catch(err => console.error(err))
         .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-5" style={{ marginTop: '100px', minHeight: '60vh' }}>
        <div className="text-center mb-5">
            <h1 className="fw-bold display-5 mb-3">Knowledge Base</h1>
            <p className="lead text-muted">Find answers, tutorials, and technical guides.</p>
        </div>
        
        {loading ? (
            <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>
        ) : (
            <div className="row g-4">
                {categories.length === 0 && (
                    <div className="col-12 text-center text-muted">
                        <i className="fas fa-book-open fa-3x mb-3 opacity-25"></i>
                        <p>No articles found.</p>
                    </div>
                )}

                {categories.map(cat => (
                    <div key={cat.id} className="col-md-6 col-lg-4">
                        <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                            <div className="card-body p-4">
                                <h4 className="fw-bold mb-3 text-primary">{cat.name}</h4>
                                {cat.description && <p className="text-muted small mb-3">{cat.description}</p>}
                                
                                <ul className="list-unstyled mb-0">
                                    {cat.articles.map((art: any) => (
                                        <li key={art.id} className="mb-2">
                                            <Link href={`/knowledge-base/${art.slug}`} className="text-decoration-none text-dark d-flex align-items-center">
                                                <i className="fas fa-file-alt me-2 text-muted small"></i>
                                                <span className="hover-underline">{art.title}</span>
                                            </Link>
                                        </li>
                                    ))}
                                    {cat.articles.length === 0 && <li className="text-muted small fst-italic">No articles yet.</li>}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}
