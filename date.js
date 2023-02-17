
exports.getToday = () => {
    let today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('ar-dz', options);
}


exports.getday = getday;
function getday() {
    let today = new Date();
    const options = { weekday: 'long'};
    return today.toLocaleDateString('ar-dz', options);
}