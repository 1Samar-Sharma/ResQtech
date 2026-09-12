package com.example.resqtech.data

import com.example.resqtech.model.*

object MockDataProvider {

    val DEFAULT_COORDINATES = Coordinates(37.7749, -122.4194)
    const val DEFAULT_LOCATION_NAME = "San Francisco Bay Area, CA"

    fun getInitialCurrentWeather(location: String = DEFAULT_LOCATION_NAME): CurrentWeatherState {
        return CurrentWeatherState(
            temperatureC = 22.0,
            temperatureF = 72.0,
            feelsLikeC = 21.5,
            feelsLikeF = 71.0,
            condition = "Partly Cloudy",
            conditionIcon = "cloud_sun",
            conditionDescription = "Scattered clouds with mild ocean breeze and stable atmospheric boundary layer",
            humidityPct = 62,
            windSpeedKmh = 16.0,
            windGustKmh = 24.0,
            windDirection = "WNW",
            barometricPressureHpa = 1014.2,
            pressureTrend = "steady",
            uvIndex = 5,
            aqiIndex = 38,
            aqiStatus = "Good",
            visibilityKm = 14.5,
            dewPointC = 14.2,
            cloudCoverPct = 35,
            precipitationProbability = 10,
            precipitationMm = 0.0,
            floodRiskIndex = 15,
            landslideRiskIndex = 12,
            fireWeatherIndex = 28,
            heatStressIndex = 20,
            stormSeverityIndex = 18,
            sunrise = "06:14 AM",
            sunset = "07:48 PM",
            lastUpdated = "Just now",
            locationName = location
        )
    }

    fun getInitialHourlyForecast(): List<HourlyWeatherForecast> {
        return listOf(
            HourlyWeatherForecast("12:00", 22.0, 72.0, "Partly Cloudy", "cloud_sun", 10, 0.0, 16.0, 24.0, "normal"),
            HourlyWeatherForecast("15:00", 24.0, 75.0, "Sunny", "sun", 5, 0.0, 18.0, 26.0, "normal"),
            HourlyWeatherForecast("18:00", 21.0, 70.0, "Partly Cloudy", "cloud_sun", 15, 0.0, 20.0, 28.0, "caution"),
            HourlyWeatherForecast("21:00", 18.0, 64.0, "Overcast", "cloud", 25, 0.5, 22.0, 32.0, "caution"),
            HourlyWeatherForecast("00:00", 16.0, 61.0, "Light Rain", "rain", 60, 2.5, 25.0, 38.0, "warning"),
            HourlyWeatherForecast("03:00", 15.0, 59.0, "Moderate Rain", "rain", 75, 4.2, 28.0, 42.0, "warning"),
            HourlyWeatherForecast("06:00", 15.0, 59.0, "Heavy Rain", "rain", 85, 6.8, 32.0, 48.0, "danger"),
            HourlyWeatherForecast("09:00", 17.0, 63.0, "Showers", "rain", 50, 1.8, 22.0, 30.0, "caution")
        )
    }

    fun getInitialDailyForecast(): List<DailyWeatherForecast> {
        return listOf(
            DailyWeatherForecast("Today", "Sep 12", 24.0, 75.0, 15.0, 59.0, "Partly Cloudy", "cloud_sun", 15, 0.0, 24.0, 6, 38, "none", "low", "Comfortable & Dry", "Optimal conditions for outdoor activities."),
            DailyWeatherForecast("Sat", "Sep 13", 21.0, 70.0, 14.0, 57.0, "Incoming Frontal Rain", "rain", 80, 14.5, 36.0, 4, 25, "flood", "moderate", "Flash Runoff Watch", "Clear gutters and secure outdoor furniture before nightfall."),
            DailyWeatherForecast("Sun", "Sep 14", 19.0, 66.0, 13.0, 55.0, "Gusty Showers", "rain", 65, 8.2, 42.0, 3, 20, "storm", "high", "High Wind & Coastal Advisory", "Avoid elevated bridges and seaside promenades."),
            DailyWeatherForecast("Mon", "Sep 15", 22.0, 72.0, 14.0, 57.0, "Clearing Skies", "sun", 20, 0.2, 18.0, 6, 32, "none", "low", "Atmospheric Recovery", "Standard operations resume across transit corridors."),
            DailyWeatherForecast("Tue", "Sep 16", 25.0, 77.0, 16.0, 61.0, "Sunny & Warm", "sun", 10, 0.0, 15.0, 7, 45, "none", "low", "Warm & Clear", "Pleasant weather with mild afternoon humidity."),
            DailyWeatherForecast("Wed", "Sep 17", 27.0, 81.0, 17.0, 63.0, "Elevated Heat", "sun", 5, 0.0, 14.0, 8, 52, "heatwave", "moderate", "Heat Index Surge", "Ensure hydration during peak sun hours (11am-3pm)."),
            DailyWeatherForecast("Thu", "Sep 18", 26.0, 79.0, 16.0, 61.0, "Passing Cirrus", "cloud_sun", 10, 0.0, 16.0, 6, 40, "none", "low", "Mild Autumnal Flow", "Stable winds and good air quality.")
        )
    }

