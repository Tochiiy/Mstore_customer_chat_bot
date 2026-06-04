import { useEffect, useState } from "react";
import { MainLayout } from "./components/layout/MainLayout";
import { ChatBot } from "./components/chat/ChatBot";
import { shopApi } from "./services/api";
import type { Product } from "./types";
import { Heart } from "lucide-react";
import { getOnlineImage } from "./utils/imageMapper"; 

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [selectedColor, setSelectedColor] = useState<string>("All");

  useEffect(() => {
    shopApi.getProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  const brands = ["All", ...Array.from(new Set(products.map(p => p.brand)))].filter(Boolean) as string[];
  const genders = ["All", ...Array.from(new Set(products.map(p => p.gender)))].filter(Boolean) as string[];
  const colors = ["All", ...Array.from(new Set(products.map(p => p.color)))].filter(Boolean) as string[];


  const filteredProducts = products.filter(product => {
    const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;
    const matchesGender = selectedGender === "All" || product.gender === selectedGender;
    const matchesColor = selectedColor === "All" || product.color === selectedColor;
    return matchesBrand && matchesGender && matchesColor;
  });

  const sidebarFilters = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h2 className="font-semibold text-lg text-slate-900">Filter</h2>
        <button 
          onClick={() => {
            setSelectedBrand("All");
            setSelectedGender("All");
            setSelectedColor("All");
          }}
          className="text-sm text-cyan-500 font-medium hover:text-cyan-600 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
          <select 
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-50 outline-none cursor-pointer"
          >
            {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
          <select 
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-50 outline-none cursor-pointer"
          >
            {genders.map(gender => <option key={gender} value={gender}>{gender}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
          <select 
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-slate-50 outline-none cursor-pointer"
          >
            {colors.map(color => <option key={color} value={color}>{color}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MainLayout sidebarContent={sidebarFilters}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="font-semibold text-lg text-slate-900">
            {filteredProducts.length} <span className="text-slate-500 font-normal">results found</span>
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">Loading inventory...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500">No products found matching these filters.</div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative aspect-4/5 bg-[#F1F3F5] rounded-2xl mb-4 overflow-hidden">
                    <img 
                      src={getOnlineImage(product.brand, product.color, product.id)} 
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  
                  <div className="space-y-1 relative">
                    <div className="flex justify-between items-start">
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{product.brand}</p>
                      <button className="text-slate-300 hover:text-red-500 transition-colors">
                        <Heart size={18} />
                      </button>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{product.name}</h3>
                    <p className="text-sm font-bold text-cyan-500">${product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </MainLayout>
      <ChatBot />
    </>
  );
}

export default App;