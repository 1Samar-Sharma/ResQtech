package com.example.resqtech.model

import kotlinx.serialization.Serializable

@Serializable
data class Coordinates(
    val lat: Double,
    val lng: Double
)

enum class DisasterCategory(val label: String) {
    WILDFIRE("Wildfire"),
    FLOOD("Flood"),
    LANDSLIDE("Landslide"),
    EARTHQUAKE("Earthquake"),
    STORM("Severe Storm"),
    WOMEN_SAFETY("Women Safety / SOS"),
    MEDICAL_EMERGENCY("Medical Emergency"),
    OTHER("Other")
}

enum class SeverityLevel(val label: String) {
    CRITICAL("Critical"),
    HIGH("High"),
    MODERATE("Moderate"),
    LOW("Low")
}

enum class AlertStatus(val label: String) {
    ACTIVE("Active"),
    MONITORING("Monitoring"),
    CONTAINED("Contained"),
    RESOLVED("Resolved")
}

@Serializable
data class HazardMetrics(
    val temperatureC: Double? = null,
    val windSpeedKmh: Double? = null,
    val windDirection: String? = null,
    val humidityPct: Int? = null,
    val riverLevelMeters: Double? = null,
    val riverThresholdMeters: Double? = null,
    val seismicMagnitude: Double? = null,
    val soilSaturationPct: Int? = null,
    val aqiIndex: Int? = null
)

@Serializable
data class DisasterAlert(
    val id: String,
    val title: String,
    val category: DisasterCategory,
    val severity: SeverityLevel,
    val status: AlertStatus,
    val locationName: String,
    val coordinates: Coordinates,
    val radiusMeters: Int,
    val affectedPopulation: Int,
    val timestamp: String,
    val verifiedCount: Int,
    val source: String,
    val description: String,
    val hazardMetrics: HazardMetrics? = null,
    val recommendedActions: List<String> = emptyList(),
    val evacuationRoutes: List<String> = emptyList()
)

enum class AidCategory(val label: String) {
    SHELTER("Emergency Shelter"),
    MANPOWER("Manpower & Rescue"),
    FOOD_WATER("Food & Clean Water"),
    CLOTHING("Dry Clothing & Blankets"),
    MEDICAL("Medical Kit & First Aid"),
    POWER_TRANSPORT("Power & Transport Evac"),
    WILDFIRE_EVAC("Wildfire Perimeter Evac")
}

enum class AidUrgency(val label: String) {
    IMMEDIATE_LIFE_THREAT("Immediate Life Threat (0-30m)"),
    WITHIN_2_HOURS("Urgent (Within 2 Hours)"),
    TODAY("Today Priority"),
    WITHIN_48_HOURS("Within 48 Hours")
}

@Serializable
data class HelpRequest(
    val id: String,
    val requesterName: String,
    val phoneMasked: String,
    val locationName: String,
    val coordinates: Coordinates,
    val category: AidCategory,
    val subCategory: String,
    val urgency: AidUrgency,
    val peopleCount: Int,
    val description: String,
    val specialNeeds: List<String> = emptyList(),
    val status: String = "open", // open, matched, in_progress, fulfilled
    val createdAt: String,
    val offersCount: Int = 0
)

@Serializable
data class VolunteerOffer(
    val id: String,
    val volunteerName: String,
    val phoneMasked: String,
    val roleSkills: List<String>,
    val coordinates: Coordinates,
    val locationName: String,
    val radiusCoveredKm: Int,
    val capacityDetails: String,
    val isAvailable: Boolean = true,
    val verifiedStatus: Boolean = true,
    val missionsCompleted: Int = 0,
    val joinedDate: String = "2025"
)

@Serializable
data class SafeHavenPoint(
    val id: String,
    val name: String,
    val type: String, // verified_shelter, community_safe_haven, medical_point, water_distribution
    val coordinates: Coordinates,
    val capacityTotal: Int,
    val capacityOccupied: Int,
    val amenities: List<String>,
    val isOpen: Boolean = true,
    val contactPhone: String,
    val address: String
)

@Serializable
data class CommunityReport(
    val id: String,
    val authorName: String,
    val category: DisasterCategory,
    val title: String,
    val description: String,
    val locationName: String,
    val coordinates: Coordinates,
    val severity: SeverityLevel,
    val timestamp: String,
    val upvotes: Int = 0,
    val downvotes: Int = 0,
    val userVoted: String? = null, // "up", "down"
    val verifiedByGuardians: Boolean = false
)

@Serializable
data class CurrentWeatherState(
    val temperatureC: Double,
    val temperatureF: Double,
    val feelsLikeC: Double,
    val feelsLikeF: Double,
    val condition: String,
    val conditionIcon: String,
    val conditionDescription: String,
    val humidityPct: Int,
    val windSpeedKmh: Double,
    val windGustKmh: Double,
    val windDirection: String,
    val barometricPressureHpa: Double,
    val pressureTrend: String = "steady",
    val uvIndex: Int,
    val aqiIndex: Int,
    val aqiStatus: String,
    val visibilityKm: Double,
    val dewPointC: Double,
    val cloudCoverPct: Int,
    val precipitationProbability: Int,
    val precipitationMm: Double,
    // Risk Indices (0-100)
    val floodRiskIndex: Int,
    val landslideRiskIndex: Int,
    val fireWeatherIndex: Int,
    val heatStressIndex: Int,
    val stormSeverityIndex: Int,
    val sunrise: String,
    val sunset: String,
    val lastUpdated: String,
    val locationName: String
)

