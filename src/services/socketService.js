import { io } from "socket.io-client";
import toast from "react-hot-toast";

let globalSocket = null;

export const getSocketUrl = () => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:8800";
  }
  return "https://karmsetu-socket.onrender.com";
};

// Play a pleasant audio chime using browser Web Audio API
export const playNotificationPing = () => {
  try {
    if (typeof window === "undefined") return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // First chime note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second chime note (higher)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880.00, now + 0.12); // A5
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (err) {
    console.warn("Could not play audio notification ping:", err);
  }
};

// Initialize or retrieve socket instance
let currentRegisteredUserId = null;

export const initGlobalSocket = (userId) => {
  if (!userId) return globalSocket;

  const strUserId = String(userId);
  currentRegisteredUserId = strUserId;

  if (globalSocket) {
    if (globalSocket.connected) {
      globalSocket.emit("new-user-add", strUserId);
    } else {
      globalSocket.connect();
    }
    return globalSocket;
  }

  const url = getSocketUrl();
  globalSocket = io(url, {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  const registerUser = () => {
    if (currentRegisteredUserId) {
      console.log("Registering socket user with ID:", currentRegisteredUserId);
      globalSocket.emit("new-user-add", currentRegisteredUserId);
    }
  };

  globalSocket.on("connect", registerUser);
  globalSocket.on("reconnect", registerUser);

  if (globalSocket.connected) {
    registerUser();
  }

  return globalSocket;
};

export const getActiveSocket = () => {
  return globalSocket;
};

// Show a live popup toast for Client when a Freelancer applies
export const showClientApplicationPopup = (data) => {
  playNotificationPing();

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex flex-col p-4 border border-gray-200 ring-1 ring-black/5`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-0.5">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-primary/20">
              {data.freelancerName ? data.freelancerName.charAt(0).toUpperCase() : "F"}
            </div>
          </div>
          <div className="flex-1 w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">
                New Project Application
              </p>
              <span className="text-[10px] text-gray-400">Just now</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              {data.freelancerName || "A freelancer"} applied!
            </p>
            <p className="text-xs text-gray-600 mt-0.5 truncate">
              Project: <span className="font-medium text-gray-800">{data.projectTitle || "Your Project"}</span>
            </p>
            {data.message && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2 italic bg-gray-50 p-1.5 rounded-md border border-gray-100">
                &ldquo;{data.message}&rdquo;
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Dismiss
          </button>
          <a
            href="/cl/application"
            onClick={() => toast.dismiss(t.id)}
            className="px-3.5 py-1 text-xs font-semibold text-white bg-primary hover:bg-primaryho rounded-lg transition-colors shadow-xs"
          >
            Review Application
          </a>
        </div>
      </div>
    ),
    { duration: 9000, position: "top-right" }
  );
};

// Show a live popup toast for Freelancer when Application status is updated
export const showFreelancerStatusPopup = (data) => {
  playNotificationPing();

  const isAccepted = (data.status || "").toLowerCase() === "accepted";

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex flex-col p-4 border ${
          isAccepted ? "border-green-200" : "border-red-200"
        } ring-1 ring-black/5`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 pt-0.5">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                isAccepted
                  ? "bg-green-100 text-green-600 border border-green-300"
                  : "bg-red-100 text-red-600 border border-red-300"
              }`}
            >
              {isAccepted ? "✓" : "✕"}
            </div>
          </div>
          <div className="flex-1 w-0">
            <div className="flex items-center justify-between">
              <p
                className={`text-xs font-bold uppercase tracking-wider ${
                  isAccepted ? "text-green-600" : "text-red-600"
                }`}
              >
                Application {isAccepted ? "Accepted 🎉" : "Status Update"}
              </p>
              <span className="text-[10px] text-gray-400">Just now</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">
              {isAccepted
                ? "Congratulations! Your application was accepted!"
                : "Your application was not selected."}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Project: <span className="font-medium text-gray-800">{data.projectTitle || "Project"}</span>
            </p>
            {data.clientName && (
              <p className="text-xs text-gray-500 mt-0.5">
                Client: <span className="font-medium">{data.clientName}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Dismiss
          </button>
          {isAccepted && data.projectId && (
            <a
              href={`/fl/projectDashboard/${data.projectId}`}
              onClick={() => toast.dismiss(t.id)}
              className="px-3.5 py-1 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-xs"
            >
              Go to Project
            </a>
          )}
        </div>
      </div>
    ),
    { duration: 10000, position: "top-right" }
  );
};
