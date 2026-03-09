import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// --- DATA FETCHING (Server Side) ---
async function getProduct(slug: string) {
  try {
    const res = await fetch('http://backend-api:3003/api/ecommerce/products', { cache: 'no-store' });
    if (res.ok) {
      const products: any[] = await res.json();
      const product = products.find((p: any) => p.id === slug || p.slug === slug);
      if (product) return product;
    }
  } catch (error) { /* Silent fail to fallback */ }

  // Fallback Mock
  return {
    id: slug,
    name: "Enterprise Solution (Demo)",
    price: 99.99,
    type: "PHYSICAL",
    description: "This is a comprehensive enterprise solution designed to streamline your workflow. Featuring robust architecture, seamless integration, and 24/7 support, it is the standard for modern businesses.",
    images: [],
    variants: [{ sku: 'DEMO-SKU-001' }]
  };
}

// --- SEO ---
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} | PixelForge`,
    description: product.description?.substring(0, 160),
  };
}

// --- PAGE ---
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) return notFound();

  return (
    <main className="bg-light" style={{ minHeight: '100vh', marginTop: '56px', paddingBottom: '80px' }}>
      
      {/* 1. HEADER / BREADCRUMB */}
      <div className="bg-white border-bottom py-3">
        <div className="container px-4">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link href="/" className="text-decoration-none text-muted">Home</Link></li>
                    <li className="breadcrumb-item"><Link href="/shop" className="text-decoration-none text-muted">Shop</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
                </ol>
            </nav>
        </div>
      </div>

      <div className="container px-4 my-5">
        <div className="row gx-5">
          
          {/* 2. LEFT: IMAGE & GALLERY */}
          <div className="col-lg-7 mb-5 mb-lg-0">
            <div className="bg-white rounded-4 shadow-sm p-5 mb-4 text-center position-relative" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span className="badge bg-dark position-absolute top-0 start-0 m-4 px-3 py-2">NEW ARRIVAL</span>
               {product.images && product.images.length > 0 ? (
                 <img src={product.images[0]} alt={product.name} className="img-fluid" style={{maxHeight:'100%'}} />
               ) : (
                 <i className="fas fa-box fa-8x text-secondary opacity-25"></i>
               )}
            </div>
            
            {/* Features Grid */}
            <div className="row g-3">
                <div className="col-md-4">
                    <div className="p-3 bg-white rounded-3 shadow-sm text-center h-100">
                        <i className="fas fa-bolt text-warning mb-2 fs-4"></i>
                        <h6 className="fw-bold">Fast Setup</h6>
                        <p className="small text-muted mb-0">Up and running in minutes.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-3 bg-white rounded-3 shadow-sm text-center h-100">
                        <i className="fas fa-lock text-primary mb-2 fs-4"></i>
                        <h6 className="fw-bold">Secure</h6>
                        <p className="small text-muted mb-0">Enterprise-grade encryption.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-3 bg-white rounded-3 shadow-sm text-center h-100">
                        <i className="fas fa-sync text-success mb-2 fs-4"></i>
                        <h6 className="fw-bold">Updates</h6>
                        <p className="small text-muted mb-0">Lifetime free updates.</p>
                    </div>
                </div>
            </div>
          </div>

          {/* 3. RIGHT: DETAILS & BUY */}
          <div className="col-lg-5">
            <div className="ps-lg-4">
                <h6 className="text-uppercase text-muted fw-bold letter-spacing-1 mb-2">{product.type || 'Enterprise'}</h6>
                <h1 className="display-5 fw-bolder mb-3">{product.name}</h1>
                
                <div className="d-flex align-items-center mb-4">
                    <div className="text-warning small me-2">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star-half-alt"></i>
                    </div>
                    <span className="text-muted small">(4.8/5 Reviews)</span>
                </div>

                <div className="mb-4">
                    <h2 className="fw-bold text-primary display-6">${product.price.toFixed(2)}</h2>
                    <p className="text-muted small">Includes all taxes and fees.</p>
                </div>

                <p className="lead text-secondary mb-5" style={{ fontSize: '1.1rem' }}>
                    {product.description}
                </p>

                {/* CTA Card */}
                <div className="card border-0 shadow-sm bg-white rounded-4 p-4 mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="fw-bold">Quantity</span>
                        <div className="border rounded-pill px-3 py-1 bg-light">1</div>
                    </div>
                    <button className="btn btn-primary btn-lg w-100 rounded-pill fw-bold mb-3 shadow-sm">
                        Add to Cart &mdash; ${product.price.toFixed(2)}
                    </button>
                    <div className="text-center">
                        <small className="text-muted"><i className="fas fa-truck me-1"></i> Instant Digital Delivery</small>
                    </div>
                </div>

                <div className="border-top pt-4">
                    <p className="fw-bold mb-2">Description</p>
                    <p className="text-muted small mb-4">
                        This product is meticulously crafted to meet high standards of quality and performance. 
                        Compatible with all modern frameworks and backed by our dedicated support team.
                    </p>
                    
                    <p className="fw-bold mb-2">Specifications</p>
                    <ul className="list-unstyled text-muted small">
                        <li className="mb-1"><strong>SKU:</strong> {product.variants?.[0]?.sku || 'DEMO-123'}</li>
                        <li className="mb-1"><strong>License:</strong> Commercial Use</li>
                        <li className="mb-1"><strong>Version:</strong> v2.4.0 (Latest)</li>
                    </ul>
                </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}