// Micro-haptic vibration utility for mobile touch responsiveness (like Glorify / iOS)

export type HapticType = "light" | "medium" | "heavy" | "success" | "warning" | "selection";

export function triggerHaptic(type: HapticType = "light") {
  if (typeof window === "undefined" || !("vibrate" in navigator)) {
    return;
  }

  try {
    switch (type) {
      case "light":
      case "selection":
        navigator.vibrate(8);
        break;
      case "medium":
        navigator.vibrate(15);
        break;
      case "heavy":
        navigator.vibrate(25);
        break;
      case "success":
        navigator.vibrate([10, 35, 15]);
        break;
      case "warning":
        navigator.vibrate([20, 50, 20]);
        break;
    }
  } catch {
    // Ignore unsupported devices / environments silently
  }
}
