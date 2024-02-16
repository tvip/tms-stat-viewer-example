import AbstractStatService from "@/service/stat/AbstractStatService";

class AccountStatService extends AbstractStatService {
  getPath(): string {
    return "/api/stats/account";
  }
}

export default new AccountStatService();
