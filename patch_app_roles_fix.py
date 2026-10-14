import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/App.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

owner_route_protect = """const OwnerRoute = ({ children }) => {
  const { token, user, loading } = useAuth();
  if (loading) return null;
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== 'Owner') return <Navigate to="/pos" replace />;
  return children;
};"""

if "const OwnerRoute" not in text:
    text = text.replace("const PrivateRoute = ({ children }) => {", owner_route_protect + "\n\nconst PrivateRoute = ({ children }) => {")

text = re.sub(r'<Route path="/inventory" element=\{<PrivateRoute><Inventory /></PrivateRoute>\} />', r'<Route path="/inventory" element={<OwnerRoute><Inventory /></OwnerRoute>} />', text)
text = re.sub(r'<Route path="/khata" element=\{<PrivateRoute><Khata /></PrivateRoute>\} />', r'<Route path="/khata" element={<OwnerRoute><Khata /></OwnerRoute>} />', text)
text = re.sub(r'<Route path="/dashboard" element=\{<PrivateRoute><Dashboard /></PrivateRoute>\} />', r'<Route path="/dashboard" element={<OwnerRoute><Dashboard /></OwnerRoute>} />', text)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("App.jsx successfully patched with OwnerRoute")