    fun getInitialIMDAlerts(): List<IMDColorAlert> {
        return listOf(
            IMDColorAlert(
                id = "imd-alert-01",
                colorCode = IMDColorCode.ORANGE,
                headline = "Orange Alert: Heavy to Very Heavy Precipitation with Gusty Winds",
                hazardCategory = "Thunderstorm & Flash Runoff",
                affectedArea = "Coastal & Riparian Lowland Corridors",
                validFrom = "Sep 12, 18:00 UTC",
                validTo = "Sep 13, 23:59 UTC",
                criteriaThresholdMet = "Rainfall > 64.5 mm in 24h accompanied by gusts exceeding 45 km/h",
                capSeverity = "Severe",
                instructions = listOf(
                    "Stay indoors during peak thunderstorm activity.",
                    "Do not drive through waterlogged subways or overflowing creek beds.",
                    "Verify emergency backup power and keep mobile devices fully charged."
                )
            ),
            IMDColorAlert(
                id = "imd-alert-02",
                colorCode = IMDColorCode.YELLOW,
                headline = "Yellow Watch: Dense Sea Fog with Reduced Highway Visibility",
                hazardCategory = "Dense Marine Fog",
                affectedArea = "Harbor Basin and Low-Lying Coastal Freeways",
                validFrom = "Sep 13, 03:00 UTC",
                validTo = "Sep 13, 10:00 UTC",
                criteriaThresholdMet = "Surface horizontal visibility below 200 meters",
                capSeverity = "Moderate",
                instructions = listOf(
                    "Use low-beam headlights and reduce transit speeds on coastal routes.",
                    "Small craft mariners must maintain continuous radar watch and fog horn signaling."
                )
            )
        )
    }

    fun getInitialDisasterAlerts(): List<DisasterAlert> {
        return listOf(
            DisasterAlert(
                id = "alert-fire-001",
                title = "Timber Ridge Brush Fire Expansion",
                category = DisasterCategory.WILDFIRE,
                severity = SeverityLevel.CRITICAL,
                status = AlertStatus.ACTIVE,
                locationName = "Ridgeview Canyon Park",
                coordinates = Coordinates(37.8200, -122.3800),
                radiusMeters = 3500,
                affectedPopulation = 4200,
                timestamp = "15 mins ago",
                verifiedCount = 38,
                source = "Fire Rescue Command / Incident Dispatch",
                description = "Rapidly expanding brush perimeter fueled by 35 km/h wind gusts. Evacuation perimeter established west of Pine Boulevard.",
                hazardMetrics = HazardMetrics(
                    temperatureC = 28.5,
                    windSpeedKmh = 34.0,
                    windDirection = "ENE",
                    humidityPct = 18,
                    aqiIndex = 168
                ),
                recommendedActions = listOf(
                    "Evacuate Sector 4 via West Highway 101 Northbound.",
                    "Keep windows and vehicle air intakes strictly closed.",
                    "Report uncontained ember spots to civilian dispatch."
                ),
                evacuationRoutes = listOf("West Route 101 N", "Canyon Passway to Safe Haven Shelter A")
            ),
            DisasterAlert(
                id = "alert-flood-002",
                title = "Creek Basin Flash Surcharge Watch",
                category = DisasterCategory.FLOOD,
                severity = SeverityLevel.HIGH,
                status = AlertStatus.MONITORING,
                locationName = "Lower Creek Basin & Mill Valley",
                coordinates = Coordinates(37.7400, -122.4600),
                radiusMeters = 2200,
                affectedPopulation = 1850,
                timestamp = "42 mins ago",
                verifiedCount = 19,
                source = "Hydrologic Telemetry Gauges",
                description = "River level reached 3.8m against 4.0m danger threshold. Runoff from upper hills accelerating after concentrated cloudburst.",
                hazardMetrics = HazardMetrics(
                    riverLevelMeters = 3.82,
                    riverThresholdMeters = 4.00,
                    soilSaturationPct = 88
                ),
                recommendedActions = listOf(
                    "Deploy sandbags along basement grade entries.",
                    "Move electrical equipment and vehicles to elevated parking."
                ),
                evacuationRoutes = listOf("Highland Avenue Bypass")
            )
        )
    }

