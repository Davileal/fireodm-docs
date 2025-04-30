---
sidebar_position: 1
---

# Getting Started

Welcome to **FireODM**, a decorator-based ODM for Firestore in Node.js. In a few minutes you’ll have a working model, save it to Firestore, and fetch it back.

## 1. Prerequisites

- Node.js ≥ 14  
- A Firebase project with Firestore enabled  
- Firebase Admin SDK credentials (service account)

## 2. Install

From your project folder, run:
```bash
npm install fireodm
```

## 3. TypeScript Configuration

By default, subclass field initializers will override the values assigned via `BaseModel`’s `Object.assign`.  
If you’d rather **not** write manual `this.foo = data.foo` bindings in every constructor, add the following to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    // …
    "useDefineForClassFields": false
  }
}
```

## 4. Configure Firebase Admin

```typescript
import * as admin from 'firebase-admin';
import { setFirestoreInstance } from "fireodm";

admin.initializeApp({
  // ...,
});

// Gets the Admin Firestore instance connected to the emulator
const db = admin.firestore();

// Sets the instance for the ORM library
setFirestoreInstance(db, { allowOverwrite: true });
```

## 5. Define Your First Model

```typescript
import { BaseModel, Collection, StringField, TimestampField } from 'fireodm'
import { Timestamp } from 'firebase-admin/firestore'

@Collection('users')
class User extends BaseModel {
  @StringField({ min: 2 })
  name!: string

  @StringField({ required: false })
  nickname?: string

  @TimestampField({ defaultNow: true })
  createdAt?: Timestamp

  constructor(data: Partial<User>, id?: string) {
    super(data, id)
  }
}
```

## 6. Save a New Document

```typescript
const u = new User({ name: 'Alice' })
await u.save()
console.log('User ID:', u.id)
```

## 7. Fetch It Back

```typescript
const found = await User.findById(u.id!)
if (found) {
  console.log(found.name)  // 'Alice'
}
```

---

You’re all set! From here you can explore:  
- `await User.findWhere('age', '>=', 18)`  
- `await found.update({ nickname: 'ally' })`  
- `await found.delete()`  
- `await found.populate(['relationField'])`  

Next up: deep dive into decorators and validation. See you there!