import React from "react";

const Dashboard = () => {
    const role = localStorage.getItem("role"); //Retrieve user roles

    return (
        <div>
            <h1>{role === 'staff' ? "Staff Dashboard" : 'Customer Dashboard' }</h1>
            <div>
                {role === 'staff' ? (
                    <StaffDashboard />
                ) : (
                    <CustomerDashboard />
                )}    
                
            </div>
        </div>

    );
};

//Placeholder components for sections
const StaffDashboard = () => <div>Staff Features Go Here</div>
const CustomerDashboard = () => <div>Customer Features Go Here</div>


export default Dashboard;