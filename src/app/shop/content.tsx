'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useCartStore } from '@/lib/cartStore';
import { StatusModal } from '@/components/StatusModal'; // <-- Use Standard Modal


export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // --- NEW STANDARD STATUS MODAL STATE ---
  const [status, setStatus] = useState({ show: false, title: '', message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    api.get('/ecommerce/products')
      .then(res => {
         const active = res.data.filter((p:any) => p.isActive);
         setProducts(active);
         setFilteredProducts(active);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = products;
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (typeFilter !== 'ALL') result = result.filter(p => p.type === typeFilter);
    setFilteredProducts(result);
  }, [searchQuery, typeFilter, products]);

  const handleAddToCart = (product: any) => {
      addItem({ id: product.id, name: product.name, price: product.price, quantity: 1 });
      
      // --- USE STANDARD MODAL ---
      setStatus({ 
          show: true, 
          title: 'Added to Cart', 
          message: `${product.name} has been added to your cart.`, 
          type: 'success' 
      });
      
      if(selectedProduct) setSelectedProduct(null);
  };

  if (loading) return <div className="text-center py-5 mt-5"><h3>Loading Catalog...</h3></div>;

  return (
    <main>
      {/* --- STANDARD STATUS MODAL --- */}
      <StatusModal 
         show={status.show} 
         title={status.title} 
         message={status.message} 
         type={status.type} 
         onClose={() => setStatus({ ...status, show: false })} 
      />

      <header className="bg-dark" style={{ marginTop: '56px', height: '200px', display: 'flex', alignItems: 'center' }}>
        <div className="container px-4 px-lg-5">
             <div className="text-center text-white">
                 <h1 className="display-6 fw-bold text-uppercase m-0">Shop Solutions</h1>
                 <p className="lead fw-normal text-white-50 mb-0 small">Enterprise Modules & Plugins</p>
             </div>
         </div>
      </header>

      {/* --- PRODUCT DETAIL MODAL --- */}
      {selectedProduct && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999 }} tabIndex={-1} onClick={() => setSelectedProduct(null)}>
           <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                 <div className="modal-header border-0">
                    <button type="button" className="btn-close" onClick={() => setSelectedProduct(null)}></button>
                 </div>
                 <div className="modal-body pb-5 px-5">
                    <div className="row">
                       <div className="col-md-6 mb-4 mb-md-0">
                           <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                               <i className="fas fa-box fa-5x text-secondary"></i>
                           </div>
                       </div>
                       <div className="col-md-6">
                           <h2 className="fw-bold mb-2">{selectedProduct.name}</h2>
                           <p className="text-muted text-uppercase small mb-4">{selectedProduct.type} • ${selectedProduct.price.toFixed(2)}</p>
                           <h3 className="text-primary fw-bold mb-4">${selectedProduct.price.toFixed(2)}</h3>
                           <p className="lead mb-4" style={{ fontSize: '1rem' }}>{selectedProduct.description || "No description available."}</p>
                           
                           <ul className="list-unstyled mb-4 text-muted small">
                               <li><i className="fas fa-check text-success me-2"></i> Instant Delivery</li>
                               <li><i className="fas fa-check text-success me-2"></i> Enterprise License</li>
                               <li><i className="fas fa-check text-success me-2"></i> 24/7 Support</li>
                           </ul>
                           <button 
                              className="btn btn-primary btn-lg w-100 rounded-pill" 
                              onClick={() => handleAddToCart(selectedProduct)}
                           >
                              Add to Cart
                           </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <section className="page-section pt-5 bg-light">
        <div className="container">
          
          {/* --- PRO CONTROL BAR --- */}
          <div className="card border-0 shadow-sm mb-5 rounded-3 overflow-hidden" style={{ transform: 'translateY(-50px)' }}>
             <div className="card-body p-4 bg-white">
                <div className="row g-3 align-items-center">
                    <div className="col-md-6">
                        <div 
                           className="input-group input-group-lg border-0 rounded-3 overflow-hidden shadow-none"
                           style={{ backgroundColor: '#f3f3f3' }}
                        >
                           <span className="input-group-text border-0 ps-4" style={{ backgroundColor: 'transparent', marginRight: '3px' }}>
                               <i className="fas fa-search text-muted"></i>
                           </span>
                           <input 
                              type="text" 
                              className="form-control border-0 shadow-none ps-0" 
                              placeholder="Search products..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              style={{ fontSize: '1rem', backgroundColor: 'transparent' }}
                           />
                        </div>
                    </div>

                    <div className="col-md-3">
                       <div className="position-relative rounded-3 shadow-none" style={{ backgroundColor: '#f3f3f3' }}>
                           <select 
                              className="form-select form-select-lg border-0 w-100 shadow-none"
                              style={{ 
                                  fontSize: '0.95rem', 
                                  fontWeight: '500', 
                                  color: '#495057',
                                  backgroundColor: 'transparent',
                                  appearance: 'none', 
                                  WebkitAppearance: 'none',
                                  paddingLeft: '1.5rem',
                                  paddingRight: '2.5rem',
                                  cursor: 'pointer',
                                  height: '48px'
                              }}
                              value={typeFilter}
                              onChange={(e) => setTypeFilter(e.target.value)}
                           >
                              <option value="ALL">All Categories</option>
                              <option value="PHYSICAL">Physical Goods</option>
                              <option value="SERVICE">Services</option>
                              <option value="DIGITAL">Digital Assets</option>
                              <option value="CUSTOM">Custom Orders</option>
                           </select>
                           
                           <div 
                                className="position-absolute top-50 end-0 translate-middle-y me-3"
                                style={{ pointerEvents: 'none' }}
                           >
                              <i className="fas fa-chevron-down text-muted small"></i>
                           </div>
                       </div>
                    </div>
                    
                    <div className="col-md-3 text-md-end text-muted small fw-bold">
                       {filteredProducts.length} Results Found
                    </div>
                </div>
             </div>
          </div>

          {/* --- PRODUCT GRID --- */}
          <div className="row gx-4 gy-5">
            {filteredProducts.length === 0 && (
               <div className="col-12 text-center text-muted py-5">
                  <i className="fas fa-search fa-3x mb-3 text-secondary opacity-25"></i>
                  <h4>No products found.</h4>
               </div>
            )}

            {filteredProducts.map((product) => (
              <div className="col-lg-4 col-md-6 mb-5" key={product.id}>
                <div className="card h-100 border-0 shadow-hover transition-all rounded-4 overflow-hidden" style={{ cursor: 'pointer' }} onClick={() => setSelectedProduct(product)}>
                  <div className="position-relative" style={{ height: '220px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <i className="fas fa-box fa-4x text-secondary opacity-25"></i>
                     <span className="badge bg-dark position-absolute top-0 end-0 m-3 rounded-pill px-3 py-2">{product.type}</span>
                  </div>
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-1">{product.name}</h5>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                         <span className="text-primary fw-bold fs-5">${product.price.toFixed(2)}</span>
                         <small className="text-muted">SKU: {product.variants?.[0]?.sku || 'N/A'}</small>
                    </div>
                    <p className="card-text text-muted small line-clamp-2">{product.description}</p>
                  </div>
                  <div className="card-footer p-4 pt-0 border-0 bg-white">
                     <button 
                        className="btn btn-outline-primary w-100 rounded-pill fw-bold"
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                     >
                        Add to Cart
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}