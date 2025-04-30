---
sidebar_position: 4
---

# CRUD API

FireODM provides simple, strongly-typed methods for basic data operations. You’ll find both static methods on your model classes and instance methods on your objects.

## Create

To create (or overwrite) a document, call `save()` on an instance:

```typescript
import { User } from 'fireodm'

// New user (no ID)
const user = new User({ name: 'Alice', email: 'alice@test.com' })
await user.save()             // Saves and assigns an ID
console.log('Saved user ID:', user.id)
```

If the instance already has an `id`, `save()` will overwrite the existing document.

## Read

### findById(id, options?)
Fetch a single document by its Firestore ID:

```typescript
const found = await User.findById(user.id)
if (found) console.log(found.name)
```

Accepts an optional `options` object:
- `populate`: `true` or array of relation fields

### findAll(options?)
Query multiple documents with pagination and ordering:

```typescript
const result = await User.findAll({
    limit: 10,
    orderBy: { field: 'createdAt', direction: 'desc' }
})
console.log(result.results)
console.log('Next cursor:', result.lastVisible)
```

### findWhere(field, op, value, options?)
Simple `where` clause query:

```typescript
const adults = await User.findWhere('age', '>=', 18)
console.log(adults)
```

### findOne(queryFn, options?)
Fetch the first matching document:

```typescript
const adminUser = await User.findOne(
    ref => ref.where('role', '==', 'admin'),
    { populate: ['department'] }
)
```

## Update

Call `update()` on an existing instance (must have an `id`):

```typescript
const user = await User.findById('someId')
if (user) {
    await user.update({ name: 'Bob', age: 30 })
    console.log('Updated locally:', user.name, user.age)
}
```

`update()` merges only specified fields; all other data stays intact.

## Delete

Remove a document from Firestore:

```typescript
const user = await User.findById('someId')
await user?.delete()         // Deletes and clears instance ID
console.log('Deleted user')
```

After deletion, the instance’s `id` property is reset to `undefined`.

## Reload

Refresh the instance with the latest data from Firestore:

```typescript
const user = await User.findById('someId')
// external update happens...
await user?.reload()
console.log('Latest data:', user)
```

Throws `NotFoundError` if the document no longer exists.

---

Continue to **Relations & Populate** to learn how to define and load related documents.

