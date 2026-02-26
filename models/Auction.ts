import mongoose, { Schema, model, models } from "mongoose";

export interface IAuction {
  _id: string;
  title: string;
  description: string;
  currentBid: number;
  image: string;
  endTime: string;
  status: string;
}


const AuctionSchema = new Schema({
  title: { 
    type: String, 
    required: [true, "Ürün başliği zorunludur"] 
  },
  description: { 
    type: String, 
    required: [true, "Açiklama zorunludur"] 
  },
  startPrice: { 
    type: Number, 
    required: true 
  },
  currentBid: { 
    type: Number, 
    default: 0 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  image: { 
    type: String, 
    default: "https://via.placeholder.com/400" 
  },
  status: { 
    type: String, 
    enum: ["active", "closed"], 
    default: "active" 
  },
  bids: [
    {
      bidder: { type: String, default: "Anonim" },
      amount: { type: Number },
      time: { type: Date, default: Date.now }
    }
  ]
}, { 
  timestamps: true 
});

const Auction = models.Auction || model("Auction", AuctionSchema);

export default Auction;