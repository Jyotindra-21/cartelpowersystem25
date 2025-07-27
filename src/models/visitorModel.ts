import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisitorSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  pages: {
    url: string;
    title?: string;
    timestamp: Date;
    duration?: number;
  }[];
}

export interface IVisitorDocument extends Document {
  visitorId: string;
  ipAddress: string;
  userAgent: string;
  firstVisit: Date;
  lastVisit: Date;
  visitCount: number;
  sessions: IVisitorSession[];
  referrer?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
    ll?: [number, number]; // latitude/longitude
  };
  device?: {
    type?: string;
    browser?: {
      name?: string;
      version?: string;
    };
    os?: {
      name?: string;
      version?: string;
    };
    isBot?: boolean;
  };
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const sessionSchema = new Schema({
  sessionId: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number },
  pages: [
    {
      url: { type: String, required: true },
      title: { type: String },
      timestamp: { type: Date, default: Date.now },
      duration: { type: Number },
    },
  ],
});

const VisitorSchema: Schema = new Schema(
  {
    visitorId: { type: String, required: true, unique: true, index: true },
    ipAddress: { type: String, required: true, index: true },
    userAgent: { type: String, required: true },
    firstVisit: { type: Date, default: Date.now, index: true },
    lastVisit: { type: Date, default: Date.now, index: true },
    visitCount: { type: Number, default: 1 },
    sessions: [sessionSchema],
    referrer: { type: String },
    location: {
      country: { type: String },
      region: { type: String },
      city: { type: String },
      timezone: { type: String },
      ll: { type: [Number] }, // [longitude, latitude]
    },
    device: {
      type: {
        type: String,
        enum: ["desktop", "mobile", "tablet", "bot", "other"],
      },
      browser: {
        name: { type: String },
        version: { type: String },
      },
      os: {
        name: { type: String },
        version: { type: String },
      },
      isBot: { type: Boolean, default: false },
    },
    utm: {
      source: { type: String },
      medium: { type: String },
      campaign: { type: String },
      term: { type: String },
      content: { type: String },
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
VisitorSchema.index({ "device.type": 1 });
VisitorSchema.index({ "location.country": 1 });
VisitorSchema.index({ createdAt: 1 });

const VisitorModel: Model<IVisitorDocument> =
  mongoose.models.Visitor ||
  mongoose.model<IVisitorDocument>("Visitor", VisitorSchema);

export default VisitorModel;
