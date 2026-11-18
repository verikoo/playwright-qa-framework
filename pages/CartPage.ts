// CartPage.ts
// Page Object for the SauceDemo cart page.

import { type Page, type Locator } from "@playwright/test";

export class CartPage {

    readonly page: Page;
    readonly title: Locator;
    readonly itemNames: Locator;
    readonly itemQuantities: Locator;
    readonly itemPrices: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByTestId('title');
        this.itemNames = page.getByTestId('inventory-item-name');
        this.itemQuantities = page.getByTestId('item-quantity');
        this.itemPrices = page.getByTestId('inventory-item-price');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });

    }

    /** Remove button for one product row, e.g. removeButton('sauce-labs-backpack'). */
    removeButton(slug: string): Locator {
        return this.page.getByTestId(`remove-${slug}`);
    }

    async remove(slug: string): Promise<void> {
        await this.removeButton(slug).click();
    }

    async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }


    async checkout(): Promise<void> {
        await this.checkoutButton.click();
    }

}