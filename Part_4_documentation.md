# ClearCart - Technical Documentation

## 1. Introduction

This document provides a technical overview of the ClearCart application, a full-stack solution for a product rental and marketplace platform. The goal was to build a robust, maintainable, and scalable application that adheres to modern software engineering best practices.

This documentation is intended for the engineering team to understand the architectural decisions, design patterns, and implementation details of the project.

**Core Technologies:**
*   **Backend:** Java 21, Spring Boot 3.2, Spring for GraphQL, Spring Data JPA
*   **Frontend:** React 18, Vite, Apollo Client, React Router, Mantine UI
*   **Database:** PostgreSQL 15
*   **Build & Orchestration:** Maven, Docker, Docker Compose

---

## 2. Backend Architecture

The backend is designed as a monolithic Spring Boot service, providing a GraphQL API. The focus was on creating a clean, layered architecture that is both testable and easy to extend.

### 2.1. API Layer - GraphQL

GraphQL was implemented as the required API paradigm for this project. The implementation leverages several key GraphQL advantages:

*   **Efficiency:** It eliminates over-fetching and under-fetching of data. The frontend can request the exact data it needs in a single network call, which is crucial for performance.
*   **Strongly-Typed Schema:** The `schema.graphqls` file acts as a powerful and self-documenting contract between the frontend and backend, reducing ambiguity and integration errors.
*   **Developer Experience:** Tools like the GraphiQL playground allow for rapid testing and exploration of the API without needing a UI.

### 2.2. Authentication & Security

Authentication is handled via a stateful, session-based approach using secure, `HttpOnly` cookies, which is a standard and robust method for web applications.

*   The `login` mutation establishes the session.
*   Subsequent requests from the frontend automatically include the session cookie (`credentials: 'include'` was set in Apollo Client).
*   The `currentUser` query serves as the primary mechanism for the frontend to verify an active session on application load.

### 2.3. Service Layer & DTO Pattern

A strict **Data Transfer Object (DTO)** pattern was implemented to decouple the internal database entities from the public-facing API.

*   **Why DTOs?** This is a critical security and design choice. It prevents sensitive information (like the `password` field in the `User` entity) from ever being accidentally exposed through the API. It also allows the API's shape to evolve independently of the database schema.
*   **Implementation:** The application uses `RegisterUserInput` for inputs and `AuthResponse`, `UserDashboard`, etc., for outputs. A dedicated `Mapper` layer handles the translation between entities and DTOs.

### 2.4. Exception Handling

A **Global GraphQL Exception Handler** (`GraphQLErrorHandler`) was implemented to provide clean, structured, and predictable error responses.

*   **Custom Exceptions:** Business-specific errors (e.g., `ResourceNotFoundException`) are thrown from the service layer.
*   **Structured Responses:** The handler catches these exceptions and transforms them into a consistent GraphQL error format with a user-friendly `message` and a machine-readable `errorCode` in the `extensions` field (e.g., `RESOURCE_NOT_FOUND`). This makes frontend error handling declarative and robust.
*   **Input Validation:** Spring Boot's validation starter is used to automatically validate DTOs, with violations being caught and formatted by the same global handler.

---

## 3. Database Architecture

The choice of database and schema management was driven by the need for reliability and explicit control.

### 3.1. Database & Schema Management

*   **Database:** PostgreSQL was chosen for its reliability, feature set, and strong performance as a relational database.
*   **Schema Management with Flyway:** Instead of allowing Hibernate's `ddl-auto` to implicitly manage the schema (which is unsafe for production-like environments), I chose **Flyway** for database migrations. This provides:
    *   **Explicit Control:** The database schema is defined in versioned `.sql` files.
    *   **Auditability:** Schema changes are tracked in version control, creating a clear history.
    *   **Reliability:** The database setup is deterministic and repeatable across any environment.

### 3.2. Key Schema Design Decision: Products vs. Transactions

A core architectural decision was to separate the static properties of a product from the time-based events that happen to it.

*   The **`products` table** stores the product's catalog information: its name, description, and the *default price* for renting or buying.
*   The **`transactions` table** acts as an immutable ledger, recording every single `SALE` or `RENTAL` event. **This is where specific rental dates (`rent_start_date`, `rent_end_date`) are stored.**

This separation was crucial for solving the **rental overlap corner case**.

---

## 4. Frontend Architecture

The frontend is a modern React Single-Page Application (SPA) built with Vite, focusing on component reusability and clean state management.

### 4.1. State Management (Authentication)

Authentication state management is handled directly within the routing layer through the `ProtectedRoute` component.

*   **Implementation:** The `ProtectedRoute` component encapsulates all authentication logic. It runs the `currentUser` query to check for an existing session whenever a protected route is accessed.
*   **Why this approach?** This keeps authentication concerns isolated to the routing layer, making the implementation straightforward and avoiding unnecessary global state management for a project of this scale.

### 4.2. Routing

Routing is handled by **React Router DOM**. The `ProtectedRoute` component serves dual purposes:

1. **Authentication Guard:** It verifies user authentication status before allowing access to protected routes like `/dashboard`.
2. **Session Management:** It handles the `currentUser` query execution and manages the authentication state for its child components.

Unauthenticated users are automatically redirected to the `/login` page, ensuring a secure user experience.

### 4.3. Data Fetching & Caching (Apollo Client)

Apollo Client is used for all GraphQL communication.

*   **Hooks:** `useQuery` and `useMutation` are used for declarative data fetching and state management (handling loading and error states automatically).
*   **Cache Management:** The `InMemoryCache` is used as required. To fulfill the requirement of keeping the UI in sync, mutations that alter data (e.g., `deleteProduct`) are configured to update the cache. This is typically done using the `update` function in the `useMutation` hook to manually evict the deleted item from the cache, or by refetching relevant queries (`refetchQueries`).

---

## 5. Corner Cases & Solutions

Several potential issues were considered and addressed in the design.

*   **Problem:** A user trying to rent a product for a period that overlaps with an existing rental.
    *   **Solution:** Before creating a new `RENTAL` transaction, the backend service layer performs a query on the `transactions` table to check for any existing rentals for that `product_id` whose date range conflicts with the requested dates. If a conflict is found, the mutation fails with a user-friendly error.

*   **Problem:** A user sees stale data after performing an action (e.g., deleting a product but it still appears on the page).
    *   **Solution:** This is handled by the Apollo Client cache management strategy. The `deleteProduct` mutation is configured to update the cache on completion, ensuring the UI re-renders with the correct, up-to-date list of products.

*   **Problem:** An unauthenticated user accessing a protected page by typing the URL directly.
    *   **Solution:** The `ProtectedRoute` component immediately redirects any unauthenticated access attempts to the `/login` page, preventing unauthorized access.

---
## 6. Future Improvements

Given more time, I would extend the project in the following ways:

*   **Enhanced Security:** Implement password hashing on the backend (e.g., with Spring Security's `BCryptPasswordEncoder`).
*   **Advanced Marketplace Filtering:** Implement comprehensive filtering capabilities for the marketplace, allowing users to filter products by:
    *   Price range (both for purchase and rental prices)
    *   Upload date (newest, oldest, or within a specific date range)
    *   Product categories
    *   Availability status
    *   User ratings (if implemented)
*   **Pagination:** Implement cursor-based pagination for the `products` query to handle large datasets efficiently.
*   **Real-time Features:** Use GraphQL Subscriptions to implement real-time notifications, for example, when a user's product is rented or sold.
*   **Comprehensive Testing:** Expand the test suite to include frontend component tests with React Testing Library and more extensive backend integration tests.