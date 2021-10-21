import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "semantic-ui-react";
import { Activity } from "app/models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity>();
  const [editMode, setEditMode] = useState<boolean>(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find((activity) => activity.id === id));
    setEditMode(false);
  };

  const handleCancelActivity = () => setSelectedActivity(undefined);

  const handleFormOpen = (id?: string) => {
    id ? handleSelectActivity(id) : handleCancelActivity();
    setEditMode(true);
  };

  const handleFormClose = () => setEditMode(false);

  const fetchActivities = async () => {
    const response = await axios.get<Activity[]>(
      "http://localhost:5000/api/Activities"
    );
    console.log(response.data);
    setActivities(response.data);
  };

  const handleCreateActivity = (activity: Activity) => {
    setActivities([...activities, { ...activity, id: uuid() }]);
    setEditMode(false);
    setSelectedActivity(activity);
  };

  const handleEditActivity = (activity: Activity) => {
    setActivities([
      ...activities.filter(
        (currentActivity) => currentActivity.id !== activity.id
      ),
      activity,
    ]);
    setEditMode(false);
    setSelectedActivity(activity);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities([
      ...activities.filter((currentActivity) => currentActivity.id !== id),
    ]);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelActivity={handleCancelActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
}

export default App;
