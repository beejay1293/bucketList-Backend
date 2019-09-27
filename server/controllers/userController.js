import bcrypt from 'bcryptjs';
import redis from 'redis';
import JWTR from 'jwt-redis';
import Db from '../db/index';
import Auth from '../middlewares/isAuth';

const redisClient = redis.createClient();
const jwtr = new JWTR(redisClient);


const { createToken } = Auth;

const { query } = Db;

const { genSaltSync, hashSync, compareSync } = bcrypt;

class UserController {
  /**
     * create a user account
     */

  static async signup(req, res) {
    try {
      const { body } = req;
      const salt = genSaltSync(10);
      const hash = hashSync(body.password, salt);
      const values = [body.firstname, body.lastname, body.email, body.number, hash];


      const queryString = 'INSERT INTO users(firstname, lastname, email, number, password) VALUES($1, $2, $3, $4, $5) returning *';
      const { rows } = await query(queryString, values);
      const token = createToken(rows[0].email, rows[0].id, rows[0].firstname, rows[0].lastname);
      return res.status(201).json({
        status: 201,
        data: {
          id: rows[0].id,
          username: rows[0].lastname,
          token,
        },
      });
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(409).json({
          status: 409,
          error: 'User already exist',
        });
      }

      return res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }

  /**
   * login controller
   * @param {*} req
   * @param {*} res
   */
  static async login(req, res) {
    const { email, password } = req.body;
    const queryString = 'SELECT * FROM users WHERE email = $1';

    try {
      const { rows } = await query(queryString, [email]);
      // check if user exist in database
      if (!rows[0]) {
        return res.status(401).json({
          status: 401,
          error: 'Invalid Email/Password',
        });
      }

      // check if user provided password matches user's hashed password in database
      if (!compareSync(password, rows[0].password)) {
        return res.status(401).json({
          status: 401,
          error: 'Invalid Email/Password',
        });
      }

      // generate token
      const token = createToken(rows[0].email, rows[0].id, rows[0].firstname, rows[0].lastname);

      // return success message
      return res.status(200).json({
        status: 200,
        data: {
          id: rows[0].id,
          lastname: rows[0].lastname,
          token,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Something went wrong, try again',
      });
    }
  }

  static async logout(req, res) {
    const { token } = req.headers;

    try {
      await jwtr.destroy(token);

      res.status(200).json({
        status: 200,
        message: "you've been logged out",
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    }
  }
}

export default UserController;
