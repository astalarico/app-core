import { Navigate, Route, Routes } from 'react-router-dom';
import UserList from "./User/UserList";
import UserForm from "./User/UserForm";
import GeneralSettings from "./Settings/GeneralSettings";
import NotFound from "./NotFound/NotFound";
import Dashboard from "./Dashboard/Dashboard";

export default function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/admin"
                element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route path="/admin/dashboard" element={<Dashboard />} />

            <Route path="/admin/users">
                <Route path="list" element={<UserList />} />
                <Route path=":id/edit" element={<UserForm />} />
                <Route path="create" element={<UserForm />} />
                <Route path="" element={<UserList />} />
            </Route>
            <Route path="/admin/settings" element={<GeneralSettings />} />
  
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
