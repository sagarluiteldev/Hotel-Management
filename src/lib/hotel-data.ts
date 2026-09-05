// Hotel Management System (HMS) Data Models & Assets

export type Room = {
  title: string;
  tags: string[];
  progress: number;
  icon: "layout" | "code" | "pen" | "book";
  accent: "teal" | "indigo" | "emerald" | "purple";
  time: string;
};

// Aliases for compatibility
export type Course = Room;
export type RoomItem = Room;

export type StaffMember = {
  name: string;
  title: string;
  rating: number;
  bio: string;
  nextSession: string;
  avatar: string;
  specialty: string;
};

// Aliases for compatibility
export type Teacher = StaffMember;
export type StaffLead = StaffMember;

export type WorkOrder = {
  id: string;
  title: string;
  course: string; // Suite name
  status: "todo" | "progress" | "submitted";
  priority: "Low" | "Medium" | "High";
  due: string;
  deadline: string;
};

// Aliases for compatibility
export type TaskItem = WorkOrder;
export type WorkOrderItem = WorkOrder;

export type HotelResource = {
  title: string;
  course: string;
  type: string;
  slug: string;
};

export const avatarUrls = {
  brenda:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD-7sCh_RFsKgwGYV9GaVEewjNipywpXvVSxYPec-eXyyDm85Bm_YNRUtILQgniD3DE7XiQiSMRFX-IdZE82ABRhOuYWmQ-FfjvEdmfzhom6Yk42BSVLlg0KO-CwKMiN7j8AUM6QsbxHF63k7Yv09CLsQPr84F9Dc4H-zwOiOH_u7WOKCXjZxNIQCVMV0XrmKnWkZ5m7NqVAIIrtLEi7nWlmTN849KAk8k5ffpLDGhe281RhfBChxvukWZvT3EGlfEAPO1Z25nYcg",
  arlene:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDBBaD4iTt_jXTZkIf6qTCKoWpseAbYOLZVgm08xmjMkaqSf1TpUP5U41sZ0427RbYsO0KlJ3H4vZi-iO8_9bJUUE99JO6UCvep44ZqDNCdzpLwpvn21ZFo4ApJxQmBK5dqJtSr34HtWm8NZABkyJP47C0gtJA0wlnUlRkrxmHJPyKsVAmdpU6U9y4bRssf0klQfMu5waYzfjHPbL-4UcnEx8Qqt7-tUmj_0ZPGFTuBPxWVMxt9oSYKbZyVe2ZDBHL6d3szPDNQLg",
  jerome:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAN4B_Uyjty5M8w0ETi8jDMul3U6YvajYj1rLQOn7HmumHocoIoOjDSpQ0IFprt6R5RxRfsl6m_hR-YWM1u632lWQjUGB9aTGxp1_pYzNlNs-0z1fXgpRnhAuS28abo_jG5p8Y5tUTOgm-o5B97vDXcYW0TQWA0jD-EgQAeRw5wl1MBGHN-lLLAFJZ0LG2f02i7PXy8Vm5wLR8-Ruffy5aC98m9qkZVAcNgVER2ZCwU9fGOJaFruM7SxNGIPa_u8GsAXU593RDflA",
  annette:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBZmxYYFE_DXP8Liq90M8QPmj5CAKin-RwERXljK_9XwNHoF-y6KEru-b0cnskIZKJ92-qQ1KOCAizgq3EU60u4Eo5NbIyW0vyE6OTCrPhqHIqhlzGQoZ56h4qZP-YD_oe617FSo13s7qgf94sC7Zw1SRwMdddEf2MqcVwrAHcm8ZlmFHaBNoQgC6KPLwDAL3wXvQc8ru5zGJbJ4fS8WfnmhzTELBbYCjicawB2x-CUUiLWgq-5ebcjuSQE83a53lDS68EC-bT41A",
  blenda:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBw4voESf-_e8YFAm4YD3D49Zghu-PukJ4nhlTa5yNa3WbzhWKhsBeRJEp9MaDxhcqm6IIuxldavWT2hsr4XmpmmN7A4bkrPslB3q9mQImONFjFXC_uhRkTURBt-WqEW7k90DLW1ODPuAh6u9yjUa0USO7XHvi-VqTZt3UJcHGpU2Qu6Fqqwn1pSIMsXwmffwJR-KPAl0vBrzC25-gYXaR5ph-v6EbK0R3RLnkgScDw4RCYlxwbsJtRUEA_CXzIzIM6-o8MjtErrg"
};

