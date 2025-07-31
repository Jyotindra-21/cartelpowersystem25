export interface BaseType {
  _id?: string;
}

export interface IUserGrowthData {
  name: string;
  user: number;
}
export interface IProductGrowthData {
  name: string;
  product: number;
}
export interface IMetrics {
  title: string;
  value: string;
  change: string;
  icon: string;
  trend: "up" | "down";
  gradientColor: string;
  textColor: string;
  href: string;
}
export interface IStatusDataItem {
  name: string;
  value: number;
  percentage?: number;
}

export interface ITeamMembers {
  name: string;
  position: string;
  image: string;
}
export interface DashboardDataType {
  metrics: IMetrics[];
  userGrowthData: IUserGrowthData[];
  productGrowthData: IProductGrowthData[];
  contactStatusData: IStatusDataItem[];
  teamMembers: ITeamMembers[];
}

// Visitor Type
export interface IVisitor {
  _id: string;
  visitorId: string;
  createdAt: string;
  device: {
    browser: {
      name: string;
      version: string;
    };
    os: {
      name: string;
      version: string;
    };
    isBot: boolean;
    type: string;
  };
  firstVisit: string;
  ipAddress: string;
  lastVisit: string;
  location: {
    ll: [number | null, number | null];
  };
  referrer: string;
  sessions: Array<{
    sessionId: string;
    startTime: string;
    pages: Array<{
      url: string;
      timestamp: string;
      _id: string;
    }>;
    _id: string;
  }>;
  updatedAt: string;
  userAgent: string;
  visitCount: number;
}

export interface IVisitorList {
  _id: string;
  visitorId: string;
  device: string;
  isBot: boolean;
  deviceType: "desktop" | "mobile" | "tablet" | "bot" | string;
  sessionDuration: string;
  location: {
    ll: [number | null, number | null] | [];
  };
  pagesLength: number;
  visitCount: number;
}
