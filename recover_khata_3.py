import json
import re

log_path = r"C:\Users\Omkar\.gemini\antigravity\brain\a4ad6823-6000-42b6-a1dd-6d0f3de13e80\.system_generated\logs\transcript_full.jsonl"

found_contents = []

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'TOOL_RESPONSE':
                output = data.get('content', '')
                if 'export default Khata' in output and 'import React' in output:
                    print("Found a potential full Khata.jsx in TOOL_RESPONSE!")
                    found_contents.append(output)
        except Exception as e:
            pass

if found_contents:
    print(f"Found {len(found_contents)} occurrences.")
    # The last one is probably the most up to date!
    # Wait, the tool response usually has "The command exited with code 0.\nOutput:\n"
    # Let's clean it up
    raw = found_contents[-1]
    
    # Extract just the code
    match = re.search(r'Output:\n(.*)', raw, re.DOTALL)
    if match:
        code = match.group(1).strip()
        with open(r'C:\Users\Omkar\Desktop\Dukaan360_Project\Dukaan360_Frontend\src\pages\Khata.jsx', 'w', encoding='utf-8') as out:
            out.write(code)
        print("Restored Khata.jsx!")
else:
    print("Could not find Khata.jsx output in logs.")
