import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

config({ path: ".env.local" });
config({ path: ".env" });
config();

const prisma = new PrismaClient();

const avatarUrls = {
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

async function main() {
  console.log("Seeding Hotel Management System database: Grand Haven Hotel & Suites...");

  // 1. Seed Demo Manager User (Brenda Clarence) & Sagar Luitel (Operations Director)
  const passwordHash = await bcrypt.hash("learnpro", 12);
  const user = await prisma.user.upsert({
    where: { email: "brenda@example.com" },
    update: {
      passwordHash,
      name: "Brenda Clarence",
      avatarUrl: avatarUrls.brenda,
      bio: "Senior Hotel Operations Manager supervising luxury front-of-house, reservations, and 5-star guest services.",
      phone: "+1 415 010 2026",
      role: "MANAGER",
      membership: "PRO"
    },
    create: {
      name: "Brenda Clarence",
      email: "brenda@example.com",
      passwordHash,
      role: "MANAGER",
      membership: "PRO",
      avatarUrl: avatarUrls.brenda,
      bio: "Senior Hotel Operations Manager supervising luxury front-of-house, reservations, and 5-star guest services.",
      phone: "+1 415 010 2026"
    }
  });
  console.log(`✓ Manager seeded: ${user.name} (${user.email})`);

  // Update Sagar Luitel if already registered
  const sagar = await prisma.user.findUnique({ where: { email: "dragonm0901@gmail.com" } });
  if (sagar) {
    await prisma.user.update({
      where: { id: sagar.id },
      data: {
        bio: "Director of Hotel Operations & Asset Management at Grand Haven Hotel & Suites.",
        role: "ADMIN",
        membership: "PRO"
      }
    });
    console.log(`✓ Sagar Luitel bio updated to Hotel Operations Director`);
  }

  // Target users to seed records for
  const targetUsers = [user];
  if (sagar) targetUsers.push(sagar);

  // 2. Seed Hotel Department Staff Leads
  const staffData = [
    {
      name: "Elena Vance",
      title: "Chief Concierge & Guest Experience",
      department: "Concierge",
      rating: 4.9,
      bio: "Coordinates high-touch VIP guest arrivals, curated city excursions, and private luxury bookings with white-glove service.",
      nextShift: "On Duty, Lobby",
      shiftStatus: "ON_DUTY",
      avatarUrl: avatarUrls.arlene,
      specialty: "Guest Experience",
      phone: "+1 415 555 0101",
      email: "elena.vance@grandhaven.test"
    },
    {
      name: "Marcus Chen",
      title: "Executive Housekeeper",
      department: "Housekeeping",
      rating: 4.9,
      bio: "Oversees 5-star sanitization standards, turn-down service inspections, and rapid suite turnover routines across all floors.",
      nextShift: "Floor 4 Inspection",
      shiftStatus: "ON_DUTY",
      avatarUrl: avatarUrls.jerome,
      specialty: "Housekeeping",
      phone: "+1 415 555 0102",
      email: "marcus.chen@grandhaven.test"
    },
    {
      name: "Sofia Rodriguez",
      title: "Front Office Duty Manager",
      department: "Front Office",
      rating: 4.8,
      bio: "Directs reservation check-ins, express key distribution, guest billing, and escalations for uninterrupted hospitality.",
      nextShift: "Front Desk Briefing",
      shiftStatus: "ON_DUTY",
      avatarUrl: avatarUrls.annette,
      specialty: "Front Desk",
      phone: "+1 415 555 0103",
      email: "sofia.rodriguez@grandhaven.test"
    },
    {
      name: "David Kim",
      title: "Facilities & Engineering Lead",
      department: "Engineering",
      rating: 4.8,
      bio: "Supervises HVAC climate balance, central boilers, smart room lighting automation, and 24/7 rapid emergency repair response.",
      nextShift: "Plant Audit 10:00 AM",
      shiftStatus: "ON_DUTY",
      avatarUrl: avatarUrls.blenda,
      specialty: "Facilities & Maint",
      phone: "+1 415 555 0104",
      email: "david.kim@grandhaven.test"
    }
  ];

  await prisma.staff.deleteMany();
  for (const s of staffData) {
    await prisma.staff.create({ data: s });
  }
  console.log(`✓ ${staffData.length} Hotel Staff Leads seeded`);

  // 3. Seed Rooms & Suites
  const roomData = [
    {
      title: "Presidential Penthouse 401",
      roomNumber: "401",
      category: "Penthouse",
      tags: ["Penthouse", "Ocean View", "Private Terrace"],
      progress: 100,
      accent: "teal",
      icon: "layout",
      pricePerNight: "$650/night",
      status: "OCCUPIED",
      description: "Top-floor luxury penthouse with panoramic ocean vistas, private infinity spa, and 24/7 dedicated butler service."
    },
    {
      title: "Deluxe Ocean Suite 204",
      roomNumber: "204",
      category: "Suite",
      tags: ["Deluxe Suite", "King Bed", "Jacuzzi"],
      progress: 85,
      accent: "indigo",
      icon: "code",
      pricePerNight: "$380/night",
      status: "OCCUPIED",
      description: "Spacious coastal suite featuring a deep soaking marble tub, sunset terrace, and premium espresso bar."
    },
    {
      title: "Royal Garden Villa 305",
      roomNumber: "305",
      category: "Villa",
      tags: ["Private Villa", "Garden", "Butler Service"],
      progress: 65,
      accent: "emerald",
      icon: "pen",
      pricePerNight: "$490/night",
      status: "AVAILABLE",
      description: "Secluded tropical sanctuary with private courtyard garden, outdoor rain shower, and evening cocktail service."
    },
    {
      title: "Executive City King 102",
      roomNumber: "102",
      category: "Executive",
      tags: ["Executive", "High Floor", "Work Lounge"],
      progress: 90,
      accent: "purple",
      icon: "book",
      pricePerNight: "$260/night",
      status: "CLEANING",
      description: "Ergonomically designed for executive guests with acoustic soundproofing, ergonomic workspace, and Club Lounge privileges."
    }
  ];

  await prisma.workOrder.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.room.deleteMany();

  const createdRooms = [];
  for (const r of roomData) {
    const room = await prisma.room.create({ data: r });
    createdRooms.push(room);
  }
  console.log(`✓ ${createdRooms.length} Hotel Suites & Rooms seeded`);

  // 4. Seed Hotel Work Orders
  const workOrderData = [
    {
      title: "VIP Penthouse 401 Welcome & Champagne Setup",
      roomId: createdRooms[0]?.id,
      status: "TODO",
      priority: "HIGH",
      dueAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
    },
    {
      title: "Suite 204 AC Filter Check & Thermostat Calibration",
      roomId: createdRooms[1]?.id,
      status: "IN_PROGRESS",
      priority: "HIGH",
      dueAt: new Date(Date.now() + 4 * 60 * 60 * 1000)
    },
    {
      title: "Restock Premium Wine Cellar in Garden Villa 305",
      roomId: createdRooms[2]?.id,
      status: "SUBMITTED",
      priority: "MEDIUM",
      dueAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      title: "Inspect Poolside Cabanas & Replenish Luxury Towels",
      roomId: createdRooms[3]?.id,
      status: "TODO",
      priority: "LOW",
      dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  ];

  for (const u of targetUsers) {
    for (const wo of workOrderData) {
      await prisma.workOrder.create({
        data: {
          ...wo,
          userId: u.id
        }
      });
    }
  }
  console.log(`✓ Work orders & operational tasks seeded`);

  // 5. Seed Hotel SOP & Policy Resources
  const resourceData = [
    {
      title: "Front Desk Check-in & VIP Arrival SOP",
      fileName: "front-desk-checkin-sop.pdf",
      slug: "front-desk-checkin-sop",
      type: "PDF",
      roomId: createdRooms[0]?.id
    },
    {
      title: "Housekeeping 50-Point Room Sanitization Protocol",
      fileName: "housekeeping-sanitization-protocol.docx",
      slug: "housekeeping-sanitization-protocol",
      type: "DOC",
      roomId: createdRooms[1]?.id
    },
    {
      title: "Property Amenities Map & Emergency Evacuation Plan",
      fileName: "property-amenities-safety-map.zip",
      slug: "property-amenities-safety-map",
      type: "ZIP",
      roomId: createdRooms[2]?.id
    }
  ];

  for (const res of resourceData) {
    await prisma.resource.create({ data: res });
  }
  console.log(`✓ ${resourceData.length} Hotel SOP Resources seeded`);

  // 6. Seed Weekly Occupancy Logs
  const occupancyLogs = [
    { day: "Mon", hours: 72 },
    { day: "Tue", hours: 81 },
    { day: "Wed", hours: 86 },
    { day: "Thu", hours: 92 },
    { day: "Fri", hours: 97 },
    { day: "Sat", hours: 98 },
    { day: "Sun", hours: 64 }
  ];

  await prisma.occupancyLog.deleteMany();
  for (const u of targetUsers) {
    for (const l of occupancyLogs) {
      await prisma.occupancyLog.create({
        data: {
          userId: u.id,
          hours: l.hours,
          dayLabel: l.day
        }
      });
    }
  }
  console.log(`✓ Weekly Occupancy Logs seeded`);

  // 7. Seed Sample Reservations
  const sampleReservations = [
    {
      guestName: "Ambassador Henrik Lindqvist",
      guestEmail: "henrik.lindqvist@embassy.gov",
      roomId: createdRooms[0]?.id,
      userId: user.id,
      status: "CONFIRMED",
      checkIn: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      checkOut: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    {
      guestName: "Dr. Evelyn Reed",
      guestEmail: "evelyn.reed@biotech.org",
      roomId: createdRooms[1]?.id,
      userId: user.id,
      status: "CHECKED_IN",
      checkIn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    }
  ];

  for (const res of sampleReservations) {
    await prisma.reservation.create({ data: res });
  }
  console.log(`✓ Sample reservations seeded`);

  console.log("Hotel Management System database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