    fun getInitialNWPComparison(): NWPModelComparisonData {
        return NWPModelComparisonData(
            locationName = DEFAULT_LOCATION_NAME,
            generatedAt = "Updated 10m ago (06Z Ensemble Cycle)",
            sounding = SoundingAnalysis(
                capeJkg = 1420.0,
                liftedIndex = -3.4,
                stormPotential = "Enhanced Convective Potential",
                interpretation = "Moderate instability coupled with low-level moisture convergence favors scattered severe thunderstorms with squall winds."
            ),
            modelConsensus = "High alignment on frontal passage timing (02:00-06:00 UTC). GFS predicts slightly heavier peak precipitation than ECMWF.",
            confidenceRating = "High (88% Model Agreement)",
            timeline = listOf(
                NWPModelPoint("12h", 22.0, 21.8, 22.2, 21.5, 0.0, 0.0, 0.0, 0.0, 16.0, 320.0, 95),
                NWPModelPoint("18h", 20.5, 20.0, 20.8, 19.8, 1.2, 0.8, 1.5, 1.0, 22.0, 890.0, 90),
                NWPModelPoint("24h", 16.0, 15.5, 16.2, 15.0, 6.8, 5.4, 7.2, 7.8, 34.0, 1420.0, 85),
                NWPModelPoint("36h", 18.2, 18.0, 18.5, 17.8, 0.4, 0.2, 0.5, 0.2, 18.0, 410.0, 92),
                NWPModelPoint("48h", 21.0, 21.4, 20.9, 21.0, 0.0, 0.0, 0.0, 0.0, 14.0, 180.0, 98)
            )
        )
    }

    fun getInitialAgroAdvisory(): AgroAdvisoryData {
        return AgroAdvisoryData(
            locationName = "Regional Agro Corridor",
            soilMoisturePct = 68,
            sprayWindowFavorable = true,
            bestSprayWindow = "07:00 AM - 10:30 AM (Wind < 12 km/h)",
            irrigationAdvice = "Pause supplemental overhead irrigation; incoming convective rainfall will supply 12-18mm soil hydration.",
            crops = listOf(
                CropAdvisory("Wheat / Cereal", "Rabi", "Tillering to Stem Elongation", "favorable", "Healthy canopy development. Maintain drainage channels to avert root hypoxia.", "Rust fungus", "Prophylactic sulfur dusting if humidity persists > 80%."),
                CropAdvisory("Mustard / Oilseed", "Rabi", "Pod Formation", "optimal", "Adequate moisture supporting seed development. Soil moisture saturation index is optimal.", "Aphids / Pod Borer", "Deploy yellow sticky traps along field perimeter."),
                CropAdvisory("Horticulture / Tomato", "Annual", "Flowering & Fruit Set", "moderate", "Stake tall vines to prevent lodging from forecasted 35 km/h squalls.", "Early Blight", "Copper oxychloride spray during tomorrow morning's window.")
            )
        )
    }

    fun getInitialSafeHavens(): List<SafeHavenPoint> {
        return listOf(
            SafeHavenPoint(
                id = "haven-01",
                name = "Civic Arena Emergency Shelter",
                type = "verified_shelter",
                coordinates = Coordinates(37.7800, -122.4100),
                capacityTotal = 450,
                capacityOccupied = 180,
                amenities = listOf("Cots & Blankets", "Clean Drinking Water", "Backup Generator", "First Aid Triage", "Pet Accommodating"),
                isOpen = true,
                contactPhone = "+1 (555) 019-2834",
                address = "100 Civic Center Plaza, Gate 3"
            ),
            SafeHavenPoint(
                id = "haven-02",
                name = "North Ridge Medical Point & Triage",
                type = "medical_point",
                coordinates = Coordinates(37.7950, -122.4200),
                capacityTotal = 120,
                capacityOccupied = 45,
                amenities = listOf("Trauma Staff", "Oxygen Concentrators", "Insulin Refrigeration", "Emergency Ambulance Dock"),
                isOpen = true,
                contactPhone = "+1 (555) 019-8831",
                address = "450 North Medical Way"
            ),
            SafeHavenPoint(
                id = "haven-03",
                name = "St. Jude Water & Ration Hub",
                type = "water_distribution",
                coordinates = Coordinates(37.7600, -122.4350),
                capacityTotal = 800,
                capacityOccupied = 210,
                amenities = listOf("Bottled Water Crates", "Dry MRE Ration Packs", "Infant Formula", "Mobile Phone Charging Station"),
                isOpen = true,
                contactPhone = "+1 (555) 019-4492",
                address = "1200 Church Street Hall"
            )
        )
    }

