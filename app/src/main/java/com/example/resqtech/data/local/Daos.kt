package com.example.resqtech.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface DisasterAlertDao {
    @Query("SELECT * FROM disaster_alerts ORDER BY timestamp DESC")
    fun getAllAlerts(): Flow<List<DisasterAlertEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(alerts: List<DisasterAlertEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(alert: DisasterAlertEntity)

    @Query("DELETE FROM disaster_alerts")
    suspend fun clearAll()
}

@Dao
interface HelpRequestDao {
    @Query("SELECT * FROM help_requests ORDER BY createdAt DESC")
    fun getAllRequests(): Flow<List<HelpRequestEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(request: HelpRequestEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(requests: List<HelpRequestEntity>)

    @Query("UPDATE help_requests SET status = :newStatus WHERE id = :id")
    suspend fun updateStatus(id: String, newStatus: String)

    @Query("DELETE FROM help_requests")
    suspend fun clearAll()
}

@Dao
interface CommunityReportDao {
    @Query("SELECT * FROM community_reports ORDER BY timestamp DESC")
    fun getAllReports(): Flow<List<CommunityReportEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(report: CommunityReportEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(reports: List<CommunityReportEntity>)

    @Query("UPDATE community_reports SET upvotes = upvotes + 1, userVoted = 'up' WHERE id = :id")
    suspend fun upvote(id: String)

    @Query("UPDATE community_reports SET downvotes = downvotes + 1, userVoted = 'down' WHERE id = :id")
    suspend fun downvote(id: String)
}
