import Axios from "axios";
import _ from "lodash";

const UserService = {
  _users: [],
  _currentUser: {},
  getUsers: async function (fetch = false) {
    if (this._users.length === 0 || fetch) {
      const users = await Axios.get(
        // "http://localhost:5001/awre-268da/us-central1/api/users"
        ""
      );
      this._users = users.data;
    }
    return this._users;
  },
  deleteUser: async function (userId) {
    return await Axios.delete(
      // `http://localhost:5001/awre-268da/us-central1/api/users/${userId}`
      `/${userId}`
    );
  },
  getUserById: async function (userId) {
    if (_.isEmpty(this._currentUser) || this._currentUser.uid !== userId) {
      const currentUser = await Axios.get(
        // `http://localhost:5001/awre-268da/us-central1/api/users/${userId}`
        `/${userId}`
      );
      this._currentUser = currentUser.data;
    }
    return this._currentUser;
  },
  setUser: async function (data) {
    await Axios.post(
      // `http://localhost:5001/awre-268da/us-central1/api/users/${userId}`
      `/`,
      data
    );
  },
  updateUser: async function (id, data) {
    await Axios.put(
      // `http://localhost:5001/awre-268da/us-central1/api/users/${userId}`
      `/${id}`,
      data
    );
  },
  cleanCache: function () {
    this._users = [];
    this._currentUser = {};
  },
};

export default UserService;