    fun getInitialHelpRequests(): List<HelpRequest> {
        return listOf(
            HelpRequest(
                id = "req-001",
                requesterName = "Elena Rostova",
                phoneMasked = "+1 (555) •••-4921",
                locationName = "Maple Grove Senior Living",
                coordinates = Coordinates(37.7820, -122.4150),
                category = AidCategory.POWER_TRANSPORT,
                subCategory = "Wheelchair Accessible Transport",
                urgency = AidUrgency.WITHIN_2_HOURS,
                peopleCount = 3,
                description = "Elderly residents need wheelchair transport away from wildfire smoke plume. Oxygen tanks running low.",
                specialNeeds = listOf("Wheelchair Lift", "Oxygen Support"),
                status = "open",
                createdAt = "25m ago",
                offersCount = 2
            ),
            HelpRequest(
                id = "req-002",
                requesterName = "Marcus Vance",
                phoneMasked = "+1 (555) •••-8812",
                locationName = "Lower Creek Bend, Unit 4B",
                coordinates = Coordinates(37.7420, -122.4580),
                category = AidCategory.FOOD_WATER,
                subCategory = "Drinking Water & Dry Rations",
                urgency = AidUrgency.TODAY,
                peopleCount = 5,
                description = "Tap water contaminated due to municipal drain backup. Need clean potable water bottles and basic baby formula.",
                specialNeeds = listOf("Infant Nutrition", "Water Filters"),
                status = "open",
                createdAt = "1h ago",
                offersCount = 4
            )
        )
    }

    fun getInitialVolunteerOffers(): List<VolunteerOffer> {
        return listOf(
            VolunteerOffer(
                id = "vol-001",
                volunteerName = "David Chen",
                phoneMasked = "+1 (555) •••-1290",
                roleSkills = listOf("4x4 High-Clearance Truck", "Chainsaw Certified", "First Aid / CPR"),
                coordinates = Coordinates(37.7700, -122.4200),
                locationName = "Mission District Base",
                radiusCoveredKm = 15,
                capacityDetails = "Can transport up to 4 adults plus cargo/supplies or debris clearance tools.",
                isAvailable = true,
                verifiedStatus = true,
                missionsCompleted = 12
            ),
            VolunteerOffer(
                id = "vol-002",
                volunteerName = "Sarah Jenkins (RN)",
                phoneMasked = "+1 (555) •••-7341",
                roleSkills = listOf("Registered Nurse", "Wound Care", "Triage Coordinator"),
                coordinates = Coordinates(37.7850, -122.4050),
                locationName = "Downtown Medical Core",
                radiusCoveredKm = 10,
                capacityDetails = "Equipped with professional mobile trauma pack and diagnostic tools.",
                isAvailable = true,
                verifiedStatus = true,
                missionsCompleted = 24
            )
        )
    }

    fun getInitialCommunityReports(): List<CommunityReport> {
        return listOf(
            CommunityReport(
                id = "rep-001",
                authorName = "Jordan Miller",
                category = DisasterCategory.LANDSLIDE,
                title = "Mud and Boulder Slip Blocking Highway 9 Eastbound",
                description = "Hillside slipped following overnight saturated rainfall. Downed oak tree and debris blocking both eastbound lanes. Highway patrol notified.",
                locationName = "Highway 9 Mile Marker 14",
                coordinates = Coordinates(37.7300, -122.4700),
                severity = SeverityLevel.HIGH,
                timestamp = "30m ago",
                upvotes = 24,
                downvotes = 1,
                verifiedByGuardians = true
            ),
            CommunityReport(
                id = "rep-002",
                authorName = "Aisha Khan",
                category = DisasterCategory.FLOOD,
                title = "Storm Drain Overflow at 4th & Harrison Underpass",
                description = "Water pooling approximately 40cm deep. Sedans cannot pass; two vehicles already stalled in center puddle.",
                locationName = "4th St Underpass at Harrison",
                coordinates = Coordinates(37.7790, -122.4010),
                severity = SeverityLevel.MODERATE,
                timestamp = "1h ago",
                upvotes = 18,
                downvotes = 0,
                verifiedByGuardians = true
            )
        )
    }
}
