/**
 * Storefront records for the four holiday stores, as the preview script and
 * tests use them: only the fields the branded footer reads (locationName,
 * showroomInfo name/address/phone, hours). Copied Nov 23, 2026 from the local
 * QA Mongo snapshot, not production; the live email reads the real record by
 * slug at send time.
 */
export const HOLIDAY_STOREFRONT_FIXTURES: Record<'dallas' | 'houston' | 'denver' | 'st-louis', unknown> = {
  "dallas": {
    "locationName": "Dallas",
    "showroomInfo": {
      "name": "Dallas",
      "address": "601 W Plano Pkwy, Ste 153, Plano, TX 75075",
      "phone": "(972) 379-2200"
    },
    "hours": [
      {
        "day": "Tuesday",
        "time": "10:00 am–6:30 pm"
      },
      {
        "day": "Wednesday",
        "time": "10:00 am–6:30 pm"
      },
      {
        "day": "Thursday",
        "time": "10:00 am–6:30 pm"
      },
      {
        "day": "Friday",
        "time": "10:00 am–6:30 pm"
      },
      {
        "day": "Saturday",
        "time": "10:00 am–6:00 pm"
      },
      {
        "day": "Sunday",
        "time": "1:00 pm–5:00 pm"
      }
    ]
  },
  "denver": {
    "locationName": "Denver",
    "showroomInfo": {
      "name": "Denver",
      "address": "3191 South Broadway, Englewood, CO 80113",
      "phone": "(720) 762-4938"
    },
    "hours": [
      {
        "day": "Wednesday",
        "time": "10:00 am–6:00 pm"
      },
      {
        "day": "Thursday",
        "time": "10:00 am–6:00 pm"
      },
      {
        "day": "Friday",
        "time": "10:00 am–6:00 pm"
      },
      {
        "day": "Saturday",
        "time": "10:00 am–6:00 pm"
      },
      {
        "day": "Sunday",
        "time": "1:00 pm–5:00 pm"
      }
    ]
  },
  "houston": {
    "locationName": "Houston",
    "showroomInfo": {
      "name": "Houston",
      "address": "5800 Richmond Ave, Houston, TX 77057, USA",
      "phone": "(713) 904-0001"
    },
    "hours": [
      {
        "day": "Monday",
        "time": "10:00 am–7:00 pm"
      },
      {
        "day": "Tuesday",
        "time": "10:00 am–7:00 pm"
      },
      {
        "day": "Wednesday",
        "time": "10:00 am–7:00 pm"
      },
      {
        "day": "Thursday",
        "time": "10:00 am–7:00 pm"
      },
      {
        "day": "Friday",
        "time": "10:00 am–7:00 pm"
      },
      {
        "day": "Saturday",
        "time": "10:00 am–6:00 pm"
      },
      {
        "day": "Sunday",
        "time": "1:00 pm–5:00 pm"
      }
    ]
  },
  "st-louis": {
    "locationName": "St. Louis",
    "showroomInfo": {
      "name": "St. Louis",
      "address": "18521 Outlet Boulevard, Suite 527, Chesterfield, Missouri 63005",
      "phone": "(636) 778-0477"
    },
    "hours": [
      {
        "day": "Monday",
        "time": "Closed"
      },
      {
        "day": "Tuesday",
        "time": "10:00 am–8:00 pm"
      },
      {
        "day": "Wednesday",
        "time": "10:00 am–8:00 pm"
      },
      {
        "day": "Thursday",
        "time": "10:00 am–8:00 pm"
      },
      {
        "day": "Friday",
        "time": "10:00 am–8:00 pm"
      },
      {
        "day": "Saturday",
        "time": "10:00 am–8:00 pm"
      },
      {
        "day": "Sunday",
        "time": "11am - 6pm"
      }
    ]
  }
}
