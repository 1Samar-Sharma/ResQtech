package com.example.resqtech.data

import com.example.resqtech.data.local.*
import com.example.resqtech.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.*

class WeatherRepository(private val database: AppDatabase) {

    private val disasterAlertDao = database.disasterAlertDao()
    private val helpRequestDao = database.helpRequestDao()
    private val communityReportDao = database.communityReportDao()

    // In-memory collections for transient telemetry
    private var currentWeatherState: CurrentWeatherState = MockDataProvider.getInitialCurrentWeather()
    private var dailyForecastList: List<DailyWeatherForecast> = MockDataProvider.getInitialDailyForecast()
    private var hourlyForecastList: List<HourlyWeatherForecast> = MockDataProvider.getInitialHourlyForecast()
    private var imdAlertsList: List<IMDColorAlert> = MockDataProvider.getInitialIMDAlerts()
    private var nwpData: NWPModelComparisonData = MockDataProvider.getInitialNWPComparison()
    private var agroData: AgroAdvisoryData = MockDataProvider.getInitialAgroAdvisory()
    private var safeHavensList: List<SafeHavenPoint> = MockDataProvider.getInitialSafeHavens()
    private var volunteerOffersList: List<VolunteerOffer> = MockDataProvider.getInitialVolunteerOffers()

    suspend fun initializeSeedDataIfNeeded() = withContext(Dispatchers.IO) {
        // Seed initial alerts if empty
        val initialAlerts = MockDataProvider.getInitialDisasterAlerts().map { alert ->
            DisasterAlertEntity(
                id = alert.id,
                title = alert.title,
                category = alert.category.name,
                severity = alert.severity.name,
                status = alert.status.name,
                locationName = alert.locationName,
                lat = alert.coordinates.lat,
                lng = alert.coordinates.lng,
                radiusMeters = alert.radiusMeters,
                affectedPopulation = alert.affectedPopulation,
                timestamp = alert.timestamp,
                verifiedCount = alert.verifiedCount,
                source = alert.source,
                description = alert.description,
                recommendedActionsCsv = alert.recommendedActions.joinToString("||"),
                evacuationRoutesCsv = alert.evacuationRoutes.joinToString("||")
            )
        }
        disasterAlertDao.insertAll(initialAlerts)

        // Seed initial help requests
        val initialRequests = MockDataProvider.getInitialHelpRequests().map { req ->
            HelpRequestEntity(
                id = req.id,
                requesterName = req.requesterName,
                phoneMasked = req.phoneMasked,
                locationName = req.locationName,
                lat = req.coordinates.lat,
                lng = req.coordinates.lng,
                category = req.category.name,
                subCategory = req.subCategory,
                urgency = req.urgency.name,
                peopleCount = req.peopleCount,
                description = req.description,
                status = req.status,
                createdAt = req.createdAt,
                offersCount = req.offersCount
            )
        }
        helpRequestDao.insertAll(initialRequests)

        // Seed initial community reports
        val initialReports = MockDataProvider.getInitialCommunityReports().map { rep ->
            CommunityReportEntity(
                id = rep.id,
                authorName = rep.authorName,
                category = rep.category.name,
                title = rep.title,
                description = rep.description,
                locationName = rep.locationName,
                lat = rep.coordinates.lat,
                lng = rep.coordinates.lng,
                severity = rep.severity.name,
                timestamp = rep.timestamp,
                upvotes = rep.upvotes,
                downvotes = rep.downvotes,
                userVoted = rep.userVoted,
                verifiedByGuardians = rep.verifiedByGuardians
            )
        }
        communityReportDao.insertAll(initialReports)
    }

    // Room Flow Streams
    fun getDisasterAlertsStream(): Flow<List<DisasterAlert>> {
        return disasterAlertDao.getAllAlerts().map { entities ->
            entities.map { entity ->
                DisasterAlert(
                    id = entity.id,
                    title = entity.title,
                    category = runCatching { DisasterCategory.valueOf(entity.category) }.getOrDefault(DisasterCategory.OTHER),
                    severity = runCatching { SeverityLevel.valueOf(entity.severity) }.getOrDefault(SeverityLevel.MODERATE),
                    status = runCatching { AlertStatus.valueOf(entity.status) }.getOrDefault(AlertStatus.ACTIVE),
                    locationName = entity.locationName,
                    coordinates = Coordinates(entity.lat, entity.lng),
                    radiusMeters = entity.radiusMeters,
                    affectedPopulation = entity.affectedPopulation,
                    timestamp = entity.timestamp,
                    verifiedCount = entity.verifiedCount,
                    source = entity.source,
                    description = entity.description,
                    recommendedActions = if (entity.recommendedActionsCsv.isBlank()) emptyList() else entity.recommendedActionsCsv.split("||"),
                    evacuationRoutes = if (entity.evacuationRoutesCsv.isBlank()) emptyList() else entity.evacuationRoutesCsv.split("||")
                )
            }
        }
    }

