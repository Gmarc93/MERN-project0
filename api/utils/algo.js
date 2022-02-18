function filterObj(obj, filter) {
  // Returns an object
  const filtered = {};

  Object.keys(obj).forEach((prop) => {
    if (filter.includes(prop)) filtered[prop] = obj[prop];
  });

  return filtered;
}

function assignProps(source, target) {
  // Assign properties from source obj to target obj if prop in target obj.
  // This function is used when making property assignments for updates.
  // Source is the filtered object and target is the Mongoose document.
  for (const prop in source) {
    if (prop in target) {
      target[prop] = source[prop];
    }
  }
}

module.exports = {filterObj, assignProps};
