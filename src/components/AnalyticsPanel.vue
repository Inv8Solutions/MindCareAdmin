<script setup lang="ts">
import { ref } from 'vue'

// Sample KPI cards — replace values with real backend data
const kpis = ref([
  { title: 'Registered Students', value: '2,847', change: '+12%', trend: 'up' },
  { title: 'Learners with special needs (LSNs)', value: '128', change: '+2%', trend: 'up' },
  { title: 'Verified Students', value: '2,432', change: '+8%', trend: 'up' },
  { title: 'Students who answered assessment', value: '1,956', change: '+4%', trend: 'up' },
])

const timeRange = ref('7d')
</script>

<template>
  <div class="analytics-panel">
    <div class="panel-header">
      <h3>Analytics Dashboard</h3>
      <select v-model="timeRange" class="time-selector">
        <option value="1d">Last 24 hours</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
      </select>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div v-for="kpi in kpis" :key="kpi.title" class="kpi-card">
        <div class="kpi-content">
          <h4 class="kpi-title">{{ kpi.title }}</h4>
          <p class="kpi-value">{{ kpi.value }}</p>
          <div class="kpi-change" :class="kpi.trend">
            <span class="change-icon">{{ kpi.trend === 'up' ? '↗' : '↘' }}</span>
            {{ kpi.change }}
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- Mental Health Risk Chart -->
      <div class="chart-container large">
        <div class="chart-header">
          <h4>Mental Health Risk</h4>
          <div class="chart-legend">
            <span class="legend-item">
              <span class="legend-color" style="background: #ef4444"></span>
              High risk
            </span>
            <span class="legend-item">
              <span class="legend-color" style="background: #f59e0b"></span>
              Medium risk
            </span>
            <span class="legend-item">
              <span class="legend-color" style="background: #10b981"></span>
              Low risk
            </span>
          </div>
        </div>
        <div class="chart-placeholder">
          <div class="chart-bars">
            <div
              class="bar"
              style="height: 20%; background: linear-gradient(to top, #ef4444, #fca5a5)"
            ></div>
            <div
              class="bar"
              style="height: 45%; background: linear-gradient(to top, #f59e0b, #fcd34d)"
            ></div>
            <div
              class="bar"
              style="height: 70%; background: linear-gradient(to top, #10b981, #6ee7b7)"
            ></div>
            <div
              class="bar"
              style="height: 55%; background: linear-gradient(to top, #f59e0b, #fcd34d)"
            ></div>
            <div
              class="bar"
              style="height: 30%; background: linear-gradient(to top, #ef4444, #fca5a5)"
            ></div>
            <div
              class="bar"
              style="height: 65%; background: linear-gradient(to top, #10b981, #6ee7b7)"
            ></div>
            <div
              class="bar"
              style="height: 40%; background: linear-gradient(to top, #f59e0b, #fcd34d)"
            ></div>
          </div>
          <p class="chart-note">Risk distribution placeholder — replace with real risk chart</p>
        </div>
      </div>

      <!-- User Demographics -->
      <div class="chart-container">
        <div class="chart-header">
          <h4>User Demographics</h4>
        </div>
        <div class="chart-placeholder">
          <div class="donut-chart">
            <div class="donut-segments">
              <div class="segment segment-1"></div>
              <div class="segment segment-2"></div>
              <div class="segment segment-3"></div>
              <div class="segment segment-4"></div>
            </div>
            <div class="donut-center">
              <span class="donut-value">100%</span>
              <span class="donut-label">Coverage</span>
            </div>
          </div>
          <div class="demographics-list">
            <div class="demo-item">
              <span class="demo-color color-1"></span>
              <span>18-24 (35%)</span>
            </div>
            <div class="demo-item">
              <span class="demo-color color-2"></span>
              <span>25-34 (28%)</span>
            </div>
            <div class="demo-item">
              <span class="demo-color color-3"></span>
              <span>35-44 (22%)</span>
            </div>
            <div class="demo-item">
              <span class="demo-color color-4"></span>
              <span>45+ (15%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Heatmap -->
      <div class="chart-container">
        <div class="chart-header">
          <h4>Activity Heatmap</h4>
        </div>
        <div class="chart-placeholder">
          <div class="heatmap">
            <div class="heatmap-labels">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
            <div class="heatmap-grid">
              <div class="heat-cell low"></div>
              <div class="heat-cell medium"></div>
              <div class="heat-cell high"></div>
              <div class="heat-cell medium"></div>
              <div class="heat-cell high"></div>
              <div class="heat-cell low"></div>
              <div class="heat-cell medium"></div>
            </div>
          </div>
          <p class="chart-note">Weekly activity patterns</p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="chart-container">
        <div class="chart-header">
          <h4>Recent Activity</h4>
        </div>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon new-user">👤</div>
            <div class="activity-content">
              <p class="activity-text">New user registration</p>
              <span class="activity-time">2 minutes ago</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon session">🎯</div>
            <div class="activity-content">
              <p class="activity-text">High engagement session completed</p>
              <span class="activity-time">15 minutes ago</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon milestone">🏆</div>
            <div class="activity-content">
              <p class="activity-text">User milestone achieved</p>
              <span class="activity-time">1 hour ago</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon feedback">💬</div>
            <div class="activity-content">
              <p class="activity-text">New feedback received</p>
              <span class="activity-time">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.analytics-panel {
  background: var(--surface, #fff);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  min-height: 600px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.time-selector {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.time-selector:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.kpi-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.kpi-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.kpi-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.kpi-change.up {
  color: #059669;
}

.kpi-change.down {
  color: #dc2626;
}

.change-icon {
  font-size: 1rem;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.chart-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.chart-container.large {
  grid-column: 1 / -1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-header h4 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.chart-legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.primary {
  background: #3b82f6;
}

.legend-color.secondary {
  background: #10b981;
}

/* Chart Placeholders */
.chart-placeholder {
  position: relative;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 120px;
  margin-bottom: 1rem;
}

.bar {
  width: 20px;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 2px;
  min-height: 10px;
}

.chart-note {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
  margin: 0;
}

/* Donut Chart */
.donut-chart {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
}

.donut-segments {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    #3b82f6 0deg 126deg,
    #10b981 126deg 226deg,
    #f59e0b 226deg 305deg,
    #ef4444 305deg 360deg
  );
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.donut-value {
  font-weight: 600;
  font-size: 1rem;
  color: #1f2937;
}

.donut-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.demographics-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.demo-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.demo-color.color-1 {
  background: #3b82f6;
}
.demo-color.color-2 {
  background: #10b981;
}
.demo-color.color-3 {
  background: #f59e0b;
}
.demo-color.color-4 {
  background: #ef4444;
}

/* Heatmap */
.heatmap {
  width: 100%;
}

.heatmap-labels {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
  text-align: center;
}

.heatmap-labels span {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.heat-cell {
  aspect-ratio: 1;
  border-radius: 2px;
}

.heat-cell.low {
  background: #dbeafe;
}
.heat-cell.medium {
  background: #93c5fd;
}
.heat-cell.high {
  background: #3b82f6;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.activity-icon.new-user {
  background: #dbeafe;
}
.activity-icon.session {
  background: #d1fae5;
}
.activity-icon.milestone {
  background: #fef3c7;
}
.activity-icon.feedback {
  background: #fce7f3;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.875rem;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.activity-time {
  font-size: 0.75rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-container.large {
    grid-column: unset;
  }

  .kpi-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .panel-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