    fun getHelpRequestsStream(): Flow<List<HelpRequest>> {
        return helpRequestDao.getAllRequests().map { entities ->
            entities.map { entity ->
                HelpRequest(
                    id = entity.id,
                    requesterName = entity.requesterName,
                    phoneMasked = entity.phoneMasked,
                    locationName = entity.locationName,
                    coordinates = Coordinates(entity.lat, entity.lng),
                    category = runCatching { AidCategory.valueOf(entity.category) }.getOrDefault(AidCategory.FOOD_WATER),
                    subCategory = entity.subCategory,
                    urgency = runCatching { AidUrgency.valueOf(entity.urgency) }.getOrDefault(AidUrgency.TODAY),
                    peopleCount = entity.peopleCount,
                    description = entity.description,
                    status = entity.status,
                    createdAt = entity.createdAt,
                    offersCount = entity.offersCount
                )
            }
        }
    }

    fun getCommunityReportsStream(): Flow<List<CommunityReport>> {
        return communityReportDao.getAllReports().map { entities ->
            entities.map { entity ->
                CommunityReport(
                    id = entity.id,
                    authorName = entity.authorName,
                    category = runCatching { DisasterCategory.valueOf(entity.category) }.getOrDefault(DisasterCategory.OTHER),
                    title = entity.title,
                    description = entity.description,
                    locationName = entity.locationName,
                    coordinates = Coordinates(entity.lat, entity.lng),
                    severity = runCatching { SeverityLevel.valueOf(entity.severity) }.getOrDefault(SeverityLevel.MODERATE),
                    timestamp = entity.timestamp,
                    upvotes = entity.upvotes,
                    downvotes = entity.downvotes,
                    userVoted = entity.userVoted,
                    verifiedByGuardians = entity.verifiedByGuardians
                )
            }
        }
    }

    // CRUD Operations
    suspend fun addHelpRequest(
        requesterName: String,
        category: AidCategory,
        subCategory: String,
        urgency: AidUrgency,
        peopleCount: Int,
        description: String,
        locationName: String
    ) = withContext(Dispatchers.IO) {
        val newEntity = HelpRequestEntity(
            id = "req-${UUID.randomUUID().toString().take(8)}",
            requesterName = requesterName.ifBlank { "Civilian Resident" },
            phoneMasked = "+1 (555) •••-${(1000..9999).random()}",
            locationName = locationName,
            lat = MockDataProvider.DEFAULT_COORDINATES.lat + (Math.random() - 0.5) * 0.05,
            lng = MockDataProvider.DEFAULT_COORDINATES.lng + (Math.random() - 0.5) * 0.05,
            category = category.name,
            subCategory = subCategory,
            urgency = urgency.name,
            peopleCount = peopleCount,
            description = description,
            status = "open",
            createdAt = "Just now",
            offersCount = 0
        )
        helpRequestDao.insert(newEntity)
    }

    suspend fun addCommunityReport(
        title: String,
        description: String,
        category: DisasterCategory,
        severity: SeverityLevel,
        locationName: String
    ) = withContext(Dispatchers.IO) {
        val newEntity = CommunityReportEntity(
            id = "rep-${UUID.randomUUID().toString().take(8)}",
            authorName = "Community Guardian",
            category = category.name,
            title = title,
            description = description,
            locationName = locationName,
            lat = MockDataProvider.DEFAULT_COORDINATES.lat + (Math.random() - 0.5) * 0.03,
            lng = MockDataProvider.DEFAULT_COORDINATES.lng + (Math.random() - 0.5) * 0.03,
            severity = severity.name,
            timestamp = "Just now",
            upvotes = 1,
            downvotes = 0,
            userVoted = "up",
            verifiedByGuardians = false
        )
        communityReportDao.insert(newEntity)
    }

    suspend fun upvoteReport(reportId: String) = withContext(Dispatchers.IO) {
        communityReportDao.upvote(reportId)
    }

    suspend fun downvoteReport(reportId: String) = withContext(Dispatchers.IO) {
        communityReportDao.downvote(reportId)
    }

    // Meteorological Getters
    fun getCurrentWeather(): CurrentWeatherState = currentWeatherState
    fun getHourlyForecast(): List<HourlyWeatherForecast> = hourlyForecastList
    fun getDailyForecast(): List<DailyWeatherForecast> = dailyForecastList
    fun getIMDAlerts(): List<IMDColorAlert> = imdAlertsList
    fun getNWPComparison(): NWPModelComparisonData = nwpData
    fun getAgroAdvisory(): AgroAdvisoryData = agroData
    fun getSafeHavens(): List<SafeHavenPoint> = safeHavensList
    fun getVolunteerOffers(): List<VolunteerOffer> = volunteerOffersList

