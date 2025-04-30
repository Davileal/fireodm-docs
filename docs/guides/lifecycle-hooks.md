---
sidebar_position: 7
---

# Lifecycle Hooks

FireODM models support lifecycle callbacks (hooks) that run before or after various operations. Use these to:

- Set default values or timestamps
- Enforce business rules
- Trigger side effects (logging, analytics)

## Supported Hooks

| Hook            | When It Runs                             | Signature                                |
|-----------------|------------------------------------------|------------------------------------------|
| `beforeSave`    | Before `.save()` (create or overwrite)   | `async beforeSave(options?: SetOptions)` |
| `afterSave`     | After `.save()`                          | `async afterSave(result: WriteResult)`   |
| `beforeUpdate`  | Before `.update()`                       | `async beforeUpdate(data: UpdateData<T>)`|
| `afterUpdate`   | After `.update()`                        | `async afterUpdate(result: WriteResult, data: UpdateData<T>)` |
| `beforeDelete`  | Before `.delete()`                       | `async beforeDelete()`                   |
| `afterDelete`   | After `.delete()`                        | `async afterDelete(result: WriteResult, originalId: string)` |
| `afterLoad`     | After loading via `findById` or converter| `async afterLoad(snapshot: DocumentSnapshot)`              |

## Example: Auditing Fields

```typescript
import { BaseModel, Collection, StringField, TimestampField } from 'fireodm'
import { Timestamp } from 'firebase-admin/firestore'

@Collection('posts')
class Post extends BaseModel {
    @StringField({ required: true })
    title!: string

    @TimestampField({ defaultNow: true })
    createdAt?: Timestamp

    @TimestampField({ defaultNow: true })
    updatedAt?: Timestamp

    async beforeSave() {
        // Ensure createdAt for new docs
        if (!this.createdAt) this.createdAt = Timestamp.now()
        // Always update updatedAt
        this.updatedAt = Timestamp.now()
    }

    async afterLoad() {
        console.log(`Post ${this.id} loaded at ${new Date().toISOString()}`)
    }
}
```

## Notes

- **Error handling**: Throwing an error in a `before` hook will abort the operation.
- **Transactions & Batches**: Only `before` hooks run when queuing operations in transactions or batches. `after` hooks do not run automatically.

---

Next: **Advanced Usage** — explore custom converters, pagination, and Firestore-specific features.