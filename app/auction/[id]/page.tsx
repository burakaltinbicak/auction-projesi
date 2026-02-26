import dbConnect from "@/lib/db";
import Auction from "@/models/Auction";
import BidBox from "@/components/BidBox";
import { notFound } from "next/navigation";

// 1. Veri Çekme Fonksiyonu
async function getAuction(id: string) {
  await dbConnect();
  // MongoDB'den id ile ürünü buluyoruz
  const data = await Auction.findById(id).lean();
  if (!data) return null;

  // Veriyi Next.js bileşenlerinin anlayacağı temiz JSON formatına çeviriyoruz
  return {
    ...data,
    _id: (data._id as any).toString(),
    endTime: (data.endTime as any).toISOString(),
    bids: (data as any).bids.map((b: any) => ({
      ...b,
      _id: b._id.toString(),
      time: b.time.toISOString(),
    })),
  };
}

// 2. Sayfa Arayüzü (Next.js 15 Standartlarına Uygun)
// params artık bir Promise olduğu için tipini ona göre güncelledik
export default async function AuctionPage({ params }: { params: Promise<{ id: string }> }) {
  
  // ÖNEMLİ: Next.js 15'te params'ı kullanmadan önce await ile beklemeliyiz
  const { id } = await params;
  
  // Bekleyip aldığımız id ile ürünü çekiyoruz
  const item = await getAuction(id);

  // Eğer ürün veritabanında yoksa 404 sayfasına gönder
  if (!item) notFound();

  const sureDoldu = new Date(item.endTime) < new Date();

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[#f8f9fa]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* SOL TARAF: Görsel Bölümü */}
        <div className="relative h-[400px] md:h-[600px]">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover rounded-[3rem] shadow-2xl border-4 border-white"
          />
        </div>

        {/* SAĞ TARAF: Bilgi ve Teklif Bölümü */}
        <div className="flex flex-col">
          <header className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-2">{item.title}</h1>
            <p className="text-gray-500 leading-relaxed italic">"{item.description}"</p>
          </header>

          {/* FİYAT KUTUSU */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-amber-600 mb-1.5">Güncel Teklif</p>
              <p className="text-5xl font-black text-gray-900">{item.currentBid} <span className="text-2xl text-amber-500 font-normal">₺</span></p>
            </div>
            <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1.5">Bitiş Tarihi</p>
                <p className="font-bold text-gray-800">
                  {new Date(item.endTime).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
            </div>
          </div>

          {/* TEKLİF VERME ALANI */}
          {!sureDoldu ? (
            <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-xl text-white mb-8">
               <BidBox productId={item._id} currentBid={item.currentBid} />
            </div>
          ) : (
            <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-[2.5rem] font-black text-center mb-8 uppercase tracking-widest">
              Müzayede Sona Erdi
            </div>
          )}

          {/* TEKLİF GEÇMİŞİ */}
          <div className="flex-grow bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 px-2">Teklif Geçmişi</h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar px-2">
              {(item.bids as any).length > 0 ? (
                [...(item.bids as any)].reverse().map((bid: any) => (
                  <div key={bid._id} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-2xl hover:bg-amber-50 transition-colors">
                    <span className="font-bold text-gray-700 text-sm">Koleksiyoner</span>
                    <span className="text-amber-600 font-black">{bid.amount} ₺</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic text-center py-4">Henüz bir teklif gelmedi. İlk sen ver!</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}