package com.example.resqtech.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "disaster_alerts")
data class DisasterAlertEntity(
    @PrimaryKey val id: String,
    val title: String,
    val category: String,
    val severity: String,
    val status: String,
    val locationName: String,
    val lat: Double,
    val lng: Double,
    val radiusMeters: Int,
    val affectedPopulation: Int,
    val timestamp: String,
    val verifiedCount: Int,
    val source: String,
    val description: String,
    val recommendedActionsCsv: String,
    val evacuationRoutesCsv: String
)

@Entity(tableName = "help_requests")
data class HelpRequestEntity(
    @PrimaryKey val id: String,
    val requesterName: String,
    val phoneMasked: String,
    val locationName: String,
    val lat: Double,
    val lng: Double,
    val category: String,
    val subCategory: String,
    val urgency: String,
    val peopleCount: Int,
    val description: String,
    val status: String,
    val createdAt: String,
    val offersCount: Int
)

@Entity(tableName = "community_reports")
data class CommunityReportEntity(
    @PrimaryKey val id: String,
    val authorName: String,
    val category: String,
    val title: String,
    val description: String,
    val locationName: String,
    val lat: Double,
    val lng: Double,
    val severity: String,
    val timestamp: String,
    val upvotes: Int,
    val downvotes: Int,
    val userVoted: String?,
    val verifiedByGuardians: Boolean
)
