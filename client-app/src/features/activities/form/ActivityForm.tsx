import React, { ChangeEvent, useState } from "react";
import { Activity } from "app/models/activity";
import { Button, Form, Segment } from "semantic-ui-react";

interface Props {
  activity: Activity | undefined;
  closeForm: () => void;
  createActivity: (activity: Activity) => void;
  editActivity: (activity: Activity) => void;
}

const ActivityForm = ({
  closeForm,
  activity: selectedActivity,
  createActivity,
  editActivity,
}: Props) => {
  const initialState: Activity = selectedActivity ?? {
    category: "",
    city: "",
    date: "",
    description: "",
    id: "",
    title: "",
    venue: "",
  };

  const [activity, setActivity] = useState<Activity>(initialState);

  const handleSubmit = () => {
    activity.id ? editActivity(activity) : createActivity(activity);
  };

  const handleChangeInputElement = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setActivity({ ...activity, [name]: value });
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Input
          placeholder="Title"
          onChange={handleChangeInputElement}
          name="title"
          value={activity.title}
        />
        <Form.TextArea
          placeholder="Description"
          onChange={handleChangeInputElement}
          name="description"
          value={activity.description}
        />
        <Form.Input
          placeholder="Category"
          onChange={handleChangeInputElement}
          name="category"
          value={activity.category}
        />
        <Form.Input
          placeholder="Date"
          onChange={handleChangeInputElement}
          name="date"
          value={activity.date}
        />
        <Form.Input
          placeholder="City"
          onChange={handleChangeInputElement}
          name="city"
          value={activity.city}
        />
        <Form.Input
          placeholder="Venue"
          onChange={handleChangeInputElement}
          name="venue"
          value={activity.venue}
        />
        <Button floated="right" positive type="submit" content="Submit" />
        <Button
          onClick={closeForm}
          floated="right"
          type="button"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
