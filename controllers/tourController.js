const Tour= require('../models/tourModel')


exports.checkBody=(req,res,next)=>{
    if(!req.body.name || !req.body.price){
        return res.status(400).json({ status: 'fail', message: 'Missing Name and Price' });
    }
    next();
}

exports.getAllTours = (req, res) => {
  // res
  //   .status(200)
  //   .json({
  //     status: 'success',
  //     requestedAt: req.requestTime,
  //     total_records: tours.length,
  //     data: { tours },
  //   });
};
exports.getTourById = (req, res) => {
  //   const tour = tours.find((res) => res.id === req.params.id * 1);
  // res.status(200).json({ status: 'success', data: { tour } });
};
exports.createTour = (req, res) => {

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    };

exports.updateTour = (req, res) => {
  res.status(200).json({ status: 'success', data: `<Updated tour here...>` });
};
exports.deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};
