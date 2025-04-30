---
sidebar_position: 8
---

# Advanced Usage

Once you’ve mastered basic CRUD, decorators, relations and hooks, explore these advanced Firestore features with FireODM.

## 1. Custom Converters

Sometimes you need to transform fields on the fly (e.g., encrypting, custom class instances). FireODM lets you register a FirestoreDataConverter:

```typescript
import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore'
import { getFirestoreInstance } from 'fireodm/config'
import { BaseModel } from 'fireodm'

// Define converter
const MyConverter: FirestoreDataConverter<MyClass> = {
    toFirestore(inst) {
    return { raw: inst.toJSON() }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot) {
    const data = snapshot.data()
    return new MyClass(data.raw)
    }
}

// Apply converter manually if needed
const col = getFirestoreInstance()
            .collection('mycol')
            .withConverter(MyConverter)

```

## 2. Pagination & Cursors

Use `findAll` options to page through large datasets:

```typescript
const page1 = await User.findAll({ limit: 10, orderBy: { field: 'createdAt', direction: 'asc' } })
const cursor = page1.lastVisible

const page2 = await User.findAll({
    limit: 10,
    orderBy: { field: 'createdAt', direction: 'asc' },
    startAfter: cursor
})
```

Fields must be indexed in Firestore for composite queries.

## 3. Select & Projection

Fetch only specific fields to reduce bandwidth:

```typescript
const { results } = await User.findAll({
    queryFn: ref => ref.select('name','email'),
})
// Each User instance will only have 'name' and 'email' populated
```

## 4. Complex Queries

Combine `where`, `in`, `array-contains`, etc.:

```typescript
// users whose role is one of ['admin','editor']
const users = await User.findWhere('role','in',['admin','editor'])

// posts tagged with 'news'
const newsPosts = await Post.findWhere('tags','array-contains','news')
```

## 5. GeoPoints & Timestamps

Decorate `GeoPoint` and `Timestamp` fields:

```typescript
import { GeoPointField, TimestampField } from 'fireodm'
import { GeoPoint } from 'firebase-admin/firestore'

class Place extends BaseModel {
    @GeoPointField()
    location!: GeoPoint

    @TimestampField({ defaultNow: true })
    visitedAt?: Timestamp
}

// Query by bounding box
const nearby = await Place.findAll({
    queryFn: ref => ref
    .where('location', '>=', new GeoPoint(lat1, lng1))
    .where('location', '<=', new GeoPoint(lat2, lng2))
})
```

## 6. Transactions & Batches (Recap)

Refer back to the **Transactions & Batched Writes** guide for atomic multi-op patterns.

---

Next: **FAQ & Troubleshooting** for common issues and best practices.