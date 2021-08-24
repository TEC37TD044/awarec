import _ from "lodash";
import { db } from "../providers/firebase";

const StorageService = {
  _assets: [],
  _bookings: [],
  _assignments: [],

  getAssets: async function () {
    if (_.isEmpty(this._assets)) {
      const assets = await db
        .collection("assets")
        .where("deleted", "==", false)
        .get();
      this._assets = assets.docs;
    }
    return this._assets.map((asset) => asset.data());
  },
  getAssigments: async function () {
    if (_.isEmpty(this._assignments)) {
      const assigments = await db.collection("asset_assignment").get();
      this._assignments = assigments.docs;
    }
    return this._assignments.map((assigment) => assigment.data());
  },
};

export default StorageService;
