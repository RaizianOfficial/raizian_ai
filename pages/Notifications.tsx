import React, { useEffect, useState } from "react";
import { db } from "../src/firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  type?: string;
  createdAt?: any;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      setNotifications(data);
    });

    return () => unsubscribe();
  }, []);

  const glowColor = theme === "cyan" ? "#00CCFF" : "#ff009d";

  return (
    <div
      className={`min-h-screen w-full px-6 py-8 relative transition-all duration-500`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h2
          className={`text-3xl font-bold tracking-tight ${
            theme === "cyan" ? "text-[#0CF]" : "text-[#ff66c4]"
          }`}
        >
          Notifications 
        </h2>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            theme === "cyan"
              ? "bg-[#00CCFF20] border border-[#00CCFF40] text-[#0CF]"
              : "bg-[#ff009d20] border border-[#ff009d50] text-[#ff66c4]"
          }`}
        >
          {notifications.length} New
        </div>
      </div>

      {/* EMPTY STATE */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 border-2 animate-pulse`}
          >
            🔕
          </div>
          <p className="text-lg font-medium">No notifications yet...</p>
          <p className="text-sm text-gray-500">
            You’ll see updates from Raizian here soon.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notifications.map((n, index) => (
            <div
              key={n.id}
              style={{
                borderColor: glowColor,
                boxShadow:
                  theme === "cyan"
                    ? "0 0 12px rgba(0,204,255,0.2)"
                    : "0 0 12px rgba(255,0,157,0.2)",
              }}
              className={`group relative p-5 rounded-2xl border bg-[#0a0a0a]/70 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,204,255,0.25)]`}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300"
                style={{
                  background:
                    theme === "cyan"
                      ? "linear-gradient(135deg, rgba(0,204,255,0.15), rgba(0,255,255,0.1))"
                      : "linear-gradient(135deg, rgba(255,0,157,0.15), rgba(255,100,180,0.1))",
                }}
              ></div>

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-2">
                  <h3
                    className={`text-lg font-semibold ${
                      theme === "cyan" ? "text-[#0CF]" : "text-[#ff66c4]"
                    }`}
                  >
                    {n.title}
                  </h3>
                  <span
                    className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                      theme === "cyan"
                        ? "bg-[#00CCFF20] text-[#0CF]"
                        : "bg-[#ff009d20] text-[#ff66c4]"
                    }`}
                  >
                    {n.type || "update"}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  {n.message}
                </p>
                <p className="text-xs text-gray-500">
                  {n.createdAt?.toDate
                    ? n.createdAt.toDate().toLocaleString()
                    : "Just now"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
