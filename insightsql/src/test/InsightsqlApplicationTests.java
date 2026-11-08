package com.insightsql.insightsql;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class InsightsqlApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void contextLoads() {
    }

    @Test
void kpisEndpointShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/kpis"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.delivered_orders").value(96478))
            .andExpect(jsonPath("$.unique_customers").value(93358))
            .andExpect(jsonPath("$.total_item_sales").value(13221498.11))
            .andExpect(jsonPath("$.average_item_sales_per_order")
                    .value(137.0415857501191982))
            .andExpect(jsonPath("$.on_time_delivery_percentage").value(91.89));
}

   @Test
void monthlySalesEndpointShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/monthly-sales"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(23))
            .andExpect(jsonPath("$[0].month").value("2016-09"))
            .andExpect(jsonPath("$[0].delivered_orders").value(1))
            .andExpect(jsonPath("$[0].total_item_sales").value(134.97))
            .andExpect(jsonPath("$[1].month").value("2016-10"))
            .andExpect(jsonPath("$[1].delivered_orders").value(265))
            .andExpect(jsonPath("$[22].month").value("2018-08"))
            .andExpect(jsonPath("$[22].delivered_orders").value(6351))
            .andExpect(jsonPath("$[22].total_item_sales").value(838576.64));
}
    @Test
void topCategoriesEndpointShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/top-categories"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(10))

            // First category
            .andExpect(jsonPath("$[0].category").value("beleza_saude"))
            .andExpect(jsonPath("$[0].total_sales").value(1233131.72))
            .andExpect(jsonPath("$[0].total_orders").value(8647))

            // Second category
            .andExpect(jsonPath("$[1].category").value("relogios_presentes"))
            .andExpect(jsonPath("$[1].total_sales").value(1166176.98))
            .andExpect(jsonPath("$[1].total_orders").value(5495))

            // Third category
            .andExpect(jsonPath("$[2].category").value("cama_mesa_banho"))
            .andExpect(jsonPath("$[2].total_sales").value(1023434.76))
            .andExpect(jsonPath("$[2].total_orders").value(9272))

            // Last category
            .andExpect(jsonPath("$[9].category").value("brinquedos"))
            .andExpect(jsonPath("$[9].total_sales").value(471286.48))
            .andExpect(jsonPath("$[9].total_orders").value(3804));
}

  @Test
void customerInsightsEndpointShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/customer-insights"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2))

            .andExpect(jsonPath("$[0].customer_type")
                    .value("One-time customers"))
            .andExpect(jsonPath("$[0].total_customers").value(90557))

            .andExpect(jsonPath("$[1].customer_type")
                    .value("Repeat customers"))
            .andExpect(jsonPath("$[1].total_customers").value(2801));
}
@Test
void paymentInsightsEndpointShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/payment-insights"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(5))

            // Credit card
            .andExpect(jsonPath("$[0].payment_type").value("credit_card"))
            .andExpect(jsonPath("$[0].payment_records").value(76795))
            .andExpect(jsonPath("$[0].total_orders").value(76505))
            .andExpect(jsonPath("$[0].total_payment_value").value(12542084.19))
            .andExpect(jsonPath("$[0].average_payment_value").value(163.32))

            // Boleto
            .andExpect(jsonPath("$[1].payment_type").value("boleto"))
            .andExpect(jsonPath("$[1].payment_records").value(19784))
            .andExpect(jsonPath("$[1].total_orders").value(19784))
            .andExpect(jsonPath("$[1].total_payment_value").value(2869361.27))
            .andExpect(jsonPath("$[1].average_payment_value").value(145.03))

            // Voucher
            .andExpect(jsonPath("$[2].payment_type").value("voucher"))
            .andExpect(jsonPath("$[2].payment_records").value(5775))
            .andExpect(jsonPath("$[2].total_orders").value(3866))
            .andExpect(jsonPath("$[2].total_payment_value").value(379436.87))
            .andExpect(jsonPath("$[2].average_payment_value").value(65.70))

            // Debit card
            .andExpect(jsonPath("$[3].payment_type").value("debit_card"))
            .andExpect(jsonPath("$[3].payment_records").value(1529))
            .andExpect(jsonPath("$[3].total_orders").value(1528))
            .andExpect(jsonPath("$[3].total_payment_value").value(217989.79))
            .andExpect(jsonPath("$[3].average_payment_value").value(142.57))

            // Undefined payment type
            .andExpect(jsonPath("$[4].payment_type").value("not_defined"))
            .andExpect(jsonPath("$[4].payment_records").value(3))
            .andExpect(jsonPath("$[4].total_orders").value(3))
            .andExpect(jsonPath("$[4].total_payment_value").value(0))
            .andExpect(jsonPath("$[4].average_payment_value").value(0));
}
 @Test
void orderInsightsEndpointShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/order-insights"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(8))

            .andExpect(jsonPath("$[0].order_status").value("delivered"))
            .andExpect(jsonPath("$[0].total_orders").value(96478))

            .andExpect(jsonPath("$[1].order_status").value("shipped"))
            .andExpect(jsonPath("$[1].total_orders").value(1107))

            .andExpect(jsonPath("$[2].order_status").value("canceled"))
            .andExpect(jsonPath("$[2].total_orders").value(625))

            .andExpect(jsonPath("$[3].order_status").value("unavailable"))
            .andExpect(jsonPath("$[3].total_orders").value(609))

            .andExpect(jsonPath("$[4].order_status").value("invoiced"))
            .andExpect(jsonPath("$[4].total_orders").value(314))

            .andExpect(jsonPath("$[5].order_status").value("processing"))
            .andExpect(jsonPath("$[5].total_orders").value(301))

            .andExpect(jsonPath("$[6].order_status").value("created"))
            .andExpect(jsonPath("$[6].total_orders").value(5))

            .andExpect(jsonPath("$[7].order_status").value("approved"))
            .andExpect(jsonPath("$[7].total_orders").value(2));
}

   @Test
void customerAdvancedKpisEndpointShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/customer-advanced-kpis"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.analyzed_customers").value(93358))
            .andExpect(jsonPath("$.repeat_customers").value(2801))
            .andExpect(jsonPath("$.repeat_purchase_rate").value(3))
            .andExpect(jsonPath("$.average_orders_per_customer").value(1.03))
            .andExpect(jsonPath("$.average_customer_lifetime_sales").value(141.62))
            .andExpect(jsonPath("$.average_order_value").value(137.04))
            .andExpect(jsonPath("$.highest_customer_lifetime_sales").value(13440));
}

@Test
void customerSegmentsEndpointShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/customer-segments"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(3))

            // One-time customers
            .andExpect(jsonPath("$[0].customer_segment")
                    .value("One-time (1 order)"))
            .andExpect(jsonPath("$[0].total_customers").value(90557))
            .andExpect(jsonPath("$[0].customer_percentage").value(97))
            .andExpect(jsonPath("$[0].average_lifetime_sales").value(137.96))
            .andExpect(jsonPath("$[0].average_orders").value(1))

            // Repeat customers
            .andExpect(jsonPath("$[1].customer_segment")
                    .value("Repeat (2–3 orders)"))
            .andExpect(jsonPath("$[1].total_customers").value(2754))
            .andExpect(jsonPath("$[1].customer_percentage").value(2.95))
            .andExpect(jsonPath("$[1].average_lifetime_sales").value(253.18))
            .andExpect(jsonPath("$[1].average_orders").value(2.07))

            // Loyal customers
            .andExpect(jsonPath("$[2].customer_segment")
                    .value("Loyal (4+ orders)"))
            .andExpect(jsonPath("$[2].total_customers").value(47))
            .andExpect(jsonPath("$[2].customer_percentage").value(0.05))
            .andExpect(jsonPath("$[2].average_lifetime_sales").value(662.97))
            .andExpect(jsonPath("$[2].average_orders").value(4.94));
}

  @Test
void customerRetentionEndpointShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/customer-retention"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(23))

            // September 2016
            .andExpect(jsonPath("$[0].month").value("2016-09"))
            .andExpect(jsonPath("$[0].active_customers").value(1))
            .andExpect(jsonPath("$[0].returning_customers").value(0))
            .andExpect(jsonPath("$[0].returning_customer_rate").value(0))

            // January 2017
            .andExpect(jsonPath("$[3].month").value("2017-01"))
            .andExpect(jsonPath("$[3].active_customers").value(718))
            .andExpect(jsonPath("$[3].returning_customers").value(1))
            .andExpect(jsonPath("$[3].returning_customer_rate").value(0.14))

            // November 2017
            .andExpect(jsonPath("$[13].month").value("2017-11"))
            .andExpect(jsonPath("$[13].active_customers").value(7183))
            .andExpect(jsonPath("$[13].returning_customers").value(123))
            .andExpect(jsonPath("$[13].returning_customer_rate").value(1.71))

            // August 2018
            .andExpect(jsonPath("$[22].month").value("2018-08"))
            .andExpect(jsonPath("$[22].active_customers").value(6310))
            .andExpect(jsonPath("$[22].returning_customers").value(166))
            .andExpect(jsonPath("$[22].returning_customer_rate").value(2.63));
}
@Test
void filteredOrderInsightsEndpointShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/filtered-order-insights"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(8))
            .andExpect(jsonPath("$[0].order_status").value("delivered"))
            .andExpect(jsonPath("$[0].total_orders").value(96478))
            .andExpect(jsonPath("$[1].order_status").value("shipped"))
            .andExpect(jsonPath("$[1].total_orders").value(1107))
            .andExpect(jsonPath("$[2].order_status").value("canceled"))
            .andExpect(jsonPath("$[2].total_orders").value(625))
            .andExpect(jsonPath("$[3].order_status").value("unavailable"))
            .andExpect(jsonPath("$[3].total_orders").value(609))
            .andExpect(jsonPath("$[4].order_status").value("invoiced"))
            .andExpect(jsonPath("$[4].total_orders").value(314))
            .andExpect(jsonPath("$[5].order_status").value("processing"))
            .andExpect(jsonPath("$[5].total_orders").value(301))
            .andExpect(jsonPath("$[6].order_status").value("created"))
            .andExpect(jsonPath("$[6].total_orders").value(5))
            .andExpect(jsonPath("$[7].order_status").value("approved"))
            .andExpect(jsonPath("$[7].total_orders").value(2));
}

@Test
void filteredOrderInsightsByStatusShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/filtered-order-insights")
                    .param("status", "delivered"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].order_status").value("delivered"))
            .andExpect(jsonPath("$[0].total_orders").value(96478));
}

@Test
void filteredOrderInsightsByPaymentTypeShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/filtered-order-insights")
                    .param("paymentType", "credit_card"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(8))
            .andExpect(jsonPath("$[0].order_status").value("delivered"))
            .andExpect(jsonPath("$[0].total_orders").value(74304))
            .andExpect(jsonPath("$[1].total_orders").value(848))
            .andExpect(jsonPath("$[2].total_orders").value(444))
            .andExpect(jsonPath("$[3].total_orders").value(443))
            .andExpect(jsonPath("$[4].total_orders").value(239))
            .andExpect(jsonPath("$[5].total_orders").value(222))
            .andExpect(jsonPath("$[6].total_orders").value(3))
            .andExpect(jsonPath("$[7].total_orders").value(2));
}


@Test
void filteredOrderInsightsByCategoryShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/filtered-order-insights")
                    .param("category", "beleza_saude"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(5))
            .andExpect(jsonPath("$[0].order_status").value("delivered"))
            .andExpect(jsonPath("$[0].total_orders").value(8647))
            .andExpect(jsonPath("$[1].order_status").value("shipped"))
            .andExpect(jsonPath("$[1].total_orders").value(107))
            .andExpect(jsonPath("$[2].order_status").value("canceled"))
            .andExpect(jsonPath("$[2].total_orders").value(36))
            .andExpect(jsonPath("$[3].order_status").value("invoiced"))
            .andExpect(jsonPath("$[3].total_orders").value(32))
            .andExpect(jsonPath("$[4].order_status").value("processing"))
            .andExpect(jsonPath("$[4].total_orders").value(14));
}

