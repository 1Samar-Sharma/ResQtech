package com.example.resqtech

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.resqtech.data.WeatherRepository
import com.example.resqtech.data.local.AppDatabase
import com.example.resqtech.ui.components.ResQBottomBar
import com.example.resqtech.ui.components.ResQTopBar
import com.example.resqtech.ui.components.SOSModalDialog
import com.example.resqtech.ui.screens.*
import com.example.resqtech.ui.theme.DarkBackground
import com.example.resqtech.ui.theme.WeatherGPTTheme
import com.example.resqtech.viewmodel.ResQViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val database = AppDatabase.getInstance(applicationContext)
        val repository = WeatherRepository(database)
        val viewModelFactory = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                return ResQViewModel(repository) as T
            }
        }

        setContent {
            val resQViewModel: ResQViewModel = viewModel(factory = viewModelFactory)
            WeatherGPTTheme {
                WeatherGPTApp(viewModel = resQViewModel)
            }
        }
    }
}

@Composable
fun WeatherGPTApp(viewModel: ResQViewModel) {
    val selectedTab by viewModel.selectedTab.collectAsState()
    val temperatureUnit by viewModel.temperatureUnit.collectAsState()
    val currentWeather by viewModel.currentWeather.collectAsState()
    val hourlyForecast by viewModel.hourlyForecast.collectAsState()
    val dailyForecast by viewModel.dailyForecast.collectAsState()
    val imdAlerts by viewModel.imdAlerts.collectAsState()
    val nwpData by viewModel.nwpData.collectAsState()
    val agroData by viewModel.agroData.collectAsState()
    val safeHavens by viewModel.safeHavens.collectAsState()
    val volunteerOffers by viewModel.volunteerOffers.collectAsState()
    val disasterAlerts by viewModel.disasterAlerts.collectAsState()
    val helpRequests by viewModel.helpRequests.collectAsState()
    val communityReports by viewModel.communityReports.collectAsState()
    val activePersona by viewModel.activePersona.collectAsState()
    val chatMessages by viewModel.chatMessages.collectAsState()
    val isSosModalOpen by viewModel.isSosModalOpen.collectAsState()
    val isSosActive by viewModel.isSosActive.collectAsState()
    val sosNotes by viewModel.sosNotes.collectAsState()

    Scaffold(
        containerColor = DarkBackground,
        topBar = {
            ResQTopBar(
                locationName = currentWeather.locationName,
                temperatureUnit = temperatureUnit,
                isSosActive = isSosActive,
                onToggleUnit = { viewModel.toggleUnit() },
                onOpenSos = { viewModel.openSosModal(true) }
            )
        },
        bottomBar = {
            ResQBottomBar(
                selectedTab = selectedTab,
                onTabSelected = { viewModel.selectTab(it) },
                alertCount = disasterAlerts.size + imdAlerts.size
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (selectedTab) {
                "home" -> HomeScreen(
                    currentWeather = currentWeather,
                    temperatureUnit = temperatureUnit,
                    imdAlerts = imdAlerts,
                    disasterAlerts = disasterAlerts,
                    isSosActive = isSosActive,
                    onNavigateTab = { viewModel.selectTab(it) },
                    onOpenSos = { viewModel.openSosModal(true) }
                )
                "ai_weather" -> WeatherGPTScreen(
                    chatMessages = chatMessages,
                    activePersona = activePersona,
                    onSelectPersona = { viewModel.setPersona(it) },
                    onSendMessage = { viewModel.sendUserMessage(it) }
                )
                "forecast" -> ForecastScreen(
                    hourlyForecast = hourlyForecast,
                    dailyForecast = dailyForecast,
                    nwpData = nwpData,
                    agroData = agroData,
                    temperatureUnit = temperatureUnit
                )
                "alerts" -> AlertsScreen(
                    imdAlerts = imdAlerts,
                    disasterAlerts = disasterAlerts
                )
                "relief" -> CivicReliefScreen(
                    helpRequests = helpRequests,
                    safeHavens = safeHavens,
                    volunteerOffers = volunteerOffers,
                    onSubmitHelpRequest = { name, cat, subCat, urgency, count, desc, loc ->
                        viewModel.addHelpRequest(name, cat, subCat, urgency, count, desc, loc)
                    }
                )
                "community" -> CommunityScreen(
                    communityReports = communityReports,
                    onSubmitReport = { title, desc, cat, sev, loc ->
                        viewModel.addCommunityReport(title, desc, cat, sev, loc)
                    },
                    onVoteReport = { id, upvote ->
                        viewModel.voteCommunityReport(id, upvote)
                    }
                )
            }
        }

        // Emergency SOS Beacon Modal
        SOSModalDialog(
            isOpen = isSosModalOpen,
            isSosActive = isSosActive,
            activeNotes = sosNotes,
            onDismiss = { viewModel.openSosModal(false) },
            onTriggerSos = { notes -> viewModel.triggerSosBeacon(notes) },
            onCancelSos = { viewModel.cancelSosBeacon() }
        )
    }
}
