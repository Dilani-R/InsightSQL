package com.insightsql.insightsql.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public class DashboardRepository {

    private final JdbcTemplate jdbcTemplate;

    public DashboardRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // API 1: Dashboard KPI metrics
    public Map<String, Object> getDashboardKpis() {
        String sql = """
            WITH delivered_orders AS (
                SELECT o.order_id, o.customer_id,
                       o.order_delivered_customer_date,
                       o.order_estimated_delivery_date
                FROM orders o
                WHERE o.order_status = 'delivered'
            ),
            order_sales AS (
                SELECT oi.order_id, SUM(oi.price) AS item_sales
                FROM order_items oi
                INNER JOIN delivered_orders d ON d.order_id = oi.order_id
                GROUP BY oi.order_id
            )
            SELECT
                COUNT(DISTINCT d.order_id) AS delivered_orders,
                COUNT(DISTINCT c.customer_unique_id) AS unique_customers,
                COALESCE(SUM(s.item_sales), 0) AS total_item_sales,
                COALESCE(AVG(s.item_sales), 0) AS average_item_sales_per_order,
                ROUND(
                    100.0 * COUNT(*) FILTER (
                        WHERE d.order_delivered_customer_date <= d.order_estimated_delivery_date
                    ) / NULLIF(COUNT(*) FILTER (
                        WHERE d.order_delivered_customer_date IS NOT NULL
                          AND d.order_estimated_delivery_date IS NOT NULL
                    ), 0), 2
                ) AS on_time_delivery_percentage
            FROM delivered_orders d
            INNER JOIN customers c ON c.customer_id = d.customer_id
            LEFT JOIN order_sales s ON s.order_id = d.order_id
            """;
        return jdbcTemplate.queryForMap(sql);
    }

    // API 2: Monthly sales analytics
    public List<Map<String, Object>> getMonthlySales() {
        String sql = """
            SELECT TO_CHAR(DATE_TRUNC('month', o.order_purchase_timestamp), 'YYYY-MM') AS month,
                   COUNT(DISTINCT o.order_id) AS delivered_orders,
                   ROUND(COALESCE(SUM(oi.price), 0)::numeric, 2) AS total_item_sales
            FROM orders o
            INNER JOIN order_items oi ON o.order_id = oi.order_id
            WHERE o.order_status = 'delivered'
            GROUP BY DATE_TRUNC('month', o.order_purchase_timestamp)
            ORDER BY DATE_TRUNC('month', o.order_purchase_timestamp)
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // API 3: Top product categories by delivered-order sales
    public List<Map<String, Object>> getTopCategories() {
        String sql = """
            SELECT COALESCE(p.product_category_name, 'Unknown') AS category,
                   ROUND(SUM(oi.price)::numeric, 2) AS total_sales,
                   COUNT(DISTINCT oi.order_id) AS total_orders
            FROM order_items oi
            INNER JOIN orders o ON o.order_id = oi.order_id
            INNER JOIN products p ON p.product_id = oi.product_id
            WHERE o.order_status = 'delivered'
            GROUP BY COALESCE(p.product_category_name, 'Unknown')
            ORDER BY SUM(oi.price) DESC
            LIMIT 10
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // API 4: One-time versus repeat customers, based on delivered orders
    public List<Map<String, Object>> getCustomerInsights() {
        String sql = """
            WITH customer_orders AS (
                SELECT c.customer_unique_id, COUNT(DISTINCT o.order_id) AS order_count
                FROM customers c
                INNER JOIN orders o ON o.customer_id = c.customer_id
                WHERE o.order_status = 'delivered'
                GROUP BY c.customer_unique_id
            )
            SELECT CASE WHEN order_count = 1 THEN 'One-time customers'
                        ELSE 'Repeat customers' END AS customer_type,
                   COUNT(*) AS total_customers
            FROM customer_orders
            GROUP BY CASE WHEN order_count = 1 THEN 'One-time customers'
                          ELSE 'Repeat customers' END
            ORDER BY total_customers DESC
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // API 5: Payment method analytics across all order statuses
    public List<Map<String, Object>> getPaymentInsights() {
        String sql = """
            SELECT payment_type,
                   COUNT(*) AS payment_records,
                   COUNT(DISTINCT order_id) AS total_orders,
                   ROUND(SUM(payment_value)::numeric, 2) AS total_payment_value,
                   ROUND(AVG(payment_value)::numeric, 2) AS average_payment_value
            FROM payments
            GROUP BY payment_type
            ORDER BY SUM(payment_value) DESC
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // API 6: Overall order status analytics
    public List<Map<String, Object>> getOrderInsights() {
        String sql = """
            SELECT order_status, COUNT(*) AS total_orders
            FROM orders
            GROUP BY order_status
            ORDER BY total_orders DESC
            """;
        return jdbcTemplate.queryForList(sql);
    }

    // API 7 / Phase 5: Parameterized order analytics filters.
    // Filters are optional; payment/category filtering uses EXISTS to avoid multiplying order rows.
    public List<Map<String, Object>> getFilteredOrderInsights(
            LocalDate startDate, LocalDate endDate, String status,
            String paymentType, String category) {

        String sql = """
            SELECT o.order_status, COUNT(DISTINCT o.order_id) AS total_orders
            FROM orders o
            WHERE (CAST(? AS DATE) IS NULL OR o.order_purchase_timestamp >= CAST(? AS DATE))
              AND (CAST(? AS DATE) IS NULL OR o.order_purchase_timestamp < CAST(? AS DATE) + INTERVAL '1 day')
              AND (CAST(? AS VARCHAR) IS NULL OR o.order_status = CAST(? AS VARCHAR))
              AND (CAST(? AS VARCHAR) IS NULL OR EXISTS (
                    SELECT 1 FROM payments pay
                    WHERE pay.order_id = o.order_id
                      AND pay.payment_type = CAST(? AS VARCHAR)
              ))
              AND (CAST(? AS VARCHAR) IS NULL OR EXISTS (
                    SELECT 1
                    FROM order_items oi
                    INNER JOIN products p ON p.product_id = oi.product_id
                    WHERE oi.order_id = o.order_id
                      AND COALESCE(p.product_category_name, 'Unknown') = CAST(? AS VARCHAR)
              ))
            GROUP BY o.order_status
            ORDER BY total_orders DESC
            """;

        return jdbcTemplate.queryForList(sql,
                dateOrNull(startDate), dateOrNull(startDate),
                dateOrNull(endDate), dateOrNull(endDate),
                stringOrNull(status), stringOrNull(status),
                stringOrNull(paymentType), stringOrNull(paymentType),
                stringOrNull(category), stringOrNull(category));
    }


    // Phase 6: Customer lifetime, repeat-purchase and average-order-value KPIs.
    public Map<String, Object> getAdvancedCustomerKpis() {
        String sql = """
            WITH delivered_order_sales AS (
                SELECT o.order_id, c.customer_unique_id,
                       o.order_purchase_timestamp,
                       COALESCE(SUM(oi.price), 0) AS item_sales
                FROM orders o
                INNER JOIN customers c ON c.customer_id = o.customer_id
                LEFT JOIN order_items oi ON oi.order_id = o.order_id
                WHERE o.order_status = 'delivered'
                GROUP BY o.order_id, c.customer_unique_id, o.order_purchase_timestamp
            ), customer_totals AS (
                SELECT customer_unique_id,
                       COUNT(*) AS delivered_order_count,
                       SUM(item_sales) AS lifetime_item_sales
                FROM delivered_order_sales
                GROUP BY customer_unique_id
            )
            SELECT
                COUNT(*) AS analyzed_customers,
                COUNT(*) FILTER (WHERE delivered_order_count > 1) AS repeat_customers,
                ROUND(100.0 * COUNT(*) FILTER (WHERE delivered_order_count > 1)
                    / NULLIF(COUNT(*), 0), 2) AS repeat_purchase_rate,
                ROUND(AVG(delivered_order_count)::numeric, 2) AS average_orders_per_customer,
                ROUND(AVG(lifetime_item_sales)::numeric, 2) AS average_customer_lifetime_sales,
                ROUND((SELECT AVG(item_sales) FROM delivered_order_sales)::numeric, 2) AS average_order_value,
                ROUND(MAX(lifetime_item_sales)::numeric, 2) AS highest_customer_lifetime_sales
            FROM customer_totals
            """;
        return jdbcTemplate.queryForMap(sql);
    }

    // Phase 6: Segments based on distinct delivered orders per customer identity.
    public List<Map<String, Object>> getCustomerSegments() {
        String sql = """
            WITH customer_totals AS (
                SELECT c.customer_unique_id, COUNT(DISTINCT o.order_id) AS order_count,
                       COALESCE(SUM(order_item_totals.item_sales), 0) AS lifetime_item_sales
                FROM customers c
                INNER JOIN orders o ON o.customer_id = c.customer_id
                LEFT JOIN (
                    SELECT order_id, SUM(price) AS item_sales
                    FROM order_items
                    GROUP BY order_id
                ) order_item_totals ON order_item_totals.order_id = o.order_id
                WHERE o.order_status = 'delivered'
                GROUP BY c.customer_unique_id
            ), segmented AS (
                SELECT *, CASE
                    WHEN order_count = 1 THEN 'One-time (1 order)'
                    WHEN order_count BETWEEN 2 AND 3 THEN 'Repeat (2–3 orders)'
                    ELSE 'Loyal (4+ orders)'
                END AS customer_segment
                FROM customer_totals
            )
            SELECT customer_segment,
                   COUNT(*) AS total_customers,
                   ROUND(100.0 * COUNT(*) / NULLIF(SUM(COUNT(*)) OVER (), 0), 2) AS customer_percentage,
                   ROUND(AVG(lifetime_item_sales)::numeric, 2) AS average_lifetime_sales,
                   ROUND(AVG(order_count)::numeric, 2) AS average_orders
            FROM segmented
            GROUP BY customer_segment
            ORDER BY CASE customer_segment
                WHEN 'One-time (1 order)' THEN 1
                WHEN 'Repeat (2–3 orders)' THEN 2 ELSE 3 END
            """;
        return jdbcTemplate.queryForList(sql);
    }

   
        // Phase 6: Optimized monthly returning-customer retention.
public List<Map<String, Object>> getCustomerRetention() {

    String sql = """
        WITH monthly_customer_activity AS (
            SELECT
                c.customer_unique_id,
                DATE_TRUNC('month', o.order_purchase_timestamp) AS order_month
            FROM orders o
            INNER JOIN customers c
                ON c.customer_id = o.customer_id
            WHERE o.order_status = 'delivered'
              AND o.order_purchase_timestamp IS NOT NULL
            GROUP BY
                c.customer_unique_id,
                DATE_TRUNC('month', o.order_purchase_timestamp)
        ),
        first_customer_month AS (
            SELECT
                customer_unique_id,
                MIN(order_month) AS first_order_month
            FROM monthly_customer_activity
            GROUP BY customer_unique_id
        )
        SELECT
            TO_CHAR(a.order_month, 'YYYY-MM') AS month,
            COUNT(*) AS active_customers,
            COUNT(*) FILTER (
                WHERE f.first_order_month < a.order_month
            ) AS returning_customers,
            ROUND(
                100.0 * COUNT(*) FILTER (
                    WHERE f.first_order_month < a.order_month
                ) / NULLIF(COUNT(*), 0),
                2
            ) AS returning_customer_rate
        FROM monthly_customer_activity a
        INNER JOIN first_customer_month f
            ON f.customer_unique_id = a.customer_unique_id
        GROUP BY a.order_month
        ORDER BY a.order_month
        """;

    return jdbcTemplate.queryForList(sql);
}
    

    private Date dateOrNull(LocalDate value) {
        return value == null ? null : Date.valueOf(value);
    }

    private String stringOrNull(String value) {
    return value == null || value.isBlank() ? null : value.trim();
}
}
