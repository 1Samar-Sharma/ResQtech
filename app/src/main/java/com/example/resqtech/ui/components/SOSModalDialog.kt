package com.example.resqtech.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.example.resqtech.ui.theme.*

@Composable
fun SOSModalDialog(
    isOpen: Boolean,
    isSosActive: Boolean,
    activeNotes: String,
    onDismiss: () -> Unit,
    onTriggerSos: (String) -> Unit,
    onCancelSos: () -> Unit
) {
    if (!isOpen) return

    var notes by remember { mutableStateOf("") }
    var selectedEmergencyType by remember { mutableStateOf("Immediate Life Threat") }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = DarkSurface),
            modifier = Modifier.fillMaxWidth().padding(8.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .background(RedAlert.copy(alpha = 0.2f), RoundedCornerShape(28.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Warning,
                        contentDescription = "Distress Siren",
                        tint = RedAlert,
                        modifier = Modifier.size(32.dp)
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = if (isSosActive) "EMERGENCY DISTRESS ACTIVE" else "BROADCAST SOS DISTRESS BEACON",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                    color = if (isSosActive) RedAlert else TextPrimary
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = if (isSosActive)
                        "Your distress signal is broadcasting across a 5km radius to verified local guardians and civil responders."
                    else
                        "Transmits an immediate high-priority beacon to all civil responders, nearby volunteers, and designated emergency contacts.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )

                Spacer(modifier = Modifier.height(16.dp))

                if (isSosActive) {
                    if (activeNotes.isNotBlank()) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = DarkSurfaceCard,
                            modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)
                        ) {
                            Text(
                                text = "Reported situation: $activeNotes",
                                style = MaterialTheme.typography.bodyMedium,
                                color = AmberWarning,
                                modifier = Modifier.padding(12.dp)
                            )
                        }
                    }

                    Button(
                        onClick = {
                            onCancelSos()
                            onDismiss()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = GreenSafe),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth().testTag("cancel_sos_button")
                    ) {
                        Text("CANCEL SOS / MARK AS SAFE", fontWeight = FontWeight.Bold)
                    }
                } else {
                    OutlinedTextField(
                        value = notes,
                        onValueChange = { notes = it },
                        label = { Text("Emergency Details (Trapped, Medical, Smoke)") },
                        placeholder = { Text("e.g. 2 people trapped on 2nd floor, water rising...") },
                        modifier = Modifier.fillMaxWidth().testTag("sos_notes_input"),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = RedAlert,
                            unfocusedBorderColor = DarkSurfaceBorder,
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary
                        ),
                        maxLines = 3
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            onTriggerSos(notes)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = RedAlert),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth().testTag("confirm_sos_button")
                    ) {
                        Text("CONFIRM EMERGENCY SOS", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                TextButton(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth().testTag("close_sos_dialog")
                ) {
                    Text("Close", color = TextSecondary)
                }
            }
        }
    }
}
