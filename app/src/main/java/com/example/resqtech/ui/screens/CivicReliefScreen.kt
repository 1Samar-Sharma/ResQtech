package com.example.resqtech.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Phone
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
import androidx.compose.ui.window.Dialog
import com.example.resqtech.model.*
import com.example.resqtech.ui.theme.*

@Composable
fun CivicReliefScreen(
    helpRequests: List<HelpRequest>,
    safeHavens: List<SafeHavenPoint>,
    volunteerOffers: List<VolunteerOffer>,
    onSubmitHelpRequest: (
        requesterName: String,
        category: AidCategory,
        subCategory: String,
        urgency: AidUrgency,
        peopleCount: Int,
        description: String,
        locationName: String
    ) -> Unit,
    modifier: Modifier = Modifier
) {
    var activeSubTab by remember { mutableStateOf("requests") } // "requests", "havens", "volunteers"
    var showRequestDialog by remember { mutableStateOf(false) }

    Column(modifier = modifier.fillMaxSize().background(DarkBackground)) {
        // Sub-tabs
        Surface(color = DarkSurface, shadowElevation = 2.dp) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                TabChip(
                    title = "Aid Requests (${helpRequests.size})",
                    isSelected = activeSubTab == "requests",
                    onClick = { activeSubTab = "requests" },
                    modifier = Modifier.weight(1f).testTag("tab_aid_requests")
                )
                TabChip(
                    title = "Safe Havens (${safeHavens.size})",
                    isSelected = activeSubTab == "havens",
                    onClick = { activeSubTab = "havens" },
                    modifier = Modifier.weight(1f).testTag("tab_safe_havens")
                )
                TabChip(
                    title = "Volunteers (${volunteerOffers.size})",
                    isSelected = activeSubTab == "volunteers",
                    onClick = { activeSubTab = "volunteers" },
                    modifier = Modifier.weight(1f).testTag("tab_volunteers")
                )
            }
        }

        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
            contentPadding = PaddingValues(top = 16.dp, bottom = 24.dp)
        ) {
            when (activeSubTab) {
                "requests" -> {
                    item {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Urgent Civilian Aid Requests",
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                color = TextPrimary
                            )
                            Button(
                                onClick = { showRequestDialog = true },
                                colors = ButtonDefaults.buttonColors(containerColor = AmberWarning),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.testTag("request_aid_button")
                            ) {
                                Icon(imageVector = Icons.Default.Add, contentDescription = "Request Aid", modifier = Modifier.size(16.dp), tint = DarkBackground)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Request Aid", color = DarkBackground, fontWeight = FontWeight.Bold, style = MaterialTheme.typography.labelSmall)
                            }
                        }
                    }

                    items(helpRequests) { req ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = DarkSurfaceCard),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth().testTag("help_request_${req.id}")
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(4.dp))
                                            .background(
                                                if (req.urgency == AidUrgency.IMMEDIATE_LIFE_THREAT) RedAlert else OrangeAlert
                                            )
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text(
                                            text = req.urgency.label,
                                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                            color = Color.White
                                        )
                                    }
                                    Text(
                                        text = req.createdAt,
                                        style = MaterialTheme.typography.labelSmall,
                                        color = TextMuted
                                    )
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = "${req.category.label}: ${req.subCategory}",
                                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                    color = TextPrimary
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Requester: ${req.requesterName} • ${req.peopleCount} people affected",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = CyanAccent
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "Location: ${req.locationName}",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = TextMuted
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = req.description,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = TextSecondary
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = "Status: ${req.status.uppercase()}",
                                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                        color = if (req.status == "open") AmberWarning else GreenSafe
                                    )
                                    Text(
                                        text = "Contact: ${req.phoneMasked}",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = TextSecondary
                                    )
                                }
                            }
                        }
                    }
                }

                "havens" -> {
                    item {
                        Text(
                            text = "Verified Safe Haven Shelters & Medical Hubs",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = TextPrimary
                        )
                    }

                    items(safeHavens) { haven ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = DarkSurfaceCard),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth().testTag("safe_haven_${haven.id}")
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = haven.name,
                                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                        color = TextPrimary
                                    )
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(4.dp))
                                            .background(if (haven.isOpen) GreenSafe else RedAlert)
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text(
                                            text = if (haven.isOpen) "OPEN" else "FULL",
                                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                            color = Color.White
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(imageVector = Icons.Default.LocationOn, contentDescription = null, tint = TextMuted, modifier = Modifier.size(14.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(text = haven.address, style = MaterialTheme.typography.labelSmall, color = TextSecondary)
                                }
                                Spacer(modifier = Modifier.height(10.dp))
                                // Capacity Progress Bar
                                val pct = haven.capacityOccupied.toFloat() / haven.capacityTotal
                                Text(
                                    text = "Occupancy: ${haven.capacityOccupied} / ${haven.capacityTotal} beds (${(pct * 100).toInt()}%)",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = TextPrimary
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                LinearProgressIndicator(
                                    progress = { pct },
                                    modifier = Modifier.fillMaxWidth().height(6.dp).clip(RoundedCornerShape(3.dp)),
                                    color = if (pct > 0.85f) RedAlert else AmberWarning,
                                    trackColor = DarkSurfaceBorder
                                )
                                Spacer(modifier = Modifier.height(10.dp))
                                // Amenities
                                Text(
                                    text = "Amenities: ${haven.amenities.joinToString(" • ")}",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = CyanAccent
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(imageVector = Icons.Default.Phone, contentDescription = null, tint = GreenSafe, modifier = Modifier.size(14.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(text = "Emergency Desk: ${haven.contactPhone}", style = MaterialTheme.typography.labelSmall, color = GreenSafe)
                                }
                            }
                        }
                    }
                }

                "volunteers" -> {
                    item {
                        Text(
                            text = "Verified Civilian Responders Registry",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = TextPrimary
                        )
                    }

                    items(volunteerOffers) { vol ->
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
                                    Text(
                                        text = vol.volunteerName,
                                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                        color = TextPrimary
                                    )
                                    Text(
                                        text = "${vol.missionsCompleted} missions completed",
                                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                        color = GreenSafe
                                    )
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Coverage: ${vol.radiusCoveredKm}km around ${vol.locationName}",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = TextMuted
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = "Skills: ${vol.roleSkills.joinToString(" • ")}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = AmberWarning
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = vol.capacityDetails,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = TextSecondary
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    // New Aid Request Dialog
    if (showRequestDialog) {
        var requesterName by remember { mutableStateOf("") }
        var selectedCategory by remember { mutableStateOf(AidCategory.FOOD_WATER) }
        var subCategory by remember { mutableStateOf("") }
        var selectedUrgency by remember { mutableStateOf(AidUrgency.WITHIN_2_HOURS) }
        var peopleCountText by remember { mutableStateOf("2") }
        var description by remember { mutableStateOf("") }
        var location by remember { mutableStateOf("Downtown Sector 4") }

        Dialog(onDismissRequest = { showRequestDialog = false }) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = DarkSurface),
                modifier = Modifier.fillMaxWidth().padding(8.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = "Submit Emergency Aid Request",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        color = AmberWarning
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = requesterName,
                        onValueChange = { requesterName = it },
                        label = { Text("Your Name / Organization") },
                        modifier = Modifier.fillMaxWidth().testTag("aid_name_input"),
                        maxLines = 1
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = subCategory,
                        onValueChange = { subCategory = it },
                        label = { Text("Specific Need (e.g. Baby Formula, Oxygen, Cots)") },
                        modifier = Modifier.fillMaxWidth().testTag("aid_need_input"),
                        maxLines = 1
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = peopleCountText,
                        onValueChange = { peopleCountText = it },
                        label = { Text("Number of People Affected") },
                        modifier = Modifier.fillMaxWidth().testTag("aid_people_input"),
                        maxLines = 1
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = description,
                        onValueChange = { description = it },
                        label = { Text("Description & Special Medical Needs") },
                        modifier = Modifier.fillMaxWidth().testTag("aid_desc_input"),
                        maxLines = 2
                    )
                    Spacer(modifier = Modifier.height(14.dp))

                    Button(
                        onClick = {
                            val count = peopleCountText.toIntOrNull() ?: 1
                            onSubmitHelpRequest(
                                requesterName.ifBlank { "Civilian Resident" },
                                selectedCategory,
                                subCategory.ifBlank { "General Supplies" },
                                selectedUrgency,
                                count,
                                description.ifBlank { "Immediate aid requested at location." },
                                location
                            )
                            showRequestDialog = false
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = AmberWarning),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth().testTag("submit_aid_button")
                    ) {
                        Text("SUBMIT AID DISPATCH", color = DarkBackground, fontWeight = FontWeight.Bold)
                    }

                    TextButton(
                        onClick = { showRequestDialog = false },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Cancel", color = TextSecondary)
                    }
                }
            }
        }
    }
}
