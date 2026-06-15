# Barista Doma / Home Barista IQ — v8.9.22 ICY Community Learning Loop

Focused patch after user clarified:
- ICY should get smarter based on feedback, outcomes, community usage, Machine Passport patterns, and what actually worked.

Adds:
- Advisement Outcome / Community Learning area in the In-Step Report Review.
- ICY closeout now asks the artisan to come back and say what happened after trying the next move.
- Outcome logging captures:
  - Occasion
  - active step
  - Machine Passport context
  - house formula
  - artisan issue
  - ICY guidance
  - artisan chosen action
  - outcome feedback
  - intended community-learning use
- Outcome feedback is stored in the visible capture ledger and telemetry as an advisement workflow learning signal.

This is not yet a full backend community database. It is the front-end/domain capture hook so future persistence and aggregation can be connected cleanly.
