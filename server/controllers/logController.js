const Log = require('../models/logModel');

const addLog = async (req, res) => {
  try {
    const logEntry = req.body;
    const newLog = new Log(logEntry);
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    console.error('Error creating log:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// const searchLogs = async (req, res) => {
//   try {
//     const { query, filters, startDate, endDate } = req.body;

//     const timestampFilter = {};
//     if (startDate || endDate) {
//       if (startDate) timestampFilter.$gte = new Date(startDate);
//       if (endDate) timestampFilter.$lte = new Date(endDate);
//     }

//     const filterConditions = {
//       timestamp: timestampFilter,
//     };

//     // Map filter fields to their corresponding model fields
//     const filterFieldMap = {
//       level: 'level',
//       message: 'message',
//       resourceId: 'resourceId',
//       traceId: 'traceId',
//       spanId: 'spanId',
//       commit: 'commit',
//       'metadata.parentResourceId': 'metadata.parentResourceId',
//     };

//     // Apply filters to filterConditions
//     filters.forEach((filter) => {
//       const { field, value } = filter;
//       const modelField = filterFieldMap[field];
//       if (modelField && value) {
//         filterConditions[modelField] = new RegExp(value, 'i');
//       }
//     });

//     const searchResults = await Log.find({
//       $and: [
//         {
//           $or: [
//             { message: new RegExp(query, 'i') },
//             { level: new RegExp(query, 'i') },
//           ],
//         },
//         filterConditions,
//       ],
//     });

//     res.status(200).json(searchResults);
//   } catch (error) {
//     console.error('Error searching logs:', error.message);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const searchLogs = async (req, res) => {
  try {
    const { query, filters, startDate, endDate } = req.body;

    const filterConditions = {};

    // Map filter fields to their corresponding model fields
    const filterFieldMap = {
      level: 'level',
      message: 'message',
      resourceId: 'resourceId',
      traceId: 'traceId',
      spanId: 'spanId',
      commit: 'commit',
      'metadata.parentResourceId': 'metadata.parentResourceId',
    };

    // Apply filters to filterConditions
    filters.forEach((filter) => {
      const { field, value } = filter;
      const modelField = filterFieldMap[field];
      if (modelField && value) {
        filterConditions[modelField] = new RegExp(value, 'i');
      }
    });

    // Add timestamp filter only if both startDate and endDate are provided
    if (startDate && endDate) {
      filterConditions.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const searchResults = await Log.find({
      $and: [
        {
          $or: [
            { message: new RegExp(query, 'i') },
            { level: new RegExp(query, 'i') },
          ],
        },
        filterConditions,
      ],
    });

    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error searching logs:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addLog,
  searchLogs,
};


module.exports = {
    addLog,
  searchLogs
}