
/**
 * Mock Stripe Service
 * 
 * In a production environment, this service would communicate with your Backend API.
 * The Backend API would then use the Stripe Node.js SDK to create Checkout Sessions.
 */

export const STRIPE_PRICES = {
    MONTHLY: 'price_123_monthly', // Replace with real Stripe Price ID
    YEARLY: 'price_456_yearly',   // Replace with real Stripe Price ID
};

export interface CheckoutResponse {
    success: boolean;
    redirectUrl?: string; // Where Stripe sends the user
    error?: string;
}

export const createCheckoutSession = async (priceId: string): Promise<CheckoutResponse> => {
    console.log(`[StripeService] Initiating Checkout for ${priceId}...`);

    // SIMULATION: Simulate API network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // SIMULATION: Always succeed for demo purposes
    // Removed random failure logic to prevent "Payment initialization failed" errors during testing
    console.log(`[StripeService] Checkout Session Created! Redirecting...`);
    return {
        success: true,
        // In a real app, this URL comes from Stripe (session.url)
        redirectUrl: 'https://checkout.stripe.com/pay/mock-session-id' 
    };
};

export const manageSubscription = async (): Promise<string> => {
    console.log(`[StripeService] Opening Customer Portal...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'https://billing.stripe.com/p/session/mock_portal';
};
