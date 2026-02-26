"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAuction() {
  const router = useRouter();
  const [yukleniyor, setYukleniyor] = useState(false);
  const [secilenResim, setSecilenResim] = useState<string | null>(null);

  const handleResimSecimi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSecilenResim(reader.result as string); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setYukleniyor(true);

    const formData = new FormData(e.currentTarget);
    const yeniUrun = {
      title: formData.get("title"),
      description: formData.get("description"),
      startPrice: Number(formData.get("startPrice")),
      currentBid: Number(formData.get("startPrice")),
      endTime: formData.get("endTime"),
      image: secilenResim || "/saat.jpg", 
      status: "active"
    };

    const res = await fetch("/api/auctions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(yeniUrun),
    });

    if (res.ok) {
      alert("🎉 Ürün başarıyla eklendi!");
      router.push("/");
      router.refresh();
    } else {
      alert("Bir hata oluştu, lütfen tekrar dene.");
    }
    
    setYukleniyor(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-black">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900">Yeni İlan Ver</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ürün Adı</label>
            {/* text-black ve bg-white*/}
            <input type="text" name="title" required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-black bg-white placeholder-gray-400" placeholder="Örn: 1960 Model Daktilo" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Açıklama</label>
            {/* text-black ve bg-white*/}
            <textarea name="description" required rows={3} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-black bg-white placeholder-gray-400" placeholder="Ürünün durumu, tarihi vb. detaylar..."></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Başlangıç Fiyatı (₺)</label>
              {/* text-black ve bg-white*/}
              <input type="number" name="startPrice" required min="1" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-black bg-white placeholder-gray-400" placeholder="1000" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bitiş Tarihi</label>
              {/* text-black ve bg-white*/}
              <input type="datetime-local" name="endTime" required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-black bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ürün Görseli Yükle</label>
            {/* text-black*/}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleResimSecimi} 
              className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none text-black bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer" 
            />
            
            {secilenResim && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Seçilen Görsel Önizleme:</p>
                <img src={secilenResim} alt="Önizleme" className="h-32 w-auto object-cover rounded-lg border shadow-sm" />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={yukleniyor}
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all disabled:bg-gray-400 mt-4"
          >
            {yukleniyor ? "Veritabanına İşleniyor..." : "Açık Artırmayı Başlat"}
          </button>
        </form>
      </div>
    </main>
  );
}