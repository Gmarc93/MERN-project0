function filterObj(obj, filter) {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (filter.includes(key)) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
}

module.exports = filterObj;
