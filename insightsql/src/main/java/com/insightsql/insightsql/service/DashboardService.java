package com.insightsql.insightsql.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.insightsql.insightsql.repository.DashboardRepository;

@Service
public class DashboardService {

    private final DashboardRepository dashboardRepository;

    public DashboardService(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    public Map<String, Object> getDashboardKpis() {
        return dashboardRepository.getDashboardKpis();
    }

    public List<Map<String, Object>> getMonthlySales() {
        return dashboardRepository.getMonthlySales();
    }

    public List<Map<String, Object>> getTopCategories() {
        return dashboardRepository.getTopCategories();
    }

    public List<Map<String, Object>> getCustomerInsights() {
        return dashboardRepository.getCustomerInsights();
    }

    public List<Map<String, Object>> getPaymentInsights() {
        return dashboardRepository.getPaymentInsights();
    }

    public List<Map<String, Object>> getOrderInsights() {
        return dashboardRepository.getOrderInsights();
    }

    public Map<String, Object> getAdvancedCustomerKpis() {
        return dashboardRepository.getAdvancedCustomerKpis();
    }

    public List<Map<String, Object>> getCustomerSegments() {
        return dashboardRepository.getCustomerSegments();
    }

    public List<Map<String, Object>> getCustomerRetention() {
        return dashboardRepository.getCustomerRetention();
    }

    public List<Map<String, Object>> getFilteredOrderInsights(
            LocalDate startDate,
            LocalDate endDate,
            String status,
            String paymentType,
            String category) {

        if (startDate != null && endDate != null
                && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException(
                    "startDate must be on or before endDate");
        }

        return dashboardRepository.getFilteredOrderInsights(
                startDate, endDate, status, paymentType, category);
    }
}
