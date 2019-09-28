import dotenv from 'dotenv';
import moment from 'moment';
import Db from '../db/index';

const currentTimestamp = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

dotenv.config();


const { query } = Db;
class BucketListController {
  static async createBucketList(req, res) {
    try {
      const { id } = req.user;
      const { name } = req.body;

      const values = [name, id];

      const queryString = 'INSERT INTO bucketlists(name, created_by) VALUES($1, $2) returning *';

      const { rows } = await query(queryString, values);

      return res.status(201).json({
        status: 201,
        data: rows[0],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Internal server error',
      });
    }
  }

  static async getAllBucketLists(req, res) {
    try {
      const { id } = req.user;
      const queryString = 'SELECT bucketlists.id, bucketlists.name, bucketlists.date_created, bucketlists.date_modified FROM bucketlists LEFT JOIN bucketlist_items on bucketlists.id = bucketlist_items.bucketlist WHERE bucketlists.created_by = $1';
      const { rows } = await query(queryString, [id]);

      if (rows.length === 0) {
        return res.status(200).json({
          status: 200,
          messages: 'you have not created any bucket list yet',
        });
      }

      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  static async getSingleBucketList(req, res) {
    const { bucketId } = req.params;
    const idParams = parseInt(bucketId, 10);

    const { id } = req.user;

    try {
      const queryString = 'SELECT bucketlists.id, bucketlists.name, bucketlists.date_created, bucketlists.date_modified FROM bucketlists LEFT JOIN bucketlist_items on bucketlists.id = bucketlist_items.bucketlist WHERE (bucketlists.id, bucketlists.created_by) = ($1, $2)';

      const { rows } = await query(queryString, [idParams, id]);

      if (rows.length === 0) {
        return res.status(404).json({
          status: 404,
          message: 'invalid request, bucketlist not found',
        });
      }

      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error,
      });
    }
  }

  static async updateBucketList(req, res) {
    const { bucketId } = req.params;
    const idParams = parseInt(bucketId, 10);
    const { id } = req.user;
    const { name } = req.body;

    try {
      const queryString = 'UPDATE bucketlists SET (name, date_modified) = ($1, $2) WHERE (id, created_by) = ($3, $4) returning *';
      const { rows } = await query(queryString, [name, currentTimestamp, idParams, id]);

      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'bucketlist can not be found',
        });
      }

      const response = [{
        id: rows[0].id,
        name: rows[0].name,
        created: rows[0].date_created,
        updated: rows[0].date_modified,
      }];

      return res.status(200).json({
        status: 200,
        data: response,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error,
      });
    }
  }

  static async deleteBucketLits(req, res) {
    const { bucketId } = req.params;
    const idParams = parseInt(bucketId, 10);
    const { id } = req.user;

    try {
      const queryString = 'DELETE FROM bucketlists WHERE (id, created_by) = ($1, $2) returning *';

      const { rows } = await query(queryString, [idParams, id]);
      if (rows.length === 0) {
        return res.status(400).json({
          status: 400,
          error: 'invalid request, sorry you cannot delete this bucket list',
        });
      }

      return res.status(200).json({
        status: 200,
        messages: `${rows[0].name}, has been deleted successfully`,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  static async createBucketListItem(req, res) {
    const { bucketId } = req.params;
    const idParams = parseInt(bucketId, 10);
    const { name } = req.body;
    const { id } = req.user;

    try {
      const queryS = 'SELECT * from bucketlists WHERE (id, created_by) = ($1, $2)';

      const bucket = await query(queryS, [idParams, id]);

      if (bucket.rows.length === 0) {
        return res.status(404).json({
          status: 404,
          error: 'Please create a bucket list for this item',
        });
      }
      const querySting = 'INSERT INTO bucketlist_items(name, created_by, bucketlist) VALUES($1, $2, $3) returning *';

      const { rows } = await query(querySting, [name, id, idParams]);

      return res.status(201).json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  static async getBucketListItems(req, res) {
    const { bucketId } = req.params;
    const idParams = parseInt(bucketId, 10);
    const { id } = req.user;

    try {
      const queryS = 'SELECT * from bucketlists WHERE(id, created_by) = ($1, $2)';

      const bucket = await query(queryS, [idParams, id]);


      if (bucket.rows.length === 0) {
        return res.status(404).json({
          status: 404,
          error: 'bucketlist does not exist',
        });
      }
      const queryString = 'SELECT * from bucketlist_items WHERE(bucketlist, created_by) = ($1, $2)';

      const { rows } = await query(queryString, [idParams, id]);

      if (rows.length === 0) {
        return res.status(404).json({
          status: 404,
          message: 'no item has been added to this bucketlist',
        });
      }

      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error,
      });
    }
  }

  static async getSingleBucketListItem(req, res) {
    const { bucketId, itemId } = req.params;
    const idParams = parseInt(bucketId, 10);
    const { id } = req.user;

    try {
      const queryS = 'SELECT * from bucketlists WHERE(id, created_by) = ($1, $2)';

      const bucket = await query(queryS, [idParams, id]);


      if (bucket.rows.length === 0) {
        return res.status(404).json({
          status: 404,
          error: 'bucketlist does not exist',
        });
      }
      const queryString = 'SELECT * from bucketlist_items WHERE(id, bucketlist, created_by) = ($1, $2, $3)';

      const { rows } = await query(queryString, [itemId, idParams, id]);

      if (rows.length === 0) {
        return res.status(404).json({
          status: 404,
          message: 'item does not exist',
        });
      }

      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  static async updateSingleBucketListItem(req, res) {
    const { bucketId, itemId } = req.params;
    const idParams = parseInt(bucketId, 10);
    const { id } = req.user;
    const { name, done } = req.body;
    const isDOne = done || false;

    try {
      const queryS = 'SELECT * from bucketlists WHERE(id, created_by) = ($1, $2)';

      const bucket = await query(queryS, [idParams, id]);


      if (bucket.rows.length === 0) {
        return res.status(404).json({
          status: 404,
          error: 'bucketlist does not exist',
        });
      }
      const queryString = 'UPDATE bucketlist_items SET(name, date_modified, done) = ($1, $2, $3) WHERE(id, bucketlist, created_by) = ($4, $5, $6) returning *';
      const values = [name, currentTimestamp, isDOne, itemId, idParams, id];
      const { rows } = await query(queryString, values);

      if (rows.length === 0) {
        return res.status(404).json({
          status: 404,
          message: 'item does not exist',
        });
      }

      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  static async deleteSingleBucketListItem(req, res) {
    const { bucketId, itemId } = req.params;
    const idParams = parseInt(bucketId, 10);
    const { id } = req.user;

    try {
      const queryS = 'SELECT * from bucketlists WHERE(id, created_by) = ($1, $2)';

      const bucket = await query(queryS, [idParams, id]);


      if (bucket.rows.length === 0) {
        return res.status(404).json({
          status: 404,
          error: 'bucketlist does not exist',
        });
      }
      const queryString = 'DELETE FROM bucketlist_items WHERE(id, bucketlist, created_by) = ($1, $2, $3) returning *';
      const values = [itemId, idParams, id];
      const { rows } = await query(queryString, values);
      if (rows.length === 0) {
        return res.status(400).json({
          status: 400,
          error: 'invalid request, sorry you cannot delete this bucket list item',
        });
      }

      return res.status(200).json({
        status: 200,
        messages: `${rows[0].name}, has been deleted successfully`,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }
}

export default BucketListController;
