"use client"; // Bu bir etkileşimli (Client) bileşen

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BidBox({ productId, currentBid }: { productId: string, currentBid: number }) {
  const [bid, setBid] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBid = async () => {
    // Boş girilirse veya düşük teklif verilirse uyar
    if (!bid || Number(bid) <= currentBid) {
      alert("Lütfen şu anki tekliften daha yüksek bir tutar girin!");
      return;
    }

    setLoading(true);

    // API'ye yeni fiyatı gönder
    const res = await fetch(`/api/auctions/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newBid: Number(bid) })
    });

    if (res.ok) {
      alert("🎉 Tebrikler! Yeni teklifiniz kabul edildi.");
      setBid(""); // Kutucuğu temizle
      router.refresh(); // Sayfayı yenilemeden güncel fiyatı ekrana yansıt!
    } else {
      const data = await res.json();
      alert(data.error || "Bir hata oluştu.");
    }
    
    setLoading(false);
  };

  return (
    <div className="flex gap-3">
      <input 
        type="number" 
        value={bid}
        onChange={(e) => setBid(e.target.value)}
        placeholder={`Min: ${currentBid + 10} ₺`} 
        className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-lg font-bold text-black bg-white"
      />
      <button 
        onClick={handleBid}
        disabled={loading}
        className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
      >
        {loading ? "İşleniyor..." : "Teklif Ver"}
      </button>
    </div>
  );
}