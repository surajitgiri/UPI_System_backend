import accountLimitRepository from "../repositories/limits/accountLimit.repository.js";

class AccountLimitService {
    //Create Account Limit
    async createAccountLimit(data) {
        return await accountLimitRepository.create(data);
    }

    //Get All Account Limits
    async getAllAccountLimits() {
        return await accountLimitRepository.findAll();
    }

    //Get Account Limit By ID
    async getAccountLimitById(id) {
        return await accountLimitRepository.findByAccountId(id)
    }

    //Get Account Limit By Account ID
    async getAccountLimitByAccountId(accountId) {
        return await accountLimitRepository.findByAccountId(accountId);
    }

    //Update Account Limit
    async updateAccountLimit(id, data) {
        return await accountLimitRepository.update(id, data);
    }

    //Update Account Limit By Account ID
    async updateAccountLimitByAccountId(accountId, data) {
        return await accountLimitRepository.updateByAccountId(
            accountId,
            data
        );
    }

    /**
 * Delete Account Limit
 */
    async deleteAccountLimit(id) {
        return await accountLimitRepository.delete(id);
    }

    /**
     * Delete Account Limit By Account ID
     */
    async deleteAccountLimitByAccountId(accountId) {
        return await accountLimitRepository.deleteByAccountId(accountId);
    }

    //Count Account Limits
    async countAccountLimits() {
        return await accountLimitRepository.count();
    }
}

export default new AccountLimitService();