import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Login.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_catch = """    } catch (err) {
      if (err.response?.data?.detail === "PENDING_APPROVAL") {
        setError('Your store is currently pending admin approval.');
      } else {
        setError(err.response?.data?.detail || 'Login failed. Please check credentials.');
      }
    }"""

new_catch = """    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail === "PENDING_APPROVAL") {
        setError('Your store is currently pending admin approval. Please wait.');
      } else if (detail === "SUBSCRIPTION_EXPIRED") {
        setError('Your subscription plan has expired. Please pay to renew your access.');
      } else if (detail === "ACCOUNT_REJECTED") {
        setError('Your store registration was rejected by the admin.');
      } else {
        setError(detail || 'Login failed. Please check credentials.');
      }
    }"""

text = text.replace(old_catch, new_catch)

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/pages/Login.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Login.jsx catch block patched.")
