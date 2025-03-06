const Tour=require('./../models/tourModel');
const APIFeatures=require('./../utils/apiFeatures');


exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

    
    const tours = await features.query;
    console.log("API Features",tours);
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'failsss',
      message: err
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    // findById() is used to get a single record
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: 'Tour not found' });
  }
};
exports.createTour = async (req, res) => {
  try {
    //create Methos is save the request body data
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err });
  }
};

exports.updateTour = async (req, res) => {
  try {
    // findbyIdAndUpdate is use to update the tour params : id, paylod and validation
    const updatedTour= await Tour.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true})
    res.status(200).json({ status: 'success', data: updatedTour });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Invalid Payload' });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    // findbyIdAndDelete is use to delete the tour by id
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: 'Tour not found' });
  }

};
