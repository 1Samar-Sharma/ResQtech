package com.example.resqtech.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
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
fun HomeScreen(
    currentWeather: CurrentWeatherState,
    temperatureUnit: String,
    imdAlerts: List<IMDColorAlert>,
    disasterAlerts: List<DisasterAlert>,
    isSosActive: Boolean,
    onNavigateTab: (String) -> Unit,
    onOpenSos: () -> Unit,
    modifier: Modifier = Modifier
) {
    val tempDisplay = if (temperatureUnit == "C") {
        "${currentWeather.temperatureC.toInt()}°C"
    } else {
        "${currentWeather.temperatureF.toInt()}°F"
    }
    val feelsLikeDisplay = if (temperatureUnit == "C") {
        "${currentWeather.feelsLikeC.toInt()}°C"
    } else {
        "${currentWeather.feelsLikeF.toInt()}°F"
    }

    LazyColumn(
        modifier = modifier.fillMaxSize().padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 12.dp, bottom = 24.dp)
    ) {
        // SOS Active Distressed Alert Banner
        if (isSosActive) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = RedAlert),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth().clickable { onOpenSos() }
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Warning,
                            contentDescription = "Active Distress",
                            tint = Color.White,
                            modifier = Modifier.size(28.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "SOS DISTRESS ACTIVE (5km Beacon)",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                color = Color.White
                            )
                            Text(
                                text = "Civilian responders & local emergency units notified. Tap to review or cancel.",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color.White.copy(alpha = 0.9f)
                            )
                        }
                    }
                }
            }
        }

        // IMD Active Alert Banner (e.g. Orange or Red warning)
        if (imdAlerts.isNotEmpty()) {
            val primaryAlert = imdAlerts.first()
            item {
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = when (primaryAlert.colorCode) {
                            IMDColorCode.RED -> RedAlert
                            IMDColorCode.ORANGE -> OrangeAlert
                            IMDColorCode.YELLOW -> AmberDark
                            IMDColorCode.GREEN -> GreenSafe
                        }
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth().clickable { onNavigateTab("alerts") }
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = primaryAlert.colorCode.badge,
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                color = Color.White
                            )
                            Spacer(modifier = Modifier.weight(1f))
                            Text(
                                text = "Tap for CAP Details →",
                                style = MaterialTheme.typography.labelSmall,
                                color = Color.White.copy(alpha = 0.9f)
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = primaryAlert.headline,
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = primaryAlert.criteriaThresholdMet,
                            style = MaterialTheme.typography.bodySmall,
                            color = Color.White.copy(alpha = 0.85f)
                        )
                    }
                }
            }
        }

        // Weather Telemetry Hero Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = DarkSurfaceCard),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = tempDisplay,
                                style = MaterialTheme.typography.headlineLarge.copy(
                                    fontWeight = FontWeight.ExtraBold,
                                    fontSize = 42.sp
                                ),
                                color = AmberWarning
                            )
                            Text(
                                text = "Feels like $feelsLikeDisplay • ${currentWeather.condition}",
                                style = MaterialTheme.typography.titleMedium,
                                color = TextPrimary
                            )
                        }
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(CircleShape)
                                .background(AmberWarning.copy(alpha = 0.15f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (currentWeather.precipitationProbability > 40) "🌧️" else "⛅",
                                fontSize = 28.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = currentWeather.conditionDescription,
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )

                    Spacer(modifier = Modifier.height(16.dp))
                    Divider(color = DarkSurfaceBorder)
                    Spacer(modifier = Modifier.height(14.dp))

                    // 4-cell telemetry grid
                    Row(modifier = Modifier.fillMaxWidth()) {
                        TelemetryCell(
                            label = "WIND SPEED",
                            value = "${currentWeather.windSpeedKmh.toInt()} km/h (${currentWeather.windDirection})",
                            subValue = "Gust: ${currentWeather.windGustKmh.toInt()} km/h",
                            modifier = Modifier.weight(1f)
                        )
                        TelemetryCell(
                            label = "HUMIDITY",
                            value = "${currentWeather.humidityPct}%",
                            subValue = "Dew Pt: ${currentWeather.dewPointC.toInt()}°C",
                            modifier = Modifier.weight(1f)
                        )
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(modifier = Modifier.fillMaxWidth()) {
                        TelemetryCell(
                            label = "AIR QUALITY (AQI)",
                            value = "${currentWeather.aqiIndex}",
                            subValue = currentWeather.aqiStatus,
                            valueColor = if (currentWeather.aqiIndex > 100) RedAlert else GreenSafe,
                            modifier = Modifier.weight(1f)
                        )
                        TelemetryCell(
                            label = "BAROMETRIC",
                            value = "${currentWeather.barometricPressureHpa.toInt()} hPa",
                            subValue = "Trend: ${currentWeather.pressureTrend}",
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }

        // Hazard Risk Radar (0-100 Gauges)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = DarkSurfaceCard),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Shield,
                            contentDescription = "Risk Radar",
                            tint = CyanAccent,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Multi-Hazard Risk Indices",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = TextPrimary
                        )
                    }
                    Spacer(modifier = Modifier.height(12.dp))

                    RiskBar(label = "Flash Flood Risk", score = currentWeather.floodRiskIndex, color = CyanAccent)
                    Spacer(modifier = Modifier.height(8.dp))
                    RiskBar(label = "Fire Weather Index", score = currentWeather.fireWeatherIndex, color = AmberWarning)
                    Spacer(modifier = Modifier.height(8.dp))
                    RiskBar(label = "Landslide Saturation", score = currentWeather.landslideRiskIndex, color = OrangeAlert)
                    Spacer(modifier = Modifier.height(8.dp))
                    RiskBar(label = "Severe Storm Severity", score = currentWeather.stormSeverityIndex, color = if (currentWeather.stormSeverityIndex > 50) RedAlert else GreenSafe)
                }
            }
        }

        // Active Disaster Alerts Carousel
        if (disasterAlerts.isNotEmpty()) {
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Active Incident Alerts (${disasterAlerts.size})",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = TextPrimary
                    )
                    TextButton(onClick = { onNavigateTab("alerts") }) {
                        Text("View All", color = AmberWarning)
                    }
                }
            }

            items(disasterAlerts.take(2)) { alert ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = DarkSurface),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth().clickable { onNavigateTab("alerts") }
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(if (alert.severity == SeverityLevel.CRITICAL) RedAlert else OrangeAlert)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = alert.severity.label.uppercase(),
                                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                    color = Color.White
                                )
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = alert.category.label,
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary
                            )
                            Spacer(modifier = Modifier.weight(1f))
                            Text(
                                text = alert.timestamp,
                                style = MaterialTheme.typography.labelSmall,
                                color = TextMuted
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = alert.title,
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.SemiBold),
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = alert.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary,
                            maxLines = 2
                        )
                    }
                }
            }
        }

        // Fast Action Navigation Grid
        item {
            Text(
                text = "Rapid Operations",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                ActionCard(
                    title = "AI Weather Assistant",
                    subtitle = "Domain Personas",
                    icon = "🤖",
                    modifier = Modifier.weight(1f).clickable { onNavigateTab("ai_weather") }
                )
                ActionCard(
                    title = "NWP Models & Outlook",
                    subtitle = "ECMWF & Sounding",
                    icon = "📊",
                    modifier = Modifier.weight(1f).clickable { onNavigateTab("forecast") }
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                ActionCard(
                    title = "Civic Relief & Shelters",
                    subtitle = "Safe Haven Registry",
                    icon = "🏥",
                    modifier = Modifier.weight(1f).clickable { onNavigateTab("relief") }
                )
                ActionCard(
                    title = "Crowdsourced Reports",
                    subtitle = "Field Hazard Intel",
                    icon = "📡",
                    modifier = Modifier.weight(1f).clickable { onNavigateTab("community") }
                )
            }
        }
    }
}

