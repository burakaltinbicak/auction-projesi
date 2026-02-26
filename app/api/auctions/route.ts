import dbConnect from "@/lib/db";
import Auction from "@/models/Auction";
import { NextResponse } from "next/server";

// POST: Dışarıdan gelen veriyi veritabanına kaydetme komutu
export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Formdan gelen bilgileri JSON olarak oku
    const body = await request.json(); 
    
    // MongoDB'ye kaydet
    const yeniUrun = await Auction.create(body);
    
    return NextResponse.json({ basari: true, urun: yeniUrun }, { status: 201 });
  } catch (error) {
    console.error("Ekleme hatası:", error);
    return NextResponse.json({ basari: false, hata: "Ürün eklenirken bir sorun oluştu." }, { status: 500 });
  }
}