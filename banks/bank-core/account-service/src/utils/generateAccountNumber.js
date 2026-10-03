const generateAccountNumber = () => {
    const year = new Date().getFullYear();

    const random = Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, "0");

    return `${year}${random}`;
};

export default generateAccountNumber;