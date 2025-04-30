---
sidebar_position: 2
---

# Models & Decorators

FireODM uses TypeScript classes plus decorators to map your data types to Firestore documents. Every model:

1. Extends **BaseModel**
2. Uses `@Collection('name')` to define the Firestore collection
3. Annotates each field with a decorator for validation and conversion

## 1. Define the Collection

Use `@Collection()` on your class:

```typescript
import { BaseModel, Collection } from 'fireodm'

@Collection('users')
export class User extends BaseModel {
    // fields...
}
```

This tells FireODM which Firestore collection to read from and write to.

## 2. Field Decorators

Each property in your model should have one decorator that enforces its type and validation:

- **@StringField(opts?)** – validates strings, supports `min`, `max`, `required`
- **@NumberField(opts?)** – validates numbers, supports `min`, `max`, `required`
- **@BooleanField(opts?)** – validates booleans, supports `required`, `defaultValue`
- **@TimestampField(opts?)** – validates Firestore `Timestamp`, supports `defaultNow`, `required`
- **@GeoPointField(opts?)** – validates Firestore `GeoPoint`, supports `required`
- **@ArrayField(schema, opts?)** – validates arrays of a given Zod schema, supports `required`
- **@MapField(schema, opts?)** – validates object maps, supports `required`
- **@DocumentReferenceField(opts?)** – validates Firestore `DocumentReference` or populated model, supports `required`

### Example

```typescript
import {
    BaseModel,
    Collection,
    StringField,
    NumberField,
    BooleanField,
    TimestampField,
    ArrayField,
    MapField
} from 'fireodm'
import { Timestamp } from 'firebase-admin/firestore'

@Collection('products')
export class Product extends BaseModel {
    @StringField({ required: true, min: 3 })
    name!: string

    @NumberField({ min: 0 })
    price?: number

    @BooleanField({ defaultValue: true })
    inStock!: boolean

    @TimestampField({ defaultNow: true })
    addedAt?: Timestamp

    @ArrayField(z.string())
    tags?: string[]

    @MapField(z.number())
    ratings?: Record<string, number>
}
```

## 3. Relations

Link documents across collections with `@Relation` and `@DocumentReferenceField`:

```typescript
import { Relation, DocumentReferenceField } from 'fireodm'
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

- `@Relation(() => Department)` registers the related model for `populate()`
- `@DocumentReferenceField` ensures raw refs or instances pass validation

To fetch relations, use:

```typescript
const emp = await Employee.findById(id, { populate: ['department'] })
```
or later:

```typescript
await emp.populate(['department'])
```

## 4. Putting It All Together

Here is a complete `User` example:

```typescript
import { BaseModel, Collection, StringField, EmailField, Relation, DocumentReferenceField, TimestampField } from 'fireodm'
import { Timestamp, DocumentReference } from 'firebase-admin/firestore'
import { Department } from './department.model'

@Collection('users')
export class User extends BaseModel {
    @StringField({ min: 2 })
    name!: string

    @EmailField()
    email!: string

    @TimestampField({ defaultNow: true })
    createdAt?: Timestamp

    @DocumentReferenceField({ required: false })
    @Relation(() => Department)
    department?: DocumentReference | Department | null

    constructor(data: Partial<User>, id?: string) {
    super(data, id)
    }
}
```

## 5. Next

Continue to **Validation** to learn more about Zod schemas and error handling in FireODM.