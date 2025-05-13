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

## 4. Sub-Collections

FireODM also supports organizing related data in Firestore sub-collections using two decorators:

### 4.1. `@SubcollectionModel(path)`

Annotate a class to indicate it represents documents in a sub-collection under a parent document:

```typescript
import { BaseModel, SubcollectionModel } from 'fireodm'

@SubcollectionModel('children')
export class ChildModel extends BaseModel {
  @StringField()
  name!: string

  @NumberField()
  age!: number
}
```

The path argument (`'children'`) specifies the sub-collection name under its parent collection.

### 4.2 `@Subcollection()`

On your parent model, declare a property to hold sub-collection items and decorate it:

```typescript
import { Subcollection } from 'fireodm'

export class ParentModel extends BaseModel {
  @StringField()
  title!: string

  @Subcollection(() => ChildModel, 'children')
  children?: ChildModel[]
}
```

`@Subcollection()` registers metadata so FireODM knows to load children from `/parents/{id}/children`.

### 4.3. Eager Loading with `populateSub`

Pass populateSub to findById or findAll to load sub-collections automatically:

```typescript
// findById example
const parent = await ParentModel.findById('docId', {
  populateSub: ['children'],
});
console.log(parent.children); // ChildModel[]

// findAll example
const { results } = await ParentModel.findAll({
  limit: 10,
  populateSub: ['children'],
});
results.forEach(p => console.log(p.children));
```

`populateSub` takes an array of sub-collection property names to eagerly load.

### 4.4. Manual Loading with `subcollection()`

Use the instance method `subcollection()` to fetch sub-collection data on demand:

```typescript
const parent = await ParentModel.findById('docId')

// Load 'children' when needed:
const kids = await parent.subcollection('children')
console.log(kids); // ChildModel[]
```

## 5. Putting It All Together

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

    @SubCollection(() => Role, "roles")
    roles?: Role[];

    constructor(data: Partial<User>, id?: string) {
    super(data, id)
    }
}

@SubcollectionModel('roles')
export class Role extends BaseModel {
  @StringField()
  name!: string

  @StringField()
  description!: number
}

```

## 6. Next

Continue to **Validation** to learn more about Zod schemas and error handling in FireODM.