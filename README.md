# InsightSQL – E-Commerce Data Analytics Dashboard

InsightSQL is a full-stack e-commerce analytics application that transforms raw transactional data into meaningful business insights through SQL analysis, REST APIs, and interactive visualizations.

The project uses the Brazilian Olist e-commerce dataset to analyze sales performance, customer behavior, payment preferences, order trends, product categories, and customer retention.

## Key Features

### Business Analytics
- **Sales Analytics:** Track monthly sales, delivered orders, and average order value.
- **Customer Insights:** Analyze unique customers, repeat purchases, customer lifetime sales, and customer segments.
- **Customer Retention:** Understand monthly customer activity and returning-customer trends.
- **Payment Analytics:** Compare payment methods, transaction counts, and payment values.
- **Order Analytics:** Examine order-status distribution and delivery performance.
- **Category Performance:** Identify top-performing product categories.

### Interactive Dashboard
- Interactive charts and KPI cards.
- Filter order analytics by date range, order status, payment type, and product category.
- Responsive React interface.
- REST API integration with the Spring Boot backend.

### Backend and API Quality
- RESTful API architecture using Spring Boot.
- Layered architecture with Controller, Service, and Repository components.
- SQL queries using Spring JdbcTemplate.
- Input validation and centralized exception handling.
- Interactive API documentation using Swagger UI.
- Automated backend tests.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | Java, Spring Boot |
| Database | PostgreSQL |
| Database Hosting | Neon |
| Data Access | Spring JdbcTemplate |
| API Documentation | Swagger / OpenAPI |
| Testing | JUnit, Spring Boot Test |
| Development Tools | VS Code, Maven, Postman |

## System Architecture

```text
              Olist E-Commerce Dataset
                        |
                        v
                 PostgreSQL (Neon)
                        |
                        v
              Spring Boot REST API
                        |
          +-------------+-------------+
          |             |             |
      Controller     Service     Repository
          |             |             |
          +-------------+-------------+
                        |
                        v
                REST API Responses
                        |
                        v
                 React Dashboard
                        |
                        v
             Interactive Visualizations
```

## Database Overview

The application uses five PostgreSQL tables:

| Table | Description |
|---|---|
| customers | Customer information |
| orders | Order details and timestamps |
| order_items | Products purchased and transaction prices |
| products | Product categories and attributes |
| payments | Payment methods and transaction values |

### Dataset Statistics

| Metric | Records |
|---|---:|
| Customers | 99,441 |
| Orders | 99,441 |
| Products | 32,951 |
| Order Items | 112,650 |
| Payments | 103,886 |

## Key Analytical Findings

The following insights were obtained from the dataset:

- **96,478** delivered orders.
- **93,358** unique customers with delivered orders.
- **R$13.22 million** in delivered-order item sales, excluding freight.
- **R$137.04** average item sales per delivered order.
- **91.89%** on-time delivery rate.
- **3%** repeat purchase rate.

These metrics help demonstrate sales performance, customer purchasing behavior, and delivery efficiency.

## REST API Endpoints

Base URL: `http://localhost:8080`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/dashboard/kpis` | Overall dashboard KPIs |
| GET | `/api/dashboard/monthly-sales` | Monthly sales analysis |
| GET | `/api/dashboard/top-categories` | Top product categories |
| GET | `/api/dashboard/customer-insights` | Customer insights |
| GET | `/api/dashboard/payment-insights` | Payment analysis |
| GET | `/api/dashboard/order-insights` | Order statistics |
| GET | `/api/dashboard/filtered-order-insights` | Filtered order analysis |
| GET | `/api/dashboard/customer-advanced-kpis` | Advanced customer KPIs |
| GET | `/api/dashboard/customer-segments` | Customer segmentation |
| GET | `/api/dashboard/customer-retention` | Customer retention analysis |

### Filtering Example

The filtered order endpoint supports:

- `startDate`
- `endDate`
- `status`
- `paymentType`
- `category`

Example:

```http
GET /api/dashboard/filtered-order-insights?startDate=2017-01-01&endDate=2017-12-31&status=delivered&paymentType=credit_card&category=beleza_saude
```

## API Documentation

Swagger UI provides interactive documentation for exploring and testing the REST APIs.

When the backend is running, visit:

`http://localhost:8080/swagger-ui/index.html`

## Testing

The backend includes automated tests covering:

- Dashboard KPI endpoints.
- Monthly sales and category analytics.
- Customer, payment, and order insights.
- Customer segmentation and retention.
- Date and combined filter scenarios.
- Invalid date ranges and date formats.
- Unknown filter values.

**Current test status: 23 tests passed, 0 failures, 0 errors.**

Run the tests from the backend directory:

```powershell
.\mvnw.cmd clean test
```

## Running the Project Locally

### Prerequisites

- Java 21
- Node.js and npm
- Neon PostgreSQL account
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd InsightSQL
```

### 2. Configure Environment Variables

Configure the following environment variables using your Neon PostgreSQL credentials:

```text
NEON_DATABASE_URL
NEON_DATABASE_USERNAME
NEON_DATABASE_PASSWORD
```

The backend reads these values from environment variables through `application.yaml`.

Do not commit database credentials or files containing secrets.

### 3. Start the Backend

Open a terminal in the project root and navigate to the backend folder:

```powershell
cd insightsql
```

Start the Spring Boot application:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend URL:

`http://localhost:8080`

### 4. Start the Frontend

Open another terminal in the project root:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

`http://localhost:5173`

## Project Structure

```text
InsightSQL/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── insightsql/
│   ├── .mvn/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/insightsql/insightsql/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── OpenApiConfig.java
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   └── resources/
│   │   │       └── application.yaml
│   │   └── test/
│   │       └── java/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── .gitignore
└── README.md
```

## Future Improvements

- Deploy the frontend and backend for public access.
- Add advanced analytics and additional business KPIs.
- Improve dashboard export and reporting capabilities.
- Introduce pagination and caching for larger datasets.

## Dataset

The project uses the Brazilian E-Commerce Public Dataset by Olist, available on Kaggle.

Dataset: https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

---

**InsightSQL – Turning E-Commerce Data into Actionable Business Insights.**
