/*
refactor masterOrder so that it becomes an independent configuration of the diff viewer, rather than something tied 
to the calling component or the event models.

There are three reasons:
1. Different components may want different property ordering.
2. Some callers may not need custom ordering at all.
3. The normalisation logic belongs in the diff viewer, not in any particular calling component.
*/


import { MasterOrderRule } from "../models/diff-viewer.models";

export const EVENT_MASTER_ORDER: readonly MasterOrderRule[] = [

  // Explicitly prioritised properties.
  { path: 'eventId', position: 'last' },
  { path: 'name', position: 'last' },
  { path: 'model_type', position: 'last' },
  { path: 'eventStatus', position: 'last' },

  { path: 'template_meta', position: 'last' },
  { path: 'template_meta.type', position: 'last' },

  { path: 'overview', position: 'last' },
  { path: 'overview.meta', position: 'last' },
  { path: 'overview.data', position: 'last' },

  { path: 'organisation', position: 'last' },

  { path: 'payment_meta', position: 'last' },
  { path: 'payment_meta.agent', position: 'last' },
  { path: 'payment_meta.paymentModel', position: 'last' },

  { path: 'single_meta', position: 'last' },
  { path: 'single_meta.headerlabel', position: 'last' },
  { path: 'single_meta.footerlabel', position: 'last' },

  { path: 'attendees_meta', position: 'last' },
  { path: 'attendees_meta.optional_fields', position: 'last' },

  { path: 'offerings', position: 'last' },
  { path: 'offerings.meta.type', position: 'last' },
  { path: 'offerings.meta.visible', position: 'last' },
  { path: 'offerings.meta', position: 'last' },
  { path: 'offerings.data', position: 'last' }

];