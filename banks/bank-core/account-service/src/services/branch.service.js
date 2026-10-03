// src/services/branch.service.js
import branchRepository from "../repositories/account/branch.repository.js";

class BranchService {
    /**
     * Create Branch
     */
    async createBranch(data) {
        return await branchRepository.create(data);
    }

    /**
     * Get All Branches
     */
    async getAllBranches() {
        return await branchRepository.findAll();
    }

    /**
     * Get Branch By ID
     */
    async getBranchById(id) {
        return await branchRepository.findById(id);
    }

    /**
     * Get Branch By Branch Code
     */
    async getBranchByBranchCode(branchCode) {
        return await branchRepository.findByBranchCode(branchCode);
    }

    /**
     * Get Branch By IFSC Code
     */
    async getBranchByIfscCode(ifscCode) {
        return await branchRepository.findByIfscCode(ifscCode);
    }

    /**
     * Get Branch With Accounts
     */
    async getBranchWithAccounts(id) {
        return await branchRepository.findWithAccounts(id);
    }

    /**
     * Update Branch
     */
    async updateBranch(id, data) {
        return await branchRepository.update(id, data);
    }

    /**
     * Delete Branch
     */
    async deleteBranch(id) {
        return await branchRepository.delete(id);
    }

    /**
     * Search Branches
     */
    async searchBranches(keyword) {
        return await branchRepository.search(keyword);
    }

    /**
     * Count Branches
     */
    async countBranches() {
        return await branchRepository.count();
    }
}

export default new BranchService();