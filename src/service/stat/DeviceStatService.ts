import AbstractStatService from "@/service/stat/AbstractStatService";

class DeviceStatService extends AbstractStatService {
  getPath(): string {
    return "/api/stats/device/";
  }

}
