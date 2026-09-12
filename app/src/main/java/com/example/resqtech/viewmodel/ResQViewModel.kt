package com.example.resqtech.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.resqtech.data.WeatherRepository
import com.example.resqtech.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class ResQViewModel(private val repository: WeatherRepository) : ViewModel() {

    private val _selectedTab = MutableStateFlow("home")
    val selectedTab: StateFlow<String> = _selectedTab.asStateFlow()

    private val _temperatureUnit = MutableStateFlow("C") // "C" or "F"
    val temperatureUnit: StateFlow<String> = _temperatureUnit.asStateFlow()

    private val _currentWeather = MutableStateFlow(repository.getCurrentWeather())
    val currentWeather: StateFlow<CurrentWeatherState> = _currentWeather.asStateFlow()

    private val _hourlyForecast = MutableStateFlow(repository.getHourlyForecast())
    val hourlyForecast: StateFlow<List<HourlyWeatherForecast>> = _hourlyForecast.asStateFlow()

    private val _dailyForecast = MutableStateFlow(repository.getDailyForecast())
    val dailyForecast: StateFlow<List<DailyWeatherForecast>> = _dailyForecast.asStateFlow()

    private val _imdAlerts = MutableStateFlow(repository.getIMDAlerts())
    val imdAlerts: StateFlow<List<IMDColorAlert>> = _imdAlerts.asStateFlow()

    private val _nwpData = MutableStateFlow(repository.getNWPComparison())
    val nwpData: StateFlow<NWPModelComparisonData> = _nwpData.asStateFlow()

    private val _agroData = MutableStateFlow(repository.getAgroAdvisory())
    val agroData: StateFlow<AgroAdvisoryData> = _agroData.asStateFlow()

    private val _safeHavens = MutableStateFlow(repository.getSafeHavens())
    val safeHavens: StateFlow<List<SafeHavenPoint>> = _safeHavens.asStateFlow()

    private val _volunteerOffers = MutableStateFlow(repository.getVolunteerOffers())
    val volunteerOffers: StateFlow<List<VolunteerOffer>> = _volunteerOffers.asStateFlow()

    // Room Streams
    private val _disasterAlerts = MutableStateFlow<List<DisasterAlert>>(emptyList())
    val disasterAlerts: StateFlow<List<DisasterAlert>> = _disasterAlerts.asStateFlow()

    private val _helpRequests = MutableStateFlow<List<HelpRequest>>(emptyList())
    val helpRequests: StateFlow<List<HelpRequest>> = _helpRequests.asStateFlow()

    private val _communityReports = MutableStateFlow<List<CommunityReport>>(emptyList())
    val communityReports: StateFlow<List<CommunityReport>> = _communityReports.asStateFlow()

    // Conversational WeatherGPT
    private val _activePersona = MutableStateFlow(WeatherPersona.GENERAL)
    val activePersona: StateFlow<WeatherPersona> = _activePersona.asStateFlow()

    private val _chatMessages = MutableStateFlow<List<WeatherChatMessage>>(
        listOf(
            WeatherChatMessage(
                id = "init-1",
                sender = "assistant",
                text = "Welcome to WeatherGPT & ResQ Emergency Operations. Select a specialized persona or ask about current storm fronts, rainfall projections, coastal swells, or civil relief resources.",
                timestamp = "Just now",
                personaUsed = WeatherPersona.GENERAL.code
            )
        )
    )
    val chatMessages: StateFlow<List<WeatherChatMessage>> = _chatMessages.asStateFlow()

    // SOS Emergency Beacon
    private val _isSosModalOpen = MutableStateFlow(false)
    val isSosModalOpen: StateFlow<Boolean> = _isSosModalOpen.asStateFlow()

    private val _isSosActive = MutableStateFlow(false)
    val isSosActive: StateFlow<Boolean> = _isSosActive.asStateFlow()

    private val _sosNotes = MutableStateFlow("")
    val sosNotes: StateFlow<String> = _sosNotes.asStateFlow()

    init {
        viewModelScope.launch {
            repository.initializeSeedDataIfNeeded()
        }
        viewModelScope.launch {
            repository.getDisasterAlertsStream().collect {
                _disasterAlerts.value = it
            }
        }
        viewModelScope.launch {
            repository.getHelpRequestsStream().collect {
                _helpRequests.value = it
            }
        }
        viewModelScope.launch {
            repository.getCommunityReportsStream().collect {
                _communityReports.value = it
            }
        }
    }

    fun selectTab(tab: String) {
        _selectedTab.value = tab
    }

    fun toggleUnit() {
        _temperatureUnit.value = if (_temperatureUnit.value == "C") "F" else "C"
    }

    fun setPersona(persona: WeatherPersona) {
        _activePersona.value = persona
    }

    fun sendUserMessage(queryText: String) {
        if (queryText.isBlank()) return
        val timeStr = SimpleDateFormat("h:mm a", Locale.getDefault()).format(Date())
        val userMsg = WeatherChatMessage(
            id = "user-${UUID.randomUUID()}",
            sender = "user",
            text = queryText,
            timestamp = timeStr,
            personaUsed = _activePersona.value.code
        )
        _chatMessages.value = _chatMessages.value + userMsg

        viewModelScope.launch {
            val reply = repository.generatePersonaReply(queryText, _activePersona.value)
            _chatMessages.value = _chatMessages.value + reply
        }
    }

    fun openSosModal(open: Boolean) {
        _isSosModalOpen.value = open
    }

    fun triggerSosBeacon(notes: String) {
        _sosNotes.value = notes
        _isSosActive.value = true
        _isSosModalOpen.value = false
    }

    fun cancelSosBeacon() {
        _isSosActive.value = false
        _sosNotes.value = ""
    }

    fun addHelpRequest(
        requesterName: String,
        category: AidCategory,
        subCategory: String,
        urgency: AidUrgency,
        peopleCount: Int,
        description: String,
        locationName: String
    ) {
        viewModelScope.launch {
            repository.addHelpRequest(
                requesterName,
                category,
                subCategory,
                urgency,
                peopleCount,
                description,
                locationName
            )
        }
    }

    fun addCommunityReport(
        title: String,
        description: String,
        category: DisasterCategory,
        severity: SeverityLevel,
        locationName: String
    ) {
        viewModelScope.launch {
            repository.addCommunityReport(title, description, category, severity, locationName)
        }
    }

    fun voteCommunityReport(reportId: String, isUpvote: Boolean) {
        viewModelScope.launch {
            if (isUpvote) {
                repository.upvoteReport(reportId)
            } else {
                repository.downvoteReport(reportId)
            }
        }
    }
}
