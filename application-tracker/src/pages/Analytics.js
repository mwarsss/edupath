import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [applicationsOverTime, setApplicationsOverTime] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem("token");
      try {
        const overviewRes = await axios.get("http://127.0.0.1:8000/api/analytics/overview/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const timeRes = await axios.get("http://127.0.0.1:8000/api/analytics/over-time/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOverview(overviewRes.data);
        setApplicationsOverTime(timeRes.data.applications_over_time);
      } catch (err) {
        console.error("Failed to fetch analytics data.");
      }
    };

    fetchAnalytics();
  }, []);

  if (!overview || !applicationsOverTime) {
    return <h2>Loading Analytics...</h2>;
  }

  // Prepare data for charts
  const statusLabels = overview.applications_by_status.map((item) => item.application_status);
  const statusCounts = overview.applications_by_status.map((item) => item.count);

  const courseLabels = overview.applications_by_course.map((item) => item.course_applied);
  const courseCounts = overview.applications_by_course.map((item) => item.count);

  const timeLabels = applicationsOverTime.map((item) => item.day);
  const timeCounts = applicationsOverTime.map((item) => item.count);

  return (
    <div className="container mt-4">
      <h2>Reporting & Analytics</h2>

      <div className="row my-4">
        <div className="col-md-4">
          <h5>Total Students</h5>
          <p>{overview.total_students}</p>
        </div>
        <div className="col-md-4">
          <h5>Status Distribution</h5>
          <Pie
            data={{
              labels: statusLabels,
              datasets: [
                {
                  label: "Applications by Status",
                  data: statusCounts,
                  backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
                },
              ],
            }}
          />
        </div>
        <div className="col-md-4">
          <h5>Applications Per Course</h5>
          <Bar
            data={{
              labels: courseLabels,
              datasets: [
                {
                  label: "Applications by Course",
                  data: courseCounts,
                  backgroundColor: "#4CAF50",
                },
              ],
            }}
          />
        </div>
      </div>

      <div className="row my-4">
        <div className="col-12">
          <h5>Applications Over Time</h5>
          <Line
            data={{
              labels: timeLabels,
              datasets: [
                {
                  label: "Applications Over Time",
                  data: timeCounts,
                  fill: false,
                  borderColor: "#FF6384",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
