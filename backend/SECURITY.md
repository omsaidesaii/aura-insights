# Security & Data Isolation

## User Data Isolation

This application implements **strict user data isolation** - each user can ONLY see and access their own data.

## How It Works

### 1. Authentication Layer
- All protected endpoints require Clerk authentication via `@require_auth` decorator
- User ID is extracted from verified JWT token
- Invalid or missing tokens result in 401 Unauthorized

### 2. Database Queries
**ALL database queries are filtered by `clerk_user_id`:**
- `/api/reviews` - Only returns reviews where `clerk_user_id` matches authenticated user
- `/api/sessions` - Only returns sessions where `clerk_user_id` matches authenticated user
- `/api/stats` - Only counts documents where `clerk_user_id` matches authenticated user
- `/api/user-data` - Only returns reviews where `clerk_user_id` matches authenticated user

### 3. Data Storage
**ALL data is saved with the authenticated user's ID:**
- When saving reviews: `clerk_user_id` is taken from authenticated token (cannot be spoofed)
- When saving bulk analysis: All reviews are linked to authenticated user's ID
- Users cannot save data for other users

### 4. Security Checks

**Multiple layers of validation:**
1. Token verification in `auth.py` - Validates Clerk JWT token
2. User ID validation in all endpoints - Ensures user ID is valid and not None
3. Database queries always filter by `clerk_user_id` - Impossible to bypass
4. Input normalization - User IDs are trimmed and validated

## Security Features

✅ **Authentication Required**: All data endpoints require valid Clerk token
✅ **User ID Validation**: User ID is validated before any database operation
✅ **Query Filtering**: All queries include `clerk_user_id` filter
✅ **No Cross-User Access**: Users cannot access other users' data
✅ **Input Sanitization**: User IDs are normalized and validated
✅ **Error Logging**: Security violations are logged for monitoring

## Testing User Isolation

To verify data isolation works:

1. **Create two test accounts** in Clerk
2. **Upload data with User A** - Should save with User A's ID
3. **Upload data with User B** - Should save with User B's ID
4. **Login as User A** - Should ONLY see User A's data
5. **Login as User B** - Should ONLY see User B's data

## Database Schema

All collections include `clerk_user_id` field for filtering:

```javascript
// reviews collection
{
  _id: ObjectId,
  clerk_user_id: "user_abc123",  // ALWAYS filtered by authenticated user
  text: "...",
  predicted_sentiment: "Positive",
  created_at: ISODate
}

// analysis_sessions collection
{
  _id: ObjectId,
  clerk_user_id: "user_abc123",  // ALWAYS filtered by authenticated user
  filename: "...",
  total_reviews: 100,
  created_at: ISODate
}
```

## Important Notes

⚠️ **Never remove the `clerk_user_id` filter from queries**
⚠️ **Always validate `clerk_user_id` is not None before database operations**
⚠️ **User ID comes from authenticated token - cannot be manipulated by client**
⚠️ **All endpoints must use `@require_auth` decorator**

## Compliance

This implementation ensures:
- **Data Privacy**: Users can only access their own data
- **GDPR Compliance**: Personal data is isolated per user
- **Security Best Practices**: Defense in depth with multiple validation layers

