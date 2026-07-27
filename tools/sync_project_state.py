#!/usr/bin/env python3
from common import ROOT, load, save
from state_model import derive_state

existing = load('project-state.json') if (ROOT / 'project-state.json').exists() else {}
state = derive_state(existing)
save('project-state.json', state)
print(f"OK: {state['currentPhase']} / {state['status']}")
