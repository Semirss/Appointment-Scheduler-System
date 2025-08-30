import {
  getSchedulesModel,
  addScheduleModel,
  updateScheduleModel,
  deleteScheduleModel,
  getCompanySchedule
} from "../Models/scheduleModel.js";

export const getSchedules = async (req, res) => {
  try {
    const schedules = await getSchedulesModel();
    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch schedules" });
  }
};

export const fetchCompanySchedule = async (req, res) => {
  const { scheduleCompanyId } = req.params;
  try {
    const schedule = await getCompanySchedule(scheduleCompanyId);
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found for this company" });
    }
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch company schedule" });
  }
};


export const addSchedule = async (req, res) => {
  try {
    await addScheduleModel(req.body);
    res.status(201).json({ success: true, message: "Schedule added" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add schedule" });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    await updateScheduleModel(req.params.id, req.body);
    res.json({ success: true, message: "Schedule updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update schedule" });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    await deleteScheduleModel(req.params.id);
    res.json({ success: true, message: "Schedule deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete schedule" });
  }
};
