import json

log_path = r"C:\Users\Omkar\.gemini\antigravity\brain\a4ad6823-6000-42b6-a1dd-6d0f3de13e80\.system_generated\logs\transcript_full.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'Move-Item' in line or 'Copy-Item' in line or 'mv ' in line or 'cp ' in line:
            data = json.loads(line)
            if data.get('type') == 'PLANNER_RESPONSE':
                for tc in data.get('tool_calls', []):
                    if tc.get('name') == 'default_api:run_command':
                        print(tc.get('arguments', {}).get('CommandLine'))
