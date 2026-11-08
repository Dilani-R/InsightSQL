package com.insightsql.insightsql.controller;

import com.insightsql.insightsql.service.DashboardService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@Tag(
    name = "Dashboard Analytics",
    description = "APIs for analyzing Olist e-commerce sales, customers, payments and orders"
)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @Operation(
        summary = "Get dashboard KPIs",
        description = "Returns key business metrics including delivered orders, "
                    + "unique customers, total item sales, average sales per order "
                    + "and on-time delivery percentage."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Dashboard KPIs retrieved successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/kpis")
    public Map<String, Object> getDashboardKpis() {
        return dashboardService.getDashboardKpis();
    }

    @Operation(
        summary = "Get monthly sales",
        description = "Returns monthly delivered order counts and total item sales."
    )
    @GetMapping("/monthly-sales")
    public List<Map<String, Object>> getMonthlySales() {
        return dashboardService.getMonthlySales();
    }

    @Operation(
        summary = "Get top product categories",
        description = "Returns the highest-performing product categories based on sales."
    )
    @GetMapping("/top-categories")
    public List<Map<String, Object>> getTopCategories() {
        return dashboardService.getTopCategories();
    }

    @Operation(
        summary = "Get customer insights",
        description = "Returns customer-related analytics and purchasing patterns."
    )
    @GetMapping("/customer-insights")
    public List<Map<String, Object>> getCustomerInsights() {
        return dashboardService.getCustomerInsights();
    }

    @Operation(
        summary = "Get payment insights",
        description = "Analyzes payment methods, transaction counts and payment values."
    )
    @GetMapping("/payment-insights")
    public List<Map<String, Object>> getPaymentInsights() {
        return dashboardService.getPaymentInsights();
    }

    @Operation(
        summary = "Get order insights",
        description = "Returns order distribution across different order statuses."
    )
    @GetMapping("/order-insights")
    public List<Map<String, Object>> getOrderInsights() {
        return dashboardService.getOrderInsights();
    }

    @Operation(
        summary = "Get advanced customer KPIs",
        description = "Returns repeat purchase rate, average customer lifetime sales, "
                    + "average order value and other customer performance metrics."
    )
    @GetMapping("/customer-advanced-kpis")
    public Map<String, Object> getAdvancedCustomerKpis() {
        return dashboardService.getAdvancedCustomerKpis();
    }

    @Operation(
        summary = "Get customer segments",
        description = "Classifies customers into one-time, repeat and loyal customer groups."
    )
    @GetMapping("/customer-segments")
    public List<Map<String, Object>> getCustomerSegments() {
        return dashboardService.getCustomerSegments();
    }

    @Operation(
        summary = "Get customer retention",
        description = "Returns monthly active customers, returning customers and retention rates."
    )
    @GetMapping("/customer-retention")
    public List<Map<String, Object>> getCustomerRetention() {
        return dashboardService.getCustomerRetention();
    }

    @Operation(
        summary = "Get filtered order insights",
        description = "Filters order statistics using date range, order status, "
                    + "payment type and product category."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Filtered order insights retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid date range or date format"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/filtered-order-insights")
    public List<Map<String, Object>> getFilteredOrderInsights(

        @Parameter(description = "Start date in YYYY-MM-DD format")
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate startDate,

        @Parameter(description = "End date in YYYY-MM-DD format")
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate endDate,

        @Parameter(description = "Filter by order status, e.g. delivered")
        @RequestParam(required = false)
        String status,

        @Parameter(description = "Filter by payment method, e.g. credit_card")
        @RequestParam(required = false)
        String paymentType,

        @Parameter(description = "Filter by product category, e.g. beleza_saude")
        @RequestParam(required = false)
        String category) {

        return dashboardService.getFilteredOrderInsights(
                startDate, endDate, status, paymentType, category);
    }
}