export const rooms: Room[] = [
  {
    title: "Presidential Penthouse 401",
    tags: ["Penthouse", "Ocean View", "Private Terrace"],
    progress: 100,
    icon: "layout",
    accent: "teal",
    time: "$650/night"
  },
  {
    title: "Deluxe Ocean Suite 204",
    tags: ["Deluxe Suite", "King Bed", "Jacuzzi"],
    progress: 85,
    icon: "code",
    accent: "indigo",
    time: "$380/night"
  },
  {
    title: "Royal Garden Villa 305",
    tags: ["Private Villa", "Garden", "Butler Service"],
    progress: 65,
    icon: "pen",
    accent: "emerald",
    time: "$490/night"
  },
  {
    title: "Executive City King 102",
    tags: ["Executive", "High Floor", "Work Lounge"],
    progress: 90,
    icon: "book",
    accent: "purple",
    time: "$260/night"
  }
];

export const courses = rooms;

export const staff: StaffMember[] = [
  {
    name: "Elena Vance",
    title: "Chief Concierge & Guest Experience",
    rating: 4.9,
    bio: "Coordinates high-touch VIP guest arrivals, curated city excursions, and private luxury bookings with white-glove service.",
    nextSession: "On Duty, Lobby",
    avatar: avatarUrls.arlene,
    specialty: "Guest Experience"
  },
  {
    name: "Marcus Chen",
    title: "Executive Housekeeper",
    rating: 4.9,
    bio: "Oversees 5-star sanitization standards, turn-down service inspections, and rapid suite turnover routines across all floors.",
    nextSession: "Floor 4 Inspection",
    avatar: avatarUrls.jerome,
    specialty: "Housekeeping"
  },
  {
    name: "Sofia Rodriguez",
    title: "Front Office Duty Manager",
    rating: 4.8,
    bio: "Directs reservation check-ins, express key distribution, guest billing, and escalations for uninterrupted hospitality.",
    nextSession: "Front Desk Briefing",
    avatar: avatarUrls.annette,
    specialty: "Front Desk"
  },
  {
    name: "David Kim",
    title: "Facilities & Engineering Lead",
    rating: 4.8,
    bio: "Supervises HVAC climate balance, central boilers, smart room lighting automation, and 24/7 rapid emergency repair response.",
    nextSession: "Plant Audit 10:00 AM",
    avatar: avatarUrls.blenda,
    specialty: "Facilities & Maint"
  }
];

export const teachers = staff;

export const messages = [
  { name: "Elena Vance", status: "Front Desk (Online)", avatar: avatarUrls.arlene, color: "bg-green-500" },
  { name: "Marcus Chen", status: "Housekeeping (Floor 4)", avatar: avatarUrls.jerome, color: "bg-green-500" },
  { name: "Sofia Rodriguez", status: "Front Office Manager", avatar: avatarUrls.annette, color: "bg-gray-400" },
  { name: "David Kim", status: "Engineering (On Duty)", avatar: avatarUrls.blenda, color: "bg-green-500" }
];

export const workOrders: WorkOrder[] = [
  {
    id: "task-1",
    title: "VIP Penthouse 401 Welcome & Champagne Setup",
    course: "Presidential Penthouse 401",
    status: "todo",
    priority: "High",
    due: "Today, 2:00 PM",
    deadline: "2 hours left"
  },
  {
    id: "task-2",
    title: "Suite 204 AC Filter Check & Thermostat Calibration",
    course: "Deluxe Ocean Suite 204",
    status: "progress",
    priority: "High",
    due: "Today, 4:00 PM",
    deadline: "In Progress"
  },
  {
    id: "task-3",
    title: "Restock Premium Wine Cellar in Garden Villa 305",
    course: "Royal Garden Villa 305",
    status: "submitted",
    priority: "Medium",
    due: "Today, 11:00 AM",
    deadline: "Completed"
  },
  {
    id: "task-4",
    title: "Inspect Poolside Cabanas & Replenish Luxury Towels",
    course: "Executive City King 102",
    status: "todo",
    priority: "Low",
    due: "Tomorrow, 9:00 AM",
    deadline: "Scheduled"
  }
];

export const initialTasks = workOrders;

export const resources: HotelResource[] = [
  {
    title: "Front Desk Check-in & VIP Arrival SOP",
    course: "Presidential Penthouse 401",
    type: "PDF",
    slug: "front-desk-checkin-sop"
  },
  {
    title: "Housekeeping 50-Point Room Sanitization Protocol",
    course: "Deluxe Ocean Suite 204",
    type: "DOC",
    slug: "housekeeping-sanitization-protocol"
  },
  {
    title: "Property Amenities Map & Emergency Evacuation Plan",
    course: "Royal Garden Villa 305",
    type: "ZIP",
    slug: "property-amenities-safety-map"
  }
];
