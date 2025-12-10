'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      if(slug) {
          api.get(`/knowledge-base/articles/${slug}`)
             .then(res => setArticle(res.data))
             .catch(() => {})
             .finally(() => setLoading(false));
      }
  }, [slug]);

  if (loading) return <div className="container py-5 mt-5 text-center">Loading...</div>;
  
  if (!article) return (
      <div className="container py-5 mt-5 text-center">
          <h3>Article not found</h3>
          <Link href="/support" className="btn btn-primary mt-3">Back to Support</Link>
      </div>
  );

  return (
    <div className="container py-5" style={{ marginTop: '80px', minHeight: '60vh' }}>
        <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link href="/support">Support</Link></li>
                <li className="breadcrumb-item active" aria-current="page">{article.title}</li>
            </ol>
        </nav>

        <div className="row justify-content-center">
            <div className="col-lg-8">
                <h1 className="fw-bold mb-4">{article.title}</h1>
                <div className="text-muted mb-4 small">
                    <span className="me-3"><i className="fas fa-eye me-1"></i> {article.views} views</span>
                    <span><i className="fas fa-calendar me-1"></i> {new Date(article.updatedAt).toLocaleDateString()}</span>
                </div>
                
                <div className="card shadow-sm border-0">
                    <div className="card-body p-5 article-content">
                        {/* NOTE: In a real production app, sanitize this HTML using a library like 'dompurify' 
                           to prevent XSS if you allow untrusted staff to write articles.
                        */}
                        <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
                    </div>
                </div>

                <div className="mt-5 text-center">
                    <p className="text-muted">Still need help?</p>
                    <button className="btn btn-outline-primary" onClick={() => (window as any).openChatWidget?.()}>
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}
