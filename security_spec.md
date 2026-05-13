# Security Specification - PriceWise AI

## Data Invariants
1. A price offer must always have a positive numerical value.
2. Watched items must be owned by the user who created them (`userId` check).
3. Product IDs and Offer IDs must be valid strings.
4. Users cannot modify global product data (System/Admin only).
5. Price history is immutable once written (System only).

## The Dirty Dozen Payloads
1. **The Spoof:** Attempt to create a `watchedItem` in another user's collection.
2. **The Price Injector:** Update an offer price to a negative value.
3. **The Shadow Field:** Add an `isAdmin: true` field to a user document.
4. **The Giant ID:** Use a 1MB string as a product ID.
5. **The Orphan:** Create an offer for a product that doesn't exist.
6. **The Time Traveler:** Client provides a future `updatedAt` date.
7. **The Blanket Read:** Attempt to list all `users` private data.
8. **The Immutable Break:** Try to update a `createdAt` timestamp.
9. **The Rating Spam:** Update a product rating directly without a review.
10. **The Link Poison:** Inject a `javascript:alert()` link into an offer.
11. **The Delete War:** Attempt to delete a product you didn't create.
12. **The Partial Wipe:** Update an offer but omit the `storeName`.

## Test Runner
Testing will be handled by the companion `firestore.rules.test.ts` to ensure PERMISSION_DENIED on these payloads.
