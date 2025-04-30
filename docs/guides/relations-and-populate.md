---
sidebar_position: 5
---

# Relations & Populate

FireODM lets you link documents across collections with minimal setup. You define a relation on your model, and then load the related documents on demand with `populate()` or via query options.

## 1. Defining Relations

Use two decorators together on a property:

1. `@DocumentReferenceField(opts?)` – ensures the raw Firestore `DocumentReference` or populated model instance passes validation.
2. `@Relation(() => RelatedModel, opts?)` – registers metadata for FireODM, including whether the relation is lazy-loaded.

Example:

```typescript
import { BaseModel, Collection, StringField, Relation, DocumentReferenceField } from 'fireodm'
import { DocumentReference } from 'firebase-admin/firestore'
import { Department } from './department.model'

@Collection('employees')
export class Employee extends BaseModel {
    @StringField()
    name!: string

    @DocumentReferenceField({ required: false })
    @Relation(() => Department)
    department?: DocumentReference | Department | null
}
```

- The `department` property may hold a Firestore `DocumentReference`, a `Department` instance, or `null`.
- By default, relations are **lazy**: loaded only when you call `populate()`.

## 2. Query-Time Population

Pass `populate` in query options to load relations automatically when fetching:
```typescript
// Populate only 'department'
const emp = await Employee.findById(empId, { populate: ['department'] })

// Populate all relations
const allEmps = await Employee.findAll({ populate: true })
```

Behind the scenes FireODM fetches each referenced document and replaces the property with a fully initialized model.

## 3. Runtime Population

If you fetched without `populate`, you can populate later on any instance:

```typescript
const emp = await Employee.findById(empId)
// emp.department is still a DocumentReference or undefined

// Populate a specific field
await emp.populate('department')
console.log(emp.department) // Department instance

// Populate all relations
await emp.populate(true)
```

Subsequent calls use an internal cache so each relation is fetched only once.

## 4. Eager vs Lazy

- **Lazy (default)**: relations load only when you call `populate()` or specify `populate` in options.
- **Eager**: pass `{ lazy: false }` to `@Relation` to automatically fetch that relation when creating the model via `.find…` methods.

```typescript
@Relation(() => Department, { lazy: false })
department?: …
```

With eager loading, any query that returns an `Employee` will include the `Department` model instance automatically.

## 5. Best Practices

- Only populate fields you need to minimize reads.
- Use pagination (`findAll` with `limit`) before populating large result sets.
- Combine with TypeScript types for full type safety.

---

Continue to **Transactions & Batched Writes** to learn how to group operations atomically.