import Service from "../model/service.model.js";
import { HTTP_STATUS } from "../const/http-status.const.js";

export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(service);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const listServices = async (_req, res) => {
  try {
    const services = await Service.find();
    res.status(HTTP_STATUS.OK).json(services);
  } catch (err) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Service not found" });
    res.status(HTTP_STATUS.OK).json(service);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Service not found" });
    res.status(HTTP_STATUS.OK).json(service);
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Service not found" });
    res.status(HTTP_STATUS.OK).json({ message: "Service deleted" });
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};


