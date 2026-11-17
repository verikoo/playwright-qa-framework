# SauceDemo Shopping Cart Test Plan

## Application Overview

Validate the SauceDemo shopping cart starting from tests/ui/seed.spec.ts, which logs in a standard user and opens the Products page. Each scenario assumes a fresh cart and can run independently. Cover empty-cart behavior, adding selected and all six products, badge counts and empty-state badge visibility, cart contents and reload persistence, Continue Shopping, cart-page removals, and checkout entry with an empty cart. Product-list add/remove toggling is covered by tests/ui/products.spec.ts and is not duplicated here.

## Test Scenarios

### 1. Shopping Cart

**Seed:** `tests/ui/seed.spec.ts`

#### 1.1. Fresh cart is empty and Continue Shopping returns to Products

**File:** `tests/ui/cart-empty.spec.ts`

**Steps:**
  1. -
    - expect: The user is logged in and the Products page is displayed.
    - expect: The cart button is labeled Cart, empty; no numeric badge is displayed.
  2. Click the cart icon.
    - expect: The Your Cart page opens with no product rows or Remove buttons.
    - expect: The cart button remains labeled Cart, empty; no 0 badge is displayed.
    - expect: Continue Shopping and Checkout are visible.
  3. Click Continue Shopping.
    - expect: The Products page opens.
    - expect: The cart remains empty with no numeric badge.

#### 1.2. Adding several products updates the badge and cart contents

**File:** `tests/ui/cart-add-products.spec.ts`

**Steps:**
  1. On the Products page, add Sauce Labs Backpack.
    - expect: The cart badge displays 1.
  2. Add Sauce Labs Bike Light, then Sauce Labs Bolt T-Shirt.
    - expect: The badge increments to 2 after Bike Light and to 3 after Bolt T-Shirt.
  3. Open the cart.
    - expect: The Your Cart page lists exactly Sauce Labs Backpack, Sauce Labs Bike Light, and Sauce Labs Bolt T-Shirt.
    - expect: Each product appears once with quantity 1.
    - expect: Prices are Backpack $29.99, Bike Light $9.99, and Bolt T-Shirt $15.99.
    - expect: The cart badge displays 3.

#### 1.3. Continue Shopping preserves cart selections

**File:** `tests/ui/cart-continue-shopping.spec.ts`

**Steps:**
  1. Add Sauce Labs Backpack and Sauce Labs Onesie from the Products page.
    - expect: The cart badge displays 2.
  2. Open the cart and click Continue Shopping.
    - expect: The Products page opens and the badge still displays 2.
    - expect: Backpack and Onesie show Remove actions; an unselected product still shows Add to cart.
  3. Open the cart again.
    - expect: Backpack and Onesie remain in the cart, each appearing once with quantity 1.
    - expect: The cart badge still displays 2.

#### 1.4. Removing selected items from the cart updates rows and badge through empty

**File:** `tests/ui/cart-remove-items.spec.ts`

**Steps:**
  1. Add Sauce Labs Backpack, Sauce Labs Bike Light, and Sauce Labs Bolt T-Shirt, then open the cart.
    - expect: The cart contains exactly those three products and the badge displays 3.
  2. Click Remove on the Sauce Labs Bike Light row.
    - expect: The Bike Light row disappears while Backpack and Bolt T-Shirt remain.
    - expect: The badge decreases to 2 and no other product is removed.
  3. Click Remove on the Backpack row, then Remove on the Bolt T-Shirt row.
    - expect: After removing Backpack, only Bolt T-Shirt remains and the badge displays 1.
    - expect: After removing Bolt T-Shirt, the cart has no product rows and the badge is absent, not 0.
    - expect: The empty cart still shows Continue Shopping and Checkout.

#### 1.5. Cart contents persist after page reload

**File:** `tests/ui/cart-reload.spec.ts`

**Steps:**
  1. Add Sauce Labs Backpack and Sauce Labs Fleece Jacket, then open the cart.
    - expect: The cart lists Backpack and Fleece Jacket, each once with quantity 1.
    - expect: The cart badge displays 2.
  2. Reload the browser page while on the cart page.
    - expect: The browser remains on the Your Cart page.
    - expect: Backpack and Fleece Jacket are still listed, each with quantity 1.
    - expect: The cart badge still displays 2.

#### 1.6. Checkout can be started with an empty cart

**File:** `tests/ui/cart-empty-checkout.spec.ts`

**Steps:**
  1. -
    - expect: The fresh cart is empty and the cart button has no numeric badge.
  2. Open the cart and click Checkout without adding any products.
    - expect: Checkout is allowed to start and the page navigates to Checkout: Your Information at /checkout-step-one.html.
    - expect: The First Name, Last Name, and Zip/Postal Code fields are visible, along with Cancel and Continue buttons.
    - expect: The cart remains empty and no numeric badge is displayed.

#### 1.7. Adding all six products displays a badge count of six

**File:** `tests/ui/cart-all-products.spec.ts`

**Steps:**
  1. From a fresh Products page, add Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt, Sauce Labs Fleece Jacket, Sauce Labs Onesie, and Test.allTheThings() T-Shirt (Red).
    - expect: All six product actions change to Remove.
    - expect: The cart badge displays 6.
  2. Open the cart.
    - expect: All six distinct products are listed exactly once, each with quantity 1.
    - expect: The cart badge displays 6.

#### 1.8. The badge disappears rather than displaying zero when the last item is removed

**File:** `tests/ui/cart-empty-badge.spec.ts`

**Steps:**
  1. Add Sauce Labs Backpack and open the cart.
    - expect: The cart contains one Backpack row with quantity 1.
    - expect: The cart badge displays 1.
  2. Click Remove on the Backpack row.
    - expect: The cart contains no product rows.
    - expect: The cart button is labeled Cart, empty and the numeric badge is absent; the interface does not display 0.
