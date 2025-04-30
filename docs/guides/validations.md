---
sidebar_position: 3
---

# Validation

FireODM integrates **Zod** under the hood to enforce schema rules at runtime. Every field decorator you use builds a Zod schema that validates data **before** it’s written to Firestore (during `save()`, `update()` or model instantiation).

## 1. How It Works

- **Field Decorators** (`@StringField()`, `@NumberField()`, `@EmailField()`, etc.) register individual Zod schemas for each property.
- FireODM composes these into a single Zod **object schema** for the whole model.
- On **save** or **update**, FireODM calls `schema.parse(data)`:
  - If validation **passes**, operation proceeds.
  - If validation **fails**, FireODM throws a `ValidationError` containing detailed issues.

## 2. Built-in Decorators & Options

| Decorator                    | Zod Type           | Options                               |
|------------------------------|--------------------|---------------------------------------|
| `@StringField(opts?)`        | `z.string()`       | `min`, `max`, `required`, `message`   |
| `@EmailField(message?)`      | `z.string().email()` | `required`, custom `message`         |
| `@NumberField(opts?)`        | `z.number()`       | `min`, `max`, `required`              |
| `@BooleanField(opts?)`       | `z.boolean()`      | `required`, `defaultValue`            |
| `@TimestampField(opts?)`     | `z.instanceof(Timestamp)` | `required`, `defaultNow`       |
| `@GeoPointField(opts?)`      | `z.instanceof(GeoPoint)`  | `required`                    |
| `@ArrayField(schema, opts?)` | `z.array(schema)`  | `required`                           |
| `@MapField(schema, opts?)`   | `z.record(z.string(), schema)` | `required`                |
| `@DocumentReferenceField(opts?)` | union of `DocumentReference`, `BaseModel`, `null` | `required` |

## 3. Example: Handling Validation Errors

```typescript
  import { ValidationError } from 'fireodm'
  import { User } from './models'

  async function createUser() {
    try {
      const u = new User({ name: 'A', email: 'not-an-email' })
      await u.save()
    } catch (err) {
      if (err instanceof ValidationError) {
        console.error('Validation failed:', err.issues)
      } else {
        throw err
      }
    }
  }
```

The `ValidationError.issues` array includes objects with:

- `path`: property path (e.g. `['email']`)
- `message`: human-readable error
- `code`: Zod error code (e.g. `invalid_type`, `too_small`)


Next: **CRUD API** — learn how to create, read, update, and delete documents with FireODM.