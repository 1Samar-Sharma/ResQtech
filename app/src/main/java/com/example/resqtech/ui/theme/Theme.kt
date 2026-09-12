package com.example.resqtech.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = AmberWarning,
    onPrimary = DarkBackground,
    primaryContainer = AmberDark,
    onPrimaryContainer = AmberLight,
    secondary = CyanAccent,
    onSecondary = DarkBackground,
    secondaryContainer = CyanDark,
    onSecondaryContainer = TextPrimary,
    background = DarkBackground,
    onBackground = TextPrimary,
    surface = DarkSurface,
    onSurface = TextPrimary,
    surfaceVariant = DarkSurfaceCard,
    onSurfaceVariant = TextSecondary,
    error = RedAlert,
    onError = TextPrimary
)

@Composable
fun WeatherGPTTheme(
    darkTheme: Boolean = true, // Force high-contrast dark emergency theme
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
