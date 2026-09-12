package com.example.resqtech.ui.components

import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.example.resqtech.ui.theme.*

data class NavItem(
    val id: String,
    val label: String,
    val icon: ImageVector,
    val testTag: String
)

@Composable
fun ResQBottomBar(
    selectedTab: String,
    onTabSelected: (String) -> Unit,
    alertCount: Int = 0,
    modifier: Modifier = Modifier
) {
    val items = listOf(
        NavItem("home", "Home", Icons.Default.Home, "nav_home"),
        NavItem("ai_weather", "AI", Icons.Default.SmartToy, "nav_ai_weather"),
        NavItem("forecast", "Forecast", Icons.Default.DateRange, "nav_forecast"),
        NavItem("alerts", "Alerts", Icons.Default.Warning, "nav_alerts"),
        NavItem("relief", "Relief", Icons.Default.HealthAndSafety, "nav_relief"),
        NavItem("community", "Feed", Icons.Default.People, "nav_community")
    )

    NavigationBar(
        containerColor = DarkSurface,
        contentColor = TextPrimary,
        tonalElevation = 8.dp,
        modifier = modifier
    ) {
        items.forEach { item ->
            val isSelected = selectedTab == item.id
            NavigationBarItem(
                selected = isSelected,
                onClick = { onTabSelected(item.id) },
                icon = {
                    if (item.id == "alerts" && alertCount > 0) {
                        BadgedBox(
                            badge = {
                                Badge(containerColor = RedAlert) {
                                    Text("$alertCount")
                                }
                            }
                        ) {
                            Icon(
                                imageVector = item.icon,
                                contentDescription = item.label,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    } else {
                        Icon(
                            imageVector = item.icon,
                            contentDescription = item.label,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                },
                label = {
                    Text(
                        text = item.label,
                        style = MaterialTheme.typography.labelSmall
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = AmberWarning,
                    selectedTextColor = AmberWarning,
                    indicatorColor = DarkSurfaceCard,
                    unselectedIconColor = TextSecondary,
                    unselectedTextColor = TextSecondary
                ),
                modifier = Modifier.testTag(item.testTag)
            )
        }
    }
}
