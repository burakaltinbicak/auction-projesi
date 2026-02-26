import dbConnect from "@/lib/db";
import Auction from "@/models/Auction";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    // URL'den ID'yi ve formdan gelen yeni fiyatı al
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const { newBid } = await request.json();

    // Veritabanında ürünü bul
    const auction = await Auction.findById(id);
    if (!auction) {
      return NextResponse.json({ error: "Ürün bulunamadi" }, { status: 404 });
    }

    // Yeni teklif eskisinden büyük mü diye kontrol et
    if (newBid <= auction.currentBid) {
      return NextResponse.json({ error: "Teklifiniz şu anki fiyattan yüksek olmali!" }, { status: 400 });
    }

    // Mevcut kontrollerin (newBid <= auction.currentBid) yanına ekle:

const simdi = new Date();
if (simdi > new Date(auction.endTime)) {
  return NextResponse.json({ error: "Bu açik artirmanin süresi dolmuştur!" }, { status: 400 });
}

    // Fiyatı güncelle ve kaydet
    auction.currentBid = newBid;
    // Teklifi geçmişe ekle
auction.bids.push({ amount: newBid, time: new Date() });
auction.currentBid = newBid;
await auction.save();
    await auction.save();

    return NextResponse.json({ success: true, newBid });
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}