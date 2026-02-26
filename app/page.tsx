import dbConnect from "@/lib/db";
import Auction from "@/models/Auction";
import Link from "next/link";

async function getAuctions() {
  await dbConnect();
  const data = await Auction.find({ status: "active" })
    .sort({ createdAt: -1 })
    .lean();
  
  return data.map((doc: any) => ({
    ...doc,
    _id: doc._id.toString(),
    endTime: doc.endTime.toISOString(), 
  }));
}

export default async function Home() {
  const auctions = await getAuctions();
  const simdi = new Date();

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-3">
            Canlı <span className="text-amber-500">Müzayede</span>
          </h1>
          <p className="text-gray-500 font-medium">Nadir parçalar, gerçek koleksiyonerler için.</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {auctions.map((item: any) => {
            const sureDoldu = new Date(item.endTime) < simdi;

            return (
              <div key={item._id} className="auction-card bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm flex flex-col h-full">
                
                {/* Ürün Görseli */}
                <div className="h-72 p-3">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover rounded-[2rem]"
                  />
                </div>

                {/* Ürün Bilgileri */}
                <div className="p-8 pt-2 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-1">{item.title}</h2>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Kartın Alt Bölümü: Tam Senin Çizdiğin Gibi */}
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-end justify-between">
                    
                    {/* Sol Alt: Son Teklif Tarihi */}
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-amber-600 mb-1.5">Son Tarih</p>
                      <p className="text-[15px] font-bold text-gray-900">
                        {new Date(item.endTime).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Sağ Alt: Fiyat ve Buton */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400 mb-1">Mevcut Teklif</p>
                        <p className="text-3xl font-black text-amber-500 leading-none tracking-tighter">
                          {item.currentBid} <span className="text-sm ml-0.5">₺</span>
                        </p>
                      </div>
                      
                      {!sureDoldu ? (
                        <Link href={`/auction/${item._id}`} className="bg-gray-900 text-white px-7 py-3 rounded-2xl text-xs font-bold hover:bg-amber-500 transition-all duration-300 shadow-lg hover:shadow-amber-200">
                          Teklifi İncele
                        </Link>
                      ) : (
                        <span className="bg-gray-50 text-gray-300 px-7 py-3 rounded-2xl text-xs font-bold border border-gray-100 cursor-not-allowed">
                          KAPANDI
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}