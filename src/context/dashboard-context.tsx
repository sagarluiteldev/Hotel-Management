"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  avatarUrls,
  rooms as initialCourses,
  workOrders as initialTasks,
  messages as initialMessages
} from "@/lib/hotel-data";
import type { Course, TaskItem, Teacher } from "@/lib/hotel-data";

export type ScheduleItem = {
  id: string;
  title: string;
  time: string;
  date: string; // YYYY-MM-DD
  progress: string;
  avatars: string[];
  course: string;
  color: "teal" | "indigo" | "blue" | "purple" | "emerald";
};

export type ChatMessage = {
  sender: "user" | "other";
  text: string;
  time: string;
};

export type UserProfile = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  membership?: string;
  avatarUrl?: string;
};

export function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

type DashboardContextType = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  coursesList: Course[];
  setCoursesList: React.Dispatch<React.SetStateAction<Course[]>>;
  tasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  schedules: ScheduleItem[];
  setSchedules: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  viewedDate: Date;
  setViewedDate: (date: Date) => void;
  learningHoursView: "weekly" | "monthly" | "daily";
  setLearningHoursView: (view: "weekly" | "monthly" | "daily") => void;
  learningHoursLogs: Record<string, number>;
  messagesList: typeof initialMessages;
  chatHistories: Record<string, ChatMessage[]>;
  activeChatContact: string | null;
  setActiveChatContact: (contact: string | null) => void;
  isTyping: boolean;
  query: string;
  setQuery: (q: string) => void;
  toast: string;
  showToast: (msg: string) => void;
  profileOpen: boolean;
  setProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showAddScheduleModal: boolean;
  setShowAddScheduleModal: (open: boolean) => void;
  showLogHoursModal: boolean;
  setShowLogHoursModal: (open: boolean) => void;
  bookingTeacher: Teacher | null;
  setBookingTeacher: (teacher: Teacher | null) => void;
  moveTask: (id: string, status: TaskItem["status"]) => Promise<void>;
  submitWork: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  saveSettings: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  signOut: () => Promise<void>;
  handleSendMessage: (text: string) => void;
  handleAddSchedule: (item: { title: string; time: string; date: string; course: string; color: ScheduleItem["color"] }) => void;
  handleLogHours: (hours: number, courseTitle: string) => Promise<void>;
  handleBook1on1: (booking: { teacher: Teacher; time: string; date: string; course: string }) => void;
  refreshDashboardData: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const today = useMemo(() => new Date(), []);

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  // Modals state
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showLogHoursModal, setShowLogHoursModal] = useState(false);
  const [bookingTeacher, setBookingTeacher] = useState<Teacher | null>(null);

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    bio: ""
  });

  const [coursesList, setCoursesList] = useState<Course[]>(initialCourses);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [messagesList] = useState(initialMessages);

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    const getOffsetDateStr = (offsetDays: number) => {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offsetDays);
      return formatDateKey(d);
    };

    return [
      {
        id: "sched-1",
        title: "VIP Penthouse 401 Check-In",
        time: "1pm - 2pm",
        date: getOffsetDateStr(-2),
        progress: "VIP Ready",
        avatars: [avatarUrls.annette, avatarUrls.jerome],
        course: "Presidential Penthouse 401",
        color: "teal"
      },
      {
        id: "sched-2",
        title: "Executive King 102 Turnover",
        time: "11am - 12pm",
        date: getOffsetDateStr(-1),
        progress: "Completed",
        avatars: [avatarUrls.arlene],
        course: "Executive City King 102",
        color: "purple"
      },
      {
        id: "sched-3",
        title: "Garden Villa 305 Butler Briefing",
        time: "12pm - 1pm",
        date: getOffsetDateStr(0),
        progress: "Assigned",
        avatars: [avatarUrls.jerome, avatarUrls.arlene],
        course: "Royal Garden Villa 305",
        color: "blue"
      },
      {
        id: "sched-4",
        title: "Front Desk Shift Handover",
        time: "3pm - 4pm",
        date: getOffsetDateStr(0),
        progress: "On Duty",
        avatars: [avatarUrls.brenda, avatarUrls.annette],
        course: "Front Desk Operations",
        color: "emerald"
      },
      {
        id: "sched-5",
        title: "Suite 204 Deep Turnover & Audit",
        time: "10am - 12pm",
        date: getOffsetDateStr(1),
        progress: "Scheduled",
        avatars: [avatarUrls.annette],
        course: "Deluxe Ocean Suite 204",
        color: "indigo"
      },
      {
        id: "sched-6",
        title: "Penthouse Evening Reception Setup",
        time: "2pm - 3pm",
        date: getOffsetDateStr(2),
        progress: "Confirmed",
        avatars: [avatarUrls.jerome],
        course: "Presidential Penthouse 401",
        color: "teal"
      },
      {
        id: "sched-7",
        title: "Central Chiller Plant Inspection",
        time: "10am - 12pm",
        date: getOffsetDateStr(3),
        progress: "Routine",
        avatars: [avatarUrls.blenda],
        course: "Facilities & Engineering",
        color: "indigo"
      }
    ];
  });

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [viewedDate, setViewedDate] = useState<Date>(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const [learningHoursView, setLearningHoursView] = useState<"weekly" | "monthly" | "daily">("weekly");
  const [learningHoursLogs, setLearningHoursLogs] = useState<Record<string, number>>({
    Mon: 72,
    Tue: 81,
    Wed: 86,
    Thu: 92,
    Fri: 97,
    Sat: 98,
    Sun: 64
  });

  const [activeChatContact, setActiveChatContact] = useState<string | null>(null);
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({
    "Elena Vance": [
      { sender: "other", text: "Good morning! The ambassador checking into Penthouse 401 requested late check-in at 2 PM.", time: "9:30 AM" },
      { sender: "user", text: "Understood Elena, housekeeping has already prioritized the suite inspection.", time: "9:45 AM" },
      { sender: "other", text: "Excellent, champagne and fruit arrangements are ready.", time: "9:46 AM" }
    ],
    "Marcus Chen": [
      { sender: "other", text: "Floor 4 turnover is 90% completed. We just need engineering to sign off Suite 204 AC.", time: "10:15 AM" }
    ]
  });
  const [isTyping, setIsTyping] = useState(false);

  // Restore client state from localStorage if available
  useEffect(() => {
    try {
      // Clear out legacy learning app caches completely
      localStorage.removeItem("learning_app_schedules");
      localStorage.removeItem("learning_app_tasks");
      localStorage.removeItem("learning_app_logs");

      const savedTheme = localStorage.getItem("hotel_hms_theme_v3") as "light" | "dark" | null;
      const savedTasks = localStorage.getItem("hotel_hms_tasks_v3");
      const savedSchedules = localStorage.getItem("hotel_hms_schedules_v3");
      const savedLogs = localStorage.getItem("hotel_hms_logs_v3");

      queueMicrotask(() => {
        if (savedTheme) setTheme(savedTheme);
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedSchedules) {
          const parsed = JSON.parse(savedSchedules);
          const sanitized = Array.isArray(parsed)
            ? parsed.filter((s: ScheduleItem) => {
                const text = `${s.title} ${s.course}`.toLowerCase();
                return (
                  !text.includes("ui design") &&
                  !text.includes("web development") &&
                  !text.includes("figma") &&
                  !text.includes("class") &&
                  !text.includes("study")
                );
              })
            : [];
          if (sanitized.length > 0) {
            setSchedules(sanitized);
          }
        }
        if (savedLogs) setLearningHoursLogs(JSON.parse(savedLogs));
      });
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save tasks and schedules to localStorage upon changes
  useEffect(() => {
    try {
      localStorage.setItem("hotel_hms_tasks_v3", JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem("hotel_hms_schedules_v3", JSON.stringify(schedules));
    } catch {}
  }, [schedules]);

  useEffect(() => {
    try {
      localStorage.setItem("hotel_hms_logs_v3", JSON.stringify(learningHoursLogs));
    } catch {}
  }, [learningHoursLogs]);

  useEffect(() => {
    try {
      localStorage.setItem("hotel_hms_theme_v3", theme);
    } catch {}
  }, [theme]);

  // Fetch initial data from API on mount and whenever navigating to protected pages
  useEffect(() => {
    if (pathname === "/signin" || pathname === "/signup") return;

    let isMounted = true;

    async function syncData() {
      try {
        const [profileRes, tasksRes, logsRes, coursesRes] = await Promise.allSettled([
          fetch("/api/profile"),
          fetch("/api/work-orders"),
          fetch("/api/occupancy"),
          fetch("/api/rooms")
        ]);

        if (!isMounted) return;

        if (profileRes.status === "fulfilled" && profileRes.value.ok) {
          const data = await profileRes.value.json();
          if (data.user && isMounted) {
            setCurrentUser((prev) => ({
              ...prev,
              ...data.user,
              name: data.user.name ?? "",
              email: data.user.email ?? "",
              phone: data.user.phone ?? "",
              bio: data.user.bio ?? ""
            }));
          }
        }

        if (tasksRes.status === "fulfilled" && tasksRes.value.ok && isMounted) {
          const data = await tasksRes.value.json();
          const list = data.workOrders || data.tasks;
          if (list && list.length > 0 && isMounted) {
            setTasks(list);
          }
        }

        if (logsRes.status === "fulfilled" && logsRes.value.ok && isMounted) {
          const data = await logsRes.value.json();
          if (data.logs && isMounted) {
            setLearningHoursLogs((prev) => ({ ...prev, ...data.logs }));
          }
        }

        if (coursesRes.status === "fulfilled" && coursesRes.value.ok && isMounted) {
          const data = await coursesRes.value.json();
          const list = data.rooms || data.courses;
          if (list && list.length > 0 && isMounted) {
            setCoursesList(list);
          }
        }
      } catch (err) {
        console.error("Error loading initial dashboard data:", err);
      }
    }

    void syncData();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const refreshDashboardData = useCallback(async () => {
    try {
      const [profileRes, tasksRes, logsRes, coursesRes] = await Promise.allSettled([
        fetch("/api/profile"),
        fetch("/api/work-orders"),
        fetch("/api/occupancy"),
        fetch("/api/rooms")
      ]);

      if (profileRes.status === "fulfilled" && profileRes.value.ok) {
        const data = await profileRes.value.json();
        if (data.user) {
          setCurrentUser((prev) => ({
            ...prev,
            ...data.user,
            name: data.user.name ?? "",
            email: data.user.email ?? "",
            phone: data.user.phone ?? "",
            bio: data.user.bio ?? ""
          }));
        }
      }

      if (tasksRes.status === "fulfilled" && tasksRes.value.ok) {
        const data = await tasksRes.value.json();
        if (data.tasks && data.tasks.length > 0) {
          setTasks(data.tasks);
        }
      }

      if (logsRes.status === "fulfilled" && logsRes.value.ok) {
        const data = await logsRes.value.json();
        if (data.logs) {
          setLearningHoursLogs((prev) => ({ ...prev, ...data.logs }));
        }
      }

      if (coursesRes.status === "fulfilled" && coursesRes.value.ok) {
        const data = await coursesRes.value.json();
        if (data.courses && data.courses.length > 0) {
          setCoursesList(data.courses);
        }
      }
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
    }
  }, []);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  async function moveTask(id: string, status: TaskItem["status"]) {
    let completedTaskTitle = "";
    const previousTasks = tasks;
    const previousCourses = coursesList;

    setTasks((current) =>
      current.map((task) => {
        if (task.id === id) {
          if (status === "submitted") {
            completedTaskTitle = task.course;
          }
          return {
            ...task,
            status,
            deadline: status === "submitted" ? "Submitted" : task.deadline
          };
        }
        return task;
      })
    );

    if (status === "submitted" && completedTaskTitle) {
      setCoursesList((current) =>
        current.map((course) => {
          if (course.title === completedTaskTitle) {
            return {
              ...course,
              progress: Math.min(100, course.progress + 15)
            };
          }
          return course;
        })
      );
    }

    try {
      const response = await fetch("/api/work-orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setTasks(previousTasks);
        setCoursesList(previousCourses);
        showToast(errorData.error || "Failed to update task on server. Changes reverted.");
        return;
      }

      if (status === "submitted") {
        showToast("Task marked as submitted! Great job.");
      } else {
        showToast("Task status updated.");
      }
    } catch (err) {
      console.error("Failed to sync task status to API:", err);
      setTasks(previousTasks);
      setCoursesList(previousCourses);
      showToast("Network error. Task status change could not be saved.");
    }
  }

  async function submitWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const taskId = String(formData.get("taskId") || "");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        body: formData
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        showToast(data.error || "Submission failed. Try again.");
        return;
      }

      if (taskId) {
        moveTask(taskId, "submitted");
      }
      form.reset();
      showToast("Assignment uploaded successfully!");
    } catch {
      showToast("Could not send assignment right now.");
    }
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      bio: String(formData.get("bio") || "")
    };

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        showToast(data.error || "Unable to save profile.");
        return;
      }

      setCurrentUser((current) => ({
        ...current,
        ...data.user,
        phone: payload.phone,
        bio: payload.bio
      }));
      showToast("Account details updated!");
    } catch {
      showToast("Error updating profile. Check your connection.");
    }
  }

  async function signOut() {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch (err) {
      console.error("Signout error:", err);
    } finally {
      window.location.href = "/signin";
    }
  }

  function handleSendMessage(text: string) {
    if (!activeChatContact) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg: ChatMessage = {
      sender: "user",
      text,
      time: timeStr
    };

    setChatHistories((prev) => ({
      ...prev,
      [activeChatContact]: [...(prev[activeChatContact] || []), newMsg]
    }));

    setIsTyping(true);

    window.setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Thanks for the update! Front Desk team has acknowledged.",
        "Housekeeping team has dispatched an inspection supervisor to the suite.",
        "Understood, VIP guest preferences have been logged in the PMS.",
        "Maintenance request received. Facilities lead has been alerted."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const replyMsg: ChatMessage = {
        sender: "other",
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setChatHistories((prev) => ({
        ...prev,
        [activeChatContact]: [...(prev[activeChatContact] || []), replyMsg]
      }));
    }, 1200);
  }

  function handleAddSchedule(item: {
    title: string;
    time: string;
    date: string;
    course: string;
    color: ScheduleItem["color"];
  }) {
    const newSched: ScheduleItem = {
      id: `sched-${Date.now()}`,
      title: item.title,
      time: item.time,
      date: item.date,
      progress: "0%",
      avatars: [],
      course: item.course,
      color: item.color
    };

    setSchedules((prev) => [...prev, newSched]);

    const parsedDate = new Date(item.date);
    setViewedDate(new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1));
    setSelectedDate(parsedDate);

    showToast(`Added "${item.title}" to hotel operations schedule!`);
  }

  async function handleLogHours(hours: number, courseTitle: string) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDay = days[today.getDay()];

    const prevLogs = learningHoursLogs;
    const prevCourses = coursesList;

    setLearningHoursLogs((prev) => ({
      ...prev,
      [currentDay]: parseFloat(((prev[currentDay] ?? 0) + hours).toFixed(1))
    }));

    setCoursesList((current) =>
      current.map((course) => {
        if (course.title === courseTitle) {
          return {
            ...course,
            progress: Math.min(100, course.progress + Math.round(hours * 3))
          };
        }
        return course;
      })
    );

    // Persist to database and await response
    try {
      const response = await fetch("/api/occupancy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours, courseTitle })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setLearningHoursLogs(prevLogs);
        setCoursesList(prevCourses);
        showToast(errorData.error || "Failed to log occupancy. Changes reverted.");
        return;
      }

      showToast(`Logged ${hours}% occupancy update for ${courseTitle}!`);
    } catch (err) {
      console.error("Failed to sync study hours to API:", err);
      setLearningHoursLogs(prevLogs);
      setCoursesList(prevCourses);
      showToast("Network error. Could not save occupancy.");
    }
  }

  function handleBook1on1(booking: { teacher: Teacher; time: string; date: string; course: string }) {
    const newSched: ScheduleItem = {
      id: `sched-booked-${Date.now()}`,
      title: `${booking.teacher.name} Shift Briefing`,
      time: booking.time,
      date: booking.date,
      progress: "Assigned",
      avatars: [booking.teacher.avatar],
      course: booking.course,
      color: "purple"
    };

    setSchedules((prev) => [...prev, newSched]);

    const parsedDate = new Date(booking.date);
    setViewedDate(new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1));
    setSelectedDate(parsedDate);

    showToast(
      `Duty briefing with ${booking.teacher.name} scheduled for ${parsedDate.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short"
      })} at ${booking.time}!`
    );
  }

  return (
    <DashboardContext.Provider
      value={{
        theme,
        setTheme,
        currentUser,
        setCurrentUser,
        coursesList,
        setCoursesList,
        tasks,
        setTasks,
        schedules,
        setSchedules,
        selectedDate,
        setSelectedDate,
        viewedDate,
        setViewedDate,
        learningHoursView,
        setLearningHoursView,
        learningHoursLogs,
        messagesList,
        chatHistories,
        activeChatContact,
        setActiveChatContact,
        isTyping,
        query,
        setQuery,
        toast,
        showToast,
        profileOpen,
        setProfileOpen,
        showAddScheduleModal,
        setShowAddScheduleModal,
        showLogHoursModal,
        setShowLogHoursModal,
        bookingTeacher,
        setBookingTeacher,
        moveTask,
        submitWork,
        saveSettings,
        signOut,
        handleSendMessage,
        handleAddSchedule,
        handleLogHours,
        handleBook1on1,
        refreshDashboardData
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return ctx;
}
