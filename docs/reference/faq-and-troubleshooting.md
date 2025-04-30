---
sidebar_position: 1
---

# FAQ & Troubleshooting

This page collects common questions, errors and tips when working with FireODM.

## Frequently Asked Questions

### Q: How do I inspect raw Firestore queries for debugging?
- Use `firebase emulators:start --only firestore` locally.
- Enable verbose logging in Firestore SDK:`
```typescript
import { setLogLevel } from 'firebase-admin/firestore'
setLogLevel('debug')
```

### Q: Can I customize the Firestore collection name at runtime?
- The `@Collection('name')` decorator is static. To change at runtime, you can subclass and override metadata:
```typescript
import { getCollectionName } from 'fireodm'
Reflect.defineMetadata(COLLECTION_KEY, newName, MyModel)
```

### Q: Where can I contribute?
- Head over to the GitHub repo: https://github.com/Davileal/fireodm
- Issues and pull requests are welcome!

## Common Errors & Fixes

### 1. **`ValidationError: Unrecognized key(s)`**
- You likely passed a property that isn’t decorated. Make sure every field in your model has a matching decorator.
- Check your model class matches your `.save()` or `.update()` payload.

### 2. **Relations not populating**
- Confirm you used both `@DocumentReferenceField()` and `@Relation(() => Model)` on the property.
- Use `await instance.populate(['field'])` or pass `{ populate: ['field'] }` to `find…` methods.

## Tips & Best Practices

- **Keep models small.** Avoid enormous schemas; split large domains into multiple collections.
- **Populate selectively.** Only fetch relations you need to reduce reads and latency.
- **Use transactions for multi-doc updates.** FireODM methods work inside transactions and batch writes.

---

Next: **Contributing** — guidelines for development, testing, and submitting changes to FireODM.

