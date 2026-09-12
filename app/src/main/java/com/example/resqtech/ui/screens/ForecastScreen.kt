package com.example.resqtech.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqtech.model.*
import com.example.resqtech.ui.theme.*

@Composable
fun ForecastScreen(
    hourlyForecast: List<HourlyWeatherForecast>,
    dailyForecast: List<DailyWeatherForecast>,
    nwpData: NWPModelComparisonData,
    agroData: AgroAdvisoryData,
    temperatureUnit: String,
    modifier: Modifier = Modifier
) {
    var activeSubTab by remember { mutableStateOf("outlook") } // "outlook", "nwp", "agro"

    Column(modifier = modifier.fillMaxSize().background(DarkBackground)) {
        // Sub-Tab Switcher
        Surface(color = DarkSurface, shadowElevation = 2.dp) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                TabChip(
                    title = "7-Day Outlook",
                    isSelected = activeSubTab == "outlook",
                    onClick = { activeSubTab = "outlook" },
                    modifier = Modifier.weight(1f).testTag("tab_outlook")
                )
                TabChip(
                    title = "NWP Multi-Model",
                    isSelected = activeSubTab == "nwp",
                    onClick = { activeSubTab = "nwp" },
                    modifier = Modifier.weight(1f).testTag("tab_nwp")
                )
                TabChip(
                    title = "Agro-Kisan",
                    isSelected = activeSubTab == "agro",
                    onClick = { activeSubTab = "agro" },
                    modifier = Modifier.weight(1f).testTag("tab_agro")
                )
            }
        }

        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(top = 16.dp, bottom = 24.dp)
        ) {
            when (activeSubTab) {
                "outlook" -> {
                    // 24-Hour Timeline Section
                    item {
                        Text(
                            text = "24-Hour Hourly Timeline",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            items(hourlyForecast) { hour ->
                                HourlyCard(hour = hour, unit = temperatureUnit)
                            }
                        }
                    }

                    // 7-Day Outlook List
                    item {
                        Text(
                            text = "7-Day Meteorological Outlook",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = TextPrimary
                        )
                    }

                    items(dailyForecast) { day ->
                        DailyCard(day = day, unit = temperatureUnit)
                    }
                }

                "nwp" -> {
                    // NWP Multi-Model Comparison
                    item {
                        Card(
                            colors = CardDefaults.cardColors(containerColor = DarkSurfaceCard),
                            shape = RoundedCornerShape(14.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = "Multi-Model Ensemble Consensus",
                                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                        color = CyanAccent
                                    )
                                    Spacer(modifier = Modifier.weight(1f))
                                    Text(
                                        text = nwpData.confidenceRating,
                                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                        color = GreenSafe
                                    )
                                }
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = nwpData.modelConsensus,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = TextSecondary
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = nwpData.generatedAt,
                                    style = MaterialTheme.typography.labelSmall,
                                    color = TextMuted
                                )
                            }
                        }
                    }

                    // Atmospheric Sounding & Instability (CAPE)
                    item {
                        Card(
                            colors = CardDefaults.cardColors(containerColor = DarkSurfaceCard),
                            shape = RoundedCornerShape(14.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = "Atmospheric Sounding & Convective Indices",
                                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                                    color = TextPrimary
                                )
                                Spacer(modifier = Modifier.height(10.dp))
                                Row(modifier = Modifier.fillMaxWidth()) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text("CAPE", style = MaterialTheme.typography.labelSmall, color = TextMuted)
                                        Text(
                                            "${nwpData.sounding.capeJkg.toInt()} J/kg",
                                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                            color = AmberWarning
                                        )
                                    }
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text("LIFTED INDEX", style = MaterialTheme.typography.labelSmall, color = TextMuted)
                                        Text(
                                            "${nwpData.sounding.liftedIndex}",
                                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                            color = OrangeAlert
                                        )
                                    }
                                    Column(modifier = Modifier.weight(1.5f)) {
                                        Text("STORM POTENTIAL", style = MaterialTheme.typography.labelSmall, color = TextMuted)
                                        Text(
                                            nwpData.sounding.stormPotential,
                                            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                            color = TextPrimary
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = nwpData.sounding.interpretation,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = TextSecondary
                                )
                            }
                        }
                    }

                    // Multi-Model Spread Timeline (ECMWF vs GFS vs ICON vs WRF)
                    item {
                        Text(
                            text = "Model Spread Comparison Timeline",
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                            color = TextPrimary
                        )
                    }

                    items(nwpData.timeline) { pt ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = DarkSurface),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "+${pt.timeLabel} Forecast Step",
                                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                                        color = TextPrimary
                                    )
                                    Text(
                                        text = "Agreement: ${pt.agreementPct}%",
                                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                        color = if (pt.agreementPct >= 85) GreenSafe else AmberWarning
                                    )
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                Row(modifier = Modifier.fillMaxWidth()) {
                                    ModelValueCell(model = "ECMWF", temp = "${pt.tempC_ecmwf}°C", rain = "${pt.precipMm_ecmwf}mm", modifier = Modifier.weight(1f))
                                    ModelValueCell(model = "GFS", temp = "${pt.tempC_gfs}°C", rain = "${pt.precipMm_gfs}mm", modifier = Modifier.weight(1f))
                                    ModelValueCell(model = "ICON", temp = "${pt.tempC_icon}°C", rain = "${pt.precipMm_icon}mm", modifier = Modifier.weight(1f))
                                    ModelValueCell(model = "WRF (Hi-Res)", temp = "${pt.tempC_wrf}°C", rain = "${pt.precipMm_wrf}mm", modifier = Modifier.weight(1f))
                                }
                            }
                        }
                    }
                }

                "agro" -> {
                    // Agro-Meteorology Kisan Summary
                    item {
                        Card(
                            colors = CardDefaults.cardColors(containerColor = DarkSurfaceCard),
                            shape = RoundedCornerShape(14.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("🌾", fontSize = 20.sp)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "Agro-Meteorological Advisory",
                                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                        color = AmberWarning
                                    )
                                }
                                Spacer(modifier = Modifier.height(10.dp))
                                Text(
                                    text = "Soil Moisture Saturation: ${agroData.soilMoisturePct}%",
                                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                                    color = TextPrimary
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Best Spray Window: ${agroData.bestSprayWindow}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = GreenSafe
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = agroData.irrigationAdvice,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = TextSecondary
                                )
                            }
                        }
                    }

                    item {
                        Text(
                            text = "Crop Stage Suitability & Pest Forecast",
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                            color = TextPrimary
                        )
                    }

                    items(agroData.crops) { crop ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = DarkSurface),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = crop.cropName,
                                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                        color = TextPrimary
                                    )
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(4.dp))
                                            .background(if (crop.suitabilityRating == "optimal") GreenSafe else AmberWarning)
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text(
                                            text = crop.suitabilityRating.uppercase(),
                                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                            color = DarkBackground
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Stage: ${crop.currentStage} (${crop.season} Season)",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = CyanAccent
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = crop.advisoryNote,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = TextSecondary
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = DarkSurfaceCard,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Column(modifier = Modifier.padding(8.dp)) {
                                        Text(
                                            text = "Pest Risk: ${crop.pestRisk}",
                                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                            color = OrangeAlert
                                        )
                                        Text(
                                            text = "Prevention: ${crop.preventiveMeasure}",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = TextSecondary
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun TabChip(
    title: String,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        shape = RoundedCornerShape(8.dp),
        color = if (isSelected) AmberWarning else DarkSurfaceCard,
        modifier = modifier.clickable { onClick() }
    ) {
        Box(
            modifier = Modifier.padding(vertical = 8.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                color = if (isSelected) DarkBackground else TextPrimary
            )
        }
    }
}

@Composable
fun HourlyCard(hour: HourlyWeatherForecast, unit: String) {
    val temp = if (unit == "C") "${hour.tempC.toInt()}°" else "${hour.tempF.toInt()}°"
    Surface(
        shape = RoundedCornerShape(12.dp),
        color = DarkSurfaceCard,
        modifier = Modifier.width(80.dp)
    ) {
        Column(
            modifier = Modifier.padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = hour.time, style = MaterialTheme.typography.labelSmall, color = TextMuted)
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = if (hour.rainProbability > 40) "🌧️" else "⛅",
                fontSize = 20.sp
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = temp,
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "${hour.rainProbability}%",
                style = MaterialTheme.typography.labelSmall,
                color = CyanAccent
            )
        }
    }
}

