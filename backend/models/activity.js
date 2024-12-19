const db = require('../db');

class Activity {
  static async add({ destinationId, activityName, description, rating }) {
    const result = await db.query(
      `INSERT INTO activities (destination_id, activity_name, description, rating)
       VALUES ($1, $2, $3, $4)
       RETURNING activity_id, activity_name`,
      [destinationId, activityName, description, rating]
    );
    return result.rows[0];
  }
}

module.exports = Activity;
