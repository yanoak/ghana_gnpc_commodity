import { csv, json } from 'd3-fetch';
import { nest } from 'd3-collection';
import * as moment from 'moment';

import timorAll from "./data/gnpc_commodity_exports.csv";

export const loadAllData = () => {
  
  const promises = [];

  promises.push(
    csv(timorAll)
  )

  return Promise.all(promises).then(function (values) {
    console.log(values);

    const result = [];
    values[0].forEach(d => {
			d.Date_of_sale = moment(d.Date_of_sale, "YYYY-MM-DD")
			d.Payment_receipt_date = moment(d.Payment_receipt_date, "YYYY-MM-DD")
      result.push(d);  
    })

    return result;
  })
}