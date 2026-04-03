#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "esp_log.h"

#define LED_PIN GPIO_NUM_2

static const char *TAG = "grimox";

void app_main(void)
{
    ESP_LOGI(TAG, "Hello from Grimox (ESP-IDF)");

    gpio_reset_pin(LED_PIN);
    gpio_set_direction(LED_PIN, GPIO_MODE_OUTPUT);

    int level = 0;
    while (1) {
        level = !level;
        gpio_set_level(LED_PIN, level);
        ESP_LOGI(TAG, "LED %s", level ? "ON" : "OFF");
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}
