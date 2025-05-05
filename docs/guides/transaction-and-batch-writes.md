---
sidebar_position: 6
---

# Transactions and Batched Writes

You can perform atomic operations by using the ORM's `save`, `update`, and `delete` methods within an asynchronous context managed by helper functions `runInTransaction` and `runInBatch`. These helpers use Node.js `AsyncLocalStorage` internally, so you **do not** need to explicitly pass the transaction or batch object to the ORM methods when called inside the helper's callback.

## Important Considerations:

* **Implicit Context:** ORM methods (`save`, `update`, `delete`) automatically detect if they are being run inside a context started by `runInTransaction` or `runInBatch`.
* **Return Value:** When executed within one of these contexts, `save`, `update`, and `delete` now return `Promise<undefined>` because the actual `WriteResult` is only available after the entire transaction or batch commits externally. Direct calls outside these contexts still return `Promise<WriteResult>`.
* **`after` Hooks Skipped:** Lifecycle hooks like `afterSave`, `afterUpdate`, and `afterDelete` are **NOT** executed automatically when the ORM methods run within a transaction or batch context. This is because the operation is only finalized upon committing the transaction/batch externally. You must handle any post-commit logic yourself if needed.
* **`before` Hooks & Validation:** Lifecycle hooks like `beforeSave`, `beforeUpdate`, `beforeDelete`, and Zod validation **ARE** still executed before the operation is added to the implicit transaction or batch.

## Using Transactions (`runInTransaction`)

Wrap your transaction logic within the `runInTransaction` helper function. Remember to perform all reads **before** writes within the transaction callback. The `transaction` object passed to your callback is the standard Firestore `Transaction` object, primarily used for `transaction.get()`.

```typescript
import { getFirestoreInstance, User, Department, Timestamp, runInTransaction, WriteResult } from 'fireodm'; // Make sure to import runInTransaction

try {
    // Wrap operations in runInTransaction
    const result = await runInTransaction(async (transaction) => {
        // --- Reads FIRST (using the provided transaction object) ---
        const userRef = User.getCollectionRef().doc('userId123');
        const userSnap = await transaction.get(userRef); // Use transaction object for reads
        if (!userSnap.exists) {
            throw new Error("Transaction failed: User not found!");
        }
        // Create ORM instance from snapshot data
        const userInstance = new User(userSnap.data() as Partial<User>, userSnap.id);

        // --- Writes SECOND (using ORM methods WITHOUT passing transaction) ---
        const updateData = { name: 'Updated via Context', lastLogin: Timestamp.now() };
        // The ORM method implicitly uses the active transaction from runInTransaction
        await userInstance.update(updateData); // No transaction parameter needed! Returns Promise<undefined>

        // Other ORM operations also use the context implicitly
        const newDept = new Department({ name: `Dept for ${userInstance.name}`});
        await newDept.save(); // No transaction parameter needed! Returns Promise<undefined>

        // You can still return values from the transaction callback
        return { success: true, newDeptId: newDept.id };
    });

    console.log("Transaction successful:", result);

} catch (error) {
    // Catches errors from reads, writes, validation, or the commit attempt
    console.error("Transaction failed:", error);
}
```

## Using Batched Writes (runInBatch)
Wrap your batch operations logic within the runInBatch helper function. The ORM methods called inside will automatically add operations to the batch. The batch is committed automatically after your callback function successfully completes.

```typeScript
import { getFirestoreInstance, User, Department, WriteResult, runInBatch, BatchResult } from 'fireodm'; // Make sure to import runInBatch and BatchResult

try {
    // Prepare instances
    const userToUpdate = new User({}, 'userId1'); // Instance with ID for update
    const newUser = new User({ name: 'Batch Context User', email: 'batchctx@example.com' }); // New user
    const userToDelete = new User({}, 'userToDeleteId'); // Instance with ID for delete

    // Wrap operations in runInBatch
    const { commitResults, callbackResult } = await runInBatch(async (/* batch */) => { // 'batch' argument usually not needed for ORM calls
        // Call ORM methods WITHOUT the batch parameter
        // They implicitly use the batch context provided by runInBatch
        await userToUpdate.update({ name: 'Updated via Batch Context', tags: ['batch-ctx'] }); // Returns Promise<undefined>
        await newUser.save(); // Returns Promise<undefined>, ID assigned before adding
        await userToDelete.delete(); // Returns Promise<undefined>

        // Optional: return a value from the callback
        return { userId: newUser.id };
    });

    // Results contains commit results and the callback's return value
    console.log(`Batch committed successfully with ${commitResults.length} writes.`);
    console.log("Callback result:", callbackResult); // { userId: '...' }

} catch (error) {
    // Catches errors from ORM methods (e.g., validation) or the batch.commit() call
    console.error("Batch failed:", error);
}
```
---

Continue to **Lifecycle Hooks** to learn how to customize behavior around data operations.