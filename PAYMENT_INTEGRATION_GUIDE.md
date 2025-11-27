# E-Amplify Payment & Wallet Integration Guide

## Overview
This guide explains how to integrate Paystack and Stripe payment gateways with the E-Amplify wallet system.

## Environment Variables Required

Set these in your Vercel environment variables or `.env.local`:

\`\`\`env
# Paystack
NEXT_PUBLIC_PAYSTACK_KEY=pk_test_xxxxx  # Public key
PAYSTACK_SECRET_KEY=sk_test_xxxxx       # Secret key

# Stripe (Optional)
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxxxx    # Public key
STRIPE_SECRET_KEY=sk_test_xxxxx         # Secret key
\`\`\`

## API Endpoints

### Payment Initialization
**POST** `/api/payments/initialize`
- Initialize payment process
- Request body: `{ amount: number, email: string }`
- Response: `{ success: true, paymentId: string, amount: number, email: string }`

### Payment Verification
**POST** `/api/payments/verify`
- Verify payment status with Paystack
- Request body: `{ reference: string }`
- Response: `{ success: true, amount: number, newBalance: number }`

### Wallet Balance
**GET** `/api/wallet/balance`
- Get user's current wallet balance
- Response: `{ success: true, balance: number }`

### Fund Wallet
**POST** `/api/wallet/fund`
- Initiate wallet funding
- Request body: `{ amount: number, paymentMethod: "paystack" | "stripe" }`
- Response: `{ success: true, paymentId: string, amount: number, paymentMethod: string }`

### Debit Wallet
**POST** `/api/wallet/debit`
- Debit funds from wallet (internal transactions)
- Request body: `{ amount: number, description: string }`
- Response: `{ success: true, debitedAmount: number, newBalance: number }`

### Get Transactions
**GET** `/api/wallet/transactions?limit=20&offset=0`
- Fetch wallet transaction history
- Response: `{ success: true, transactions: Transaction[] }`

## Server Actions

### `initializePayment(amount, email)`
Initialize a payment in the database.

### `verifyPayment(reference)`
Verify payment with Paystack and update wallet.

### `addCredits(userId, amount, type)`
Add credits to user's wallet.

### `getWalletBalance(userId)`
Get current wallet balance.

### `fundWallet(userId, amount, paymentMethod)`
Create a wallet funding payment.

### `debitWallet(userId, amount, description)`
Debit wallet for internal transactions.

### `getWalletTransactions(userId, limit, offset)`
Fetch transaction history.

## Testing

Use `lib/payment-test-utils.ts` for testing:

\`\`\`typescript
import { PAYSTACK_TEST_CARDS, TEST_SCENARIOS } from "@/lib/payment-test-utils"

// Use test cards
const testCard = PAYSTACK_TEST_CARDS.success
// number: "4084084084084081"
// cvv: "408"
// expiry: "12/25"

// Simulate scenarios
const scenarios = TEST_SCENARIOS
// scenario1: Successful ₦5,000 payment
// scenario2: Failed payment
// scenario3: Insufficient balance
// scenario4: Multiple transactions
\`\`\`

## Database Tables

### `payments`
- `id`: UUID
- `user_id`: UUID (references users)
- `amount`: Numeric
- `currency`: Character varying (NGN, USD)
- `payment_method`: Character varying (paystack, stripe)
- `payment_status`: Character varying (pending, completed, failed)
- `paystack_reference`: Character varying
- `paystack_transaction_id`: Character varying
- `created_at`: Timestamp
- `completed_at`: Timestamp

### `credits`
- `id`: UUID
- `user_id`: UUID (references users)
- `balance`: Integer
- `created_at`: Timestamp
- `updated_at`: Timestamp

### `credit_transactions`
- `id`: UUID
- `user_id`: UUID (references users)
- `amount`: Integer
- `type`: Text (payment, debit)
- `description`: Text
- `created_at`: Timestamp

## Security Notes

1. **Secret Keys**: Never expose Paystack or Stripe secret keys in frontend code
2. **RLS Policies**: All payment and credit operations use Row Level Security
3. **Verification**: Always verify payments with payment gateway before crediting wallet
4. **Logging**: All transactions are logged for audit trails
5. **Amount Validation**: Amounts are validated server-side before processing

## Error Handling

All endpoints return clean JSON responses:

\`\`\`json
{
  "error": "Error message here"
}
\`\`\`

or

\`\`\`json
{
  "success": true,
  "data": {}
}
\`\`\`

## Next Steps

1. Add environment variables to Vercel dashboard
2. Create UI components for payment flows
3. Test with provided test cards
4. Deploy to production with live keys
