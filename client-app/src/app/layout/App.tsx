import React, { useState, useEffect } from "react";
import { Container } from "semantic-ui-react";
import { Activity } from "app/models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";
import agent from "app/api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
    setIsLoading(true);
    try {
      const response = await agent.Activities.list();
      const correctDateResonse = response.map((activity) => ({
        ...activity,
        date: activity.date.split("T")[0],
      }));
      setActivities(correctDateResonse);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateActivity = async (activity: Activity) => {
    setIsSubmitting(true);
    try {
      const newActivity = { ...activity, id: uuid() };
      await agent.Activities.create(newActivity);
      setActivities([...activities, newActivity]);
      setEditMode(false);
      setSelectedActivity(activity);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditActivity = async (activity: Activity) => {
    setIsSubmitting(true);
    try {
      await agent.Activities.update(activity);
      setActivities([
        ...activities.filter(
          (currentActivity) => currentActivity.id !== activity.id
        ),
        activity,
      ]);
      setEditMode(false);
      setSelectedActivity(activity);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    await agent.Activities.delete(id);
    setActivities([
      ...activities.filter((currentActivity) => currentActivity.id !== id),
    ]);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (isLoading) return <LoadingComponent />;

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
          isSubmitting={isSubmitting}
        />
      </Container>
    </>
  );
}

export default App;
