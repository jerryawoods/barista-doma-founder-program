# Barista Doma / Home Barista IQ — v8.9.29 Global Troubleshooting Continuation

Focused patch after v8.9.28 did not catch:
“I already tried that and it did not really work.”

Root cause:
- v8.9.28 only caught continuation while the app was exactly in awaiting_decision state.
- In real use, the follow-up may land in awaiting_more, direct transcript, typed path, or another phase.

Fix:
- Adds global troubleshooting-continuation detection early in the ICY handler.
- If artisan says “I already tried that,” “it did not work,” “nothing changed,” “still bitter,” etc., ICY continues troubleshooting regardless of current phase.
- Pulls best available context from pending decision, step review, or current advisor reply.
- Keeps advisement open and writes continuation into report/ledger.
- Build verified.

Test:
1. Start with: “it was very bitter.”
2. Let ICY suggest.
3. Then say/type: “I already tried that and it did not work.”
4. ICY should continue troubleshooting and ask a follow-up checklist regardless of phase.
