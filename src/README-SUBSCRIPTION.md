# Subscription Frontend (`/subscription`)

This document describes the implemented subscription flow in `public_web`.

## Scope

- Route: `/subscription`
- Type: frontend-only implementation
- Backend contract: `apis` module `app-user-subscription`
- Authentication: required before entering checkout

## User Flow

1. User opens `/subscription`.
2. Frontend checks auth token and redirects unauthenticated users to `/login?redirect=/subscription`.
3. Plan selector loads active plans from `/api/v1/master-app-subscription-types`.
4. User fills profile and preferences.
5. Review step shows selected plan and total.
6. Checkout submits `POST /api/v1/app-user-subscription`.
7. Success step confirms subscription details.

## API Endpoints Used

- `GET /api/v1/master-app-subscription-types`
  - Used to render plan cards.
- `POST /api/v1/auth/me`
  - Used to resolve current user id for payload.
- `POST /api/v1/app-user-subscription`
  - Used to create subscription.

Optional helper methods also support:

- `GET /api/v1/app-user-subscription/user/:userId`
- `GET /api/v1/app-user-subscription/user/:userId/active`
- `PATCH /api/v1/app-user-subscription/:id/cancel`
- `PATCH /api/v1/app-user-subscription/:id/renew`

## Payload Mapping

Frontend payload builder (`SubscriptionService.buildCreateSubscriptionPayload`) sends:

- `user_id`
- `master_app_subscription_types_id`
- `auto_renew`
- `payment_method`
- `amount`
- `master_currency_id`
- `billing_cycle`

## Key Files

- `src/app/subscription/page.jsx`
  - Auth gate and redirect handling.
- `src/app/subscription/_components/PlanSelector.jsx`
  - Plan loading and list rendering.
- `src/app/subscription/_components/SubscriptionFlow.jsx`
  - Step orchestration and submit behavior.
- `src/app/subscription/_components/CheckoutForm.jsx`
  - Checkout confirmation UI and submit trigger.
- `src/services/subscriptionService.js`
  - Endpoint calls + payload/response normalization.

## Environment Notes

The route depends on the existing API proxy setup:

- `NEXT_PUBLIC_API_URL=/api/v1` (default fallback in axios already covers this)
- Next rewrite in `next.config.ts`: `/api/v1/* -> http://localhost:4050/api/v1/*`

## Verification Checklist

1. Logged-out user is redirected from `/subscription` to `/login?redirect=/subscription`.
2. Plans appear from backend (`master-app-subscription-types`).
3. Checkout creates a record in `app-user-subscriptions`.
4. Success screen shows created subscription id and plan amount.
5. Lint passes for the modified files.

## Notes

- This route does not process card tokenization directly.
- Existing Stripe payment flows in `/direct-checkout/*` remain separate.