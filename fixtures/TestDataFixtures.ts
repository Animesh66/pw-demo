import { CSVOperations } from '../utils/CSVOperations';
import { UserData, PaymentCardData, TestCredentials, PaymentCard } from '../types/test-data.types';
import { EnvironmentConfig } from '../config/environment.config';
import { Logger } from '../utils/Logger';

/**
 * TestDataFixtures - Provides centralized access to test data
 * Loads data from CSV files and provides typed interfaces
 */
export class TestDataFixtures {
    private static usersData: UserData[] | null = null;
    private static paymentCardsData: PaymentCardData[] | null = null;

    /**
     * Initialize test data (loads CSV files)
     */
    static initialize(): void {
        try {
            this.usersData = CSVOperations.readCSV(
                EnvironmentConfig.TEST_DATA.CSV_FILES.USERS
            ) as UserData[];
            
            this.paymentCardsData = CSVOperations.readCSV(
                EnvironmentConfig.TEST_DATA.CSV_FILES.PAYMENT_CARDS
            ) as PaymentCardData[];
            
            Logger.info('Test data fixtures initialized successfully');
        } catch (error) {
            Logger.error('Failed to initialize test data fixtures', error);
            throw error;
        }
    }

    /**
     * Get valid user credentials
     */
    static getValidUser(): TestCredentials {
        this.ensureInitialized();
        const userData = this.usersData![0]; // First user is valid
        return {
            email: userData.email,
            password: userData.password,
        };
    }

    /**
     * Get user by index
     */
    static getUserByIndex(index: number): UserData {
        this.ensureInitialized();
        if (index < 0 || index >= this.usersData!.length) {
            throw new Error(`User index ${index} out of bounds`);
        }
        return this.usersData![index];
    }

    /**
     * Get all users
     */
    static getAllUsers(): UserData[] {
        this.ensureInitialized();
        return [...this.usersData!];
    }

    /**
     * Get valid payment card
     */
    static getValidCard(): PaymentCard {
        this.ensureInitialized();
        const validCards = this.paymentCardsData!.filter(card => card.isValid === 'true');
        
        if (validCards.length === 0) {
            throw new Error('No valid cards found in test data');
        }

        const card = validCards[0];
        return {
            number: card.cardNumber,
            holderName: card.holderName,
            expiry: card.expiryDate,
            cvv: card.cvv,
        };
    }

    /**
     * Get invalid payment card
     */
    static getInvalidCard(): PaymentCard {
        this.ensureInitialized();
        const invalidCards = this.paymentCardsData!.filter(card => card.isValid === 'false');
        
        if (invalidCards.length === 0) {
            throw new Error('No invalid cards found in test data');
        }

        const card = invalidCards[0];
        return {
            number: card.cardNumber,
            holderName: card.holderName,
            expiry: card.expiryDate,
            cvv: card.cvv,
        };
    }

    /**
     * Get payment card by type
     */
    static getCardByType(cardType: string): PaymentCardData | undefined {
        this.ensureInitialized();
        return this.paymentCardsData!.find(card => 
            card.cardType.toLowerCase() === cardType.toLowerCase()
        );
    }

    /**
     * Get all valid cards
     */
    static getAllValidCards(): PaymentCardData[] {
        this.ensureInitialized();
        return this.paymentCardsData!.filter(card => card.isValid === 'true');
    }

    /**
     * Get all invalid cards
     */
    static getAllInvalidCards(): PaymentCardData[] {
        this.ensureInitialized();
        return this.paymentCardsData!.filter(card => card.isValid === 'false');
    }

    /**
     * Get card data with full details
     */
    static getCardData(index: number): PaymentCardData {
        this.ensureInitialized();
        if (index < 0 || index >= this.paymentCardsData!.length) {
            throw new Error(`Card index ${index} out of bounds`);
        }
        return this.paymentCardsData![index];
    }

    /**
     * Ensure test data is initialized
     */
    private static ensureInitialized(): void {
        if (!this.usersData || !this.paymentCardsData) {
            this.initialize();
        }
    }

    /**
     * Reset/clear cached data (useful for testing)
     */
    static reset(): void {
        this.usersData = null;
        this.paymentCardsData = null;
        Logger.debug('Test data fixtures reset');
    }
}
