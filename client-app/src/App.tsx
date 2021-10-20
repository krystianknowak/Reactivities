import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { Header, List } from "semantic-ui-react";

interface Activity {
  id: string;
  title: string;
}

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchActivities = async () => {
    const response = await axios.get<Activity[]>(
      "http://localhost:5000/api/Activities"
    );
    console.log(response.data);
    setActivities(response.data);
  };

  useEffect(() => {
    // axios
    //   .get<[]>("http://localhost:5000/api/Activities")
    //   .then((response) => {
    //     console.log(response.data);
    //     setActivities(response.data);
    //   });
    fetchActivities();
  }, []);

  return (
    <div>
      <Header as="h2" icon="users" content="Reactivities" />
      <List>
        {activities.map((activity) => (
          <List.Item key={activity.id}>{activity.title}</List.Item>
        ))}
      </List>
    </div>
  );
}

export default App;
