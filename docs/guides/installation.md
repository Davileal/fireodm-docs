---
sidebar_position: 1
---

# Installation & Setup

This guide shows you how to install **FireODM** in your Node.js project and configure `firebase-admin` so that FireODM can interface with Firestore.

## 1. Prerequisites

- **Node.js** v14 or newer
- A **Firebase project** with Firestore enabled
- A **service account** JSON key for Firebase Admin SDK

## 2. Install Packages

In your project folder, run:

    npm install fireodm firebase-admin

- `fireodm` is the ODM library.
- `firebase-admin` is required for Firestore access.

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

## 4. Initialize Firebase Admin

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

## 5. Using FireODM in Your Code

After setup, you can import and use FireODM models anywhere:

```typescript 
import { User } from './models' // your FireODM model

async function main() {
    // Create a new user
    const user = new User({ name: 'Alice', email: 'alice@test.com' })
    await user.save()

    // Query users
    const admins = await User.findWhere('role', '==', 'admin')
    console.log(admins)
}

main()
```

## 6. Next Steps

- Define models with decorators.
- Explore validation, hooks, relations, and CRUD in the **Models & Decorators** guide.

---

Continue to **Models & Decorators** to learn how to map your data shape with TypeScript decorators.

