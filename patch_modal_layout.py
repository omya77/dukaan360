import re

with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract the modal
modal_pattern = re.compile(r'\{\s*/\*\s*Add Staff Modal\s*\*/\s*\}\s*\{showAddStaff && \(\s*<div className="fixed inset-0.*?\)\s*\}\s*', re.DOTALL)
modal_match = modal_pattern.search(text)

if modal_match:
    modal_code = modal_match.group(0)
    # Remove modal from inside the header
    text = text.replace(modal_code, "")
    
    # Wrap the header in a fragment and put the modal outside
    text = text.replace('return (', 'return (\n    <>')
    text = text.replace('    </header>\n  );\n};', '    </header>\n' + modal_code + '\n    </>\n  );\n};')
    
    with open('C:/Users/Omkar/Desktop/Dukaan360_Project/Dukaan360_Frontend/src/components/Header.jsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Modal successfully moved outside the header container!")
else:
    print("Error: Could not find the modal code.")
