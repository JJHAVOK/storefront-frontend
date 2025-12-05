'use client';

import { useAuthStore } from '@/lib/authStore';
import Link from 'next/link';

export default function DashboardHome() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="mt-4">Welcome, {user?.firstName}!</h1>
      <p className="lead mb-4">Here is what is happening with your account.</p>
      
      <div className="row">
        {/* Active Project Widget */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title text-primary"><i className="fas fa-rocket me-2"></i> Active Projects</h5>
              <p className="card-text text-muted">You have no active projects pending.</p>
              {/* --- 👇 FIXED TAG: Link closed with Link 👇 --- */}
              <Link href="/contact" className="btn btn-outline-primary btn-sm">Request Project</Link>
              {/* --- 👆 END FIX 👆 --- */}
            </div>
          </div>
        </div>

        {/* Recent Orders Widget */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
               <h5 className="card-title text-success"><i className="fas fa-box-open me-2"></i> Recent Orders</h5>
               <p className="card-text text-muted">No recent orders found.</p>
               <Link href="/shop" className="btn btn-outline-success btn-sm">Browse Shop</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
         {/* Support Widget */}
         <div className="col-12">
            <div className="card shadow-sm border-0">
               <div className="card-body">
                  <h5 className="card-title"><i className="fas fa-headset me-2"></i> Support Tickets</h5>
                  <p className="text-muted">Need help? Open a ticket to get started.</p>
                  <Link href="/dashboard/support" className="btn btn-outline-secondary btn-sm">Go to Support</Link>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}