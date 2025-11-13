import { Routes, Route } from "react-router-dom";
import { PromotionListView } from "./marketing-platform/presentation";
import { NotFound } from "./pages/NotFound";
// import { TaskManagementApp } from './presentation/components/TaskManagementApp'

function App() {
  return (
    <Routes>
      {/* Home route */}
      <Route path="/" element={<PromotionListView />} />

      {/* Promotion routes */}
      <Route path="/promotions" element={<PromotionListView />} />
      {/* Placeholder for promotion detail page - to be implemented */}
      {/* <Route path="/promotions/:id" element={<PromotionDetailView />} /> */}

      {/* Task Management route (commented out for now) */}
      {/* <Route path="/tasks" element={<TaskManagementApp />} /> */}

      {/* 404 Not Found route - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
