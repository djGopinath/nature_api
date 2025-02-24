const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // find() is used to et all record
    // Excute the filter query and get all record
    // Build query to filter - FILTERING
     const queryObj={...req.query};
     const excludedFields=['page','sort','limit','fields'];
     excludedFields.forEach(field=>delete queryObj[field]);

     let queryStr=JSON.stringify(queryObj);
     queryStr=queryStr.replace(/\b (gte|gt|lte|lt)\b/g,match=>`$${match}`);
     let query =  Tour.find(JSON.parse(queryStr));

     //SORTING
     if(req.query.sort){
      const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
     } else {
      query=query.sort('-createdAt');
     }
     

    const tours = await query;

    res.status(200).json({
      status: 'success',
      total_records: tours.length,
      data: { tours }
    });
  } catch (err) {
    res.status(404).json({ status: 'Fail', message: err });
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
