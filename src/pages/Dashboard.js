import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications } from './actions';
// import { Link } from 'react-router-dom';

const ApplicationList = () => {
  const dispatch = useDispatch();
  const applications = useSelector(state => state.applications);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  return (
    <div>
      <h1>Applications</h1>
      <ul>
        {applications.map(application => (
          <li key={application.id}>{application.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicationList;
