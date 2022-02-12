const AppError = require('./AppError');

// Util functions ----------------------------------------
function filterObj(obj, filter) {
  // Returns an object
  const filtered = {};

  Object.keys(obj).forEach((prop) => {
    if (filter.includes(prop)) filtered[prop] = obj[prop];
  });

  return filtered;
}

function assignProps(source, target) {
  // Assign properties from source obj to target obj if prop in target obj
  for (const prop in source) {
    if (prop in target) {
      target[prop] = source[prop];
    }
  }
}

// CRUD functions ---------------------------------------

function createOne(Model, filter) {
  return async function (req, res, next) {
    try {
      const doc = await Model.create(filterObj(req.body, filter));

      res.status(200).send(doc);
    } catch (err) {
      next(err);
    }
  };
}

function readOne(Model, paramId) {
  return async function (req, res, next) {
    try {
      const doc = await Model.findById(req.params[paramId]);

      if (!doc) throw new AppError(`${Model.modelName} does not exist.`, 404);

      // Make sure to add id cast error into globalErrorHandler in the future

      res.status(200).send({
        satus: 'success',
        data: {
          [`${Model.modelName.toString().toLowerCase()}`]: doc,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}

//readAll should be configured to read all products, product reviews, and reviews

function readAll(Model, paramId) {
  return async function (req, res, next) {
    try {
      // getAllReviews through the products/productId/reviews route
      // requires readAll to specify field as product...
      // This means Model.modelName.toLowerCase cannot be used on
      // the find() method like in other CRUD functions

      let field = `${Model.modelName.toLowerCase()}`;
      const paramName = paramId.split('Id')[0];

      if (field !== paramName) {
        field = paramName;
      }

      const docs = await Model.find({
        [field]: req.params[paramId],
      });

      res.status(200).send(docs);
    } catch (err) {
      next(err);
    }
  };
}

function updateOne(Model, filter, paramId) {
  return async function (req, res, next) {
    try {
      const doc = await Model.findById(req.params[paramId]);

      if (!doc) throw new AppError(`${Model.modelName} does not exist.`, 404);

      const newReqBody = filterObj(req.body, filter);
      assignProps(newReqBody, doc);

      await doc.save();

      res.status(200).send({
        satus: 'success',
        data: {
          [`${Model.modelName.toString().toLowerCase()}`]: doc,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}

function deleteOne(Model, paramId) {
  return async function (req, res, next) {
    try {
      const doc = await Model.findById(req.params[paramId]);

      if (!doc) throw new AppError(`${Model.modelName} does not exist.`, 404);

      await doc.deleteOne();

      if (Model.modelName === 'Product') return next();

      res.status(200).send({
        satus: 'success',
      });
    } catch (err) {
      next(err);
    }
  };
}

function deleteAll(Model) {
  return async function (req, res, next) {
    try {
      await Model.deleteMany();

      if (Model.modelName === 'Product') return next();

      res.status(200).send({status: 'sucess'});
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {createOne, readOne, readAll, updateOne, deleteOne, deleteAll};