@Composable
fun TelemetryCell(
    label: String,
    value: String,
    subValue: String,
    valueColor: Color = TextPrimary,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier) {
        Text(text = label, style = MaterialTheme.typography.labelSmall, color = TextMuted)
        Text(
            text = value,
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
            color = valueColor
        )
        Text(text = subValue, style = MaterialTheme.typography.labelSmall, color = TextSecondary)
    }
}

@Composable
fun RiskBar(
    label: String,
    score: Int,
    color: Color
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = label, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
            Text(
                text = "$score / 100",
                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                color = color
            )
        }
        Spacer(modifier = Modifier.height(4.dp))
        LinearProgressIndicator(
            progress = { score / 100f },
            modifier = Modifier.fillMaxWidth().height(6.dp).clip(RoundedCornerShape(3.dp)),
            color = color,
            trackColor = DarkSurfaceBorder
        )
    }
}

@Composable
fun ActionCard(
    title: String,
    subtitle: String,
    icon: String,
    modifier: Modifier = Modifier
) {
    Surface(
        shape = RoundedCornerShape(12.dp),
        color = DarkSurfaceCard,
        modifier = modifier
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = icon, fontSize = 24.sp)
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                    color = TextPrimary
                )
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.labelSmall,
                    color = TextSecondary
                )
            }
        }
    }
}
