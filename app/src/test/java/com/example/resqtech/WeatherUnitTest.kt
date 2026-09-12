package com.example.resqtech

import com.example.resqtech.data.MockDataProvider
import com.example.resqtech.model.WeatherPersona
import org.junit.Assert.*
import org.junit.Test

class WeatherUnitTest {

    @Test
    fun testInitialCurrentWeatherState() {
        val weather = MockDataProvider.getInitialCurrentWeather()
        assertNotNull(weather)
        assertEquals(22.0, weather.temperatureC, 0.1)
        assertEquals(72.0, weather.temperatureF, 0.1)
        assertTrue(weather.humidityPct > 0)
        assertTrue(weather.windSpeedKmh > 0)
        assertEquals("Good", weather.aqiStatus)
    }

    @Test
    fun testHourlyAndDailyForecasts() {
        val hourly = MockDataProvider.getInitialHourlyForecast()
        assertTrue(hourly.isNotEmpty())
        assertEquals(8, hourly.size)

        val daily = MockDataProvider.getInitialDailyForecast()
        assertTrue(daily.isNotEmpty())
        assertEquals(7, daily.size)
    }

    @Test
    fun testIMDAlertsAndSafeHavens() {
        val imdAlerts = MockDataProvider.getInitialIMDAlerts()
        assertTrue(imdAlerts.isNotEmpty())

        val havens = MockDataProvider.getInitialSafeHavens()
        assertTrue(havens.isNotEmpty())
        assertTrue(havens.first().capacityTotal > 0)
    }
}
