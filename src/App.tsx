import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./features/auth/Login";
import { AuthProfile } from "./features/auth/AuthProfile";
import { NotFoundCard } from "./components/NotFoundCard";
import { ApplicationList } from "./features/applications/ApplicationList";
import { ApplicationCreate } from "./features/applications/ApplicationCreate";
import { Register } from "./features/auth/Register";
import { PasswordReset } from "./features/auth/PasswordReset";
import { ProcessSelectionList } from "./features/processSelections/ProcessSelectionList";
import { ProcessSelectionDetails } from "./features/processSelections/ProcessSelectionDetails";
import { ProcessSelectionResume } from "./features/processSelections/ProcessSelectionResume";
import { CandidateDashboard } from "./features/applications/CandidateDashboard";



function App() {

  return (
    <Box
      component="main"
      sx={{
        height: "100vh"
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<ProcessSelectionResume />} />
          <Route path="/process-selections/details/:id" element={<ProcessSelectionDetails />} />
          {/* <Route path="/applications" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} /> */}
          <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
          <Route path="/applications/create/:id" element={<ApplicationCreate />} />
          <Route path="/profile" element={<ProtectedRoute><AuthProfile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password/:token/:email" element={<PasswordReset />} />
          <Route path="*" element={<NotFoundCard />} />
        </Routes>
      </Layout>

    </Box>

  )
}

export default App;
