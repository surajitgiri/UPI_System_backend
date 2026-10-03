// src/services/account.service.js

import accountRepository from "../repositories/account/account.repository.js";
import generateAccountNumber from "../utils/generateAccountNumber.js";
import { getCustomerByIdGrpc } from "../grpc/client.js";
import NotFoundError from "../errors/NotFoundError.js";

class AccountService {
    /**
     * Create Account
     */
    async createAccount(data) {
        const { branch, customerId, ...rest } = data;

        // 1. Verify that customer exists via gRPC
        const customerResponse = await getCustomerByIdGrpc(customerId);

        if (!customerResponse || !customerResponse.success || !customerResponse.data?.id) {
            throw new NotFoundError("Customer not found with provided ID");
        }

        // 2. Create the account
        const accountData = {
            ...rest,
            customerId,
            branchId: branch,
            accountNumber: generateAccountNumber(),
            availableBalance: 0,
        };

        return await accountRepository.create(accountData);
    }

    /**
     * Get All Accounts
     */
    async getAllAccounts() {
        return await accountRepository.findAll();
    }

    /**
     * Get Account By ID
     */
    async getAccountById(id) {
        return await accountRepository.findById(id);
    }

    /**
     * Get Account By Account Number
     */
    async getAccountByNumber(accountNumber) {
        return await accountRepository.findByAccountNumber(accountNumber);
    }

    /**
     * Get Accounts By Customer ID
     */
    async getAccountsByCustomer(customerId) {
        return await accountRepository.findByCustomerId(customerId);
    }

    /**
     * Get Accounts By Branch ID
     */
    async getAccountsByBranch(branchId) {
        return await accountRepository.findByBranch(branchId);
    }

    /**
     * Update Account
     */
    async updateAccount(id, data) {
        return await accountRepository.update(id, data);
    }

    /**
     * Update Account Status
     */
    async updateAccountStatus(id, status) {
        return await accountRepository.updateStatus(id, status);
    }

    /**
     * Close Account
     */
    async closeAccount(id) {
        return await accountRepository.closeAccount(id);
    }

    /**
     * Freeze Account
     */
    async freezeAccount(id) {
        return await accountRepository.freezeAccount(id);
    }

    /**
     * Activate Account
     */
    async activateAccount(id) {
        return await accountRepository.activateAccount(id);
    }

    /**
     * Check if Account Exists
     */
    async accountExists(id) {
        return await accountRepository.exists(id);
    }

    /**
     * Count Customer Accounts
     */
    async countCustomerAccounts(customerId) {
        return await accountRepository.countCustomerAccounts(customerId);
    }

    /**
     * Delete Account
     */
    async deleteAccount(id) {
        return await accountRepository.delete(id);
    }
}

export default new AccountService();