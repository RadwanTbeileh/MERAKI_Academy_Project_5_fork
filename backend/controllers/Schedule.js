const pool = require("../models/db");

const createScheduleByProviderId = (req, res) => {
  const { date, timeFrom, timeTo } = req.body;
  const provider_id = req.token.userId;
  pool
    .query(
      `INSERT INTO schedule (date, timeFrom, timeTo,provider_id) VALUES ($1,$2,$3,$4) RETURNING *`,
      [date, timeFrom, timeTo, provider_id]
    )
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "schedule created successfully",
      });
    })
    .catch((err) => {
      res.status(409).json({
        success: false,
        message: "schedule created failed",
        err,
      });
    });
};

const getScheduleByProviderId =  (req, res) => {
    const provider_id = req.token.userId;
    pool
      .query(`SELECT * FROM Schedule WHERE provider_id = $1 AND is_deleted=0 `, [
        provider_id,
      ])
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "All Schedule ",
          result: result.rows,
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err,
        });
      });
  };

// user used
  const getNotBookedScheduleByProviderId =  (req, res) => {
    const provider_id = req.params.id;
    pool
      .query(`SELECT * FROM Schedule WHERE provider_id = $1 AND booked = false AND is_deleted=0`, [
        provider_id,
      ])
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "All Schedule ",
          result: result.rows,
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err,
        });
      });
  };
// booked updat
const updatedScheduleByID =(req,res)=>{
    // const provider_id = req.token.userId;
    const schedule_id = req.params.id;
    const {date, timeFrom, timeTo, booked }= req.body
    pool
      .query(`UPDATE schedule SET date = COALESCE($1,date), timeFrom = COALESCE($2, timeFrom), timeTo = COALESCE($3, timeTo) , booked = COALESCE($4,booked) WHERE schedule_id=$5 AND is_deleted = 0  RETURNING *`, [
        date, timeFrom, timeTo ,booked, schedule_id
      ])
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "Schedule update",
          result: result.rows,
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err,
        });
      });
}


const deleteScheduleByProviderId =(req,res)=>{
    const schedule_id = req.params.id;
    pool
      .query(`UPDATE schedule SET is_deleted=1 WHERE schedule_id=$1 AND is_deleted = 0  RETURNING *`, [
        schedule_id
      ])
      .then((result) => {
        res.status(200).json({
          success: true,
          message: "Schedule deleted",
          result: result.rows,
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          err: err,
        });
      });
}


// const updatedScheduleToBooked = (req,res)=>{
//     const provider_id = req.token.userId;
//     pool
//       .query(`UPDATE schedule SET booked = COALESCE(true,booked) WHERE provider_id=$1 AND is_deleted = 0  RETURNING *`, [
//         provider_id
//       ])
//       .then((result) => {
//         res.status(200).json({
//           success: true,
//           message: "Schedule Booked",
//           result: result.rows,
//         });
//       })
//       .catch((err) => {
//         res.status(500).json({
//           success: false,
//           message: "Server error",
//           err: err,
//         });
//       });
// }







module.exports = {
    createScheduleByProviderId,getScheduleByProviderId,
    updatedScheduleByID,
    deleteScheduleByProviderId,
    getNotBookedScheduleByProviderId
  };