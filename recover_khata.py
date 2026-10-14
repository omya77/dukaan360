import json

log_path = r"C:\Users\Omkar\.gemini\antigravity\brain\a4ad6823-6000-42b6-a1dd-6d0f3de13e80\.system_generated\logs\transcript_full.jsonl"
found = False

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        # check tool outputs for "cat C:\Users\Omkar\Desktop\Dukaan360_Project\Dukaan360_Frontend\src\pages\Khata.jsx"
        if data.get('type') == 'TOOL_RESPONSE' and 'Khata.jsx' in str(data):
            # Try to find the full file content if it was dumped
            content = data.get('content', '')
            if 'import React' in content and 'export default Khata' in content:
                print("FOUND IT!")
                with open(r'C:\Users\Omkar\Desktop\Dukaan360_Project\recovered_khata.jsx', 'w', encoding='utf-8') as out:
                    out.write(content)
                found = True
                break

if not found:
    print("Could not find full Khata.jsx in logs.")