@Composable
fun DailyCard(day: DailyWeatherForecast, unit: String) {
    val maxTemp = if (unit == "C") "${day.tempMaxC.toInt()}°" else "${day.tempMaxF.toInt()}°"
    val minTemp = if (unit == "C") "${day.tempMinC.toInt()}°" else "${day.tempMinF.toInt()}°"

    Card(
        colors = CardDefaults.cardColors(containerColor = DarkSurfaceCard),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = day.dayName,
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = day.dateStr,
                        style = MaterialTheme.typography.labelSmall,
                        color = TextMuted
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = maxTemp,
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = AmberWarning
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = minTemp,
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextMuted
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = day.condition,
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary
                )
                if (day.precipitationProb > 0) {
                    Text(
                        text = "Rain: ${day.precipitationProb}% (${day.precipitationTotalMm}mm)",
                        style = MaterialTheme.typography.labelSmall,
                        color = CyanAccent
                    )
                }
            }

            if (day.hazardSeverity != "low") {
                Spacer(modifier = Modifier.height(8.dp))
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = DarkSurfaceBorder,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "⚠️", fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "${day.hazardHeadline}: ${day.actionAdvice}",
                            style = MaterialTheme.typography.labelSmall,
                            color = AmberLight
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ModelValueCell(model: String, temp: String, rain: String, modifier: Modifier = Modifier) {
    Column(modifier = modifier) {
        Text(text = model, style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold), color = CyanAccent)
        Text(text = temp, style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold), color = TextPrimary)
        Text(text = rain, style = MaterialTheme.typography.labelSmall, color = TextMuted)
    }
}