@Serializable
data class HourlyWeatherForecast(
    val time: String,
    val tempC: Double,
    val tempF: Double,
    val condition: String,
    val conditionIcon: String,
    val rainProbability: Int,
    val rainVolumeMm: Double,
    val windSpeedKmh: Double,
    val windGustKmh: Double,
    val hazardLevel: String // normal, caution, warning, danger
)

@Serializable
data class DailyWeatherForecast(
    val dayName: String,
    val dateStr: String,
    val tempMaxC: Double,
    val tempMaxF: Double,
    val tempMinC: Double,
    val tempMinF: Double,
    val condition: String,
    val conditionIcon: String,
    val precipitationProb: Int,
    val precipitationTotalMm: Double,
    val windSpeedMaxKmh: Double,
    val uvMax: Int,
    val aqiMax: Int,
    val hazardType: String = "none",
    val hazardSeverity: String = "low",
    val hazardHeadline: String = "Stable Weather",
    val actionAdvice: String = "Routine activities may proceed."
)

@Serializable
data class ClimateTrendInsight(
    val metric: String,
    val currentValue: String,
    val historicalBaseline: String,
    val anomalyDiff: String,
    val trendDirection: String,
    val riskInterpretation: String,
    val climateImpactCategory: String
)

enum class WeatherPersona(val code: String, val title: String, val badge: String, val promptContext: String) {
    GENERAL("general", "General Public", "Safety & Comfort", "Tailor for civilian daily routine and safety precautions."),
    FARMER("farmer", "Kisan / Farmer", "Agro-Meteorology", "Focus on crop stage, spray suitability windows, soil moisture, and frost/heat defense."),
    FISHERMAN("fisherman", "Fisherman / Marine", "Coastal Safety", "Emphasize wave heights, coastal swell, wind gusts, and safe return to harbor."),
    COMMUTER("commuter", "Daily Commuter", "Route Transit", "Focus on road waterlogging, highway visibility, transit delays, and treefall hazards."),
    TREKKER("trekker", "Hiker / Trekker", "Mountain Safety", "Highlight sudden temperature drops, flash floods, ridge wind gusts, and trail hypothermia."),
    SDMA("sdma", "SDMA / Officer", "Disaster Response", "Provide incident commander metrics, evacuation routes, CAP alert criteria, and resource deployment.")
}

@Serializable
data class WeatherChatMessage(
    val id: String,
    val sender: String, // "user" or "assistant"
    val text: String,
    val timestamp: String,
    val personaUsed: String = "general",
    val isWeatherAlert: Boolean = false,
    val structuredHazardTitle: String? = null,
    val structuredHazardAdvice: List<String> = emptyList()
)

// IMD 4-Stage Color Warning & CAP Alert
enum class IMDColorCode(val hex: Long, val badge: String) {
    RED(0xFFDC2626, "RED WARNING (Take Action)"),
    ORANGE(0xFFEA580C, "ORANGE ALERT (Be Prepared)"),
    YELLOW(0xFFEAB308, "YELLOW WATCH (Be Aware)"),
    GREEN(0xFF16A34A, "GREEN (No Advisory)")
}

@Serializable
data class IMDColorAlert(
    val id: String,
    val colorCode: IMDColorCode,
    val headline: String,
    val hazardCategory: String,
    val affectedArea: String,
    val validFrom: String,
    val validTo: String,
    val criteriaThresholdMet: String,
    val capSeverity: String,
    val instructions: List<String>
)

// NWP Multi-Model Comparison (GFS vs ECMWF vs ICON vs WRF downscaled)
@Serializable
data class NWPModelPoint(
    val timeLabel: String,
    val tempC_gfs: Double,
    val tempC_ecmwf: Double,
    val tempC_icon: Double,
    val tempC_wrf: Double,
    val precipMm_gfs: Double,
    val precipMm_ecmwf: Double,
    val precipMm_icon: Double,
    val precipMm_wrf: Double,
    val windKmh_ecmwf: Double,
    val cape_ecmwf: Double,
    val agreementPct: Int
)

@Serializable
data class SoundingAnalysis(
    val capeJkg: Double,
    val liftedIndex: Double,
    val stormPotential: String,
    val interpretation: String
)

@Serializable
data class NWPModelComparisonData(
    val locationName: String,
    val generatedAt: String,
    val sounding: SoundingAnalysis,
    val modelConsensus: String,
    val confidenceRating: String,
    val timeline: List<NWPModelPoint>
)

// Agro-Meteorology (Kisan Advisory)
@Serializable
data class CropAdvisory(
    val cropName: String,
    val season: String,
    val currentStage: String,
    val suitabilityRating: String, // optimal, favorable, moderate, stress
    val advisoryNote: String,
    val pestRisk: String,
    val preventiveMeasure: String
)

@Serializable
data class AgroAdvisoryData(
    val locationName: String,
    val soilMoisturePct: Int,
    val sprayWindowFavorable: Boolean,
    val bestSprayWindow: String,
    val irrigationAdvice: String,
    val crops: List<CropAdvisory>
)
