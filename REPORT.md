# Inventory Management System
## Assessment Report

## 1. Task Assigned

Build a professional, responsive Inventory Management System for a small business using React and Vite.

The assigned task required:

- React and Vite implementation
- React Router navigation
- Shared state management using Context API or another justified solution
- Mock or public REST API integration
- Responsive user interface
- Dashboard with inventory statistics and charts
- Product CRUD operations
- Searchable, filterable, sortable, and paginated inventory table
- Stock-in and stock-out movement management
- Form validation and error handling
- Categories and settings management
- Reusable components
- Loading, empty, error, confirmation, and success states

The requested bonus features included:

- Authentication and role-based permissions
- Barcode or QR scanner interface
- CSV import/export
- Low-stock notifications
- Dark mode
- Product image upload
- Supplier management
- Activity or audit log
- Unit tests
- TanStack Query
- Hosted backend integration

## 2. Task Completed

### Core Application

- Built the application with React and Vite.
- Added React Router routes for all required pages.
- Added Context API through `InventoryContext` for shared inventory state.
- Added Toast Context for success and error notifications.
- Added a reusable service layer with LocalStorage persistence and simulated asynchronous API behavior.
- Added responsive desktop, tablet, and mobile layouts.

### Required Pages

- Dashboard
- Products / Inventory
- Add Product
- Edit Product
- Product Details
- Categories
- Stock Movements
- Settings
- Activity Log
- Suppliers

### Dashboard

- Total products statistic
- Total stock value statistic
- Low-stock item count
- Out-of-stock item count
- Recent stock activity
- Stock-by-category bar chart
- Inventory-value-over-time line chart

### Product Management

- Create products
- View products
- Edit products
- Delete individual products
- Bulk-delete selected products
- Product name, SKU, category, price, cost price, quantity, minimum stock level, supplier, and image fields
- Duplicate SKU validation
- Negative price and quantity prevention
- Required-field validation
- Product detail page with movement history

### Inventory Table

- Search by product name, SKU, or supplier
- Category filter
- Stock-status filter
- Sorting by product, category, price, and quantity
- Pagination
- Selectable rows
- Bulk deletion
- Clear low-stock and out-of-stock badges

### Stock Movements

- Stock-in movements
- Stock-out movements
- Quantity validation
- Prevention of stock-out beyond available inventory
- Movement date and optional notes
- Automatic product quantity updates
- Movement deletion reverses the original stock adjustment

### Categories

- Add category
- Edit category
- Delete category
- Duplicate category validation
- Protection against deleting categories assigned to products
- Automatic product synchronization when a category is renamed

### Settings

- Business name
- Owner name
- Currency selection
- Low-stock threshold
- Low-stock notification preference
- Dark mode preference

### Reusable UI Components

- Badges
- Charts
- Cards
- Confirmation dialogs
- Empty states
- Error states
- Filter dropdowns
- Loading states
- Modals
- Pagination
- Search inputs
- Product forms
- Barcode scanner dialog

## 3. Bonus Features Completed

### Authentication and RBAC

- Added authentication context with persistent browser sessions.
- Added administrator and staff demo roles.
- Added protected routes.
- Restricted categories, settings, and supplier mutations to administrators.
- Added sign-out functionality.

Demo accounts:

```text
admin / stockhub
staff / stockhub
```

### Barcode / SKU Scanner

- Added a scanner dialog that accepts barcode scanner keyboard input.
- Added direct SKU lookup and navigation to the matching product.
- USB scanners that behave like keyboards can be used with the interface.

### CSV Import and Export

- Export products to CSV.
- Import products from CSV.
- Validate imported product records through the same service-layer rules.
- Continue importing valid records when individual rows fail.

### Low-Stock Notifications

- Added a notification bell in the top navigation.
- Displays low-stock and out-of-stock products.
- Notification visibility can be enabled or disabled from Settings.

### Dark Mode

- Added application-wide dark mode.
- Dark mode preference is persisted in LocalStorage.
- Added a quick toggle in the top navigation.

### Product Image Upload

- Added remote image URL support.
- Added local image upload support using browser FileReader data URLs.
- Added product image preview in the product form.

### Supplier Management

- Added supplier CRUD functionality.
- Added supplier name, contact, phone, and address fields.
- Displayed the number of products associated with each supplier.
- Restricted supplier changes to administrators.

### Activity Log

- Added a chronological activity page.
- Displays product creation/update activity and stock movement activity.

### TanStack Query

- Added TanStack Query provider configuration.
- Added query defaults for stale time and retry behavior.
- Used TanStack Query for cached stock movement data in the Activity Log.

### Hosted API Adapter

- Added a hosted API client using `VITE_API_URL`.
- Supplier service supports hosted GET, POST, PUT, and DELETE endpoints.
- LocalStorage remains the default fallback when a hosted API URL is not configured.

Example environment variable:

```env
VITE_API_URL=https://your-api.example.com
```

### Automated Tests

- Added Vitest configuration.
- Added automated tests for:
  - Stock status calculation
  - Inventory value calculation
  - Category stock aggregation
  - Inventory value timeline generation

Test command:

```bash
npm run test
```

## 4. Validation Completed

The following commands pass successfully:

```bash
npm run build
npm run lint
npm run test
```

The application was also verified in the browser after fixing the authentication provider and login redirect flow.

## 5. Repository

GitHub repository:

https://github.com/69AMM/inventory-management

Main branch:

```text
main
```

## 6. Known Limitations

- Authentication is a frontend demo implementation and is not production security.
- LocalStorage is used as the default data store.
- Hosted API integration currently provides the supplier REST adapter; full product and movement backend integration would require matching backend endpoints.
- Automated test coverage currently focuses on utility functions rather than every UI workflow.
- Screenshots and demo video still need to be captured separately for final submission.
- Deployment to Vercel, Netlify, Render, or another hosting provider still needs to be completed.
