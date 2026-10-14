import json
import os

log_path = r"C:\Users\Omkar\.gemini\antigravity\brain\a4ad6823-6000-42b6-a1dd-6d0f3de13e80\.system_generated\logs\transcript_full.jsonl"
found = False

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'PLANNER_RESPONSE':
            tool_calls = data.get('tool_calls', [])
            for tc in tool_calls:
                if tc.get('name') == 'default_api:write_to_file':
                    args = tc.get('arguments', {})
                    if 'Khata.jsx' in args.get('TargetFile', ''):
                        print(f"FOUND write_to_file for Khata.jsx! Size: {len(args.get('CodeContent', ''))}")
                        with open(r'C:\Users\Omkar\Desktop\Dukaan360_Project\recovered_khata.jsx', 'w', encoding='utf-8') as out:
                            out.write(args.get('CodeContent', ''))
                        found = True

if not found:
    print("Could not find write_to_file for Khata.jsx")
