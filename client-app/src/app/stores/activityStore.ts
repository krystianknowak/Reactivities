import agent from "app/api/agent";
import { Activity } from "app/models/activity";
import { makeAutoObservable, runInAction } from "mobx";
import { v4 as uuid } from "uuid";
export default class ActivityStore {
  activities: Activity[] = [];
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadActivities = async () => {
    this.setLoadingInitial(true);
    try {
      const response = await agent.Activities.list();
      const correctDateResonse = response.map((activity) => ({
        ...activity,
        date: activity.date.split("T")[0],
      }));
      this.activities = correctDateResonse;
    } catch (error) {
      console.log(error);
    } finally {
      this.setLoadingInitial(false);
    }
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  setSelectedActivity = (id: string) => {
    this.selectedActivity = this.activities.find(
      (activity) => activity.id === id
    );
  };

  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  openForm = (id?: string) => {
    id ? this.setSelectedActivity(id) : this.cancelSelectedActivity();
    this.editMode = true;
  };

  closeForm = () => {
    this.editMode = false;
  };

  createActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      const newActivity = { ...activity, id: uuid() };
      await agent.Activities.create(newActivity);
      runInAction(() => {
        this.activities = [...this.activities, newActivity];
        this.editMode = false;
        this.selectedActivity = newActivity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  editActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activities = [
          ...this.activities.filter(
            (currentActivity) => currentActivity.id !== activity.id
          ),
          activity,
        ];
        this.editMode = false;
        this.selectedActivity = activity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activities = [
          ...this.activities.filter(
            (currentActivity) => currentActivity.id !== id
          ),
        ];
        if(this.selectedActivity?.id === id) {
          this.cancelSelectedActivity();
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
