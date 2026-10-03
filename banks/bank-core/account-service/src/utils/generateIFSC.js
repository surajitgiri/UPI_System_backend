const generateIFSC = (bankCode, branchCode) => {
    return `${bankCode}0${branchCode}`;
};

export default generateIFSC;