@Test
void filteredOrderInsightsByStartDateShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/filtered-order-insights")
                    .param("startDate", "2017-01-01"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(8))
            .andExpect(jsonPath("$[0].order_status").value("delivered"))
            .andExpect(jsonPath("$[0].total_orders").value(96211))
            .andExpect(jsonPath("$[1].total_orders").value(1098))
            .andExpect(jsonPath("$[2].total_orders").value(602))
            .andExpect(jsonPath("$[3].total_orders").value(599))
            .andExpect(jsonPath("$[4].total_orders").value(299))
            .andExpect(jsonPath("$[5].total_orders").value(296))
            .andExpect(jsonPath("$[6].total_orders").value(5))
            .andExpect(jsonPath("$[7].total_orders").value(2));
}

@Test
void filteredOrderInsightsByEndDateShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/filtered-order-insights")
                    .param("endDate", "2017-12-31"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(8))
            .andExpect(jsonPath("$[0].order_status").value("delivered"))
            .andExpect(jsonPath("$[0].total_orders").value(43695))
            .andExpect(jsonPath("$[1].total_orders").value(539))
            .andExpect(jsonPath("$[2].total_orders").value(464))
            .andExpect(jsonPath("$[3].total_orders").value(291))
            .andExpect(jsonPath("$[4].total_orders").value(242))
            .andExpect(jsonPath("$[5].total_orders").value(193))
            .andExpect(jsonPath("$[6].total_orders").value(4))
            .andExpect(jsonPath("$[7].total_orders").value(2));
}

@Test
void filteredOrderInsightsByDateRangeShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/filtered-order-insights")
                    .param("startDate", "2017-01-01")
                    .param("endDate", "2017-12-31"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(8))
            .andExpect(jsonPath("$[0].order_status").value("delivered"))
            .andExpect(jsonPath("$[0].total_orders").value(43428))
            .andExpect(jsonPath("$[1].total_orders").value(530))
            .andExpect(jsonPath("$[2].total_orders").value(457))
            .andExpect(jsonPath("$[3].total_orders").value(265))
            .andExpect(jsonPath("$[4].total_orders").value(240))
            .andExpect(jsonPath("$[5].total_orders").value(175))
            .andExpect(jsonPath("$[6].total_orders").value(4))
            .andExpect(jsonPath("$[7].total_orders").value(2));
}

@Test
void filteredOrderInsightsWithAllFiltersShouldReturnCorrectData() throws Exception {
    mockMvc.perform(get("/api/dashboard/filtered-order-insights")
                    .param("startDate", "2017-01-01")
                    .param("endDate", "2017-12-31")
                    .param("status", "delivered")
                    .param("paymentType", "credit_card")
                    .param("category", "beleza_saude"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].order_status").value("delivered"))
            .andExpect(jsonPath("$[0].total_orders").value(2571));
}

@Test
void invalidDateRangeShouldReturnBadRequest() throws Exception {
    mockMvc.perform(get("/api/dashboard/filtered-order-insights")
                    .param("startDate", "2018-01-01")
                    .param("endDate", "2017-01-01"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error")
                    .value("startDate must be on or before endDate"));
}

@Test
void invalidDateFormatShouldReturnBadRequest() throws Exception {
    mockMvc.perform(get("/api/dashboard/filtered-order-insights")
                    .param("startDate", "invalid-date"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error")
                    .value("Parse attempt failed for value [invalid-date]"));
}

@Test
void unknownOrderStatusShouldReturnEmptyResult() throws Exception {
    mockMvc.perform(get("/api/dashboard/filtered-order-insights")
                    .param("status", "unknown_status"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(0));
}

@Test
void unknownPaymentTypeShouldReturnEmptyResult() throws Exception {
    mockMvc.perform(get("/api/dashboard/filtered-order-insights")
                    .param("paymentType", "unknown_payment"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(0));
}

@Test
void unknownCategoryShouldReturnEmptyResult() throws Exception {
    mockMvc.perform(get("/api/dashboard/filtered-order-insights")
                    .param("category", "unknown_category"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(0));
}
}
