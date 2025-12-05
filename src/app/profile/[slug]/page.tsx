'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function PublicProfilePage() {
  const { slug } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data fallback until backend is ready
    api.get(`/customer/public/${slug}`)
      .then(res => setProfile(res.data))
      .catch(() => {
          console.log("Profile not found or API missing");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (!profile) return <div className="text-center py-5"><h3>Profile Not Found</h3><Link href="/" className="btn btn-primary">Go Home</Link></div>;

  return (
    <main className="bg-light min-vh-100 py-5" style={{ marginTop: '60px' }}>
        <div className="container">
            <div className="card border-0 shadow-sm overflow-hidden">
                <div className="card-header bg-dark text-white p-5 text-center" style={{ backgroundImage: 'url(/assets/img/header-bg.jpg)' }}>
                    <img 
                        src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&size=128`} 
                        className="rounded-circle border border-4 border-white shadow-lg mb-3"
                        width="128" height="128"
                        alt="Avatar"
                    />
                    <h2 className="fw-bold">{profile.firstName} {profile.lastName}</h2>
                    <p className="lead mb-0">{profile.title || 'Member'}</p>
                </div>
                <div className="card-body p-5">
                    <h4 className="fw-bold">About</h4>
                    <p className="text-muted">{profile.bio || "This user has not added a bio yet."}</p>
                    
                    {/* Add more sections: Projects, Badges, etc. */}
                </div>
            </div>
        </div>
    </main>
  );
}
