---
sidebar_position: 6
---

# Transactions & Batched Writes

FireODM integrates seamlessly with Firestore transactions and batched writes, allowing you to perform multiple operations atomically while still leveraging validation and lifecycle hooks.

> **Note:**
> - When you pass a `transaction` or `batch` object into `save()`, `update()`, or `delete()`, these methods return `Promise<void>` (the change is queued) instead of `Promise<WriteResult>`.
> - **Before-hooks** (`beforeSave`, `beforeUpdate`, `beforeDelete`) and Zod validation run immediately. **After-hooks** (`afterSave`, `afterUpdate`, `afterDelete`) are _not_ executed automatically—you must handle any post-commit logic yourself.

## 1. Using Transactions (`runTransaction`)

1. Initialize your transaction via `db.runTransaction(...)`.
2. Perform all reads first, then writes.
3. Pass the `transaction` object to FireODM methods.

Example:

```typescript
import { getFirestoreInstance, User, Department, Timestamp } from 'fireodm'
const db = getFirestoreInstance()

try {
    const result = await db.runTransaction(async (transaction) => {
    // Reads first
    const userRef = User.getCollectionRef().doc('user123')
    const userSnap = await transaction.get(userRef)
    if (!userSnap.exists) throw new Error('User not found')
    const user = new User(userSnap.data() as Partial<User>, userSnap.id)

    // Writes second
    await user.update(
        { lastLogin: Timestamp.now() },
        transaction
    )

    const newDept = new Department({ name: `Dept for ${user.name}` })
    await newDept.save(transaction)

    return { deptId: newDept.id }
    })
    console.log('Transaction succeeded:', result)
} catch (err) {
    console.error('Transaction failed:', err)
}
```

## 2. Using Batched Writes (`WriteBatch`)

1. Create a batch via `db.batch()`.
2. Queue multiple operations by passing the `batch` object to FireODM methods.
3. Commit the batch with `batch.commit()`, which returns an array of `WriteResult`.

Example:

```typescript
import { getFirestoreInstance, User, Department } from 'fireodm'
const db = getFirestoreInstance()
const batch = db.batch()

// Prepare instances
const existingUser = new User({}, 'user123')
const newUser      = new User({ name: 'Batch User', email: 'batch@test.com' })
const toDelete     = new User({}, 'toDeleteId')

// Queue operations
await existingUser.update({ name: 'Updated in Batch' }, batch)
await newUser.save(batch)
await toDelete.delete(batch)

// Commit atomically
try {
    const results = await batch.commit()
    console.log(`Batch committed with ${results.length} writes.`)
} catch (err) {
    console.error('Batch commit failed:', err)
}
```
---

Continue to **Lifecycle Hooks** to learn how to customize behavior around data operations.