import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/App.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add a specific protection for Owner routes
owner_route_protect = """const OwnerRoute = ({ children }) => {
  const { token, user, loading } = useAuth();
  if (loading) return null;
  if (!token || user?.role !== 'Owner') return <Navigate to="/pos" replace />;
  return children;
};"""

if "const OwnerRoute" not in text:
    text = text.replace("const ProtectedRoute = ({ children }) => {", owner_route_protect + "\n\nconst ProtectedRoute = ({ children }) => {")

# Wrap Inventory and Khata in OwnerRoute instead of ProtectedRoute
text = re.sub(r'<Route path="/inventory" element=\{<ProtectedRoute><Inventory /></ProtectedRoute>\} />', r'<Route path="/inventory" element={<OwnerRoute><Inventory /></OwnerRoute>} />', text)
text = re.sub(r'<Route path="/khata" element=\{<ProtectedRoute><Khata /></ProtectedRoute>\} />', r'<Route path="/khata" element={<OwnerRoute><Khata /></OwnerRoute>} />', text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("App.jsx patched with OwnerRoute")