    // Conversational WeatherGPT AI logic with Persona Specialization
    fun generatePersonaReply(userQuery: String, persona: WeatherPersona): WeatherChatMessage {
        val timeStr = SimpleDateFormat("h:mm a", Locale.getDefault()).format(Date())
        val queryLower = userQuery.lowercase()

        val text: String
        var hazardTitle: String? = null
        var adviceList: List<String> = emptyList()

        when (persona) {
            WeatherPersona.FARMER -> {
                text = "🌾 Kisan Agro-Advisory: Soil moisture is at ${agroData.soilMoisturePct}%. Spray window is favorable tomorrow between ${agroData.bestSprayWindow}. Incoming frontal rains will deliver 12-18mm moisture, allowing you to suspend motorized irrigation pumps."
                hazardTitle = "Agro Action Window"
                adviceList = listOf(
                    "Pause supplemental overhead irrigation; incoming convective rainfall will supply needed hydration.",
                    "Spray fungicide during early morning calm wind window.",
                    "Inspect field drainage ditches to prevent water stagnation in low rows."
                )
            }
            WeatherPersona.FISHERMAN -> {
                text = "⚓ Marine & Coastal Advisory: Wave heights are currently 1.4m building to 2.8m by late evening. Wind gusts up to 34 km/h from WNW with localized squall lines. Small craft advisory in effect; all vessels advised to secure harbor berths before 18:00."
                hazardTitle = "Marine Swell Warning"
                adviceList = listOf(
                    "Small craft mariners return to port before 18:00 UTC.",
                    "Inspect mooring lines and bilge pump batteries.",
                    "Maintain continuous radio watch on VHF Channel 16."
                )
            }
            WeatherPersona.COMMUTER -> {
                text = "🚗 Commuter Transit Advisory: Expect intermittent slick roads and spray along coastal highway sections. The 4th St underpass has reported minor ponding. Peak rain intensity expected between 22:00 and 04:00."
                hazardTitle = "Transit Hazard Advisory"
                adviceList = listOf(
                    "Allow 15-20 extra minutes on low-lying arterial routes.",
                    "Avoid entering flood-prone railway underpasses.",
                    "Ensure vehicle wiper blades and headlights are operating in low-beam."
                )
            }
            WeatherPersona.TREKKER -> {
                text = "⛰️ Mountain & Trail Advisory: Ridge winds reaching 42 km/h above 1200m elevation. Sudden temperature drop of 7°C anticipated behind the frontal boundary. Saturated shale on steep gradients poses slip hazard."
                hazardTitle = "Alpine Weather Advisory"
                adviceList = listOf(
                    "Descend exposed ridges prior to twilight.",
                    "Carry waterproof thermal outer layer and emergency bivy foil.",
                    "Avoid crossing swollen ravines or narrow canyons."
                )
            }
            WeatherPersona.SDMA -> {
                text = "🚨 Incident Commander / SDMA Telemetry: CAP Severity is rated ORANGE. Hydrologic gauges on Lower Creek indicate 3.82m (Threshold: 4.00m). 3 Safe Haven Shelters are open with 650 bed capacity. Pre-positioning sandbags in Sector 3."
                hazardTitle = "SDMA Tactical Summary"
                adviceList = listOf(
                    "Sector 3 sandbag distribution teams mobilized.",
                    "Safe Haven Shelter 1 active at 40% capacity.",
                    "Coordinate with local volunteer dispatch for senior transport."
                )
            }
            WeatherPersona.GENERAL -> {
                if (queryLower.contains("rain") || queryLower.contains("umbrella") || queryLower.contains("storm")) {
                    text = "🌧️ Weather Intelligence: Current conditions are ${currentWeatherState.condition} (${currentWeatherState.temperatureC.toInt()}°C). Rainfall probability rises to 60-85% late tonight with gusty winds. Keep an umbrella handy and secure loose yard items."
                    hazardTitle = "Incoming Precipitation Front"
                    adviceList = listOf(
                        "Carry rain gear if heading out after dark.",
                        "Inspect residential drains and downspouts."
                    )
                } else if (queryLower.contains("fire") || queryLower.contains("smoke") || queryLower.contains("air")) {
                    text = "🔥 Air Quality & Fire Telemetry: AQI is ${currentWeatherState.aqiIndex} (${currentWeatherState.aqiStatus}). Timber Ridge fire perimeter is currently 3.5km away with smoke drifting northeast away from central residential corridors."
                    hazardTitle = "Smoke & AQI Status"
                    adviceList = listOf(
                        "Sensitive groups should limit strenuous outdoor exercise if smoke odor is present.",
                        "Keep HVAC recirculating mode engaged."
                    )
                } else {
                    text = "☀️ WeatherGPT Telemetry: Currently ${currentWeatherState.temperatureC.toInt()}°C (${currentWeatherState.temperatureF.toInt()}°F) and ${currentWeatherState.condition}. Atmospheric pressure is ${currentWeatherState.barometricPressureHpa} hPa (steady). Humidity is at ${currentWeatherState.humidityPct}%."
                }
            }
        }

        return WeatherChatMessage(
            id = "msg-${UUID.randomUUID()}",
            sender = "assistant",
            text = text,
            timestamp = timeStr,
            personaUsed = persona.code,
            isWeatherAlert = hazardTitle != null,
            structuredHazardTitle = hazardTitle,
            structuredHazardAdvice = adviceList
        )
    }
}
