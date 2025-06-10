import { createRoot } from "react-dom/client";
import { DebugTest } from "./components/debug-test";
import "./index.css";

// Test with simple component first
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found");
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1>Application Error</h1>
      <p>Unable to find root element. Please refresh the page.</p>
    </div>
  `;
} else {
  try {
    const root = createRoot(rootElement);
    root.render(<DebugTest />);
  } catch (error) {
    console.error("Failed to render app:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h1>Quantum AI Trading Platform</h1>
        <p>React failed to load. Error: ${error.message}</p>
      </div>
    `;
  }
}
