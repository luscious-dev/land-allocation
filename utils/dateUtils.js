exports.getCurrentDate = function () {
  let current_datetime = new Date();
  const offset = current_datetime.getTimezoneOffset() * 60 * 1000;
  current_datetime.setTime(current_datetime.getTime() - offset);
  return current_datetime.toISOString().slice(0, 19).replace("T", " ");
};

exports.spitDate = function (dateString) {
  // 13-02-2002
  const [day, month, year] = dateString.split("-");
  const offset = new Date().getTimezoneOffset() * 60 * 1000;
  const dateObject = new Date(`${month}-${day}-${year}`);
  dateObject.setTime(dateObject.getTime() - offset);
  return dateObject.toISOString().split("T")[0];
};
