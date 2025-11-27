export const PAYSTACK_TEST_CARDS = {
  success: {
    number: "4084084084084081",
    cvv: "408",
    expiry: "12/25",
    description: "Successful payment",
  },
  failed: {
    number: "4111111111111111",
    cvv: "123",
    expiry: "12/25",
    description: "Payment declined",
  },
  pending: {
    number: "5078500100000000",
    cvv: "000",
    expiry: "12/25",
    description: "Pending payment",
  },
}

export const STRIPE_TEST_CARDS = {
  success: {
    number: "4242424242424242",
    cvv: "424",
    expiry: "12/25",
    description: "Successful payment",
  },
  declined: {
    number: "4000000000000002",
    cvv: "400",
    expiry: "12/25",
    description: "Card declined",
  },
  insufficient: {
    number: "4000000000009995",
    cvv: "000",
    expiry: "12/25",
    description: "Insufficient funds",
  },
}

export function simulatePaymentResponse(scenario: "success" | "failed" | "pending") {
  const responses = {
    success: {
      status: true,
      message: "Authorization URL created",
      data: {
        authorization_url: "https://checkout.paystack.com/test_authorization",
        access_code: "test_access_code_123",
        reference: `test_ref_${Date.now()}`,
      },
    },
    failed: {
      status: false,
      message: "Transaction was not successful",
      data: {
        status: "failed",
        reference: `test_ref_${Date.now()}`,
      },
    },
    pending: {
      status: true,
      message: "Transaction is pending",
      data: {
        status: "pending",
        reference: `test_ref_${Date.now()}`,
      },
    },
  }

  return responses[scenario]
}

export function simulateVerificationResponse(reference: string, status: "success" | "failed" | "pending") {
  const responses = {
    success: {
      status: true,
      message: "Verification successful",
      data: {
        id: 12345678,
        reference,
        amount: 50000,
        paid_at: new Date().toISOString(),
        status: "success",
        customer: {
          email: "test@example.com",
        },
      },
    },
    failed: {
      status: false,
      message: "Verification failed",
      data: {
        reference,
        status: "failed",
      },
    },
    pending: {
      status: true,
      message: "Verification pending",
      data: {
        reference,
        status: "pending",
      },
    },
  }

  return responses[status]
}

export const TEST_SCENARIOS = {
  scenario1: {
    name: "Successful Payment",
    description: "User pays ₦5,000 and receives 5,000 credits",
    amount: 5000,
    card: PAYSTACK_TEST_CARDS.success,
    expectedCredits: 5000,
  },
  scenario2: {
    name: "Failed Payment",
    description: "Payment is declined, no credits added",
    amount: 3000,
    card: PAYSTACK_TEST_CARDS.failed,
    expectedCredits: 0,
  },
  scenario3: {
    name: "Insufficient Balance for Debit",
    description: "User tries to debit more than wallet balance",
    amount: 10000,
    currentBalance: 5000,
    expectedError: "Insufficient wallet balance",
  },
  scenario4: {
    name: "Multiple Transactions",
    description: "Track credit and debit transactions",
    transactions: [
      { type: "credit", amount: 10000 },
      { type: "debit", amount: 2000 },
      { type: "debit", amount: 3000 },
    ],
    expectedBalance: 5000,
  },
}
